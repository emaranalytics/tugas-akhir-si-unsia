# BAB IV
# HASIL DAN ANALISA

Bab ini memaparkan dan menganalisis hasil eksperimen Tool Registry, sesuai tahap *demonstration* dan *evaluation* pada kerangka *Design Science Research*. Pembahasan diawali oleh hasil *benchmark* synthetic sebagai validasi aritmetika, dilanjutkan hasil resmi eksperimen *live* Gemini Native v2 (n=558), lalu analisis terperinci atas lima dimensi pengukuran — penghematan token, akurasi pemilihan *tool*, skalabilitas *sub-linear*, jejak memori, dan latensi — yang ditutup dengan uji statistik, analisis kegagalan, serta catatan validasi multi-model.


## 4.1 Hasil Benchmark Synthetic S1–S4

*Benchmark* synthetic dijalankan secara deterministik untuk memvalidasi aritmetika penghematan token dan mengekstrapolasi tren ke skenario S4 (1.000 *tool*) yang tidak dijalankan secara *live*. Pada *benchmark* ini, nilai token merupakan hasil perhitungan deterministik yang valid, sedangkan nilai akurasi dan latensi merupakan simulasi dengan koefisien asumsi — sehingga hasil synthetic hanya digunakan untuk mengilustrasikan tren penskalaan, bukan sebagai temuan utama. Ringkasan token *benchmark* synthetic disajikan pada Tabel 4.1.

Tabel 4.1 Hasil Benchmark Synthetic Token S1–S4

| Skenario | Total Tool | Token Baseline | Token Registry | Reduksi |
|----------|-----------|----------------|----------------|---------|
| S1 | 30 | 3.423 | 1.560 | −54% |
| S2 | 100 | 10.410 | 1.969 | −81% |
| S3 | 300 | 30.496 | 1.971 | −94% |
| S4 | 1.000 | 101.970 | 2.014 | −98% |

Berdasarkan Tabel 4.1, terlihat pola yang konsisten: token *baseline* tumbuh hampir linear terhadap ukuran katalog — dari 3.423 token (30 *tool*) hingga 101.970 token (1.000 *tool*) — sedangkan token *registry* tetap berada pada kisaran 1.560–2.014 token meskipun katalog membesar 33 kali lipat. Pada S4, *benchmark* synthetic memproyeksikan penghematan token mencapai 98%, menegaskan bahwa keunggulan Tool Registry justru semakin besar seiring bertambahnya ukuran katalog. Tren ekstrapolatif inilah yang kemudian diverifikasi secara empiris melalui eksperimen *live* pada Sub-bab 4.2.


## 4.2 Hasil Gemini Native v2 (Hasil Resmi)

Eksperimen resmi dijalankan secara *live* terhadap Gemini 2.5 Flash Lite dengan *native function calling*, menghasilkan total 558 rekaman (279 *baseline* + 279 *registry*) dari 100 kueri pada skenario S1–S3 dengan tiga pengulangan. Ringkasan lengkap seluruh metrik disajikan pada Tabel 4.2.

Tabel 4.2 Ringkasan Hasil Resmi Gemini Native v2

| Skenario | Mode | Total Tool | Tool Terlihat | Token | Akurasi | Latensi p50 |
|----------|------|-----------|---------------|-------|---------|-------------|
| S1 | Baseline | 30 | 30 | 2.426 | 68,8% | 833 ms |
| S1 | Registry | 30 | 10,6 | 893 | 75,0% | 905 ms |
| S2 | Baseline | 100 | 100 | 7.985 | 71,4% | 1.014 ms |
| S2 | Registry | 100 | 15 | 1.241 | 71,4% | 910 ms |
| S3 | Baseline | 300 | 300 | 23.893 | 71,4% | 992 ms |
| S3 | Registry | 300 | 15 | 1.239 | 77,6% | 851 ms |

Berdasarkan Tabel 4.2, mode *registry* secara konsisten mengungguli mode *baseline* pada dimensi efisiensi token di seluruh skenario, dengan keunggulan yang membesar seiring ukuran katalog. Akurasi *registry* setara atau lebih tinggi dibanding *baseline*, sementara latensi menunjukkan perbaikan moderat pada skenario besar. Setiap dimensi dianalisis secara terperinci pada sub-bab berikut.


## 4.3 Analisis Token Reduction

Penghematan token merupakan temuan utama penelitian ini. Sebagaimana divisualisasikan pada Gambar 4.1, selisih konsumsi token antara *baseline* dan *registry* membesar secara dramatis seiring pertumbuhan katalog.

