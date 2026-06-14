# Project Context — Tool Registry Evaluation (Thesis)

This is a **Tugas Akhir (S1 thesis) project** for Muhammadridwan (NIM 220101010009),
PJJ Sistem Informasi, Universitas Siber Asia. Supervised by Ikhwani Saputra, S.Kom., M.Kom.

## What This Project Is

Research thesis on **Tool Registry** — a filtering layer in front of AI agents that selects
the most relevant tools (by module, role, subscription tier, and token budget) before the
LLM sees them. The goal: prove that Tool Registry improves token efficiency, accuracy, and
scalability on the zerlo.id AI-ERP platform.

**Final thesis title**: "Implementasi dan Evaluasi Tool Registry untuk Skalabilitas AI Agent
Multi-Modul pada Platform ERP Restoran zerlo.id"

## Tech Stack

- **Language**: Python 3.13
- **AI Backend**: Google Gen AI SDK (Gemini 2.5 Flash Lite)
- **Agent Framework**: Pydantic AI
- **Data**: pandas, numpy, scipy (Wilcoxon, Cohen's d), matplotlib
- **CLI**: typer, rich, tqdm
- **Production system**: FastAPI + MongoDB Atlas + GCP (zerlo.id)

## Key Experiments

| Experiment | Location | Status |
|-----------|----------|--------|
| Synthetic S1–S4 (deterministic) | `outputs/summary.csv` | ✅ |
| Gemini Native v2 (n=558, 100 queries, S1–S3) | `outputs/gemini-native-v2/` | ✅ Official |
| Gemini Rich Descriptions (n=156) | `outputs/gemini-rich/` | ✅ Future-work |
| MiniMax-M2.7 (S1–S2 complete, S3 in progress) | `outputs/adacode-minimax/` | 🔄 Multi-model comparison |
| Claude Sonnet 4.6 (planned, S1–S3, 3 repeats) | `outputs/adacode-anthropic/` | 📋 Multi-model comparison |

## Codebase Structure

```
src/
  tool_registry_eval/
    catalog.py        # ToolDef catalog + 100-query dataset
    registry.py       # ToolRegistry filtering logic
    config.py         # Env var configuration
    runner.py         # JSONL incremental run loop (resume-safe, append mode)
    measure.py        # Statistical tests (Wilcoxon, Cohen's d, 95% CI)
    report.py         # Markdown report generator
    charts.py         # matplotlib charts
    io.py             # JSONL/CSV I/O utilities
    domain.py         # Domain definitions
    paths.py          # Output path helpers
    scenarios.py      # Scenario definitions + intent templates
    backends/
      __init__.py     # get_backend() factory
      base.py         # LLMBackend ABC + LLMResult
      gemini.py       # Google Gen AI SDK wrapper with retry backoff
      synthetic.py    # Deterministic simulation backend
      adacode.py      # OpenAI-compatible multi-model (Claude, MiniMax, GLM)
  experiments/
    run_eval.py       # Entry point CLI
```

## Env Vars

| Variable | Purpose |
|----------|---------|
| `EVAL_BACKEND` | `synthetic`, `gemini`, or `adacode` |
| `EVAL_ADACODE_MODEL` | `anthropic`, `minimax`, or `glm` (for adacode backend) |
| `EVAL_MAX_SCENARIO` | Max scenario index to run |
| `EVAL_REPEAT_RUNS` | Number of repeats per scenario |
| `EVAL_OUTPUT_SUBDIR` | Output subdirectory name |
| `EVAL_TOOL_BUDGET` | Max visible tools per registry call |
| `EVAL_LIVE_BASELINE` | Run live baseline alongside registry |

## Key Findings (Official Results — Gemini Native v2, n=558)

| Metric | Baseline | Registry | Change |
|--------|----------|----------|--------|
| Token S1 (30 tools) | 2,426 | 893 | **−63%** |
| Token S2 (100 tools) | 7,985 | 1,241 | **−84%** |
| Token S3 (300 tools) | 23,893 | 1,239 | **−95%** |
| Accuracy S1 | 68.8% | 75.0% | +6.3pp |
| Accuracy S3 | 71.4% | 77.6% | +6.3pp |
| Visible tools S3 | 300 | 15 | O(N) → O(1) |
| Token reduction p-value | — | — | Wilcoxon p<0.0001, Cohen's d≥11 |

## Important Conventions

- All experiment outputs go under `outputs/<subdir>/` with incremental JSONL runs
- `summary.csv` is auto-generated from all JSONL records in the directory
- Statistical tests output to `outputs/<subdir>/statistical_tests.csv`
- Reports are written as Markdown under `reports/`
- Primary tool intents defined in `scenarios.py` as `PRIMARY_TOOL_INTENTS`
- Generic intent templates per `op_type` in `OP_INTENT_TEMPLATES`

## Zerlo.id Production Context

zerlo.id is an AI-powered ERP for Indonesian F&B SMEs with:
- 38 modules, 1,176 endpoints
- 11 AI agents
- FastAPI + Pydantic AI + MongoDB Atlas + GCP
- 60+ active tools in production
- Beta testing stage

## On-Demand Rule Files

These files contain detailed rules/data for writing thesis chapters. **Do NOT auto-load all of them.**
Read the specific file only when the task requires it.

| Rule File | Isi | Kapan Dibaca |
|-----------|-----|--------------|
| `.claude/rules/sistematika-bab.md` | Struktur & konten wajib tiap bab (Bab I–V), rumusan masalah, tujuan, sub-bab, data apa yang masuk ke mana | Sebelum menulis bab apapun |
| `.claude/rules/format-penulisan.md` | Format teknis UNSIA: margin, font, spasi, caption, penomoran, bahasa pasif, IEEE citation style, aturan tabel/gambar | Saat formatting naskah atau menyusun daftar pustaka |
| `.claude/rules/data-hasil-eksperimen.md` | Angka resmi eksperimen (token, accuracy, latency, Wilcoxon p, Cohen's d) — wajib akurat | Setiap kali menulis Bab IV, abstrak, atau kesimpulan angka |
| `.claude/rules/referensi-sitasi.md` | Tabel sitasi per topik (Tool RAG, Tool Registry, LLM FC, Context Rot) + format IEEE 11 referensi kunci | Saat menulis Bab II atau menambahkan sitasi ke paragraf apapun |

## Naskah Tugas Akhir (Manuscript Drafts)

Thesis chapters are drafted as Markdown under `bab/`, then compiled into a single
UNSIA-formatted `.docx` by a generator script. **The `.docx` is generated, not hand-edited.**

| Bab | File | Status |
|-----|------|--------|
| Bab I — Pendahuluan | `bab/bab-1-pendahuluan.md` | ✅ Draft (rumusan masalah in *pernyataan* form per pedoman) |
| Bab II — Landasan Teori | `bab/bab-2-landasan-teori.md` | ✅ Draft (7 sub-bab, 23 IEEE refs, Tabel 2.1 penelitian terdahulu) |
| Bab III — Implementasi Metode Usulan | — | 📋 Placeholder + outline |
| Bab IV — Hasil dan Analisa | — | 📋 Placeholder + outline |
| Bab V — Kesimpulan | — | 📋 Placeholder + outline |

**Build the compiled draft:**
```
conda activate gradio   # needs python-docx
python tools/build_thesis_docx.py   # → draft/Draft-Tugas-Akhir-Muhammadridwan.docx
```
- Reads `bab/*.md` + front-matter metadata (cover w/ `reference/logo.png`, orisinalitas,
  pengesahan, abstrak placeholder, kata pengantar, daftar isi/tabel/gambar as Word TOC fields).
- To add a finished bab: write its `.md`, set its filename in the `CHAPTERS` list (replace `None`), re-run.
- Applies pedoman format: A4; margin L4/T3/B3/R3 cm; TNR 12; spasi 1.5; 3-line tables font 10;
  roman→arabic page numbering (3 sections); `cantSplit`/`tblHeader` so tables never crop across pages.
- After opening in Word: `Ctrl+A` then `F9` to populate the TOC fields.

## Relevant Files to Know

- `README.md` — full project narrative with results
- `02-keputusan-judul-final.md` — thesis title, focus, and all experiment results
- `00-ringkasan-project-zerlo.md` — zerlo.id overview
- `bab/` — thesis chapter drafts in Markdown (source of truth for the manuscript)
- `tools/build_thesis_docx.py` — generator: `bab/*.md` → compiled `.docx`
- `draft/Draft-Tugas-Akhir-Muhammadridwan.docx` — compiled manuscript (regenerated, do not hand-edit)
- `reference/Lampiran.pdf` — UNSIA front-matter/template reference the docx structure is based on
- `plan/01-dev-plan-evaluasi-tool-registry.md` — dev plan and roadmap
- `plan/02-bab5-threats-to-validity.md` — Bab 5 threats to validity draft
- `reference/referensi-ilmiah.md` — 21 academic references with full summaries
- `reference/PEDOMAN PENULISAN TUGAS AKHIR Validasi.md` — full university writing guidelines
- `src/experiments/run_eval.py --help` — CLI entry point documentation

## Coding Style

- Use `ruff` for linting/formatting (project has `ruff` in requirements)
- Use `pytest` for testing
- Type hints throughout
- Docstrings on public functions
- Incremental JSONL runs for experiments (never overwrite, always append)