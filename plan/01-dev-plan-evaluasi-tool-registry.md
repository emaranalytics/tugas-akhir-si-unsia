# Dev Plan — Evaluasi Tool Registry

**Versi Dokumen**: 1.5
**Tanggal Update**: 5 Mei 2026
**Status**: Lima eksperimen selesai — synthetic S1–S4, Gemini native FC v1 S1–S3, Gemini rich-description S1–S3 (future-work), Gemini native v2 S1–S3 full baseline+registry 100 query (hasil resmi)

Judul aktif:

> **Implementasi dan Evaluasi Tool Registry untuk Skalabilitas AI Agent
> Multi-Modul pada Platform ERP Restoran zerlo.id**

Tujuan dokumen ini adalah merencanakan codebase minimal untuk membuktikan
lima klaim eksperimen:

1. Token-per-turn sebelum vs sesudah Tool Registry.
2. Tool selection accuracy pada eval set adversarial.
3. Latency p50/p95.
4. Memory footprint registry.
5. Skalabilitas linear vs sub-linear saat jumlah modul/tool bertambah.

---

## 1. Prinsip Implementasi

- Codebase dibuat minimal dan hanya untuk pembuktian eksperimen.
- Tidak membangun ERP penuh.
- Tidak memakai database produksi.
- Tidak memakai data tenant asli.
- Semua eval query dan tool bersifat sintetis tetapi menyerupai domain
  ERP restoran.
- Semua metrik harus bisa direproduksi dari CLI.

---

## 2. Stack

| Komponen | Pilihan |
|----------|---------|
| Bahasa | Python 3.13 lokal, tetap kompatibel Python 3.12+ |
| LLM SDK | **Google Gen AI SDK for Python** (`google-genai`) — bukan Pydantic AI |
| Model | `GEMINI_MODEL` dari `.env`; default: `gemini-2.5-flash-lite` |
| Config | `.env` + `.env.example` |
| Output eksperimen | JSONL/CSV di folder `outputs/` |
| Analisis | Python standard library dulu; pandas opsional bila diperlukan |

Runtime backend:

| Env Var | Default | Fungsi |
|---------|---------|--------|
| `EVAL_BACKEND` | `synthetic` | `synthetic` untuk benchmark deterministik, `gemini` untuk Google Gen AI SDK + Gemini native FC |
| `EVAL_MAX_SCENARIO` | `S4` | Batasi skenario maksimum; gunakan `S1` untuk live run murah |
| `EVAL_QUERY_LIMIT` | `0` | Batasi jumlah query per skenario; `0` berarti semua query |
| `EVAL_TOOL_BUDGET` | `15` | Jumlah maksimum visible tools pada registry |
| `EVAL_LIVE_BASELINE` | `false` | Jika `true`, live Gemini juga menjalankan baseline all-tools; mahal, gunakan hati-hati |
| `EVAL_REPEAT_RUNS` | `1` | Jumlah repeat per query untuk Gemini (stochasticity handling); synthetic selalu 1 |
| `EVAL_OUTPUT_SUBDIR` | `` | Subdirektori output; kosong = `outputs/`, diisi = `outputs/<subdir>/` |
| `EVAL_BASELINE_MAX_SCENARIO` | sama dengan `EVAL_MAX_SCENARIO` | Batasi baseline sampai skenario ini; registry tetap lanjut ke `EVAL_MAX_SCENARIO` |

Catatan model: user mengusulkan "Gemini Flash Lite 3.1". Pada validasi
awal dokumentasi Google, model Flash-Lite stable yang terlihat adalah
`gemini-2.5-flash-lite`. Karena nama model dapat berubah, implementasi
wajib membaca model dari env var `GEMINI_MODEL`.

---

## 3. Struktur Aktual (Terimplemantasi)

Struktur di bawah ini adalah implementasi aktual per 5 Mei 2026, bukan rencana.

