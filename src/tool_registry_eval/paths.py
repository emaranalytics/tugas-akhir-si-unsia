from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUTPUT_DIR = ROOT / "outputs"
REPORT_DIR = ROOT / "reports" / "tool-registry-eval"
CHART_DIR = REPORT_DIR / "charts"
DATA_DIR = ROOT / "src" / "evals"
TOOL_DIR = ROOT / "src" / "tools"


def resolve_output_dir(subdir: str) -> Path:
    return OUTPUT_DIR / subdir if subdir else OUTPUT_DIR


def resolve_report_dir(subdir: str) -> Path:
    suffix = f"-{subdir}" if subdir else ""
    return ROOT / "reports" / f"tool-registry-eval{suffix}"


def ensure_dirs(subdir: str = "") -> None:
    output_dir = resolve_output_dir(subdir)
    report_dir = resolve_report_dir(subdir)
    chart_dir = report_dir / "charts"
    for path in [output_dir, report_dir, chart_dir, DATA_DIR, TOOL_DIR]:
        path.mkdir(parents=True, exist_ok=True)
