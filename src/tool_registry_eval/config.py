from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv

from .paths import ROOT


@dataclass(frozen=True)
class EvalConfig:
    backend: str
    model: str
    api_key_present: bool
    max_scenario: str
    query_limit: int
    tool_budget: int
    live_baseline: bool
    repeat_runs: int           # how many times to repeat each query (Gemini only; synthetic is deterministic)
    output_subdir: str         # non-empty routes outputs to outputs/<subdir>/ and reports/tool-registry-eval-<subdir>/
    baseline_max_scenario: str # baseline stops at this scenario; registry continues to max_scenario


def load_config() -> EvalConfig:
    load_dotenv(ROOT / ".env")
    api_key = os.getenv("GEMINI_API_KEY", "")
    if api_key and not os.getenv("GOOGLE_API_KEY"):
        os.environ["GOOGLE_API_KEY"] = api_key
    max_scenario = os.getenv("EVAL_MAX_SCENARIO", "S4").strip()
    return EvalConfig(
        backend=os.getenv("EVAL_BACKEND", "synthetic").strip().lower(),
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite").strip(),
        api_key_present=bool(api_key),
        max_scenario=max_scenario,
        query_limit=int(os.getenv("EVAL_QUERY_LIMIT", "0") or "0"),
        tool_budget=int(os.getenv("EVAL_TOOL_BUDGET", "15") or "15"),
        live_baseline=os.getenv("EVAL_LIVE_BASELINE", "false").strip().lower() == "true",
        repeat_runs=max(1, int(os.getenv("EVAL_REPEAT_RUNS", "1") or "1")),
        output_subdir=os.getenv("EVAL_OUTPUT_SUBDIR", "").strip(),
        baseline_max_scenario=os.getenv("EVAL_BASELINE_MAX_SCENARIO", max_scenario).strip(),
    )