```text
src/
  tool_registry_eval/       ← modul utama evaluasi
    catalog.py              synthetic tool catalog + eval queries (populates ToolDef.intent)
    charts.py               PNG chart generation
    config.py               env/runtime config (EvalConfig dataclass)
    domain.py               ToolDef (+ intent field) dan QueryDef
    gemini_backend.py       Google Gen AI SDK — FunctionDeclaration + mode:ANY + retry backoff
    io.py                   JSONL/CSV writers
    measure.py              token, latency, accuracy summaries + std dev
    paths.py                dynamic path resolution (resolve_output_dir, resolve_report_dir)
    registry.py             Tool Registry filtering (no oracle) + memory measurement
    report.py               Markdown report generation (per-backend methodology note)
    runner.py               orchestration — incremental JSONL flush per row
    scenarios.py            S1–S4 definitions + PRIMARY_TOOL_INTENTS + OP_INTENT_TEMPLATES
    synthetic_backend.py    deterministic benchmark backend
  experiments/
    run_eval.py             ← entry point utama

outputs/
  baseline.jsonl / registry.jsonl / summary.csv   ← synthetic S1–S4
  gemini-native/                                   ← v1 (18 query, S1–S3, S3 baseline missing)
    baseline.jsonl / registry.jsonl / summary.csv
  gemini-native-v2/                                ← HASIL RESMI (100 query, S1–S3 full)
    baseline.jsonl / registry.jsonl / summary.csv / statistical_tests.csv
  gemini-rich/                                     ← future-work validation (docstring-style)
    baseline.jsonl / registry.jsonl / summary.csv

reports/
  tool-registry-eval/             ← laporan synthetic
  tool-registry-eval-gemini-native/ ← laporan hasil resmi + failure analysis
  tool-registry-eval-gemini-rich/   ← laporan eksperimen deskripsi kaya
    (masing-masing berisi report.md + charts/)
```

---

## 4. Desain Eksperimen

### A. Token-per-turn

Baseline:

- Semua tool yang relevan untuk agent dikirim langsung ke LLM.
- Jumlah visible tools meningkat sesuai skenario skala.

Treatment:

- Tool Registry memfilter tool berdasarkan modul, role, tier, dan budget.
- Hanya top-k tool yang dikirim ke LLM.

Metrik:

- `input_tokens`
- `output_tokens`
- `total_tokens`
- `visible_tool_count`

Klaim yang ingin dibuktikan:

- Registry menurunkan token-per-turn dibanding baseline.

---

### B. Tool Selection Accuracy

Dataset:

- Query sintetis Bahasa Indonesia.
- Setiap query memiliki `expected_tool`.
- Dataset mencakup single-domain, cross-domain, dan adversarial query.

Baseline:

- Model memilih dari semua visible tools.

Treatment:

- Model memilih dari hasil filtering registry.

Metrik:

- `selected_tool == expected_tool`
- accuracy total
- accuracy per kategori query

Klaim yang ingin dibuktikan:

- Registry meningkatkan atau minimal menstabilkan akurasi pemilihan tool,
  terutama pada skenario tool banyak dan query adversarial.

---

### C. Latency p50/p95

Pengukuran:

- Ukur durasi end-to-end setiap request.
- Gunakan `time.perf_counter()`.
- Simpan latency per run.

Metrik:

- p50
- p95
- mean
- max

Klaim yang ingin dibuktikan:

- Registry menurunkan atau menjaga latency karena jumlah tool yang
  dikirim ke model lebih kecil.

---

### D. Memory Footprint Registry

Pengukuran:

- Ukur ukuran struktur registry setelah semua synthetic tools dimuat.
- Gunakan standard library `tracemalloc` atau `sys.getsizeof` sebagai
  pendekatan awal.

Metrik:

- memory bytes total
- memory bytes per tool
- overhead registry dibanding list/dict baseline sederhana

Klaim yang ingin dibuktikan:

