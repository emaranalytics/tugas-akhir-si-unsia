# BAB V
# KESIMPULAN

## 5.1 Kesimpulan

Penelitian ini merancang, mengimplementasikan, dan mengevaluasi secara kuantitatif sebuah *Tool Registry* deterministik berbasis metadata sebagai lapisan penyaringan *tool* di hadapan AI Agent pada platform ERP restoran zerlo.id. Berdasarkan hasil eksperimen yang dipaparkan pada Bab IV — khususnya eksperimen resmi Gemini Native v2 dengan total n=558 rekaman — keempat rumusan masalah penelitian dapat dijawab sebagai berikut.

**Rumusan masalah pertama** menyangkut perancangan Tool Registry yang mampu menyimpan metadata *tool* secara terstruktur. Permasalahan ini terjawab melalui perancangan *dataclass* `ToolMeta` yang menyimpan lima atribut metadata per *tool* — modul (*module*), tipe operasi (*op_type*), kata kunci (*keywords*), peran (*role*), dan tingkat langganan (*tier*) — serta kelas `ToolRegistry` sebagai *singleton* penyimpan katalog. Rancangan ini terbukti memadai untuk merepresentasikan seluruh *tool* pada tiga skenario katalog (30, 100, dan 300 *tools*) tanpa perubahan struktur, sebagaimana diuraikan pada Bab III.

**Rumusan masalah kedua** menyangkut mekanisme penyaringan *tool* secara dinamis berdasarkan modul, peran, tingkat langganan, dan anggaran token. Permasalahan ini terjawab melalui fungsi `registry_filter()` yang menjalankan *pipeline* penyaringan berbasis *keyword scoring* dengan *budget cap* maksimal 15 *tools* per panggilan. Mekanisme ini bekerja secara deterministik dan ringan — tanpa ketergantungan pada model *embedding* maupun basis data vektor — sehingga selaras dengan kebutuhan sistem ERP berukuran menengah seperti zerlo.id.

**Rumusan masalah ketiga** menyangkut dampak Tool Registry terhadap penggunaan token, latensi, dan akurasi pemilihan *tool*. Hasil pengukuran menunjukkan bahwa kontribusi terkuat penelitian ini terletak pada **penghematan token**: konsumsi token rata-rata per kueri turun dari 2.426 menjadi 893 token pada skenario S1 (−63%), dari 7.985 menjadi 1.241 token pada S2 (−84%), dan dari 23.893 menjadi 1.239 token pada S3 (−95%). Penghematan ini terbukti signifikan secara statistik dengan uji Wilcoxon *signed-rank* (p=0,0002 pada S1; p<0,0001 pada S2 dan S3) dan ukuran efek Cohen's d yang sangat besar (11,71 hingga 782,01), jauh melampaui ambang *large effect*. Pada dimensi akurasi, mode *registry* mencatat tren positif sebesar +6,3 persentase poin pada S1 (68,8% → 75,0%) dan S3 (71,4% → 77,6%), namun tanpa perubahan pada S2 (71,4% → 71,4%); peningkatan ini bersifat *directional* dan **belum signifikan** secara statistik (Wilcoxon p=0,28; 0,50; dan 0,09, seluruhnya di atas α=0,05), sehingga diposisikan sebagai tren pendukung, bukan klaim utama. Pada dimensi latensi, perbaikan bersifat moderat dan *noisy*: latensi p50 pada S3 turun dari 992 ms menjadi 851 ms (−14%), sedangkan pada S1 mode *registry* justru sedikit lebih lambat — sehingga perbaikan latensi tidak dapat dinyatakan kuat.

**Rumusan masalah keempat** menyangkut kemampuan Tool Registry mendukung skalabilitas AI Agent ketika katalog *tool* bertambah. Permasalahan ini terjawab melalui temuan skalabilitas *sub-linear*: jumlah *tool* yang terlihat oleh LLM tetap konstan pada batas anggaran (15 *tools* pada S2 dan S3; 10,6 *tools* rata-rata pada S1) meskipun ukuran katalog tumbuh dari 30 ke 100 ke 300 *tools*. Dengan demikian, konsumsi token mode *registry* praktis stabil (893–1.241 token) sementara konsumsi *baseline* meningkat hampir sepuluh kali lipat (2.426 → 23.893 token). Perilaku ini mengubah kompleksitas dari O(N) menjadi O(1) terhadap ukuran katalog, dengan *overhead* memori yang tetap kecil dan linear (22 KB pada S1, 70 KB pada S2, 201 KB pada S3). Proyeksi deterministik pada skenario S4 (1.000 *tools*) memperkuat pola ini, dengan estimasi penghematan token mencapai −98%.

