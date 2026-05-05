# Keputusan Judul Tugas Akhir

> Dokumen ini menetapkan arah judul yang dipilih untuk Tugas Akhir
> berbasis project **zerlo.id**. Alternatif judul sebelumnya tetap
> disimpan di folder `arsip-judul/` sebagai bahan historis.

---

## 1. Judul yang Dipilih

> **"Implementasi dan Evaluasi Tool Registry untuk Skalabilitas AI Agent
> Multi-Modul pada Platform ERP Restoran zerlo.id"**

Judul ini menjadi arah utama dan digunakan sebagai basis penyusunan
proposal, Bab 1, Bab 2, metodologi, dan rancangan eksperimen.

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

## 7. Dokumen Terkait

| File | Fungsi |
|------|--------|
| `00-ringkasan-project-zerlo.md` | Konteks sistem zerlo.id |
| `01-judul-tool-registry.md` | Detail teknis dan metodologi judul terpilih |
| `03-pertanyaan-untuk-dospem.md` | Pertanyaan bimbingan terkait judul final |
| `arsip-judul/` | Arsip alternatif judul dan dokumen perbandingan lama |
