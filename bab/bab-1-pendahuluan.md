# BAB I
# PENDAHULUAN

## 1.1 Latar Belakang Masalah

Perkembangan kecerdasan buatan (*artificial intelligence*) pada dekade terakhir telah mendorong kemunculan sistem AI Agent yang mampu memanggil fungsi eksternal secara otonom untuk menyelesaikan tugas kompleks. Kemampuan ini, yang dikenal sebagai *function calling* atau *tool use*, pertama kali diperkenalkan sebagai fitur siap produksi oleh OpenAI pada Juni 2023 [1] dan kemudian diadopsi oleh Google DeepMind melalui mekanisme *FunctionDeclaration* pada Gemini [2]. Fondasi teoritis dari kemampuan ini diletakkan oleh Schick et al. (2023) melalui Toolformer [3], yang membuktikan bahwa LLM dapat belajar memanggil *tools* secara *self-supervised*, serta oleh Yao et al. (2023) melalui kerangka ReAct [4] yang memodelkan siklus Thought→Action→Observation sebagai dasar perilaku agen.

Zerlo.id adalah platform ERP (*Enterprise Resource Planning*) berbasis AI yang dirancang khusus untuk usaha mikro, kecil, dan menengah (UMKM) di sektor F&B (*Food and Beverage*) Indonesia. Platform ini mengoperasikan 38 modul bisnis dengan 1.176 *endpoint*, 11 AI Agent aktif, dan lebih dari 60 *tools* produksi yang tersedia bagi agen. Setiap modul — mulai dari manajemen pemesanan, inventaris, akuntansi, hingga analitik penjualan — memiliki sejumlah *tools* yang harus dapat dipanggil oleh AI Agent sesuai konteks permintaan pengguna. Pada tahap *beta testing* saat ini, jumlah *tools* terus bertambah sejalan dengan pengembangan fitur baru.

Pertumbuhan katalog *tools* ini menimbulkan permasalahan fundamental yang disebut *tool overload*. Ketika seluruh daftar *tools* dikirimkan kepada LLM sebagai bagian dari konteks (*context window*), jumlah token input meningkat secara proporsional terhadap ukuran katalog. Pada skenario S3 dengan 300 *tools*, pengukuran pada penelitian ini menunjukkan rata-rata konsumsi token mencapai 23.893 token per kueri hanya untuk mendefinisikan *tools* yang tersedia — bahkan sebelum pertanyaan pengguna diproses. Kondisi ini berdampak langsung pada biaya komputasi, latensi respons, dan akurasi pemilihan *tool*.

Fenomena degradasi performa LLM akibat konteks yang terlalu panjang telah dibuktikan secara empiris oleh Liu et al. (2024) dalam penelitian "Lost in the Middle" [5]: model cenderung mengabaikan informasi yang berada di bagian tengah konteks panjang dan lebih mengandalkan informasi di awal atau akhir konteks. Temuan serupa dilaporkan oleh Timothy B. Lee (2025) [6], yang mengukur akurasi Claude 3.5 Sonnet menurun dari 88% menjadi 30% ketika konteks mencapai 32K token — sebuah fenomena yang disebut *context rot*. Rajasekaran et al. (2025) dari Anthropic memperkuat temuan ini dengan pernyataan bahwa "*bloated tool sets cause agent failure*" dan merekomendasikan prinsip *minimal token set* [7].

Solusi yang berkembang di industri dan komunitas riset adalah pendekatan *Tool RAG* (*Retrieval-Augmented Generation* untuk *tools*): alih-alih menyertakan seluruh katalog, sistem mengambil hanya *tools* yang paling relevan secara semantik sebelum memanggil LLM. Gorilla [8] dan ToolLLM [9] membuktikan bahwa LLM dapat dihubungkan dengan ribuan API nyata menggunakan mekanisme *retrieval*. Lumer (2024) melalui Toolshed [10] mencapai peningkatan Recall@5 sebesar 46–56% menggunakan fusi tiga fase RAG-*tool*. Namun pendekatan berbasis *embedding* ini membawa kompleksitas infrastruktur tersendiri: diperlukan model *embedding*, basis data vektor, dan *pipeline* sinkronisasi yang tidak selalu tersedia dalam konteks sistem ERP berukuran menengah.

