# Keputusan Judul Tugas Akhir

> Dokumen ini menetapkan arah judul yang dipilih untuk Tugas Akhir
> berbasis project **zerlo.id**. Alternatif judul sebelumnya tetap
> disimpan di folder `arsip-judul/` sebagai bahan historis.
>
> **Status: JUDUL DIKUNCI — tidak berubah lagi.** (per 25 Mei 2026)

---

## 1. Judul Final (Dikunci)

> **"Implementasi dan Evaluasi Tool Registry untuk Skalabilitas AI Agent
> Multi-Modul pada Platform ERP Restoran zerlo.id"**

Judul ini **final** dan menjadi dasar penulisan seluruh bab skripsi —
Bab 1, Bab 2, Bab 3, Bab 4, dan Bab 5.

---

## 2. Fokus Penelitian

Penelitian berfokus pada penerapan **Tool Registry** sebagai mekanisme
pengelolaan tool pada sistem AI Agent multi-modul. Pada platform
zerlo.id, jumlah modul, endpoint, dan fungsi bisnis terus bertambah
seiring perkembangan ERP restoran. Tanpa mekanisme registry, setiap
agent berisiko membawa terlalu banyak tool ke dalam konteks LLM,
sehingga token usage, latency, dan akurasi pemilihan tool dapat
terpengaruh.

Fokus utama penelitian:

1. Merancang struktur metadata Tool Registry.
2. Mengimplementasikan registry di atas sistem AI Agent berbasis
   Pydantic AI.
3. Memfilter tool berdasarkan modul, role pengguna, tier subscription,
   dan anggaran token.
4. Mengevaluasi dampaknya terhadap token usage, latency, dan tool
   selection accuracy.

*Multi-agent orchestration* tetap dibahas sebagai konteks penerapan,
tetapi bukan beban utama judul.

---

## 3. Alasan Pemilihan

Judul ini dipilih karena paling seimbang untuk Tugas Akhir S1 Sistem
Informasi:

- **Relevan dengan project nyata**: zerlo.id sudah memiliki sistem ERP
  restoran berbasis AI Agent dan berada pada tahap beta testing.
- **Kontribusi terukur**: Bab 4 dapat diisi dengan hasil eksperimen
  kuantitatif, bukan hanya screenshot aplikasi.
- **Tidak terlalu generik**: lebih kuat daripada judul rancang bangun
  ERP biasa.
- **Tidak terlalu berisiko**: lebih mudah dipertahankan daripada topik
  keamanan prompt injection yang membutuhkan eksperimen adversarial dan
  pembahasan etika lebih berat.
- **Selaras dengan tren teknologi**: dokumentasi Pydantic AI tentang
  toolsets dan multi-agent applications, serta dokumentasi Google Vertex
  AI tentang function calling, mendukung bahwa pengelolaan tool adalah
  isu nyata pada aplikasi LLM enterprise.

---

## 4. Rumusan Masalah Awal

1. Bagaimana merancang Tool Registry yang menyimpan metadata tool secara
   terstruktur pada sistem AI Agent multi-modul?
2. Bagaimana menerapkan filtering tool berdasarkan modul, role pengguna,
   tier subscription, dan anggaran token?
3. Bagaimana dampak Tool Registry terhadap token usage, latency, dan
   tool selection accuracy dibanding pendekatan tool binding langsung?
4. Bagaimana Tool Registry mendukung skalabilitas sistem AI Agent pada
   platform ERP restoran zerlo.id?

---

## 5. Metrik Evaluasi

Metrik utama yang akan digunakan:

| Metrik | Tujuan |
|--------|--------|
| Token usage per turn | Mengukur efisiensi konteks sebelum dan sesudah registry |
| Latency p50/p95 | Mengukur dampak registry terhadap waktu respons agent |
| Tool selection accuracy | Mengukur ketepatan agent memilih tool yang sesuai |
| Jumlah visible tools per turn | Mengukur efektivitas filtering tool |
| Memory footprint registry | Mengukur overhead runtime dari registry |

---

## 6. Sumber Validasi Awal

| Sumber | Relevansi |
|--------|-----------|
| Pydantic AI Toolsets — `https://pydantic.dev/docs/ai/api/pydantic-ai/toolsets/` | Mendukung konsep pengelompokan dan pengelolaan tool untuk agent. |
| Pydantic AI Multi-Agent Applications — `https://pydantic.dev/docs/ai/guides/multi-agent-applications/` | Mendukung pembahasan delegation, hand-off, dan graph sebagai konteks penerapan multi-agent. |
| Google Vertex AI Function Calling — `https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/function-calling` | Mendukung function/tool calling sebagai mekanisme LLM untuk mengakses API, database, dan sistem enterprise. |
| e-Conomy SEA 2025 Indonesia — `https://services.google.com/fh/files/misc/indonesia_e_conomy_sea_2025_report.pdf` | Menguatkan konteks bisnis digital dan AI di Indonesia/Asia Tenggara. |