![Token per Kueri](assets/charts/token_per_turn.png)

Gambar 4.1 Perbandingan Rata-rata Token per Kueri Baseline dan Registry

Pada skenario S1 (30 *tool*), konsumsi token turun dari 2.426 menjadi 893 token (−63%). Pada S2 (100 *tool*), token turun dari 7.985 menjadi 1.241 token (−84%). Pada S3 (300 *tool*), token turun dari 23.893 menjadi hanya 1.239 token (−95%). Pola penting yang terlihat pada Gambar 4.1 adalah bahwa token *registry* nyaris konstan (893–1.241 token) meskipun katalog membesar sepuluh kali lipat, sedangkan token *baseline* tumbuh hampir linear. Rincian besaran penghematan disajikan pada Tabel 4.3.

Tabel 4.3 Penghematan Token Registry terhadap Baseline

| Skenario | Token Baseline | Token Registry | Penghematan | Reduksi |
|----------|----------------|----------------|-------------|---------|
| S1 | 2.426 | 893 | 1.533 token | −63% |
| S2 | 7.985 | 1.241 | 6.744 token | −84% |
| S3 | 23.893 | 1.239 | 22.654 token | −95% |

Penghematan absolut tumbuh dari 1.533 token (S1) menjadi 22.654 token (S3) per kueri. Implikasi praktis bagi zerlo.id sangat signifikan: pada katalog 300 *tool*, Tool Registry menghapus lebih dari 22 ribu token *overhead* per kueri, yang berarti penurunan biaya inferensi dan mitigasi langsung terhadap risiko *context rot* yang diuraikan pada Bab II. Signifikansi statistik penghematan ini diuji pada Sub-bab 4.8.


## 4.4 Analisis Tool Selection Accuracy

Akurasi pemilihan *tool* dinilai secara biner terhadap `expected_tool` sebagai *ground truth*. Perbandingan akurasi *baseline* dan *registry* per skenario disajikan pada Gambar 4.2 dan Tabel 4.4.

![Akurasi Pemilihan Tool](assets/charts/tool_selection_accuracy.png)

Gambar 4.2 Perbandingan Akurasi Pemilihan Tool Baseline dan Registry

Tabel 4.4 Akurasi Pemilihan Tool per Skenario

| Skenario | Baseline | Registry | Selisih |
|----------|----------|----------|---------|
| S1 | 68,8% | 75,0% | +6,3 pp |
| S2 | 71,4% | 71,4% | 0 pp |
| S3 | 71,4% | 77,6% | +6,3 pp |

Mode *registry* meningkatkan akurasi sebesar +6,3 poin persentase pada skenario S1 dan S3, serta setara pada S2. Temuan ini menunjukkan bahwa penyaringan *tool* tidak mengorbankan akurasi — bahkan cenderung memperbaikinya — karena dengan meneruskan hanya himpunan *tool* relevan, model terhindar dari kebingungan akibat *bloated tool sets*. Yang patut dicatat, perbaikan akurasi pada S3 (katalog terbesar) justru paling konsisten, sejalan dengan prinsip bahwa pengurangan *noise* konteks paling bermanfaat ketika katalog membesar.

Meskipun arah perbaikan akurasi konsisten dan positif, besarnya peningkatan (+6,3 pp) belum mencapai signifikansi statistik pada taraf α=0,05 (lihat Sub-bab 4.8). Oleh karena itu, peningkatan akurasi dilaporkan sebagai tren positif yang konsisten, sedangkan klaim utama penelitian difokuskan pada penghematan token yang terbukti signifikan kuat secara statistik.


## 4.5 Analisis Sub-linear Scalability

Properti skalabilitas *sub-linear* merupakan kontribusi arsitektural utama Tool Registry. Gambar 4.3 dan Tabel 4.5 membandingkan jumlah *tool* yang terlihat oleh LLM antara kedua mode.

![Skalabilitas Visible Tools](assets/charts/visible_tools_scaling.png)

Gambar 4.3 Jumlah Tool Terlihat oleh LLM terhadap Ukuran Katalog

Tabel 4.5 Jumlah Tool Terlihat dan Kompleksitas Penskalaan

| Skenario | Total Tool Katalog | Tool Terlihat (Baseline) | Tool Terlihat (Registry) |
|----------|--------------------|--------------------------|--------------------------|
| S1 | 30 | 30 | 10,6 |
| S2 | 100 | 100 | 15 |
| S3 | 300 | 300 | 15 |