Sebagai alternatif yang lebih deterministik dan ringan, konsep *Tool Registry* menawarkan lapisan penyaringan berbasis metadata: setiap *tool* didaftarkan bersama atribut modul, peran (*role*), tingkat langganan (*subscription tier*), kata kunci (*keywords*), dan batas anggaran token (*token budget*). Sebelum LLM dipanggil, registry memfilter katalog berdasarkan konteks permintaan sehingga hanya subset *tools* yang relevan yang diteruskan. Gaurav et al. (2025) menunjukkan bahwa pemuatan *tool* yang dinamis dapat mengurangi beban pemuatan *tool* hingga 50% sambil mempertahankan akurasi [11]. Jia dan Li (AAAI 2026) melalui AutoTool [12] membuktikan bahwa pola penggunaan *tools* bersifat sekuensial dan dapat diprediksi, mendukung preseleksi sebelum inferensi. Wang et al. (ACL 2026) melalui MCP-Flow [13] melaporkan validasi skala industri dengan 11.536 *tools* di 1.166 server MCP. Di tingkat *hyperscaler*, AWS telah mengadopsi pola ini sebagai AWS Agent Registry dengan *hybrid search* dan integrasi IAM [14].

Pada ekosistem Pydantic AI — kerangka AI Agent yang digunakan zerlo.id — tersedia antarmuka `FilteredToolset` yang memungkinkan penyaringan *tools* berdasarkan predikat tunggal. Namun antarmuka ini tidak mendukung penyaringan multi-kriteria (modul + peran + tier + anggaran token) yang diperlukan oleh platform ERP multi-modul. Kesenjangan ini menjadi motivasi utama perancangan Tool Registry khusus yang menjadi objek penelitian ini.

Berdasarkan pemaparan di atas, penelitian ini membangun dan mengevaluasi Tool Registry deterministik berbasis metadata pada platform zerlo.id, dengan mengukur dampaknya terhadap efisiensi token, akurasi pemilihan *tool*, dan skalabilitas AI Agent secara kuantitatif. Sejauh pengetahuan penulis, belum ada penelitian yang secara eksplisit mengukur dan mempublikasikan hasil evaluasi kuantitatif Tool Registry berbasis metadata pada kerangka Pydantic AI 1.x.


## 1.2 Rumusan Masalah

Berdasarkan latar belakang yang telah dipaparkan, rumusan masalah penelitian ini dinyatakan sebagai berikut.

1. Diperlukan rancangan Tool Registry yang mampu menyimpan metadata *tool* secara terstruktur pada platform ERP multi-modul zerlo.id.

2. Diperlukan mekanisme penyaringan *tool* (*filtering*) secara dinamis berdasarkan modul, peran, tingkat langganan, dan anggaran token pada AI Agent.

3. Dampak penerapan Tool Registry terhadap penggunaan token (*token usage*), latensi (*latency*), dan akurasi pemilihan *tool* (*tool selection accuracy*) dibandingkan dengan pendekatan *baseline* tanpa penyaringan belum diketahui dan perlu diukur secara kuantitatif.

4. Kemampuan Tool Registry dalam mendukung skalabilitas AI Agent pada platform ERP restoran ketika jumlah *tools* dalam katalog bertambah secara signifikan perlu dibuktikan.


## 1.3 Batasan Masalah

Agar penelitian ini terfokus dan hasilnya dapat diukur secara valid, ditetapkan batasan-batasan sebagai berikut.

1. Penyedia LLM yang digunakan adalah Google Gemini 2.5 Flash Lite melalui Google Gen AI SDK dengan mekanisme *native function calling* (FunctionDeclaration, mode=ANY, temperature=0). Eksperimen multi-model (MiniMax-M2.7 dan Claude Sonnet 4.6) disertakan sebagai bukti generalisabilitas, bukan sebagai hasil utama.

2. Dataset evaluasi terdiri dari 100 kueri berbahasa Indonesia yang mencakup tiga kategori: 50 kueri *single-domain*, 30 kueri *cross-domain*, dan 20 kueri adversarial. Setiap kueri diulang sebanyak tiga kali per skenario (*repeat runs*).

3. Evaluasi dilakukan pada tiga skenario katalog: S1 (30 *tools*), S2 (100 *tools*), dan S3 (300 *tools*). Skenario S4 (1.000 *tools*) hanya disimulasikan secara deterministik, tidak dijalankan secara *live*.

4. Batas *tool budget* yang diteruskan ke LLM ditetapkan maksimal 15 *tools* per panggilan registry.

5. Penelitian tidak mengukur kualitas linguistik dari respons yang dihasilkan LLM.

6. Pendekatan *Tool RAG* berbasis *embedding* dibahas sebagai *future work*, bukan sebagai bagian dari implementasi utama.


## 1.4 Tujuan Penelitian

Penelitian ini bertujuan untuk:

