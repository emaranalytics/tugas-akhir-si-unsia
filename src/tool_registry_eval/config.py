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
    repeat_runs: int           # how many times to repeat each query (Gemini/ADACODE only; synthetic is deterministic)
    output_subdir: str         # non-empty routes outputs to outputs/<subdir>/ and reports/tool-registry-eval-<subdir>/
    baseline_max_scenario: str # baseline stops at this scenario; registry continues to max_scenario
    # ADACODE-specific
    adacode_model: str | None   # e.g. "anthropic", "glm", "minimax"; None if backend != "adacode"
    adacode_model_name: str | None  # actual model ID, e.g. "claude-sonnet-4-6"; None if not adacode


def load_config() -> EvalConfig:
    load_dotenv(ROOT / ".env")
    api_key = os.getenv("GEMINI_API_KEY", "")
    if api_key and not os.getenv("GOOGLE_API_KEY"):
        os.environ["GOOGLE_API_KEY"] = api_key
    max_scenario = os.getenv("EVAL_MAX_SCENARIO", "S4").strip()

    backend = os.getenv("EVAL_BACKEND", "synthetic").strip().lower()

    adacode_model: str | None = None
    adacode_model_name: str | None = None
    if backend == "adacode":
        adacode_model = os.getenv("EVAL_ADACODE_MODEL", "anthropic").strip().lower()
        model_map = {
            "anthropic": os.getenv("ANTHROPIC_SONNET_MODEL"),
            "glm": os.getenv("GLM_FLASH_MODEL"),
            "minimax": os.getenv("MINIMAX_M_MODEL"),
        }
        adacode_model_name = model_map.get(adacode_model)
        if not adacode_model_name:
            raise ValueError(
                f"EVAL_ADACODE_MODEL='{adacode_model}' — "
                f"对应的 env var 为空或未定义. "
                f"Available: {list(model_map)}"
            )

    return EvalConfig(
        backend=backend,
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite").strip(),
        api_key_present=bool(api_key),
        max_scenario=max_scenario,
        query_limit=int(os.getenv("EVAL_QUERY_LIMIT", "0") or "0"),
        tool_budget=int(os.getenv("EVAL_TOOL_BUDGET", "15") or "15"),
        live_baseline=os.getenv("EVAL_LIVE_BASELINE", "false").strip().lower() == "true",
        repeat_runs=max(1, int(os.getenv("EVAL_REPEAT_RUNS", "1") or "1")),
        output_subdir=os.getenv("EVAL_OUTPUT_SUBDIR", "").strip(),
        baseline_max_scenario=os.getenv("EVAL_BASELINE_MAX_SCENARIO", max_scenario).strip(),
        adacode_model=adacode_model,
        adacode_model_name=adacode_model_name,
    )