Pada mode *baseline*, jumlah *tool* yang terlihat tumbuh secara O(N) — mengikuti persis ukuran katalog (30, 100, 300). Sebaliknya, pada mode *registry*, jumlah *tool* terlihat tertahan pada *budget cap* sebesar 15 *tool*, bahkan hanya 10,6 *tool* rata-rata pada S1 karena sebagian kueri menghasilkan kandidat lebih sedikit dari anggaran. Sebagaimana terlihat pada Gambar 4.3, kurva *registry* mendatar (O(1)) sementara kurva *baseline* menanjak linear. Properti O(1) inilah yang menjawab rumusan masalah keempat: katalog dapat tumbuh dari 30 ke 300 *tool* tanpa menambah beban konteks yang dilihat LLM, sehingga skalabilitas AI Agent zerlo.id tidak lagi dibatasi oleh ukuran katalog *tool*.


## 4.6 Analisis Memory Footprint

Jejak memori (*memory footprint*) registry diukur untuk memastikan bahwa *overhead* struktur metadata tetap kecil dan dapat dikelola. Hasil pengukuran disajikan pada Gambar 4.4 dan Tabel 4.6.

![Jejak Memori Registry](assets/charts/memory_footprint.png)

Gambar 4.4 Jejak Memori Registry terhadap Ukuran Katalog

Tabel 4.6 Jejak Memori Registry per Skenario

| Skenario | Total Tool | Jejak Memori (byte) | Setara |
|----------|-----------|---------------------|--------|
| S1 | 30 | 22.662 | ≈22 KB |
| S2 | 100 | 71.971 | ≈70 KB |
| S3 | 300 | 205.354 | ≈201 KB |

Jejak memori tumbuh secara linear terhadap ukuran katalog, dari 22 KB (30 *tool*) menjadi 201 KB (300 *tool*). Pertumbuhan linear ini wajar dan tidak menjadi *bottleneck*: bahkan pada katalog 300 *tool*, struktur metadata registry hanya menempati sekitar 201 KB memori — jumlah yang sangat kecil dibandingkan kapasitas memori server produksi. Dengan demikian, manfaat penghematan token yang besar diperoleh dengan *overhead* memori yang dapat diabaikan, menjadikan Tool Registry solusi yang efisien secara ruang maupun token.


## 4.7 Analisis Latency

Latensi respons diukur pada persentil ke-50 (p50) sebagai indikator pengalaman pengguna tipikal. Perbandingan latensi disajikan pada Gambar 4.5 dan Tabel 4.7.

![Latensi p50](assets/charts/latency_p50.png)

Gambar 4.5 Perbandingan Latensi p50 Baseline dan Registry

Tabel 4.7 Latensi p50 dan p95 per Skenario

| Skenario | p50 Baseline | p50 Registry | p95 Baseline | p95 Registry |
|----------|--------------|--------------|--------------|--------------|
| S1 | 833 ms | 905 ms | 1.311 ms | 2.567 ms |
| S2 | 1.014 ms | 910 ms | 2.625 ms | 1.369 ms |
| S3 | 992 ms | 851 ms | 1.548 ms | 1.112 ms |

Perbaikan latensi bersifat moderat dan tidak sekuat penghematan token. Pada skenario besar S3, latensi p50 membaik dari 992 ms menjadi 851 ms (−14%), dan p95 membaik dari 1.548 ms menjadi 1.112 ms. Namun pada skenario kecil S1, latensi *registry* justru sedikit lebih tinggi (905 ms vs 833 ms), karena *overhead* komputasi penyaringan belum terkompensasi oleh penghematan token yang kecil. Pola ini menunjukkan bahwa manfaat latensi Tool Registry baru terasa pada katalog besar — tepat pada kondisi di mana *bottleneck* token paling parah. Mengingat variabilitas latensi yang tinggi (dipengaruhi kondisi jaringan dan beban layanan), perbaikan latensi dilaporkan sebagai manfaat sekunder yang moderat, bukan sebagai klaim utama.


## 4.8 Uji Statistik

Signifikansi penghematan token diuji menggunakan uji Wilcoxon *signed-rank* berpasangan satu arah, dengan ukuran efek Cohen's d dan selang kepercayaan (*confidence interval*) 95%. Hasil uji disajikan pada Tabel 4.8.

Tabel 4.8 Hasil Uji Statistik Penghematan Token

| Skenario | n Pasangan | Rerata Penghematan | CI 95% | Wilcoxon p | Cohen's d |
|----------|-----------|--------------------|--------|------------|-----------|
| S1 | 16 | 1.534 token | [1.464, 1.604] | 0,0002 | 11,71 |
| S2 | 28 | 6.744 token | [6.735, 6.753] | <0,0001 | 290,91 |
| S3 | 49 | 22.654 token | [22.645, 22.662] | <0,0001 | 782,01 |

