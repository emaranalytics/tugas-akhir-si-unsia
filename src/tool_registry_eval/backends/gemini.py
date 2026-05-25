from __future__ import annotations

import os
import time
from typing import Any

from google import genai
from google.genai import errors as genai_errors
from google.genai import types

from ..config import EvalConfig
from ..domain import QueryDef, ToolDef
from ..registry import registry_filter
from .base import LLMBackend


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


class GeminiBackend(LLMBackend):
    """Google Gen AI SDK backend — native function calling via gemini-backend."""

    def __init__(self):
        self._client: genai.Client | None = None

    @property
    def name(self) -> str:
        return "gemini-native"

    def _get_client(self) -> genai.Client:
        if self._client is None:
            self._client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
        return self._client

    def _make_fn_decls(self, visible_tools: list[ToolDef]) -> list[types.FunctionDeclaration]:
        return [
            types.FunctionDeclaration(
                name=t.name,
                description=_tool_description(t),
                parameters=types.Schema(type=types.Type.OBJECT, properties={}),
            )
            for t in visible_tools
        ]

    def _extract_tool_call(self, resp: Any, tool_names: set[str]) -> str:
        for part in getattr(resp, "candidates", [{}])[0].content.parts if resp.candidates else []:
            fc = getattr(part, "function_call", None)
            if fc and fc.name in tool_names:
                return fc.name
        return "NO_TOOL"

    def _usage_numbers(self, resp: Any) -> tuple[int, int, int]:
        um = getattr(resp, "usage_metadata", None)
        if um is None:
            return 0, 0, 0
        input_t = int(getattr(um, "prompt_token_count", 0) or 0)
        output_t = int(getattr(um, "candidates_token_count", 0) or 0)
        total_t = int(getattr(um, "total_token_count", 0) or (input_t + output_t))
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

        fn_decls = self._make_fn_decls(visible_tools)
        tool_names = {t.name for t in visible_tools}

        gen_config = types.GenerateContentConfig(
            system_instruction=(
                "Anda adalah router tool ERP restoran. "
                "Pilih dan panggil SATU tool yang paling tepat untuk permintaan pengguna."
            ),
            tools=[types.Tool(function_declarations=fn_decls)],
            tool_config=types.ToolConfig(
                function_calling_config=types.FunctionCallingConfig(
                    mode="ANY",
                    allowed_function_names=list(tool_names),
                )
            ),
            temperature=0,
            max_output_tokens=32,
        )

        # Small throttle to avoid sustained-load 503s from Gemini free tier.
        time.sleep(0.5)

        client = self._get_client()
        started = time.perf_counter()
        resp = None
        for attempt in range(6):
            try:
                resp = client.models.generate_content(
                    model=config.model,
                    contents=query.text,
                    config=gen_config,
                )
                break
            except (genai_errors.ServerError, genai_errors.ClientError) as exc:
                status = getattr(exc, "status_code", None)
                if status is None:
                    msg = str(exc)
                    if "503" in msg or "UNAVAILABLE" in msg:
                        status = 503
                    elif "429" in msg or "RESOURCE_EXHAUSTED" in msg:
                        status = 429
                    else:
                        status = 0
                if status in (429, 503) and attempt < 5:
                    wait = 2 ** (attempt + 3)  # 8, 16, 32, 64, 128s
                    print(f"    [{status}] retry {attempt + 1}/5 in {wait}s ...", flush=True)
                    time.sleep(wait)
                else:
                    raise
        elapsed_ms = round((time.perf_counter() - started) * 1000, 3)

        selected_tool = self._extract_tool_call(resp, tool_names)
        input_tokens, output_tokens, total_tokens = self._usage_numbers(resp)

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
            "model": config.model,
        }