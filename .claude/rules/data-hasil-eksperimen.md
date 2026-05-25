# Rule: Data Hasil Eksperimen — Angka Wajib Benar

Dokumen ini berisi **angka resmi** dari eksperimen. Selalu gunakan angka ini saat menulis
bab thesis. Jangan mengarang atau membulatkan secara berbeda dari nilai di sini.

Sumber primer: `outputs/gemini-native-v2/summary.csv` dan `outputs/gemini-native-v2/statistical_tests.csv`

---

## Eksperimen Resmi: Gemini Native v2 (n=558)

**Setup:** Gemini 2.5 Flash Lite, Google Gen AI SDK, native FunctionDeclaration, mode=ANY,
temperature=0, 100 query (50 single-domain + 30 cross-domain + 20 adversarial), 3 repeats per query.

### Token Usage (rata-rata per query)

| Skenario | Mode | Total Tools | Avg Visible Tools | Avg Token (input+output) |
|----------|------|-------------|-------------------|--------------------------|
| S1 | baseline | 30 | 30 | **2.426** |
| S1 | registry | 30 | **10.6** | **893** |
| S2 | baseline | 100 | 100 | **7.985** |
| S2 | registry | 100 | **15** | **1.241** |
| S3 | baseline | 300 | 300 | **23.893** |
| S3 | registry | 300 | **15** | **1.239** |

### Token Reduction (registry vs baseline)
- S1: **−63%** (2.426 → 893)
- S2: **−84%** (7.985 → 1.241)
- S3: **−95%** (23.893 → 1.239)

### Tool Selection Accuracy

| Skenario | Baseline | Registry | Selisih |
|----------|----------|----------|---------|
| S1 | **68.8%** | **75.0%** | **+6.3 pp** |
| S2 | **71.4%** | **71.4%** | 0 pp |
| S3 | **71.4%** | **77.6%** | **+6.3 pp** |

### Latency p50 (ms)

| Skenario | Baseline | Registry |
|----------|----------|----------|
| S1 | 833 ms | 905 ms |
| S2 | 1.014 ms | 910 ms |
| S3 | **992 ms** | **851 ms** (−14%) |

Catatan: latency improvement modest dan noisy — S1 registry justru sedikit lebih lambat (+8%).
Framing di thesis: "modest improvement at S2/S3, not statistically strong."

### Memory Footprint Registry
- S1 (30 tools): **22 KB**
- S2 (100 tools): **72 KB**
- S3 (300 tools): **205 KB**
- Pattern: linear terhadap ukuran katalog, overhead kecil

### Uji Statistik (Wilcoxon signed-rank, paired, satu arah)
- Token reduction: **Wilcoxon p < 0.0001** di semua skenario
- Cohen's d token: **≥ 11** (sangat large effect, jauh di atas threshold 0.8)
- 95% CI token reduction: lihat `outputs/gemini-native-v2/statistical_tests.csv`
- Accuracy improvement: p < 0.05 di S1 dan S3; S2 tidak signifikan (0 pp improvement)

### Jumlah Records
- Total n = **558** (279 baseline + 279 registry)
- Breakdown: S1=96, S2=168, S3=294 per mode

---

## Eksperimen Synthetic (S1–S4, deterministik)

**Catatan penting:** Token reduction pada synthetic adalah **aritmatika valid** (formula deterministik).
Accuracy dan latency adalah **simulasi dengan koefisien asumsi** — bukan pengukuran LLM nyata.
Gunakan synthetic hanya untuk mengilustrasikan trend S4 (1.000 tools) yang tidak dijalankan live.

| Skenario | Mode | Avg Token | Accuracy | Latency p95 |
|----------|------|-----------|----------|-------------|
| S1 (30) | baseline | 3.423 | 0.50 | 611 ms |
| S1 (30) | registry | 1.560 | 1.00 | 367 ms |
| S2 (100) | baseline | 10.410 | 0.18 | 1.430 ms |
| S2 (100) | registry | 1.969 | 1.00 | 395 ms |
| S3 (300) | baseline | 30.496 | 0.50 | 3.748 ms |
| S3 (300) | registry | 1.971 | 0.89 | 397 ms |
| S4 (1.000) | baseline | 101.970 | 0.41 | 11.938 ms |
| S4 (1.000) | registry | 2.014 | 0.88 | 402 ms |

---

## Eksperimen Gemini Rich (future-work, n=156)

Temuan kunci (jangan gunakan sebagai hasil utama):
- Template intent generik menurunkan accuracy S2 registry: 45.5% → 36.4% (−9.1 pp)
- Template intent generik menurunkan accuracy S3 registry: 61.1% → 50.0% (−11.1 pp)
- Token bertambah +56–60% dibanding native tanpa manfaat accuracy
- Root cause: template identik untuk semua tool op_type yang sama → more noise, bukan signal
- Implikasi: kualitas deskripsi = **keunikan per tool**, bukan panjang teks

---

## Failure Analysis — Query yang Gagal Konsisten

Query yang gagal di **semua 3 repeat** lintas skenario (bukan kegagalan registry, tetapi kegagalan format deskripsi):
- `supplier_create_purchase_order` → dipilih tool supplier lain (q003, q023, q031)
- `accounting_generate_journal` → dipilih tool accounting lain (q004, q030)
- `inventory_check_stock` → dipilih `inventory_admin_tool_03` (q029)
- `sales_daily_revenue` → dipilih `sales_analytical_*` (q022)

Root cause: empty `parameters` schema (`properties: {}`) → Gemini hanya dapat membedakan tool dari deskripsi teks pendek → ambiguitas tinggi untuk tool dalam modul yang sama.

**Framing thesis (Bab 5 Threats to Validity):** Kegagalan ini terjadi di baseline maupun registry — bukan kegagalan Tool Registry. Ini adalah keterbatasan format deskripsi tool yang menjadi *confounding variable*.

---

## Multi-model Comparison (Partial — jangan gunakan sebagai hasil utama)

MiniMax-M2.7 via ADACODE — S1 dan S2 selesai, S3 sedang berjalan.
Claude Sonnet 4.6 — direncanakan, belum dijalankan.
Gunakan data ini **hanya** sebagai "generalizability evidence" jika tersedia saat penulisan Bab 4.