- Overhead memory registry kecil dibanding manfaat token dan latency.

---

### E. Skalabilitas

Skenario skala:

| Skenario | Modul | Tool per Modul | Total Tool |
|----------|-------|----------------|------------|
| S1 | 3 | 10 | 30 |
| S2 | 5 | 20 | 100 |
| S3 | 10 | 30 | 300 |
| S4 | 20 | 50 | 1000 |

Baseline:

- Visible tools naik mengikuti total tool.

Treatment:

- Visible tools dibatasi oleh registry budget, misalnya 10-20 tool per
  turn.

Metrik:

- total tools
- visible tools
- token usage
- latency
- accuracy

Klaim yang ingin dibuktikan:

- Baseline cenderung linear terhadap jumlah total tool.
- Registry cenderung sub-linear karena visible tools dibatasi.

---

## 5. Output Minimal

Setiap run menghasilkan satu baris JSONL:

```json
{
  "mode": "baseline",
  "scenario": "S2",
  "query_id": "q001",
  "query_type": "single_domain",
  "total_tools": 100,
  "visible_tools": 100,
  "expected_tool": "inventory_check_stock",
  "selected_tool": "inventory_check_stock",
  "is_correct": true,
  "input_tokens": 1234,
  "output_tokens": 120,
  "total_tokens": 1354,
  "latency_ms": 850,
  "registry_memory_bytes": 0
}
```

---

## 6. Tahapan Kerja

1. Definisikan synthetic tool catalog.
2. Definisikan eval query JSONL.
3. Implementasikan baseline runner.
4. Implementasikan registry filtering runner.
5. Tambahkan measurement token, latency, dan memory.
6. Tambahkan summarizer p50/p95 dan accuracy.
7. Jalankan eksperimen kecil.
8. Naikkan skenario skala.
9. Ekspor tabel untuk Bab 4.

---

## 7. Cara Menjalankan Eksperimen

### Re-run synthetic (deterministik, gratis):
```bash
python3 src/experiments/run_eval.py
```

### Re-run Gemini native FC (hasil resmi):
```bash
EVAL_BACKEND=gemini EVAL_MAX_SCENARIO=S3 EVAL_BASELINE_MAX_SCENARIO=S2 \
EVAL_LIVE_BASELINE=true EVAL_REPEAT_RUNS=3 EVAL_OUTPUT_SUBDIR=gemini-native \
python3 src/experiments/run_eval.py
```

### Re-run Gemini rich description (future-work validation):
```bash
EVAL_BACKEND=gemini EVAL_MAX_SCENARIO=S3 EVAL_BASELINE_MAX_SCENARIO=S2 \
EVAL_LIVE_BASELINE=true EVAL_REPEAT_RUNS=3 EVAL_OUTPUT_SUBDIR=gemini-rich \
python3 src/experiments/run_eval.py
```

Backend menggunakan **Google Gen AI SDK** (`google.genai.Client`) dengan
`FunctionDeclaration` + `ToolConfig(mode=ANY)`. Retry otomatis pada 503/429
dengan exponential backoff (4s, 8s, 16s, 32s). Semua row ditulis ke JSONL
secara inkremental — tidak ada data yang hilang jika run terputus di tengah.

---

## 8. Catatan Model

Model dibaca dari env var `GEMINI_MODEL` (default `gemini-2.5-flash-lite`).
Karena nama model Google dapat berubah antar rilis, selalu cek dokumentasi
Google AI Studio untuk model ID terbaru sebelum menjalankan eksperimen nyata.

---

## 9. Hasil Eksperimen

### 9.1 Benchmark Synthetic (S1–S4, deterministik)

Sumber: `outputs/summary.csv` · Laporan: `reports/tool-registry-eval/report.md`

Token reduction dan sub-linear scalability valid (aritmatika). Accuracy/latency adalah
simulasi dengan koefisien asumsi — bukan LLM nyata. Oracle trick sudah dihapus.

