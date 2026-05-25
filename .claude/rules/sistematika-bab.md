# Rule: Sistematika Bab & Konten Tugas Akhir

Sumber: Pedoman UNSIA + 01-judul-tool-registry.md + rancangan thesis ini

## Judul Final (Dikunci)
> **"Implementasi dan Evaluasi Tool Registry untuk Skalabilitas AI Agent Multi-Modul pada Platform ERP Restoran zerlo.id"**

## Skema TA yang Dipilih
**Tugas Akhir Prototype** (Rancang Bangun + Eksperimen Kuantitatif)

---

## BAB I — PENDAHULUAN

### 1.1 Latar Belakang Masalah
Wajib memuat:
- Konteks bisnis: zerlo.id, UMKM F&B Indonesia, AI-ERP, 38 modul, 1.176 endpoint, 60+ tools aktif
- Fenomena masalah: *tool overload* pada AI Agent saat katalog tool bertambah (kuantitatif: S3 baseline = 23.893 token)
- Rujukan empiris: "Lost in the Middle" [Liu et al., 2024] + konteks industri (AWS, Red Hat artikel)
- Urgensi: zerlo.id sedang beta testing, akan scale ke ratusan modul
- Kebaruan: Tool Registry deterministik berbasis metadata pada Pydantic AI + evaluasi kuantitatif (belum ada penelitian serupa)

### 1.2 Rumusan Masalah
4 pertanyaan (dari 02-keputusan-judul-final.md):
1. Bagaimana merancang Tool Registry yang menyimpan metadata tool secara terstruktur?
2. Bagaimana menerapkan filtering tool berdasarkan modul, role, tier, dan anggaran token?
3. Bagaimana dampak Tool Registry terhadap token usage, latency, dan tool selection accuracy?
4. Bagaimana Tool Registry mendukung skalabilitas AI Agent pada platform ERP restoran?

### 1.3 Batasan Masalah
- LLM provider: Gemini 2.5 Flash Lite (single provider, dikontrol)
- Eval dataset: 100 query Bahasa Indonesia (50 single-domain, 30 cross-domain, 20 adversarial)
- Skenario: S1 (30 tools), S2 (100 tools), S3 (300 tools)
- Tool budget cap: 15 tools per panggilan
- Tidak mengukur kualitas linguistik output
- Tool RAG dibahas sebagai future work, bukan treatment utama

### 1.4 Tujuan Penelitian
Gunakan kata kerja terukur:
- **Merancang** Tool Registry dengan metadata terstruktur (ToolMeta)
- **Mengimplementasikan** filtering dinamis berbasis modul, role, tier, dan token budget
- **Mengukur** dampak terhadap token usage, latency, dan tool selection accuracy
- **Membuktikan** sifat sub-linear scalability Tool Registry dibandingkan baseline O(N)

### 1.5 Manfaat Penelitian
- Akademik: baseline kuantitatif pertama Tool Registry pada Pydantic AI 1.x
- Praktis: zerlo.id dapat scale ke ratusan modul tanpa degradasi LLM
- Komunitas: pola yang dapat direplikasi untuk AI Agent enterprise lain

### 1.6 Metode Penelitian
- Penelitian Eksperimental Terapan dengan Design Science Research (Hevner et al., 2004)
- Pendekatan kuantitatif: baseline vs treatment, 100 query × 3 repeat × 3 skenario
- Uji statistik: Wilcoxon signed-rank, Cohen's d, 95% CI

---

## BAB II — LANDASAN METODE (Tinjauan Pustaka)

Sub-bab yang wajib ada:
1. **LLM dan Tool-Calling** — Toolformer [Schick et al., NeurIPS 2023], ReAct [Yao et al., ICLR 2023], OpenAI Function Calling (2023), Gemini Function Calling
2. **Context Engineering & Context Rot** — "Lost in the Middle" [Liu et al., TACL 2024], Anthropic Context Engineering (2025), Timothy B. Lee (2025)
3. **Tool RAG** — Gorilla [Patil et al., NeurIPS 2024], ToolLLM [Qin et al., ICLR 2024], Toolshed [Lumer, 2024]
4. **Tool Registry & Tool Management** — Dynamic ReAct [Gaurav et al., 2025], AutoTool [Jia & Li, AAAI 2026], AWS Agent Registry (2026), Red Hat Tool RAG artikel (2025)
5. **Pydantic AI Native Toolsets API vs zerlo.id Tool Registry** — `AbstractToolset`, `FilteredToolset` (simple predicate, bukan multi-kriteria); zerlo.id Registry sebagai lapisan multi-kriteria di atasnya
6. **Design Science Research** — Hevner et al. (2004): problem → objective → design → demo → evaluation → communication
7. **Penelitian Terdahulu** — tabel komparasi (lihat `reference/referensi-ilmiah.md` bagian 6)

