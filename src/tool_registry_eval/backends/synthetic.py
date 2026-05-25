from __future__ import annotations

from typing import Any

from ..config import EvalConfig
from ..domain import QueryDef, ToolDef
from ..measure import latency_ms, select_tool, token_count
from ..registry import registry_filter
from .base import LLMBackend


class SyntheticBackend(LLMBackend):
    """Deterministic synthetic benchmark backend."""

    @property
    def name(self) -> str:
        return "synthetic"

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
        input_tokens, output_tokens, total_tokens = token_count(query, visible_tools)
        selected_tool = select_tool(
            mode, query, visible_tools, total_tools=len(tools_for_scenario)
        )
        return {
            "mode": mode,
            "scenario": scenario,
            "query_id": query.query_id,
            "query_type": query.query_type,
            "repeat_idx": 0,
            "total_tools": len(tools_for_scenario),
            "visible_tools": len(visible_tools),
            "expected_tool": query.expected_tool,
            "selected_tool": selected_tool,
            "is_correct": selected_tool == query.expected_tool,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": total_tokens,
            "latency_ms": latency_ms(
                mode, query, visible_tools, total_tokens, total_tools=len(tools_for_scenario)
            ),
            "registry_memory_bytes": registry_memory_bytes if mode == "registry" else 0,
            "backend": "synthetic",
            "model": "synthetic",
        }