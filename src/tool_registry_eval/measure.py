from __future__ import annotations

import math
import statistics
from typing import Any

from .domain import QueryDef, ToolDef
from .registry import stable_unit

try:
    from scipy import stats as _scipy_stats
    _SCIPY_AVAILABLE = True
except ImportError:
    _SCIPY_AVAILABLE = False


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


def paired_statistical_tests(rows: list[dict[str, Any]], scenario: str) -> dict[str, Any]:
    """Paired Wilcoxon signed-rank, Cohen's d, and 95% CI for token reduction in one scenario.

    Matches baseline and registry by query_id, averages over repeats, then runs
    paired tests on total_tokens. Returns empty dict if scipy is unavailable or
    data is insufficient.
    """
    if not _SCIPY_AVAILABLE:
        return {"error": "scipy not installed"}

    baseline_by_q: dict[str, list[tuple[float, float]]] = {}
    registry_by_q: dict[str, list[tuple[float, float]]] = {}
    for row in rows:
        if row["scenario"] != scenario:
            continue
        qid = row["query_id"]
        tokens = float(row["total_tokens"])
        correct = 1.0 if row["is_correct"] else 0.0
        if row["mode"] == "baseline":
            baseline_by_q.setdefault(qid, []).append((tokens, correct))
        elif row["mode"] == "registry":
            registry_by_q.setdefault(qid, []).append((tokens, correct))

    common = sorted(set(baseline_by_q) & set(registry_by_q))
    n = len(common)
    if n < 3:
        return {"scenario": scenario, "n_pairs": n, "error": "insufficient paired data (need ≥3)"}

    b_tokens = [statistics.mean(t for t, _ in baseline_by_q[q]) for q in common]
    r_tokens = [statistics.mean(t for t, _ in registry_by_q[q]) for q in common]
    b_acc = [statistics.mean(c for _, c in baseline_by_q[q]) for q in common]
    r_acc = [statistics.mean(c for _, c in registry_by_q[q]) for q in common]

    token_diffs = [b - r for b, r in zip(b_tokens, r_tokens)]  # positive = registry saves tokens
    acc_diffs = [r - b for b, r in zip(b_acc, r_acc)]  # positive = registry more accurate

    mean_diff = statistics.mean(token_diffs)
    std_diff = statistics.pstdev(token_diffs) if n > 1 else 0.0
    cohens_d = mean_diff / std_diff if std_diff > 0 else None

    try:
        w_stat, w_p = _scipy_stats.wilcoxon(token_diffs, alternative="greater")
    except Exception:
        w_stat, w_p = None, None

    se = std_diff / math.sqrt(n) if n > 0 else 0.0
    t_crit = _scipy_stats.t.ppf(0.975, df=n - 1) if n > 1 else 1.96
    ci_lower = mean_diff - t_crit * se
    ci_upper = mean_diff + t_crit * se

    mean_acc_diff = statistics.mean(acc_diffs)
    std_acc_diff = statistics.pstdev(acc_diffs) if n > 1 else 0.0
    try:
        _, acc_p = _scipy_stats.wilcoxon(acc_diffs, alternative="greater")
    except Exception:
        acc_p = None

    return {
        "scenario": scenario,
        "n_pairs": n,
        "token_reduction_mean": round(mean_diff, 2),
        "token_reduction_ci95_lower": round(ci_lower, 2),
        "token_reduction_ci95_upper": round(ci_upper, 2),
        "wilcoxon_token_stat": round(w_stat, 4) if w_stat is not None else None,
        "wilcoxon_token_p": round(w_p, 6) if w_p is not None else None,
        "cohens_d_tokens": round(cohens_d, 4) if cohens_d is not None else None,
        "accuracy_improvement_mean": round(mean_acc_diff, 4),
        "accuracy_improvement_std": round(std_acc_diff, 4),
        "wilcoxon_accuracy_p": round(acc_p, 6) if acc_p is not None else None,
    }


def all_statistical_tests(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Run paired_statistical_tests for every scenario that has both baseline and registry data."""
    scenarios_with_both: set[str] = set()
    scenarios_baseline: set[str] = set()
    scenarios_registry: set[str] = set()
    for row in rows:
        if row["mode"] == "baseline":
            scenarios_baseline.add(row["scenario"])
        elif row["mode"] == "registry":
            scenarios_registry.add(row["scenario"])
    scenarios_with_both = scenarios_baseline & scenarios_registry
    return [paired_statistical_tests(rows, s) for s in sorted(scenarios_with_both)]


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

