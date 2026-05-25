# Dev Plan — Evaluasi Multi-Model via ADACODE API

**Versi Dokumen**: 1.0
**Tanggal**: 25 Mei 2026
**Status**: Draft — belum implementasi
**Referensi**: `plan/01-dev-plan-evaluasi-tool-registry.md`, `plan/02-bab5-threats-to-validity.md`

---

## 1. Latar Belakang & Tujuan

Dokumen rencana ini melanjutkan eksperimen yang sudah ada dengan menambahkan
dukungan **multi-model evaluation** menggunakan 3 model LLM melalui **ADACODE API**:

| Env Var | Model |
|---------|-------|
| `ANTHROPIC_SONNET_MODEL` | `claude-sonnet-4-6` |
| `GLM_FLASH_MODEL` | `glm-4.5-flash` |
| `MINIMAX_M_MODEL` | `MiniMax-M2.7` |

Tujuan utama:
1. Mengukur **token reduction**, **accuracy**, dan **latency** registry secara
   komparatif lintas model.
2. Membuktikan bahwa keunggulan registry **tidak bersifat spesifik-Gemini** —
   melainkan properti arsitektural yang berlaku generik.
3. Memperkuat ancaman validitas eksternal ("satu provider LLM") dengan
   memberikan data cross-model sebagai mitigasi.

---

## 2. Prinsip Desain

- Tidak mengubah struktur output/CSV/JSONL yang sudah ada — backward compatible.
- Setiap model menghasilkan output di subdirektori sendiri: `outputs/adacode-anthropic/`,
  `outputs/adacode-glm/`, `outputs/adacode-minimax/`.
- Konfigurasi dijalankan via env var yang sudah ada, ditambah
  `EVAL_ADACODE_MODEL` (atau `EVAL_MODEL`) untuk memilih model aktif.
- Statistika lintas model (.csv per model) tetap dihasilkan; agregasi lintas model
  ditambahkan sebagai langkah future-work di Bab 4.

---

## 3. Arsitektur yang Diperlukan

### 3.1 Abstract Backend Interface

Tambahkan abstraksi `LLMBackend` agar `runner.py` tidak tergantung pada
satu SDK. Struktur:

```python
# src/tool_registry_eval/backends/
__init__.py
base.py          # ABC: LLMBackend
adacode.py       # OpenAI-compatible via ADACODE
gemini.py        # Google Gen AI SDK (backend="gemini", existing)
synthetic.py     # Deterministic sim (backend="synthetic", existing)
```

`base.py` mendefinisikan kontrak:

```python
class LLMBackend(ABC):
    @abstractmethod
    def call(self, query: QueryDef, tools: list[ToolDef], config: EvalConfig) -> LLMResult:
        """Send one query with visible tools. Return result dict."""
        ...

    @property
    @abstractmethod
    def name(self) -> str:
        """Short backend name, e.g. 'adacode-anthropic'."""
        ...
```

`LLMResult` dataclass:

```python
@dataclass
class LLMResult:
    selected_tool: str
    input_tokens: int
    output_tokens: int
    total_tokens: int
    latency_ms: float
    error: str | None = None
```

### 3.2 ADACODE Backend (`adacode.py`)

Menggunakan SDK `openai` (OpenAI-compatible):

```python
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("ADACODE_API_KEY"),
    base_url=os.getenv("ADACODE_BASE_URL", "https://api.adacode.ai/v1"),
)
```

Tool declarations dikirim sebagai schema dict (bukan native FC —
ADACODE menerjemahkan sendiri ke format tiap provider):

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": t.name,
            "description": _adacode_tool_description(t),
            "parameters": {"type": "object", "properties": {}},
        },
    }
    for t in visible_tools
]
```

Model dipilih dari env var berdasarkan konfigurasi run (`EVAL_ADACODE_MODEL`).
Mapping env var → model name:

```python
MODEL_MAP = {
    "anthropic": os.getenv("ANTHROPIC_SONNET_MODEL"),
    "glm": os.getenv("GLM_FLASH_MODEL"),
    "minimax": os.getenv("MINIMAX_M_MODEL"),
}
```

Retry logic: 3 attempts dengan exponential backoff (4s, 8s, 16s).

### 3.3 Runner Modifikasi (`runner.py`)

Ubah dispatch logic di `run_rows()`:

```python
from .backends import get_backend

