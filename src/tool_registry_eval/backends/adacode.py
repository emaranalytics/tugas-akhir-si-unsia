from __future__ import annotations

import os
import time
from typing import Any

import httpx

from ..config import EvalConfig
from ..domain import QueryDef, ToolDef
from ..registry import registry_filter
from .base import LLMBackend


# Registry of ADACODE model keys → env var holding the actual model name
_ADACODE_MODEL_MAP: dict[str, str] = {
    "anthropic": "ANTHROPIC_SONNET_MODEL",
    "glm": "GLM_FLASH_MODEL",
    "minimax": "MINIMAX_M_MODEL",
}

_ADACODE_BASE_URL = "https://api.adacode.ai/v1"


def _adacode_api_key() -> str:
    return os.getenv("ADACODE_API_KEY", "")


def _tool_description(tool: ToolDef) -> str:
    op_label = {
        "read": "Baca/lihat data",
        "analytical": "Analisis dan laporan",
        "write": "Buat/ubah/hapus data",
        "admin": "Administrasi sistem",
    }.get(tool.op_type, tool.op_type)
    kw = ", ".join(tool.keywords)
    intent_part = f" {tool.intent}" if tool.intent else ""
    return f"[{op_label}] Modul {tool.module}.{intent_part} Kata kunci: {kw}."


class ADACODEBackend(LLMBackend):
    """OpenAI-compatible backend via ADACODE API for multi-model evaluation."""

    def __init__(self, model_key: str):
        if model_key not in _ADACODE_MODEL_MAP:
            raise ValueError(
                f"Unknown ADACODE model key '{model_key}'. "
                f"Available: {list(_ADACODE_MODEL_MAP)}"
            )
        self._model_key = model_key
        model_env = _ADACODE_MODEL_MAP[model_key]
        self._model_name = os.getenv(model_env, "")
        if not self._model_name:
            raise ValueError(f"Env var {model_env} is not set for ADACODE model '{model_key}'")
        self._client: httpx.Client | None = None

    @property
    def name(self) -> str:
        return f"adacode-{self._model_key}"

    @property
    def model_name(self) -> str:
        return self._model_name

    def _client_(self) -> httpx.Client:
        if self._client is None:
            self._client = httpx.Client(base_url=_ADACODE_BASE_URL, timeout=60.0)
        return self._client

    def _tool_payload(self, visible_tools: list[ToolDef]) -> list[dict[str, Any]]:
        return [
            {
                "type": "function",
                "function": {
                    "name": t.name,
                    "description": _tool_description(t),
                    "parameters": {"type": "object", "properties": {}},
                },
            }
            for t in visible_tools
        ]

    def _messages(self, query: QueryDef) -> list[dict[str, str]]:
        return [
            {
                "role": "system",
                "content": "Anda adalah router tool ERP restoran. "
                          "Pilih dan panggil SATU tool yang paling tepat untuk permintaan pengguna.",
            },
            {"role": "user", "content": query.text},
        ]

    def _extract_tool_call(self, resp_data: dict, tool_names: set[str]) -> str:
        choices = resp_data.get("choices", [])
        if not choices:
            return "NO_TOOL"
        message = choices[0].get("message", {})
        tool_calls = message.get("tool_calls", [])
        if tool_calls:
            fc = tool_calls[0]
            fname = fc.get("function", {}).get("name", "")
            if fname in tool_names:
                return fname
        return "NO_TOOL"

    def _usage_numbers(self, resp_data: dict) -> tuple[int, int, int]:
        usage = resp_data.get("usage", {})
        input_t = int(usage.get("prompt_tokens", 0) or 0)
        output_t = int(usage.get("completion_tokens", 0) or 0)
        total_t = int(usage.get("total_tokens", 0) or (input_t + output_t))
        return input_t, output_t, total_t

    def call(
        self,
        mode: str,
        scenario: str,
        query: QueryDef,
        tools_for_scenario: list[ToolDef],
        registry_memory_bytes: int,
        config: EvalConfig,
        repeat_idx: int = 0,
    ) -> dict[str, Any]:
        visible_tools = (
            tools_for_scenario
            if mode == "baseline"
            else registry_filter(query, tools_for_scenario, budget=config.tool_budget)
        )
        tool_names = {t.name for t in visible_tools}

        payload = {
            "model": self._model_name,
            "messages": self._messages(query),
            "tools": self._tool_payload(visible_tools),
            "tool_choice": "auto",
            "temperature": 0,
            "max_tokens": 256,
        }
        headers = {
            "Authorization": f"Bearer {_adacode_api_key()}",
            "Content-Type": "application/json",
        }

        started = time.perf_counter()
        resp_data: dict | None = None
        for attempt in range(4):
            try:
                client = self._client_()
                r = client.post("/chat/completions", json=payload, headers=headers)
                r.raise_for_status()
                resp_data = r.json()
                break
            except httpx.HTTPStatusError as exc:
                if exc.response.status_code in (429, 500, 503) and attempt < 3:
                    wait = 2 ** (attempt + 2)  # 4, 8, 16s
                    print(f"    [{exc.response.status_code}] retry {attempt + 1}/3 in {wait}s ...", flush=True)
                    time.sleep(wait)
                else:
                    raise
            except httpx.ReadTimeout:
                if attempt < 3:
                    wait = 2 ** (attempt + 2)
                    print(f"    [timeout] retry {attempt + 1}/3 in {wait}s ...", flush=True)
                    time.sleep(wait)
                else:
                    raise

        elapsed_ms = round((time.perf_counter() - started) * 1000, 3)

        if resp_data is None:
            return self._error_row(mode, scenario, query, registry_memory_bytes, repeat_idx,
                                   "No response after retries")

        selected_tool = self._extract_tool_call(resp_data, tool_names)
        input_tokens, output_tokens, total_tokens = self._usage_numbers(resp_data)

        return {
            "mode": mode,
            "scenario": scenario,
            "query_id": query.query_id,
            "query_type": query.query_type,
            "repeat_idx": repeat_idx,
            "total_tools": len(tools_for_scenario),
            "visible_tools": len(visible_tools),
            "expected_tool": query.expected_tool,
            "selected_tool": selected_tool,
            "is_correct": selected_tool == query.expected_tool,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": total_tokens,
            "latency_ms": elapsed_ms,
            "registry_memory_bytes": registry_memory_bytes if mode == "registry" else 0,
            "backend": self.name,
            "model": self._model_name,
        }

    def _error_row(
        self,
        mode: str,
        scenario: str,
        query: QueryDef,
        registry_memory_bytes: int,
        repeat_idx: int,
        error_msg: str,
    ) -> dict[str, Any]:
        return {
            "mode": mode,
            "scenario": scenario,
            "query_id": query.query_id,
            "query_type": query.query_type,
            "repeat_idx": repeat_idx,
            "total_tools": 0,
            "visible_tools": 0,
            "expected_tool": query.expected_tool,
            "selected_tool": "ERROR",
            "is_correct": False,
            "input_tokens": 0,
            "output_tokens": 0,
            "total_tokens": 0,
            "latency_ms": 0,
            "registry_memory_bytes": 0,
            "backend": self.name,
            "model": self._model_name,
            "error": error_msg,
        }