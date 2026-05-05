# Bab 5 — Keterbatasan dan Ancaman Terhadap Validitas

> Draft untuk sub-bab "Keterbatasan Penelitian" dan "Ancaman Terhadap Validitas"
> pada Bab 5 Tugas Akhir. Teks ditulis dalam Bahasa Indonesia akademis dan
> siap dipaste ke dokumen skripsi dengan penyesuaian minor.

---

## 5.X Keterbatasan Penelitian

Penelitian ini dilaksanakan dalam lingkup eksperimen terbatas yang dirancang
untuk membuktikan klaim kuantitatif pada kondisi yang dapat dikontrol dan
direproduksi. Beberapa keterbatasan perlu diakui secara eksplisit.

### 5.X.1 Katalog Tool Sintetis

Tool catalog yang digunakan dalam eksperimen dibangun secara sintetis
menggunakan generator berbasis modul dan template kata kunci. Katalog ini
tidak identik dengan tool production zerlo.id karena:

1. Parameter schema dikosongkan (`properties: {}`), sedangkan tool production
   memiliki parameter bertipe dan bernama spesifik.
2. Deskripsi tool menggunakan pola seragam (`[op_type] Modul X. Kata kunci: ...`),
   sedangkan docstring production bersifat unik per service.
3. Jumlah dan distribusi tool per modul ditentukan oleh konfigurasi skenario
   (S1–S4), bukan oleh kebutuhan bisnis aktual.

Implikasi: hasil eksperimen mewakili perilaku registry pada kondisi terkontrol,
bukan pengukuran performa langsung pada sistem production.

### 5.X.2 Ukuran Dataset Evaluasi

Dataset evaluasi pada eksperimen utama (gemini-native) terdiri dari 100 query
unik yang dibagi atas 50 single-domain, 30 cross-domain, dan 20 adversarial.
Dibandingkan skala production yang menangani ribuan interaksi pengguna per hari,
ukuran ini relatif kecil. Akurasi yang dilaporkan (misalnya, 50% pada S1 registry)
memiliki interval kepercayaan yang lebar ketika dihitung pada subset per skenario,
dan mungkin tidak merepresentasikan keseluruhan distribusi query pengguna nyata.

### 5.X.3 Satu Provider LLM

Seluruh eksperimen Gemini dilaksanakan menggunakan satu model dari satu provider
(Google Gemini via Google Gen AI SDK). Hasil tidak dapat digeneralisasi langsung
ke model lain seperti GPT-4o, Claude, atau model open-source. Perilaku function
calling, sensitivitas terhadap format deskripsi tool, dan strategi pemilihan
fungsi bervariasi secara signifikan antar model.

### 5.X.4 Pengulangan Terbatas

Setiap query dijalankan sebanyak 3 kali (*repeat_runs = 3*) untuk mengukur
stokastisitas. Tiga pengulangan cukup untuk mendeteksi kegagalan deterministik
dan menghitung rata-rata kasar, tetapi tidak cukup untuk estimasi distribusi
yang stabil. Pengulangan sebanyak 10–30 kali akan menghasilkan standar deviasi
dan confidence interval yang lebih andal.

### 5.X.5 Latency Bergantung pada Jaringan

Pengukuran latency menggunakan `time.perf_counter()` yang mengukur waktu
round-trip end-to-end termasuk latensi jaringan ke Google API. Kondisi jaringan
pada saat eksperimen mempengaruhi hasil latency p50/p95. Pengukuran ini bukan
merupakan ukuran murni latensi inferensi model.

---

## 5.Y Ancaman Terhadap Validitas

### 5.Y.1 Ancaman Terhadap Validitas Internal

#### A. Confounding: Format Deskripsi Tool

Variabel yang paling signifikan mempengaruhi akurasi pemilihan tool adalah
**format deskripsi tool**, bukan keberadaan registry. Eksperimen gemini-native
menggunakan deskripsi seragam dan pendek (`[op_type] Modul X. Kata kunci: ...`),
sehingga variabel ini dikontrol secara konsisten antara baseline dan registry.

Eksperimen gemini-rich membuktikan bahwa template intent generik (identik untuk
semua tool dengan op_type yang sama dalam satu modul) justru *menurunkan* akurasi
registry sebesar 9–11 persentase poin sekaligus menambah token sebesar 57%.
Temuan ini mengkonfirmasi bahwa kualitas deskripsi berarti **keunikan per tool**,
bukan panjang teks.

**Mitigasi**: gemini-native digunakan sebagai kontrol utama karena deskripsi
dikontrol secara seragam. Kontribusi registry diukur secara terpisah dari efek
kualitas deskripsi.

#### B. Confounding: Empty Parameter Schema

