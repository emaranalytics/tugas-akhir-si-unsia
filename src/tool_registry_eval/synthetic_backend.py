from __future__ import annotations

from typing import Any

from .domain import QueryDef, ToolDef
from .measure import latency_ms, select_tool, token_count
from .registry import registry_filter


def run_synthetic_row(
    *,
    mode: str,
    scenario: str,
    query: QueryDef,
    tools_for_scenario: list[ToolDef],
    registry_memory_bytes: int,
    tool_budget: int,
) -> dict[str, Any]:
    visible_tools = (
        tools_for_scenario
        if mode == "baseline"
        else registry_filter(query, tools_for_scenario, budget=tool_budget)
    )
    input_tokens, output_tokens, total_tokens = token_count(query, visible_tools)
    selected_tool = select_tool(mode, query, visible_tools, total_tools=len(tools_for_scenario))
    return {
        "mode": mode,
        "scenario": scenario,
        "query_id": query.query_id,
        "query_type": query.query_type,
        "total_tools": len(tools_for_scenario),
        "visible_tools": len(visible_tools),
        "expected_tool": query.expected_tool,
        "selected_tool": selected_tool,
        "is_correct": selected_tool == query.expected_tool,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "total_tokens": total_tokens,
        "latency_ms": latency_ms(mode, query, visible_tools, total_tokens, total_tools=len(tools_for_scenario)),
        "registry_memory_bytes": registry_memory_bytes if mode == "registry" else 0,
        "backend": "synthetic",
    }

