from __future__ import annotations

import os
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", str(Path("/tmp") / "matplotlib-cache"))

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

from .paths import CHART_DIR
from .scenarios import SCENARIOS


def pivot(summary: list[dict], metric: str) -> dict[str, dict[str, float]]:
    result: dict[str, dict[str, float]] = {}
    for row in summary:
        result.setdefault(row["scenario"], {})[row["mode"]] = float(row[metric])
    return result


def plot_metric(
    summary: list[dict],
    metric: str,
    title: str,
    ylabel: str,
    filename: str,
    chart_dir: Path,
) -> None:
    data = pivot(summary, metric)
    scenarios = list(SCENARIOS.keys())
    scenarios = [scenario for scenario in scenarios if scenario in data]
    x = range(len(scenarios))
    width = 0.36
    baseline = [data[scenario].get("baseline", 0.0) for scenario in scenarios]
    registry = [data[scenario].get("registry", 0.0) for scenario in scenarios]

    fig, ax = plt.subplots(figsize=(9, 5))
    ax.bar([i - width / 2 for i in x], baseline, width, label="Baseline", color="#7f8c8d")
    ax.bar([i + width / 2 for i in x], registry, width, label="Registry", color="#2e86de")
    ax.set_title(title)
    ax.set_ylabel(ylabel)
    ax.set_xticks(list(x), scenarios)
    ax.grid(axis="y", alpha=0.25)
    ax.legend()
    fig.tight_layout()
    fig.savefig(chart_dir / filename, dpi=180)
    plt.close(fig)


def plot_memory(summary: list[dict], chart_dir: Path) -> None:
    rows = [row for row in summary if row["mode"] == "registry"]
    scenarios = [row["scenario"] for row in rows]
    memory_kb = [row["registry_memory_bytes"] / 1024 for row in rows]
    total_tools = [row["total_tools"] for row in rows]

    fig, ax1 = plt.subplots(figsize=(9, 5))
    ax1.plot(scenarios, memory_kb, marker="o", color="#16a085", label="Registry memory KB")
    ax1.set_ylabel("Memory KB")
    ax1.set_title("Registry Memory Footprint")
    ax1.grid(axis="y", alpha=0.25)
    ax2 = ax1.twinx()
    ax2.plot(scenarios, total_tools, marker="s", color="#34495e", label="Total tools")
    ax2.set_ylabel("Total tools")
    fig.tight_layout()
    fig.savefig(chart_dir / "memory_footprint.png", dpi=180)
    plt.close(fig)


def make_charts(summary: list[dict], chart_dir: Path = CHART_DIR) -> None:
    chart_dir.mkdir(parents=True, exist_ok=True)
    plot_metric(summary, "avg_total_tokens", "Token-per-turn: Baseline vs Registry", "Avg total tokens", "token_per_turn.png", chart_dir)
    plot_metric(summary, "accuracy", "Tool Selection Accuracy", "Accuracy", "tool_selection_accuracy.png", chart_dir)
    plot_metric(summary, "latency_p95_ms", "Latency p95", "Milliseconds", "latency_p95.png", chart_dir)
    plot_metric(summary, "avg_visible_tools", "Visible Tools Scaling", "Avg visible tools", "visible_tools_scaling.png", chart_dir)
    plot_memory(summary, chart_dir)
