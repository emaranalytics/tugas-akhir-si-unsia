from __future__ import annotations

from typing import Any

import json

from .backends import get_backend
from .catalog import make_queries, make_tools, scenario_queries, scenario_tools, write_input_data
from .charts import make_charts
from .config import EvalConfig, load_config
from .io import write_csv
from .measure import all_statistical_tests, summarize
from .paths import ensure_dirs, resolve_output_dir, resolve_report_dir
from .registry import registry_memory
from .scenarios import SCENARIOS


def scenario_names(max_scenario: str) -> list[str]:
    names = list(SCENARIOS.keys())
    if max_scenario not in names:
        return names
    return names[: names.index(max_scenario) + 1]


def _load_done_keys(output_dir) -> set[tuple[str, str, str, int]]:
    """Return (scenario, mode, query_id, repeat_idx) tuples already on disk."""
    done: set[tuple[str, str, str, int]] = set()
    if output_dir is None:
        return done
    for fname in ("baseline.jsonl", "registry.jsonl"):
        p = output_dir / fname
        if not p.exists():
            continue
        for line in p.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                r = json.loads(line)
                done.add((r["scenario"], r["mode"], r["query_id"], int(r["repeat_idx"])))
            except (json.JSONDecodeError, KeyError):
                pass
    return done


def run_rows(config: EvalConfig, output_dir=None) -> list[dict[str, Any]]:
    tools = make_tools()
    queries = make_queries()
    write_input_data(tools, queries)

    backend = get_backend(config)

    # Load already-completed keys so we can resume interrupted runs.
    done_keys = _load_done_keys(output_dir)
    if done_keys:
        print(f"Resuming: {len(done_keys)} rows already on disk — skipping those.", flush=True)

    # Open incremental JSONL sinks in append mode so partial runs are resumable.
    baseline_sink = open(output_dir / "baseline.jsonl", "a", encoding="utf-8") if output_dir else None
    registry_sink = open(output_dir / "registry.jsonl", "a", encoding="utf-8") if output_dir else None

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
        # synthetic always runs baseline; gemini/adacode runs baseline only when live_baseline is enabled
        if config.backend == "synthetic" or run_baseline:
            modes.append("baseline")
        modes.append("registry")

        n_repeats = config.repeat_runs if config.backend in ("gemini", "adacode") else 1

        for mode in modes:
            for query in queries_for_scenario:
                for repeat_idx in range(n_repeats):
                    key = (scenario, mode, query.query_id, repeat_idx)
                    if key in done_keys:
                        print(
                            f"  [{scenario}/{mode}] {query.query_id} rep={repeat_idx + 1}/{n_repeats} SKIP",
                            flush=True,
                        )
                        continue
                    print(
                        f"  [{scenario}/{mode}] {query.query_id} rep={repeat_idx + 1}/{n_repeats}",
                        flush=True,
                    )
                    row = backend.call(
                        mode=mode,
                        scenario=scenario,
                        query=query,
                        tools_for_scenario=tools_for_scenario,
                        registry_memory_bytes=memory_bytes,
                        config=config,
                        repeat_idx=repeat_idx,
                    )
                    rows.append(row)
                    _flush(row)

    if baseline_sink:
        baseline_sink.close()
    if registry_sink:
        registry_sink.close()

    return rows


def _load_all_rows(output_dir) -> list[dict[str, Any]]:
    """Read all rows from the JSONL files in output_dir (for post-run reporting)."""
    rows: list[dict[str, Any]] = []
    if output_dir is None:
        return rows
    for fname in ("baseline.jsonl", "registry.jsonl"):
        p = output_dir / fname
        if not p.exists():
            continue
        for line in p.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line:
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
    return rows


def main() -> None:
    config = load_config()
    ensure_dirs(config.output_subdir)
    output_dir = resolve_output_dir(config.output_subdir)
    report_dir = resolve_report_dir(config.output_subdir)

    print(f"Backend: {config.backend}  max_scenario: {config.max_scenario}  "
          f"repeat_runs: {config.repeat_runs}  live_baseline: {config.live_baseline}")
    run_rows(config, output_dir=output_dir)

    # Load all rows (new + pre-existing skipped) for summary/report.
    rows = _load_all_rows(output_dir)

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