### 9.2 Gemini Native Function Calling v2 — HASIL RESMI (S1–S3, 3 repeats, n=558)

Sumber: `outputs/gemini-native-v2/summary.csv` · Laporan: `reports/tool-registry-eval-gemini-native-v2/report.md`

Backend: Google Gen AI SDK, `FunctionDeclaration` + `mode:ANY`, short descriptions.
Dataset: 100 query (50/30/20). S3 baseline tersedia penuh. Uji statistik tersedia di `statistical_tests.csv`.

| Skenario | Mode | Avg Tokens | Accuracy | Token Reduction |
|----------|------|------------|----------|-----------------|
| S1 | baseline | 2.426 | 68.8% | — |
| S1 | registry | 893 | **75.0%** | −63.2% |
| S2 | baseline | 7.985 | 71.4% | — |
| S2 | registry | 1.241 | **71.4%** | −84.5% |
| S3 | baseline | 23.893 | 71.4% | — |
| S3 | registry | 1.239 | **77.6%** | −94.8% |

Uji statistik paired Wilcoxon: p<0.0001 untuk token reduction di semua skenario.
Cohen's d: S1=11.7, S2=290.9, S3=782.0 — effect size sangat besar (expected, token reduction adalah properti arsitektur).
Registry konsisten unggul atau setara baseline dalam accuracy, dengan token jauh lebih rendah.

### 9.3 Gemini Rich Description — Future-Work Validation (S1–S3, 3 repeats, n=156)

Sumber: `outputs/gemini-rich/summary.csv` · Laporan: `reports/tool-registry-eval-gemini-rich/report.md`

Ditambahkan `ToolDef.intent`: primary tools mendapat intent spesifik; generic tools mendapat
template per op_type.

**Temuan**: template generik menurunkan akurasi S2 registry 45.5%→36.4%, S3 registry
61.1%→50.0%, dan menambah token +57%.

**Root cause**: template identik untuk semua tool op_type dalam satu modul menambah noise,
bukan sinyal. Kualitas deskripsi = keunikan per tool, bukan panjang.

**Implikasi**: gemini-native adalah kontrol yang tepat (deskripsi seragam pendek).
Two-stage future-work hanya efektif dengan docstring unik per tool.

---

## 10. Roadmap Perbaikan Ilmiah (Sebelum Bab 4 Final)

### 10.1 Repeated Runs Gemini Nyata

✅ **SELESAI** — 3 repeats per query, S1–S3, n=156 (gemini-native) dan n=156 (gemini-rich).
Std dev tersedia di summary.csv untuk semua metrik.

### 10.2 Perluasan Eval Dataset

✅ **SELESAI** — 100 query (50 single-domain, 30 cross-domain, 20 adversarial) dikodekan
di `catalog.py` `make_queries()`. Selalu diregenerasi secara deterministik saat run.

### 10.3 Uji Statistik

✅ **SELESAI** — `paired_statistical_tests()` dan `all_statistical_tests()` ditambahkan ke
`src/tool_registry_eval/measure.py`. Output: `statistical_tests.csv` per run.
Tersedia: Wilcoxon signed-rank, Cohen's d, 95% CI (token reduction dan accuracy).

### 10.4 Pemisahan Laporan Synthetic vs Gemini Nyata

Di Bab 4:

- **Synthetic benchmark** = simulasi skalabilitas (S1–S4 penuh).
- **Gemini benchmark** = validasi empiris pada LLM nyata (S1–S2 saja).

Ini adalah pembingkaian yang defensible secara akademik.

### 10.5 Dokumentasi Threats to Validity

✅ **SELESAI** — Draft lengkap tersedia di `plan/02-bab5-threats-to-validity.md`.
Mencakup 7 ancaman validitas (internal/eksternal/konstruk) dengan tabel mitigasi.
Siap dipaste ke Bab 5 skripsi.