---

## 6b. Temuan Evaluasi (update 25 Mei 2026)

Lima set eksperimen telah dijalankan / direncanakan:
(1) benchmark synthetic deterministik S1–S4,
(2) eksperimen Gemini compact text router S1–S3 (3 repeats, n=210) — **sudah digantikan**,
(3) eksperimen Gemini native function_declarations S1–S3 (3 repeats, n=156) — **digantikan v2**,
(4) eksperimen Gemini native v2 — 100 query, S1–S3 full baseline+registry (3 repeats, n=558) — **hasil resmi**,
(5) eksperimen multi-model perbandingan via ADACODE — MiniMax-M2.7 (S1–S2 selesai, S3 in progress) dan Claude Sonnet 4.6 (direncanakan, setup sama dengan gemini-native-v2) — **perbandingan tambahan, bukan pengganti hasil resmi**.

### Hasil Benchmark Synthetic (S1–S4, deterministik)

Sumber: `outputs/summary.csv` · Laporan: `reports/tool-registry-eval/report.md`

| Skenario | Mode | Avg Tokens | Accuracy | Latency p95 (ms) |
|----------|------|------------|----------|------------------|
| S1 (30 tools) | baseline | 3.423 | 0.50 | 611 |
| S1 (30 tools) | registry | 1.560 | 1.00 | 367 |
| S2 (100 tools) | baseline | 10.410 | 0.18 | 1.430 |
| S2 (100 tools) | registry | 1.969 | 1.00 | 395 |
| S3 (300 tools) | baseline | 30.496 | 0.50 | 3.748 |
| S3 (300 tools) | registry | 1.971 | 0.89 | 397 |
| S4 (1.000 tools) | baseline | 101.970 | 0.41 | 11.938 |
| S4 (1.000 tools) | registry | 2.014 | 0.88 | 402 |

Catatan: accuracy dan latency di synthetic adalah model simulasi dengan koefisien
asumsi — bukan pengukuran LLM nyata. Token reduction adalah aritmatika yang valid.

### Hasil Eksperimen Gemini Native v2 (S1–S3, 3 repeats, n=558) ← HASIL RESMI

Sumber: `outputs/gemini-native-v2/summary.csv` · Laporan: `reports/tool-registry-eval-gemini-native-v2/report.md`

> Catatan: ada juga eksperimen gemini-rich di bawah sebagai validasi future-work.

Backend: **Google Gen AI SDK** dengan `FunctionDeclaration` + `ToolConfig(mode=ANY)`.
Dataset: **100 query** (50 single-domain, 30 cross-domain, 20 adversarial). S3 baseline tersedia penuh.

| Skenario | Mode | Total Tools | Avg Visible | Avg Tokens | Accuracy | Latency p50 (ms) |
|----------|------|-------------|-------------|------------|----------|------------------|
| S1 (30 tools) | baseline | 30 | 30 | 2.426 | 68.8% | 833 |
| S1 (30 tools) | registry | 30 | 10.6 | 893 | **75.0%** | 905 |
| S2 (100 tools) | baseline | 100 | 100 | 7.985 | 71.4% | 1.014 |
| S2 (100 tools) | registry | 100 | 15 | 1.241 | **71.4%** | 910 |
| S3 (300 tools) | baseline | 300 | 300 | 23.893 | 71.4% | 992 |
| S3 (300 tools) | registry | 300 | 15 | 1.239 | **77.6%** | 851 |

**Temuan utama:**

| Klaim | Status | Detail |
|-------|--------|--------|
| Token reduction | ✅ Tervalidasi empiris + statistik | −63% (S1), −84% (S2), −95% (S3); Wilcoxon p<0.0001, Cohen's d≥11 |
| Accuracy: registry ≥ baseline | ✅ Tervalidasi | +6.3pp (S1), 0pp (S2), +6.3pp (S3) |
| Sub-linear scalability | ✅ Architectural property | Visible tools S1=10.6, S2/S3=15 vs baseline O(N) |
| Memory footprint | ✅ Real Python measurement | S1=22KB, S2=72KB, S3=205KB — linear dengan katalog |
| Latency improvement | ⚠️ Modest / noisy | S3: 992ms→851ms (−14%); S2: 1014ms→910ms (−10%) |

**Perbandingan compact text router vs native function calling:**

| Skenario | Mode | Compact Router Acc | Native FC Acc | Selisih |
|----------|------|--------------------|---------------|---------|
| S1 | baseline | 83.3% | 33.3% | −50pp |
| S1 | registry | 83.3% | 50.0% | −33pp |
| S2 | baseline | 72.7% | 27.3% | −45pp |
| S2 | registry | 81.8% | 45.5% | −36pp |
| S3 | registry | 88.9% | 61.1% | −28pp |

