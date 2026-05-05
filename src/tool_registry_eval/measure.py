from __future__ import annotations

import math
import statistics
from typing import Any

from .domain import QueryDef, ToolDef
from .registry import stable_unit


def token_count(query: QueryDef, visible_tools: list[ToolDef]) -> tuple[int, int, int]:
    prompt_tokens = 420
    query_tokens = max(12, math.ceil(len(query.text.split()) * 1.4))
    tool_tokens = sum(tool.schema_tokens for tool in visible_tools)
    output_tokens = 72 + (8 if query.query_type == "cross_domain" else 0)
    input_tokens = prompt_tokens + query_tokens + tool_tokens
    return input_tokens, output_tokens, input_tokens + output_tokens


def select_tool(mode: str, query: QueryDef, visible_tools: list[ToolDef], total_tools: int) -> str:
    expected_visible = any(tool.name == query.expected_tool for tool in visible_tools)
    if not expected_visible:
        return visible_tools[0].name if visible_tools else "NO_TOOL"

    if mode == "baseline":
        load_penalty = min(0.56, math.log10(max(total_tools, 2)) * 0.19)
        type_penalty = {"single_domain": 0.02, "cross_domain": 0.09, "adversarial": 0.20}[query.query_type]
        probability = 0.95 - load_penalty - type_penalty
    else:
        load_penalty = min(0.08, math.log10(max(len(visible_tools), 2)) * 0.035)
        type_penalty = {"single_domain": 0.01, "cross_domain": 0.04, "adversarial": 0.08}[query.query_type]
        probability = 0.96 - load_penalty - type_penalty

    probability = max(0.18, min(0.98, probability))
    if stable_unit(mode, query.query_id, total_tools) <= probability:
        return query.expected_tool

    distractors = [tool for tool in visible_tools if tool.name != query.expected_tool]
    if not distractors:
        return query.expected_tool
    index = int(stable_unit("miss", mode, query.query_id, total_tools) * len(distractors))
    return distractors[min(index, len(distractors) - 1)].name


def latency_ms(mode: str, query: QueryDef, visible_tools: list[ToolDef], total_tokens: int, total_tools: int) -> float:
    base = 185.0
    visible_component = len(visible_tools) * (7.4 if mode == "baseline" else 3.1)
    token_component = total_tokens * 0.042
    registry_overhead = 18.0 if mode == "registry" else 0.0
    adversarial_overhead = 35.0 if query.query_type == "adversarial" else 0.0
    jitter = stable_unit("latency", mode, query.query_id, total_tools) * 42.0
    return round(base + visible_component + token_component + registry_overhead + adversarial_overhead + jitter, 3)


def percentile(values: list[float], pct: float) -> float:
    if not values:
        return 0.0
    sorted_values = sorted(values)
    index = (len(sorted_values) - 1) * pct
    lower = math.floor(index)
    upper = math.ceil(index)
    if lower == upper:
        return sorted_values[int(index)]
    weight = index - lower
    return sorted_values[lower] * (1 - weight) + sorted_values[upper] * weight


def summarize(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    grouped: dict[tuple[str, str], list[dict[str, Any]]] = {}
    for row in rows:
        grouped.setdefault((row["scenario"], row["mode"]), []).append(row)

    summary: list[dict[str, Any]] = []
    for (scenario, mode), items in sorted(grouped.items()):
        latencies = [float(item["latency_ms"]) for item in items]
        tokens = [float(item["total_tokens"]) for item in items]
        correct = [1.0 if item["is_correct"] else 0.0 for item in items]
        n = len(items)
        summary.append(
            {
                "scenario": scenario,
                "mode": mode,
                "total_tools": items[0]["total_tools"],
                "avg_visible_tools": round(statistics.mean(item["visible_tools"] for item in items), 3),
                "avg_total_tokens": round(statistics.mean(tokens), 3),
                "std_total_tokens": round(statistics.pstdev(tokens), 3) if n > 1 else 0.0,
                "accuracy": round(statistics.mean(correct), 4),
                "std_accuracy": round(statistics.pstdev(correct), 4) if n > 1 else 0.0,
                "latency_p50_ms": round(percentile(latencies, 0.50), 3),
                "latency_p95_ms": round(percentile(latencies, 0.95), 3),
                "latency_mean_ms": round(statistics.mean(latencies), 3),
                "std_latency_ms": round(statistics.pstdev(latencies), 3) if n > 1 else 0.0,
                "registry_memory_bytes": max(item["registry_memory_bytes"] for item in items),
                "runs": n,
            }
        )
    return summary