backend = get_backend(config)
for scenario in scenarios:
    for mode in modes:
        for query in queries_for_scenario:
            for repeat in range(n_repeats):
                row = backend.call(query, tools_for_scenario, config, mode)
                # ... rest unchanged
```

`get_backend()` factory:

```python
def get_backend(config: EvalConfig) -> LLMBackend:
    if config.backend == "synthetic":
        return SyntheticBackend()
    elif config.backend == "gemini":
        return GeminiBackend()
    elif config.backend == "adacode":
        return ADACODEBackend(model_key=config.model_key)  # model_key from env
    else:
        raise ValueError(f"Unknown backend: {config.backend}")
```

### 3.4 Config Modifikasi (`config.py`)

Tambahkan field di `EvalConfig`:

```python
@dataclass(frozen=True)
class EvalConfig:
    # ... existing fields ...
    adacode_model: str | None  # e.g. "anthropic", "glm", "minimax"
    adacode_model_name: str | None  # actual model ID from env var
```

Tambahkan env var:

| Env Var | Default | Fungsi |
|---------|---------|--------|
| `EVAL_BACKEND` | `synthetic` | Tambah nilai `adacode` |
| `EVAL_ADACODE_MODEL` | `anthropic` | Pilih model: `anthropic`, `glm`, `minimax` |

Load logic di `load_config()`:

```python
backend = os.getenv("EVAL_BACKEND", "synthetic").strip().lower()
adacode_model = None
adacode_model_name = None
if backend == "adacode":
    adacode_model = os.getenv("EVAL_ADACODE_MODEL", "anthropic").strip().lower()
    model_map = {
        "anthropic": os.getenv("ANTHROPIC_SONNET_MODEL"),
        "glm": os.getenv("GLM_FLASH_MODEL"),
        "minimax": os.getenv("MINIMAX_M_MODEL"),
    }
    adacode_model_name = model_map.get(adacode_model)
    if not adacode_model_name:
        raise ValueError(f"Unknown EVAL_ADACODE_MODEL: {adacode_model}")
```

### 3.5 Output Subdir Convention

| Backend | Output Subdir |
|---------|-------------|
| `gemini` | `gemini-native`, `gemini-native-v2` |
| `adacode` | `adacode-{model_key}` → `adacode-anthropic`, `adacode-glm`, `adacode-minimax` |

---

## 4. Eksperimen yang Direncanakan

### 4.1 Eksperimen ADACODE Multi-Model

| # | Model | Skenario | Baseline | Query/repeat |
|---|-------|----------|----------|-------------|
| E1 | `claude-sonnet-4-6` | S1–S3 | S1–S2 | 100 query × 3 repeats |
| E2 | `glm-4.5-flash` | S1–S3 | S1–S2 | 100 query × 3 repeats |
| E3 | `MiniMax-M2.7` | S1–S3 | S1–S2 | 100 query × 3 repeats |

Command run:

```bash
# E1: Anthropic Sonnet
EVAL_BACKEND=adacode EVAL_ADACODE_MODEL=anthropic \
  EVAL_MAX_SCENARIO=S3 EVAL_BASELINE_MAX_SCENARIO=S2 \
  EVAL_REPEAT_RUNS=3 EVAL_LIVE_BASELINE=true \
  EVAL_OUTPUT_SUBDIR=adacode-anthropic \
  python3 src/experiments/run_eval.py

# E2: GLM Flash
EVAL_BACKEND=adacode EVAL_ADACODE_MODEL=glm \
  EVAL_MAX_SCENARIO=S3 EVAL_BASELINE_MAX_SCENARIO=S2 \
  EVAL_REPEAT_RUNS=3 EVAL_LIVE_BASELINE=true \
  EVAL_OUTPUT_SUBDIR=adacode-glm \
  python3 src/experiments/run_eval.py

# E3: MiniMax M2.7
EVAL_BACKEND=adacode EVAL_ADACODE_MODEL=minimax \
  EVAL_MAX_SCENARIO=S3 EVAL_BASELINE_MAX_SCENARIO=S2 \
  EVAL_REPEAT_RUNS=3 EVAL_LIVE_BASELINE=true \
  EVAL_OUTPUT_SUBDIR=adacode-minimax \
  python3 src/experiments/run_eval.py