---

## BAB III — IMPLEMENTASI METODE USULAN

Sub-bab yang wajib ada:
1. **Analisis Sistem Eksisting** — inventarisasi 60+ tool zerlo.id dengan naive decorator, bottleneck kuantitatif
2. **Perancangan Tool Registry** — `ToolMeta` dataclass, `ToolRegistry` singleton, filtering pipeline
3. **Perancangan Eval Framework** — skenario S1/S2/S3, dataset 100 query, baseline vs registry mode
4. **Implementasi Tool Registry** — code walkthrough `registry.py`, `catalog.py`
5. **Implementasi Eval Runner** — `runner.py` incremental JSONL, resume support
6. **Setup Eksperimen** — Gemini 2.5 Flash Lite, Google Gen AI SDK, temperature=0, mode=ANY

---

## BAB IV — HASIL DAN ANALISA **(BAB UTAMA)**

Sub-bab yang wajib ada:
1. **Hasil Benchmark Synthetic S1–S4** — token aritmatika valid; accuracy/latency = simulasi
2. **Hasil Gemini Native v2 (HASIL RESMI)** — tabel lengkap token, accuracy, latency per skenario
3. **Analisis Token Reduction** — −63% (S1), −84% (S2), −95% (S3); Wilcoxon p<0.0001, Cohen's d≥11
4. **Analisis Tool Selection Accuracy** — baseline vs registry per skenario, failure analysis sistematis
5. **Analisis Sub-linear Scalability** — visible tools S1=10.6, S2=S3=15 vs baseline O(N)
6. **Analisis Memory Footprint** — S1=22KB, S2=72KB, S3=205KB (linear, kecil)
7. **Analisis Latency** — p50 improvement modest: S3 baseline 992ms → registry 851ms (−14%)
8. **Uji Statistik** — paired Wilcoxon + Cohen's d + 95% CI (dari `statistical_tests.csv`)
9. **Failure Analysis** — 5–7 query yang gagal konsisten di semua repeat (empty schema issue)
10. **Validasi Multi-model** — MiniMax-M2.7 dan Claude Sonnet 4.6 sebagai perbandingan generalizability (jika data tersedia)

### Data Wajib yang Harus Benar (lihat rule `data-hasil-eksperimen.md`)
Jangan mengarang angka — selalu gunakan data dari `outputs/gemini-native-v2/summary.csv`

---

## BAB V — KESIMPULAN

### 5.1 Kesimpulan
Jawab 4 rumusan masalah dengan angka konkret dari Bab IV:
- RQ1: Tool Registry dirancang dengan `ToolMeta` (module, op_type, keywords, role, tier) dan `registry_filter()` berbasis keyword scoring + budget cap
- RQ2: Filtering berjalan O(1) terhadap budget; token turun 63–95% secara statistik signifikan (p<0.0001)
- RQ3: Accuracy meningkat +6.3pp (S1 dan S3); latency turun moderat −14% (S3)
- RQ4: Visible tools tetap pada 15 (O(1)) meski katalog berkembang dari 30→100→300 — membuktikan sub-linear scalability

### 5.2 Saran / Future Work
- Tool RAG (vector-based) untuk skala ribuan tools
- Two-stage hybrid: Registry filter → per-tool rich description (perlu docstring unik)
- Multi-LLM provider comparison (MiniMax, Claude Sonnet 4.6, GLM-4.5-Flash)
- Integrasi produksi zerlo.id penuh: RBAC + tier gating + 80 tools aktif
- Eval continuous dengan query log produksi

---

## Bagian Akhir (Wajib)
- Daftar Pustaka (IEEE style)
- Lampiran A: Source code Tool Registry (cuplikan kunci)
- Lampiran B: Dataset 100 query (JSON)
- Lampiran C: Raw results CSV
- Lampiran D: Statistical analysis script (Python)
- Lampiran E: Bukti similarity check Turnitin ≤30%
