from __future__ import annotations

from typing import Any

import json

from .catalog import make_queries, make_tools, scenario_queries, scenario_tools, write_input_data
from .charts import make_charts
from .config import EvalConfig, load_config
from .gemini_backend import run_gemini_row
from .io import write_csv
from .measure import all_statistical_tests, summarize
from .paths import ensure_dirs, resolve_output_dir, resolve_report_dir
from .registry import registry_memory
from .scenarios import SCENARIOS
from .synthetic_backend import run_synthetic_row


def scenario_names(max_scenario: str) -> list[str]:
    names = list(SCENARIOS.keys())
    if max_scenario not in names:
        return names
    return names[: names.index(max_scenario) + 1]


def run_rows(config: EvalConfig, output_dir=None) -> list[dict[str, Any]]:
    tools = make_tools()
    queries = make_queries()
    write_input_data(tools, queries)

    # Open incremental JSONL sinks so no data is lost on partial runs.
    baseline_sink = open(output_dir / "baseline.jsonl", "w", encoding="utf-8") if output_dir else None
    registry_sink = open(output_dir / "registry.jsonl", "w", encoding="utf-8") if output_dir else None

    def _flush(row: dict) -> None:
        sink = baseline_sink if row["mode"] == "baseline" else registry_sink
        if sink:
            sink.write(json.dumps(row, ensure_ascii=False) + "\n")
            sink.flush()

    rows: list[dict[str, Any]] = []
    total_scenarios = scenario_names(config.max_scenario)
    for scenario in total_scenarios:
        tools_for_scenario = scenario_tools(tools, scenario)
        queries_for_scenario = scenario_queries(queries, scenario, query_limit=config.query_limit)
        memory_bytes = registry_memory(tools_for_scenario)

        baseline_scenarios = scenario_names(config.baseline_max_scenario)
        run_baseline = config.live_baseline and scenario in baseline_scenarios
        modes = []
        if config.backend != "gemini" or run_baseline:
            modes.append("baseline")
        modes.append("registry")

        for mode in modes:
            for query in queries_for_scenario:
                # repeat_runs applies to non-deterministic (gemini) backend only
                n_repeats = config.repeat_runs if config.backend == "gemini" else 1
                for repeat_idx in range(n_repeats):
                    if config.backend == "gemini":
                        print(
                            f"  [{scenario}/{mode}] {query.query_id} rep={repeat_idx + 1}/{n_repeats}",
                            flush=True,
                        )
                        row = run_gemini_row(
                            mode=mode,
                            scenario=scenario,
                            query=query,
                            tools_for_scenario=tools_for_scenario,
                            registry_memory_bytes=memory_bytes,
                            config=config,
                            repeat_idx=repeat_idx,
                        )
                    else:
                        row = run_synthetic_row(
                            mode=mode,
                            scenario=scenario,
                            query=query,
                            tools_for_scenario=tools_for_scenario,
                            registry_memory_bytes=memory_bytes,
                            tool_budget=config.tool_budget,
                        )
                    rows.append(row)
                    _flush(row)

    if baseline_sink:
        baseline_sink.close()
    if registry_sink:
        registry_sink.close()

    return rows


def main() -> None:
    config = load_config()
    ensure_dirs(config.output_subdir)
    output_dir = resolve_output_dir(config.output_subdir)
    report_dir = resolve_report_dir(config.output_subdir)

    print(f"Backend: {config.backend}  max_scenario: {config.max_scenario}  "
          f"repeat_runs: {config.repeat_runs}  live_baseline: {config.live_baseline}")
    rows = run_rows(config, output_dir=output_dir)

    summary = summarize(rows)
    write_csv(output_dir / "summary.csv", summary)

    stat_tests = all_statistical_tests(rows)
    if stat_tests:
        write_csv(output_dir / "statistical_tests.csv", stat_tests)

    make_charts(summary, report_dir / "charts")
    from .report import write_report
    write_report(summary, rows, config, report_dir, stat_tests=stat_tests)

    print(f"Wrote {len(rows)} records")
    print(f"Summary: {output_dir / 'summary.csv'}")
    if stat_tests:
        print(f"Stats:   {output_dir / 'statistical_tests.csv'}")
    print(f"Report:  {report_dir / 'report.md'}")