```

### 4.2 Klaim Eksperimen Baru

| Claim | Hipotesis | Metrik |
|-------|-----------|--------|
| C6. Token reduction berlaku lintas model | ADACODE registry menghasilkan token reduction serupa Gemini | Δ total_tokens baseline→registry |
| C7. Accuracy berlaku lintas model | Accuracy registry vs baseline konsisten di semua model | is_correct rate |
| C8. Sub-linear scalability lintas model | Visible tools O(1) berlaku di semua model | avg_visible_tools |
| C9. Cross-model comparison | Claude/GLM/MiniMax menghasilkan token/accuracy berbeda; registry relatif stabil | Summary comparison table |

---

## 5. Perubahan File

| File | Aksi | Deskripsi |
|------|------|-----------|
| `src/tool_registry_eval/backends/__init__.py` | Tambah | Backend factory |
| `src/tool_registry_eval/backends/base.py` | Tambah | `LLMBackend` ABC + `LLMResult` dataclass |
| `src/tool_registry_eval/backends/adacode.py` | Tambah | ADACODE OpenAI-compatible backend |
| `src/tool_registry_eval/backends/gemini.py` | Refactor | Pindahkan `run_gemini_row` dari `gemini_backend.py` ke kelas |
| `src/tool_registry_eval/backends/synthetic.py` | Refactor | Pindahkan dari `synthetic_backend.py` |
| `src/tool_registry_eval/config.py` | Modifikasi | Tambah `adacode_model`, `adacode_model_name` |
| `src/tool_registry_eval/runner.py` | Modifikasi | Ganti dispatch dengan `get_backend()` |
| `src/tool_registry_eval/report.py` | Modifikasi | Tambah `_methodology_note_adacode()` |
| `plan/03-dev-plan-multi-model-adacode.md` | Tambah | Dokumen ini |

---

## 6. Catatan Ancaman Validitas (dari `plan/02-bab5-threats-to-validity.md`)

Eksperimen multi-model ini secara langsung memitigasi ancaman:

> **5.Y.2.A** — Satu provider LLM. Hasil tidak dapat digeneralisasi
> ke model lain. Mitigasi saat ini: fokus pada Gemini sesuai stack
> production. **Future work: Uji pada GPT-4o dan Claude untuk validasi
> lintas model.**

Dengan ADACODE, kita mendapatkan Claude, GLM, dan MiniMax sebagai
validasi lintas model tanpa perlu SDK terpisah.

> **5.Y.2.C** — Ketergantungan pada versi model. Hasil eksperimen
> valid untuk versi model pada periode pengujian.

Setiap run ADACODE menyimpan `model` di output JSONL. Hasil bersifat
reproducible selama model ID tidak berubah di sisi ADACODE.

---

## 7. Tahapan Kerja

- [ ] Buat `src/tool_registry_eval/backends/` dengan base abstraction
- [ ] Implementasi `ADACODEBackend` di `adacode.py`
- [ ] Refactor `gemini_backend.py` → `backends/gemini.py`
- [ ] Refactor `synthetic_backend.py` → `backends/synthetic.py`
- [ ] Update `config.py` dengan `adacode_model` field dan env var
- [ ] Update `runner.py` dispatch dengan `get_backend()`
- [ ] Update `report.py` dengan ADACODE methodology note
- [ ] Run E1: `adacode-anthropic` (S1–S3)
- [ ] Run E2: `adacode-glm` (S1–S3)
- [ ] Run E3: `adacode-minimax` (S1–S3)
- [ ] Agregasi hasil lintas model untuk Bab 4

---

## 8. Output yang Diharapkan

```
outputs/
  adacode-anthropic/
    baseline.jsonl / registry.jsonl / summary.csv / statistical_tests.csv
  adacode-glm/
    baseline.jsonl / registry.jsonl / summary.csv / statistical_tests.csv
  adacode-minimax/
    baseline.jsonl / registry.jsonl / summary.csv / statistical_tests.csv

reports/
  tool-registry-eval-adacode-anthropic/report.md
  tool-registry-eval-adacode-glm/report.md
  tool-registry-eval-adacode-minimax/report.md
```

Agregasi lintas model (future-work):

```
outputs/adacode-crossmodel-comparison.csv
```

---

## 9. Referensi

- ADACODE API base URL: `https://api.adacode.ai/v1`
- openapi-core terinstal di requirements.txt (untuk validasi schema opsional)
- Test konektivitas: `scripts/test_llm_connections.py`
- Struktur eval existing: `plan/01-dev-plan-evaluasi-tool-registry.md` Section 3
- Threats to validity: `plan/02-bab5-threats-to-validity.md` Section 5.Y.2.A