Penghematan token terbukti signifikan secara statistik pada seluruh skenario, dengan nilai p<0,001 (S1) dan p<0,0001 (S2 dan S3). Ukuran efek Cohen's d berkisar antara 11,71 hingga 782,01 — jauh melampaui ambang *large effect* (0,8) — yang menandakan bahwa penghematan token bersifat hampir deterministik dan tidak mungkin terjadi secara kebetulan. Selang kepercayaan 95% yang sempit semakin menegaskan presisi estimasi penghematan. Adapun untuk dimensi akurasi, uji Wilcoxon *signed-rank* menghasilkan p=0,28 (S1), p=0,50 (S2), dan p=0,09 (S3) — seluruhnya di atas α=0,05. Dengan demikian, peningkatan akurasi +6,3 pp bersifat directional namun belum signifikan secara statistik, kemungkinan akibat jumlah kueri yang terbatas dan sifat penilaian biner per kueri. Temuan ini memposisikan penghematan token sebagai kontribusi yang terbukti kuat, sedangkan perbaikan akurasi sebagai tren pendukung yang konsisten.


## 4.9 Failure Analysis

Analisis kegagalan dilakukan terhadap kueri yang dipilih secara salah pada ketiga pengulangan (*consistent failures*) dalam mode *registry*. Pola kegagalan yang berulang lintas skenario dirangkum pada Tabel 4.9.

Tabel 4.9 Kueri yang Gagal Konsisten di Seluruh Pengulangan

| Tool yang Diharapkan | Tool yang Dipilih Model | Modul |
|----------------------|-------------------------|-------|
| `supplier_create_purchase_order` | `supplier_read_tool` / `supplier_admin_tool` | supplier |
| `accounting_generate_journal` | `accounting_read_tool` / `accounting_admin_tool` | accounting |
| `sales_daily_revenue` | `sales_analytical_tool` | sales |
| `inventory_check_stock` | `inventory_admin_tool` | inventory |

Temuan kunci dari Tabel 4.9 adalah bahwa pada seluruh kasus kegagalan, *tool* yang dipilih model berada di **modul yang sama** dengan *tool* yang diharapkan. Hal ini membuktikan bahwa penyaringan modul oleh Tool Registry berfungsi dengan benar — registry berhasil mempersempit kandidat ke modul yang tepat — namun model gagal membedakan antar-*tool* di dalam modul tersebut. Akar masalahnya adalah skema parameter *tool* yang kosong (`properties: {}`) pada eksperimen ini, sehingga model hanya dapat membedakan *tool* berdasarkan deskripsi teks pendek; ketika beberapa *tool* dalam satu modul memiliki deskripsi yang mirip, ambiguitas menjadi tinggi.

Penting ditegaskan bahwa kegagalan ini muncul baik pada mode *baseline* maupun *registry* — sehingga merupakan keterbatasan format deskripsi *tool*, **bukan** kegagalan Tool Registry. Kegagalan ini berperan sebagai *confounding variable* yang membatasi akurasi absolut kedua mode secara setara, dan menjadi dasar rekomendasi penyempurnaan deskripsi *tool* yang dibahas pada Bab V.


## 4.10 Validasi Multi-model

Untuk menguji generalisabilitas temuan ke penyedia LLM lain, dijalankan eksperimen pendahuluan menggunakan model MiniMax-M2.7 dan GLM-4.5-Flash melalui *gateway* ADACODE yang berbasis antarmuka *OpenAI-compatible*. Namun, antarmuka tersebut tidak mereproduksi penghitungan token dan ekstraksi pemanggilan *tool* secara setara dengan *native function calling* Gemini: konsumsi token mode *registry* tercatat nyaris identik dengan *baseline* (mengindikasikan katalog penuh tetap dikirim oleh *gateway*), dan ekstraksi *tool call* gagal terbaca pada mayoritas rekaman.

Oleh karena keterbatasan harness pengukuran tersebut, hasil multi-model belum dapat diperbandingkan secara valid dengan eksperimen resmi Gemini, sehingga tidak disertakan sebagai bukti generalisabilitas pada penelitian ini. Validasi multi-model yang memerlukan adaptasi harness pengukuran per penyedia diposisikan sebagai bagian dari *future work* (Bab V). Keterbatasan ini sekaligus menegaskan bahwa hasil resmi penelitian ini bersifat spesifik terhadap mekanisme *native function calling* Gemini 2.5 Flash Lite, sebagaimana dinyatakan pada batasan masalah.