Secara keseluruhan, penelitian ini membuktikan bahwa Tool Registry deterministik berbasis metadata merupakan solusi *tool management* yang efektif dan dapat diskalakan untuk AI Agent multi-modul. Kontribusi utama yang terbukti kuat secara statistik adalah penghematan token sebesar 63–95% yang memungkinkan platform zerlo.id diskalakan ke ratusan modul tanpa mengalami lonjakan biaya inferensi proporsional maupun degradasi konteks (*context rot*), sementara perbaikan akurasi dan latensi merupakan manfaat tambahan yang konsisten meskipun belum signifikan secara statistik.


## 5.2 Keterbatasan dan Ancaman Terhadap Validitas

Hasil penelitian ini perlu ditafsirkan dalam kerangka keterbatasan eksperimen yang dirancang untuk kondisi terkontrol dan dapat direproduksi. Beberapa keterbatasan dan ancaman terhadap validitas diakui secara eksplisit demi menjaga kejujuran ilmiah.

**Katalog dan skema *tool* yang sintetis.** Katalog *tool* dibangun secara sintetis menggunakan generator berbasis modul dengan skema parameter dikosongkan (`properties: {}`) dan deskripsi berpola seragam. Akibatnya, model hanya dapat membedakan *tool* berdasarkan teks deskripsi pendek tanpa sinyal struktur parameter. Kondisi ini menekan akurasi absolut kedua mode secara setara sehingga akurasi yang terukur merupakan *lower bound*; klaim keunggulan *registry* tetap valid karena kondisi ini berlaku identik pada *baseline* maupun *registry*.

**Kegagalan deterministik sebagai *confounding variable*.** Sebagaimana dianalisis pada Subbab 4.9, empat hingga lima pola kueri gagal secara konsisten di seluruh pengulangan pada kedua mode. Seluruh *tool* yang keliru dipilih berada di modul yang sama dengan *tool* yang diharapkan — membuktikan penyaringan modul berfungsi benar, namun model gagal membedakan antar-*tool* intra-modul akibat deskripsi yang mirip. Kegagalan ini merupakan keterbatasan format deskripsi *tool*, bukan kegagalan Tool Registry.

**Cakupan eksperimen yang terbatas.** Eksperimen utama menggunakan satu penyedia LLM (Gemini 2.5 Flash Lite), 100 kueri evaluasi, dan tiga pengulangan per kueri. Validasi multi-model pada MiniMax-M2.7 dan GLM-4.5-Flash melalui *gateway* ADACODE tidak dapat diperbandingkan secara valid karena keterbatasan *harness* pengukuran token dan ekstraksi pemanggilan *tool* (Subbab 4.10). Pengukuran latensi juga mencakup latensi jaringan ke API sehingga bukan ukuran murni latensi inferensi. Hasil resmi penelitian ini, dengan demikian, bersifat spesifik terhadap mekanisme *native function calling* Gemini 2.5 Flash Lite pada periode pengujian.

**Validitas konstruk.** Akurasi didefinisikan secara biner sebagai kecocokan nama fungsi (`selected_tool == expected_tool`), dengan asumsi setiap kueri memiliki tepat satu *tool* yang benar — sebuah penyederhanaan terhadap kondisi nyata yang dapat melibatkan beberapa *tool* alternatif atau rangkaian *tool*. Token usage yang diukur berasal dari `usage_metadata` API dan belum mencakup *overhead* dari *system prompt* maupun riwayat percakapan pada sistem *production*.

Tabel 5.1 merangkum pemetaan antara ancaman terhadap validitas, mitigasi yang diterapkan pada penelitian ini, dan arah penyempurnaan pada penelitian lanjutan.

Tabel 5.1 Ancaman Terhadap Validitas, Mitigasi, dan Penelitian Lanjutan