Semua tool dalam eksperimen menggunakan skema parameter kosong
(`parameters: {properties: {}}`). Akibatnya, Gemini tidak dapat membedakan tool
berdasarkan struktur parameter — hanya berdasarkan teks deskripsi. Pada tool
production, parameter yang bertipe dan bernama spesifik memberikan sinyal
tambahan yang meningkatkan kemampuan model memilih tool yang tepat.

Implikasi: akurasi yang diukur dalam eksperimen ini merupakan *lower bound*
dari akurasi yang dapat dicapai dengan schema lengkap. Klaim bahwa registry
meningkatkan akurasi tetap valid karena kondisi ini berlaku sama untuk baseline
maupun registry.

#### C. Kegagalan Deterministik (Systematic Failure)

Lima hingga tujuh query gagal secara konsisten di semua pengulangan, di kondisi
baseline maupun registry. Kegagalan ini disebabkan oleh ketidakcukupan deskripsi
untuk membedakan aksi intra-modul (misalnya: `supplier_create_purchase_order`
vs. tool supplier generik lainnya). Kegagalan ini bukan kegagalan registry —
registry tetap unggul karena mengurangi jumlah *distractor* dari O(N) menjadi
O(budget). Namun, kegagalan ini menekan skor akurasi absolut dan perlu
diperhitungkan dalam interpretasi.

### 5.Y.2 Ancaman Terhadap Validitas Eksternal

#### A. Representativitas Skenario Skala

Skenario S1–S4 (30, 100, 300, 1000 tool) dirancang untuk mensimulasikan
pertumbuhan modul pada platform ERP restoran. Namun, distribusi tool per modul
(10, 20, 30, 50 tool/modul) adalah asumsi desain, bukan observasi dari sistem
production. Platform lain dengan distribusi berbeda mungkin menunjukkan kurva
skalabilitas yang berbeda.

#### B. Generalisasi ke Domain Lain

Penelitian ini menggunakan domain ERP restoran (modul inventory, sales, supplier,
accounting, dll.) sebagai konteks. Efektivitas registry (token reduction,
akurasi, latency) mungkin berbeda pada domain lain seperti keuangan, kesehatan,
atau e-commerce yang memiliki pola query dan distribusi tool yang berbeda.

#### C. Ketergantungan pada Versi Model

Model Gemini yang digunakan (`gemini-2.5-flash-lite`) dapat diperbarui oleh
Google kapan saja. Pembaruan model dapat mengubah perilaku function calling,
sensitivitas terhadap jumlah tool, dan kemampuan membedakan deskripsi serupa.
Hasil eksperimen valid untuk versi model pada periode pengujian tetapi tidak
dijamin berlaku pada versi model yang lebih baru atau lebih lama.

### 5.Y.3 Ancaman Terhadap Validitas Konstruk

#### A. Definisi Akurasi

Akurasi didefinisikan sebagai `selected_tool == expected_tool` pada level nama
fungsi. Ini mengasumsikan bahwa setiap query memiliki tepat satu tool yang
"benar". Pada kondisi nyata, beberapa query dapat diselesaikan oleh lebih dari
satu tool, atau memerlukan rangkaian tool. Definisi biner ini menyederhanakan
realitas.

#### B. Definisi Token Usage

Token usage yang diukur adalah output `usage_metadata` dari API Gemini yang
mencakup token untuk function declarations, query, dan respons. Sistem production
mungkin memiliki overhead token tambahan dari system prompt, conversation history,
dan context lain yang tidak dimodelkan dalam eksperimen ini.

---

## 5.Z Mitigasi dan Future Work

| Ancaman | Mitigasi Saat Ini | Future Work |
|---------|-------------------|-------------|
| Catalog sintetis | Tool menyerupai domain ERP nyata; schema seragam dikontrol | Uji dengan tool catalog production zerlo.id yang sesungguhnya |
| Dataset kecil | 100 query (50/30/20), 3 repeats, uji statistik (Wilcoxon, Cohen's d, 95% CI) | Perluas ke 300+ query dengan distribusi yang lebih representatif |
| Empty schema | Kondisi dikontrol secara seragam; klaim tetap valid | Tambahkan parameter schema lengkap untuk mengukur dampaknya |
| Satu provider LLM | Fokus pada Gemini sesuai stack production zerlo.id | Uji pada GPT-4o dan Claude untuk validasi lintas model |
| Kegagalan deterministik | Dianalisis per query; didokumentasikan sebagai threat | Two-stage prompt: registry filter → unique intent snippet per tool |
| Deskripsi seragam | Dikontrol sebagai variabel dalam gemini-rich experiment | Uji dengan docstring production unik per service |
| Latency jaringan | Dilaporkan sebagai p50/p95 wall-clock; metrik komparatif tetap valid | Pisahkan latensi jaringan dari latensi inferensi (streaming API) |