Compact text router menghasilkan accuracy tinggi karena Gemini melakukan **pattern matching
pada nama tool dalam teks**, bukan semantic function calling. Native FC adalah metodologi
yang benar dan lebih jujur — namun menunjukkan bahwa tool description format (empty schema,
short description) adalah confounding variable penting.

**Analisis kegagalan sistematis (untuk Bab 4 dan Bab 5):**

Kegagalan berpola pada 5–7 query yang konsisten di semua pengulangan. Penyebab utama:
empty parameter schemas (`properties: {}`) menghapus diferensiasi struktural. Semua tool
dalam modul yang sama berbagi schema identik — Gemini hanya bisa membedakan dari deskripsi
teks pendek, di mana `[Buat/ubah/hapus data]` vs `[Analisis dan laporan]` tidak cukup
untuk disambiguasi aksi dengan penalaran tinggi.

Kegagalan ini terjadi di **baseline maupun registry** — ini bukan kegagalan registry,
melainkan keterbatasan format deskripsi tool. Registry tetap unggul dalam accuracy karena
mengurangi jumlah distractor dari O(N) ke O(budget).

**Implikasi untuk Bab 5 (keterbatasan + future work):** Two-stage hybrid prompt —
registry filter ke modul relevan (stage 1, penghematan besar), lalu tambahkan intent
unik per tool dalam filtered set (stage 2). **Catatan penting**: eksperimen gemini-rich
(lihat bawah) membuktikan bahwa template generik justru menurunkan akurasi —
stage 2 hanya efektif dengan docstring unik per tool, seperti yang ada di zerlo.id produksi.

### Eksperimen Keempat: Deskripsi Kaya / Docstring-Style (S1–S3, 3 repeats, n=156)

Sumber: `outputs/gemini-rich/summary.csv` · Laporan: `reports/tool-registry-eval-gemini-rich/report.md`

Perubahan dari gemini-native: ditambahkan field `ToolDef.intent` — 20 primary tools mendapat
intent buatan tangan; tool generik mendapat template op_type.

| Skenario | Mode | Tokens (native) | Tokens (rich) | Accuracy (native) | Accuracy (rich) |
|----------|------|-----------------|---------------|-------------------|-----------------|
| S1 | baseline | 1.520 | 2.426 (+60%) | 33.3% | 33.3% |
| S1 | registry | 581 | 909 (+56%) | 50.0% | 50.0% |
| S2 | baseline | 5.002 | 7.984 (+60%) | 27.3% | 27.3% |
| S2 | registry | 783 | 1.227 (+57%) | **45.5%** | **36.4% ↓** |
| S3 | registry | 790 | 1.235 (+56%) | **61.1%** | **50.0% ↓** |

**Temuan kunci**: template intent generik menurunkan akurasi di S2/S3 registry (−9.1pp, −11.1pp)
sekaligus menambah token +57%. Penyebab: semua tool dengan op_type sama dalam satu modul kini
memiliki deskripsi identik → model makin bingung, bukan makin terarah.

**Implikasi ilmiah**: kualitas deskripsi tool berarti **keunikan per tool**, bukan panjang teks.
Ini mengkonfirmasi mengapa zerlo.id produksi menggunakan docstring spesifik per service.
Template generik = lebih banyak noise, bukan lebih banyak sinyal.

Eksperimen ini juga memvalidasi bahwa **gemini-native adalah kontrol yang tepat** untuk
mengukur kontribusi registry secara murni — variabel deskripsi sudah dikontrol (seragam pendek).

---

## 7. Dokumen Terkait

| File | Fungsi |
|------|--------|
| `00-ringkasan-project-zerlo.md` | Konteks sistem zerlo.id |
| `01-judul-tool-registry.md` | Detail teknis dan metodologi judul terpilih |
| `03-pertanyaan-untuk-dospem.md` | Pertanyaan bimbingan terkait judul final |
| `plan/01-dev-plan-evaluasi-tool-registry.md` | Dev plan + status implementasi + roadmap perbaikan ilmiah |
| `reports/tool-registry-eval/report.md` | Laporan benchmark synthetic S1–S4 |
| `reports/tool-registry-eval-gemini-native-v2/report.md` | Laporan Gemini native FC v2 (hasil resmi) + failure analysis |
| `reports/tool-registry-eval-gemini-rich/report.md` | Laporan eksperimen deskripsi kaya — validasi future-work |
| `outputs/summary.csv` | Raw aggregated metrics synthetic S1–S4 |
| `outputs/gemini-native-v2/summary.csv` | Gemini native FC v2 metrics S1–S3 (hasil resmi) |
| `outputs/gemini-rich/summary.csv` | Gemini rich description metrics S1–S3 (future-work validation) |
| `arsip-judul/` | Arsip alternatif judul dan dokumen perbandingan lama |