| Ancaman | Mitigasi pada Penelitian Ini | Penelitian Lanjutan |
|---------|------------------------------|---------------------|
| Katalog *tool* sintetis | *Tool* menyerupai domain ERP; skema seragam dikontrol antar-mode | Uji dengan katalog *production* zerlo.id yang sesungguhnya |
| Skema parameter kosong | Kondisi identik pada *baseline* dan *registry*; klaim tetap valid | Tambahkan skema parameter lengkap untuk mengukur dampaknya |
| Dataset evaluasi kecil | 100 kueri (50/30/20), 3 pengulangan, uji Wilcoxon + Cohen's d + CI 95% | Perluas ke 300+ kueri dengan distribusi lebih representatif |
| Satu penyedia LLM | Fokus pada Gemini sesuai *stack production* zerlo.id | Validasi lintas model (Claude, GPT-4o, MiniMax) dengan *harness* per-penyedia |
| Kegagalan deterministik | Dianalisis per kueri; didokumentasikan sebagai *threat* | *Two-stage*: penyaringan *registry* → *intent* unik per *tool* |
| Latensi jaringan | Dilaporkan sebagai p50/p95 *wall-clock*; metrik komparatif tetap valid | Pisahkan latensi jaringan dari latensi inferensi |


## 5.3 Saran / Future Work

Berdasarkan temuan dan keterbatasan di atas, beberapa arah penelitian lanjutan direkomendasikan.

1. **Integrasi *Tool RAG* berbasis vektor untuk skala ribuan *tool*.** Tool Registry deterministik efektif pada skala ratusan *tool*, tetapi pada skala ribuan *tool* — sebagaimana dilaporkan MCP-Flow dengan 11.536 *tools* [1] — penyaringan berbasis kata kunci dapat menjadi kurang presisi. Penggabungan dengan pendekatan *Retrieval-Augmented Generation* berbasis *embedding* seperti Gorilla [2] dan Toolshed [3] berpotensi mempertahankan presisi pada skala yang jauh lebih besar.

2. **Pendekatan hibrida *two-stage*: penyaringan *registry* diikuti deskripsi kaya per *tool*.** Eksperimen Gemini Rich (Subbab 4.1) menunjukkan bahwa *template intent* generik justru menurunkan akurasi *registry* sebesar 9–11 persentase poin karena identik untuk seluruh *tool* dengan *op_type* yang sama. Temuan ini menegaskan bahwa kualitas deskripsi berarti **keunikan per *tool***, bukan panjang teks. Penelitian lanjutan dapat menguji arsitektur dua tahap: tahap pertama menyaring kandidat dengan *registry* (penghematan token besar), tahap kedua menyuntikkan *docstring* unik per *tool* hanya untuk kandidat terpilih — sehingga akurasi intra-modul meningkat tanpa membengkakkan token.

3. **Penambahan skema parameter lengkap.** Pengisian skema parameter yang bertipe dan bernama spesifik diharapkan dapat menaikkan *ceiling* akurasi yang pada eksperimen ini tertahan oleh skema kosong, sekaligus mengatasi sebagian besar kegagalan deterministik intra-modul.

4. **Validasi multi-model dengan *harness* pengukuran per-penyedia.** Perbandingan lintas penyedia LLM (Claude Sonnet 4.6, GPT-4o, MiniMax-M2.7, GLM-4.5-Flash) memerlukan adaptasi *harness* penghitungan token dan ekstraksi pemanggilan *tool* agar setara dengan *native function calling* Gemini, sehingga generalisabilitas temuan dapat diuji secara valid.

5. **Integrasi produksi penuh dan evaluasi berkelanjutan.** Penerapan Tool Registry pada lingkungan *production* zerlo.id secara penuh — mencakup penyaringan berbasis *role* (RBAC), *gating* berdasarkan *tier* langganan, dan 80+ *tool* aktif — perlu dievaluasi menggunakan *log* kueri pengguna nyata secara berkelanjutan, untuk memvalidasi temuan eksperimen pada distribusi kueri produksi yang sesungguhnya.

---

**Referensi Bab V**

[1] W. Wang et al., "MCP-Flow: Facilitating LLM agents to master real-world, diverse and scaling MCP tools," in *Proc. Assoc. Comput. Linguistics (ACL)*, 2026. arXiv:2510.24284.

[2] S.G. Patil, T. Zhang, X. Wang, dan J.E. Gonzalez, "Gorilla: Large language model connected with massive APIs," in *Proc. Adv. Neural Inf. Process. Syst. (NeurIPS)*, 2024. arXiv:2305.15334.

[3] E. Lumer, "Toolshed: Scale tool-equipped agents with advanced RAG-tool fusion and tool knowledge bases," arXiv:2410.14594, 2024.