1. merancang Tool Registry dengan metadata terstruktur (ToolMeta) yang mencakup atribut modul, tipe operasi, kata kunci, peran, dan tingkat langganan;

2. mengimplementasikan mekanisme penyaringan dinamis berbasis multi-kriteria (modul, peran, tier, token budget) sebagai lapisan antara katalog *tools* dan LLM pada AI Agent zerlo.id;

3. mengukur dampak penerapan Tool Registry terhadap penggunaan token, latensi, dan akurasi pemilihan *tool* secara kuantitatif menggunakan uji statistik Wilcoxon *signed-rank*, Cohen's d, dan *confidence interval* 95%;

4. membuktikan sifat skalabilitas *sub-linear* Tool Registry — yaitu bahwa jumlah *tools* yang terlihat oleh LLM tetap konstan (O(1) terhadap budget) meskipun ukuran katalog bertambah dari 30 ke 100 ke 300 *tools*.


## 1.5 Manfaat Penelitian

Penelitian ini memberikan manfaat pada tiga dimensi berikut.

**Manfaat Akademik.** Penelitian ini menghasilkan *baseline* kuantitatif pertama evaluasi Tool Registry berbasis metadata pada kerangka Pydantic AI 1.x. Metodologi eksperimen — 100 kueri × 3 pengulangan × 3 skenario dengan uji Wilcoxon dan Cohen's d — dapat dijadikan acuan bagi penelitian serupa yang membandingkan strategi penyaringan *tool* pada sistem AI Agent enterprise.

**Manfaat Praktis.** Bagi platform zerlo.id, hasil penelitian ini memberikan bukti kuantitatif bahwa Tool Registry mampu menekan konsumsi token hingga 95% (skenario S3) tanpa degradasi akurasi, sehingga platform dapat diskalakan ke ratusan modul tanpa mengalami *context rot* atau lonjakan biaya inferensi yang proporsional.

**Manfaat bagi Komunitas Pengembang.** Pola arsitektur Tool Registry deterministik berbasis metadata yang dikembangkan dalam penelitian ini dapat direplikasi oleh pengembang sistem AI Agent enterprise lain yang memerlukan solusi *tool management* tanpa ketergantungan pada infrastruktur *embedding* dan basis data vektor.


## 1.6 Metode Penelitian

Penelitian ini menggunakan pendekatan *Design Science Research* (DSR) sebagaimana dikemukakan oleh Hevner et al. (2004) [15], yang terdiri dari lima tahap: identifikasi masalah (*problem identification*), penetapan tujuan solusi (*objective of solution*), perancangan dan pengembangan artefak (*design and development*), demonstrasi (*demonstration*), dan evaluasi (*evaluation*).

**Tahap Identifikasi Masalah.** Fenomena *tool overload* diidentifikasi dari data operasional zerlo.id: 60+ *tools* aktif di lingkungan produksi dengan proyeksi pertumbuhan sejalan ekspansi modul. Literatur empiris ("Lost in the Middle" [5], *context rot* [6]) dikutip sebagai justifikasi akademik.

**Tahap Perancangan Artefak.** Artefak utama yang dirancang adalah: (a) *dataclass* ToolMeta sebagai skema metadata *tool*, (b) kelas ToolRegistry sebagai *singleton* penyimpan katalog, dan (c) fungsi `registry_filter()` sebagai *pipeline* penyaringan berbasis *keyword scoring* dan *budget cap*. Artefak pendukung mencakup *framework* evaluasi: *runner* JSONL inkremental, modul pengukuran statistik, dan *report generator*.

**Tahap Demonstrasi.** Tool Registry diintegrasikan ke dalam AI Agent berbasis Pydantic AI dan diuji pada tiga skenario katalog (S1/S2/S3) menggunakan dataset 100 kueri berbahasa Indonesia.

**Tahap Evaluasi.** Hasil eksperimen dianalisis menggunakan:
(a) pengujian statistik Wilcoxon *signed-rank* berpasangan (satu arah) untuk menguji signifikansi penurunan token;
(b) Cohen's d untuk mengukur besar efek (*effect size*);
(c) *confidence interval* 95% untuk estimasi rentang penurunan;
(d) analisis perbandingan akurasi pemilihan *tool* antara mode *baseline* dan *registry*.

Seluruh data eksperimen disimpan dalam format JSONL yang dapat dilanjutkan (*resume-safe*) untuk memastikan reprodusibilitas. Total rekaman yang dihasilkan adalah n=558 (279 *baseline* + 279 *registry*) dari eksperimen resmi Gemini Native v2.
