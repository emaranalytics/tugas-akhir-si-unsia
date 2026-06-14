# BAB II
# LANDASAN TEORI

Bab ini menguraikan landasan teori dan tinjauan pustaka yang menjadi dasar penelitian. Pembahasan dimulai dari konsep dasar pemanggilan fungsi oleh *Large Language Model* (LLM), fenomena degradasi performa akibat konteks panjang, pendekatan *Tool RAG* dan *Tool Registry* sebagai solusi, posisi penelitian terhadap antarmuka *native* kerangka Pydantic AI, serta kerangka metodologis *Design Science Research*. Bab ditutup dengan tabel perbandingan penelitian terdahulu untuk menegaskan kebaruan penelitian ini.


## 2.1 LLM dan Pemanggilan Fungsi (Tool-Calling)

Kemampuan LLM untuk memanggil fungsi eksternal merupakan fondasi dari sistem AI Agent modern. Schick et al. (2023) melalui Toolformer [1] membuktikan bahwa LLM dapat belajar memutuskan *tool* mana yang dipanggil, kapan memanggilnya, argumen apa yang diberikan, serta bagaimana mengintegrasikan hasilnya ke dalam prediksi token berikutnya — seluruhnya secara *self-supervised* tanpa anotasi manusia dalam skala besar. Temuan ini mengatasi keterbatasan fundamental LLM dalam aritmetika dan pencarian fakta, sekaligus membuktikan bahwa kapabilitas *tool use* dapat ditanamkan ke dalam LLM dengan *overhead* pelatihan yang minimal.

Kemampuan tersebut dioperasionalkan ke dalam sebuah arsitektur agen melalui kerangka ReAct yang diperkenalkan oleh Yao et al. (2023) [2]. ReAct menggabungkan penalaran berantai (*chain-of-thought reasoning*) dengan aksi pemanggilan *tool* secara berselang-seling melalui siklus Thought→Action→Observation. Model menyusun rencana (*Thought*), memanggil sebuah *tool* (*Action*), mengamati hasilnya (*Observation*), lalu memperbarui rencana pada iterasi berikutnya. Pada *benchmark* ALFWorld dan WebShop, ReAct mengungguli pendekatan *imitation learning* dan *reinforcement learning* dengan margin absolut masing-masing 34% dan 10%. Kerangka ini menjadi rujukan standar bagi arsitektur AI Agent modern, termasuk agen yang dibangun pada platform zerlo.id.

Secara industri, kemampuan *tool-calling* dijadikan fitur siap produksi pertama kali oleh OpenAI pada Juni 2023 [3]. Pengumuman tersebut memungkinkan pengembang mendefinisikan fungsi dan memperoleh keluaran JSON terstruktur berisi argumen pemanggilan fungsi dari model yang telah di-*fine-tune* untuk mendeteksi kapan sebuah fungsi perlu dipanggil. Standar *de facto* ini kemudian diadopsi oleh Anthropic dan Google. Google DeepMind menyediakan mekanisme *native function calling* pada Gemini melalui *FunctionDeclaration* [4], di mana skema *tool* didefinisikan sebagai JSON Schema yang diteruskan ke model sebelum inferensi, dan model memutuskan *tool* yang dipanggil berdasarkan konteks percakapan. Penelitian ini menggunakan mekanisme *native function calling* Gemini 2.5 Flash Lite sebagai *backend* pengukuran, sehingga pemahaman atas cara *tool* didefinisikan dan dipilih oleh model menjadi fondasi teknis langsung bagi evaluasi Tool Registry.


## 2.2 Rekayasa Konteks dan Context Rot

Penyertaan seluruh definisi *tool* ke dalam jendela konteks (*context window*) LLM menimbulkan konsekuensi yang telah dibuktikan secara empiris. Liu et al. (2024) dalam penelitian "Lost in the Middle" [5] menemukan bahwa performa LLM optimal ketika informasi relevan berada di awal atau akhir konteks, namun menurun signifikan ketika informasi tersebut berada di bagian tengah konteks panjang. Efek ini muncul bahkan pada model yang secara eksplisit dirancang untuk konteks panjang. Implikasinya langsung bagi penelitian ini: pemberian 300 definisi *tool* sekaligus kepada LLM — sebagaimana terjadi pada skenario S3 *baseline* yang mengonsumsi 23.893 token — secara inheren menurunkan akurasi pemilihan *tool* karena sebagian definisi pasti berada di posisi tengah yang rawan diabaikan.

Fenomena degradasi ini dikenal sebagai *context rot*. Lee (2025) [6] mendokumentasikan bahwa akurasi Claude 3.5 Sonnet menurun dari 88% menjadi 30% pada penalaran *two-hop* ketika konteks diperpanjang hingga 32.000 token, dan menjelaskan akar arsitekturalnya: mekanisme *attention* memiliki sifat penskalaan kuadratik (O(n²)) sehingga setiap token tambahan meningkatkan beban komputasi dan menurunkan kemampuan model merecall informasi secara akurat. Penelitian lanjutan [7] memperkuat temuan ini dengan memisahkan efek panjang konteks dari kualitas *retrieval* — dengan mengendalikan *perfect retrieval* (informasi relevan selalu tersedia) dan hanya memvariasikan panjang konteks total, degradasi performa tetap terjadi semata-mata karena konteks lebih panjang. Temuan ini membantah anggapan bahwa jendela konteks yang besar sudah memadai.

Sebagai respons, Rajasekaran et al. (2025) dari Anthropic [8] mendefinisikan *context engineering* sebagai strategi mengkurasi dan mempertahankan himpunan token optimal selama inferensi LLM. Tiga prinsip yang dikemukakan relevan langsung bagi penelitian ini: (1) kemampuan model merecall informasi menurun seiring bertambahnya jumlah token (*context rot*); (2) himpunan *tool* yang membengkak (*bloated tool sets*) menyebabkan titik keputusan ambigu dan kegagalan agen; serta (3) tujuan optimal adalah menemukan himpunan token bersinyal-tinggi sekecil mungkin (*smallest possible set of high-signal tokens*). Tool Registry yang dievaluasi pada penelitian ini merupakan implementasi langsung dari prinsip ketiga tersebut.


## 2.3 Tool RAG — Retrieval Tool Berbasis Vektor

Pendekatan dominan untuk mengatasi *tool overload* di komunitas riset adalah *Tool RAG* (*Retrieval-Augmented Generation* untuk *tools*): alih-alih menyertakan seluruh katalog, sistem mengambil hanya *tool* yang paling relevan secara semantik sebelum memanggil LLM. Patil et al. (2023) melalui Gorilla [9] menjadi rujukan fondasional pendekatan ini dengan membuktikan bahwa GPT-4 sering berhalusinasi nama dan argumen API ketika diberikan katalog besar. Dengan menggabungkan *document retriever*, Gorilla — model berbasis LLaMA yang di-*fine-tune* atas lebih dari 11.000 pasangan instruksi-API — mampu beradaptasi terhadap perubahan dokumentasi API secara *real-time*. Proyek ini juga melahirkan *Berkeley Function Calling Leaderboard* (BFCL) yang menjadi standar evaluasi *tool-calling*.

Pada skala yang lebih besar, Qin et al. (2023) melalui ToolLLM [10] menunjukkan bahwa LLM sumber terbuka dapat di-augmentasi dengan *neural API retriever* untuk menangani lebih dari 16.000 API nyata — skala yang jauh melampaui kapasitas pemuatan jendela konteks sekaligus. Penelitian tersebut membuktikan bahwa tanpa *retriever*, performa pemilihan *tool* menurun drastis pada skala ribuan *tool*. Lumer (2024) melalui Toolshed [11] memperkenalkan konsep *Tool Knowledge Base* (basis data vektor khusus *tool*) dan *Advanced RAG-Tool Fusion* berupa tiga fase *retrieval* tanpa *fine-tuning*, yang mencapai peningkatan Recall@5 sebesar 46–56% dibandingkan *baseline*. Arsitektur Toolshed paling dekat analoginya dengan lapisan penyaringan yang diteliti pada thesis ini.

Penelitian lanjutan mengidentifikasi keterbatasan *retrieval* berbasis kesamaan semantik murni. COLT [12] menunjukkan bahwa pendekatan *similarity* cenderung mengambil *tool* yang redundan alih-alih komplementer, dan mengusulkan *dual-view graph collaborative learning* untuk menangkap relasi kolaboratif antar-*tool*; hasilnya, BERT-mini (11M parameter) mengungguli BERT-large (340M parameter) pada *benchmark* ToolLens. Temuan ini menegaskan bahwa kualitas *retrieval* lebih ditentukan oleh strategi daripada ukuran model. Adapun BFCL [13] dalam perkembangannya menjadi *benchmark* holistik yang mengevaluasi *tool-calling* melalui *single-turn calls*, deteksi halusinasi, sensitivitas format, dan interaksi *multi-turn*; metodologi penilaian akurasi pada penelitian ini — yakni menilai apakah LLM memilih *tool* yang tepat — mengikuti semangat evaluasi BFCL. Meskipun demikian, pendekatan berbasis *embedding* membawa kompleksitas infrastruktur tersendiri (model *embedding*, basis data vektor, *pipeline* sinkronisasi) yang tidak selalu tersedia pada sistem ERP berukuran menengah, sehingga *Tool RAG* diposisikan sebagai *future work* dalam penelitian ini.


## 2.4 Tool Registry dan Manajemen Tool

Sebagai alternatif yang lebih deterministik dan ringan dibanding *Tool RAG*, konsep *Tool Registry* menerapkan penyaringan berbasis metadata terstruktur tanpa ketergantungan pada *embedding*. Gaurav et al. (2025) melalui Dynamic ReAct [14] mengatasi persoalan yang serupa dengan penelitian ini — keterbatasan konteks LLM yang tidak mampu menampung ratusan hingga ribuan *tool* MCP — dan membuktikan bahwa pemuatan *tool* secara dinamis mengurangi beban pemuatan hingga 50% sambil mempertahankan akurasi penyelesaian tugas. Hasil ini sejajar langsung dengan temuan penelitian ini, yakni pengurangan *visible tools* dari 300 menjadi 15 (−95%) tanpa degradasi akurasi.

Justifikasi teoritis tambahan diberikan oleh Jia dan Li (2025) melalui AutoTool [15] yang memperkenalkan konsep *tool usage inertia* — kecenderungan pemanggilan *tool* mengikuti pola sekuensial yang dapat diprediksi. Dengan memodelkan pola tersebut sebagai *directed graph* dari trajektori historis agen, AutoTool mengurangi biaya inferensi hingga 30% sambil mempertahankan tingkat penyelesaian tugas. Apabila pemanggilan *tool* memang berpola, maka penyaringan berbasis modul, peran, dan tingkat langganan sebagaimana diterapkan zerlo.id telah menangkap sebagian besar inersia tersebut secara deterministik. Pada arah evolusi sistem, ScaleMCP [16] mengusulkan *registry* yang melakukan auto-sinkronisasi melalui operasi CRUD agar katalog *tool* selalu mutakhir, sebuah visi jangka panjang yang relevan bagi pengembangan lanjutan zerlo.id.

Skala persoalan ini divalidasi pada tingkat industri oleh Wang et al. (2025) melalui MCP-Flow [17], yang mendokumentasikan 11.536 *tool* pada 1.166 server MCP — membuktikan bahwa penskalaan katalog *tool* ke ribuan entri merupakan tantangan nyata, bukan skenario hipotetis. Adopsi pola ini juga telah mencapai tingkat *hyperscaler*: AWS Agent Registry [18] menyediakan manajemen metadata, kendali akses berbasis IAM, pelacakan siklus hidup, dan *hybrid search* (kata kunci + semantik). Pada tataran konseptual, TrueFoundry [19] mendefinisikan enam fungsi inti *agent registry* — registrasi, penemuan (*discovery*), manajemen metadata, pemantauan kesehatan, kendali akses, dan pencatatan audit — yang memberikan kerangka untuk mengevaluasi kelengkapan implementasi. Kolchinsky dari Red Hat (2025) [20] secara independen sampai pada kesimpulan yang sama dengan penelitian ini, yakni bahwa pemberian seluruh *tool* sekaligus menurunkan akurasi secara drastis, dan menyatakan bahwa *retrieval tool* yang cerdas dapat melipattigakan akurasi *invocation* sambil mempersingkat *prompt* — selaras dengan temuan penelitian ini berupa peningkatan akurasi 6,3 pp dengan pengurangan *prompt* 63–95%.


## 2.5 Antarmuka Native Pydantic AI vs Tool Registry zerlo.id

Platform zerlo.id membangun AI Agent di atas kerangka Pydantic AI [21], yang menyediakan abstraksi `AbstractToolset` sebagai kontrak pengelolaan himpunan *tool*. Salah satu implementasi turunannya, `FilteredToolset`, memungkinkan penyaringan *tool* berdasarkan sebuah predikat tunggal (*single predicate*) — misalnya menyaring *tool* berdasarkan satu atribut konteks pemanggilan. Antarmuka ini memadai untuk kebutuhan penyaringan sederhana, namun tidak dirancang untuk penyaringan multi-kriteria yang dibutuhkan platform ERP multi-modul.

Tool Registry zerlo.id memposisikan diri sebagai lapisan multi-kriteria di atas antarmuka *native* tersebut. Berbeda dengan `FilteredToolset` yang mengevaluasi satu predikat, Tool Registry menyaring katalog berdasarkan kombinasi modul, peran (*role*), tingkat langganan (*subscription tier*), kata kunci (*keywords*), dan batas anggaran token (*token budget*) secara simultan, lalu menerapkan *budget cap* untuk membatasi jumlah *tool* yang diteruskan ke LLM. Dengan demikian, kontribusi penelitian ini bukan menggantikan abstraksi Pydantic AI, melainkan memperluasnya menjadi *pipeline* penyaringan deterministik berbasis metadata yang sesuai dengan karakteristik ERP. Kesenjangan antara kemampuan predikat tunggal `FilteredToolset` dan kebutuhan penyaringan multi-kriteria inilah yang menjadi motivasi utama perancangan artefak pada Bab III.


## 2.6 Design Science Research

Penelitian ini menggunakan kerangka *Design Science Research* (DSR) sebagaimana dikemukakan oleh Hevner et al. (2004) [22]. DSR merupakan paradigma penelitian sistem informasi yang berorientasi pada penciptaan dan evaluasi artefak (*artifact*) untuk menyelesaikan masalah organisasi yang teridentifikasi. Kerangka ini terdiri dari lima tahap berurutan: identifikasi masalah (*problem identification*), penetapan tujuan solusi (*objective of solution*), perancangan dan pengembangan artefak (*design and development*), demonstrasi (*demonstration*), dan evaluasi (*evaluation*), yang ditutup dengan komunikasi hasil (*communication*).

DSR dipilih karena karakteristik penelitian ini yang menghasilkan artefak perangkat lunak konkret — *dataclass* `ToolMeta`, kelas `ToolRegistry`, dan fungsi `registry_filter()` — sekaligus mengukur dampaknya secara kuantitatif. Tahap identifikasi masalah memetakan fenomena *tool overload* dari data operasional zerlo.id; tahap perancangan menghasilkan artefak Tool Registry beserta kerangka evaluasinya; tahap demonstrasi mengintegrasikan artefak ke dalam AI Agent dan menjalankannya pada tiga skenario katalog; dan tahap evaluasi menganalisis hasil menggunakan uji statistik Wilcoxon *signed-rank*, Cohen's d, dan *confidence interval* 95%. Pemetaan tahapan DSR secara rinci diuraikan pada Bab III.

Secara arsitektural, Tool Registry juga mengadaptasi pola rekayasa perangkat lunak yang telah matang dari ranah *microservices* [23], yakni *service registry* dan *API gateway*. Pada pola tersebut, *service registry* menyimpan metadata layanan (lokasi, kapabilitas, status) untuk memungkinkan *service discovery*, sementara *API gateway* berperan sebagai titik masuk tunggal yang merutekan permintaan ke layanan yang tepat. Tool Registry mengadaptasi pola ini ke domain AI Agent: LLM berperan sebagai *client*, *tools* berperan sebagai *services*, dan Tool Registry menggabungkan fungsi *service registry* dan *API gateway* dengan menyaring *tool* berdasarkan metadata sebelum diteruskan ke model.


## 2.7 Penelitian Terdahulu

Untuk menegaskan posisi dan kebaruan penelitian, Tabel 2.1 membandingkan penelitian terdahulu yang relevan berdasarkan pendekatan penyaringan *tool*, mekanisme yang digunakan, skala evaluasi, dan ketersediaan pengukuran kuantitatif.

Tabel 2.1 Perbandingan Penelitian Terdahulu

| Penelitian | Pendekatan | Mekanisme | Skala Evaluasi | Evaluasi Kuantitatif |
|------------|-----------|-----------|----------------|----------------------|
| Gorilla [9] | Tool RAG | *Document retriever* + *fine-tuning* | >11.000 API | Akurasi *API call* |
| ToolLLM [10] | Tool RAG | *Neural API retriever* | >16.000 API | Pass rate, win rate |
| Toolshed [11] | Tool RAG | *RAG-Tool Fusion* 3 fase | Katalog *tool* besar | Recall@5 (+46–56%) |
| COLT [12] | Tool RAG | *Graph collaborative learning* | *Benchmark* ToolLens | Completeness metric |
| Dynamic ReAct [14] | *Dynamic loading* | *Search-and-load* MCP | Lingkungan MCP | *Tool loading* (−50%) |
| AutoTool [15] | *Pattern-based* | *Directed graph* inersia | Trajektori agen | Biaya inferensi (−30%) |
| AWS Agent Registry [18] | *Tool Registry* | Metadata + *hybrid search* + IAM | Skala enterprise | — (produk industri) |
| **Penelitian ini** | ***Tool Registry*** *deterministik* | *Metadata multi-kriteria* (modul, *role*, *tier*, *token budget*) pada Pydantic AI | S1–S3 (30/100/300 *tool*) | *Token* (−63–95%), akurasi (+6,3 pp), Wilcoxon p<0,0001, Cohen's d≥11 |

Berdasarkan Tabel 2.1, mayoritas penelitian terdahulu berfokus pada pendekatan *Tool RAG* berbasis *embedding* atau *fine-tuning* yang memerlukan infrastruktur vektor, sedangkan pendekatan berbasis metadata deterministik masih jarang dievaluasi secara kuantitatif. Adopsi industri seperti AWS Agent Registry membuktikan relevansi praktis konsep *Tool Registry*, namun tidak menyertakan pengukuran ilmiah yang dapat direplikasi. Dengan demikian, kebaruan penelitian ini terletak pada penyediaan *baseline* kuantitatif pertama untuk Tool Registry deterministik berbasis metadata multi-kriteria pada kerangka Pydantic AI 1.x, lengkap dengan uji statistik atas penghematan token, akurasi pemilihan *tool*, dan sifat skalabilitas *sub-linear*-nya.

---

**Referensi Bab II**

[1] T. Schick, J. Dwivedi-Yu, R. Dessi, R. Raileanu, M. Lomeli, E. Hambro, L. Zettlemoyer, N. Cancedda, dan T. Scialom, "Toolformer: Language models can teach themselves to use tools," in *Proc. Adv. Neural Inf. Process. Syst. (NeurIPS)*, 2023. arXiv:2302.04761.

[2] S. Yao, J. Zhao, D. Yu, N. Du, I. Shafran, K. Narasimhan, dan Y. Cao, "ReAct: Synergizing reasoning and acting in language models," in *Proc. Int. Conf. Learn. Representations (ICLR)*, 2023. arXiv:2210.03629.

[3] OpenAI, "Function calling and other API updates," *OpenAI Blog*, Jun. 2023. [Online]. Tersedia: https://openai.com/index/function-calling-and-other-api-updates/

[4] Google DeepMind, "Gemini API function calling," *Google AI Developer Documentation*, 2024. [Online]. Tersedia: https://ai.google.dev/gemini-api/docs/function-calling

[5] N.F. Liu, K. Lin, J. Hewitt, A. Paranjape, M. Bevilacqua, F. Petroni, dan P. Liang, "Lost in the middle: How language models use long contexts," *Trans. Assoc. Comput. Linguistics*, vol. 12, pp. 157–173, 2024. arXiv:2307.03172.

[6] T.B. Lee, "Context rot: The emerging challenge that could hold back LLM progress," *Understanding AI* (Newsletter), Nov. 2025. [Online]. Tersedia: https://www.understandingai.org/p/context-rot-the-emerging-challenge

[7] Anonymous, "Context length alone hurts LLM performance despite perfect retrieval," arXiv:2510.05381, 2025.

[8] P. Rajasekaran, E. Dixon, C. Ryan, dan J. Hadfield, "Effective context engineering for AI agents," *Anthropic Engineering Blog*, Sep. 2025.

[9] S.G. Patil, T. Zhang, X. Wang, dan J.E. Gonzalez, "Gorilla: Large language model connected with massive APIs," in *Proc. Adv. Neural Inf. Process. Syst. (NeurIPS)*, 2024. arXiv:2305.15334.

[10] Y. Qin et al., "ToolLLM: Facilitating large language models to master 16000+ real-world APIs," in *Proc. Int. Conf. Learn. Representations (ICLR)*, 2024. arXiv:2307.16789.

[11] E. Lumer, "Toolshed: Scale tool-equipped agents with advanced RAG-tool fusion and tool knowledge bases," arXiv:2410.14594, 2024.

[12] Y. Qu et al., "Towards completeness-oriented tool retrieval for large language models," in *Proc. ACM Int. Conf. Inf. Knowl. Manag. (CIKM)*, 2024. arXiv:2405.16089.

[13] S.G. Patil et al., "The Berkeley function calling leaderboard (BFCL): From tool use to agentic evaluation of large language models," in *Proc. Int. Conf. Mach. Learn. (ICML)*, 2025.

[14] N. Gaurav, A. Akarsh, A. Ranjan, dan M. Bajaj, "Dynamic ReAct: Scalable tool selection for large-scale MCP environments," arXiv:2509.20386, 2025.

[15] J. Jia dan Q. Li, "AutoTool: Efficient tool selection for large language model agents," in *Proc. AAAI Conf. Artif. Intell. (AAAI)*, 2026. arXiv:2511.14650.

[16] Anonymous, "ScaleMCP: Dynamic and auto-synchronizing model context protocol tools for LLM agents," arXiv:2505.06416, 2025.

[17] W. Wang, P. Niu, Z. Xu, et al., "MCP-Flow: Facilitating LLM agents to master real-world, diverse and scaling MCP tools," in *Proc. Assoc. Comput. Linguistics (ACL)*, 2026. arXiv:2510.24284.

[18] P. CN, "Build scalable AI agent systems using Amazon Bedrock agent registry," *AWS Machine Learning Blog*, Apr. 2026.

[19] TrueFoundry, "What is AI agent registry — A complete guide," *TrueFoundry Blog*, Sep. 2025. [Online]. Tersedia: https://www.truefoundry.com/blog/ai-agent-registry

[20] I. Kolchinsky, "Tool RAG: The next breakthrough in scalable AI agents," *Red Hat Emerging Technologies Blog*, Nov. 2025.

[21] Pydantic, "Pydantic AI — Toolsets," *Pydantic AI Documentation*, 2025. [Online]. Tersedia: https://ai.pydantic.dev/

[22] A.R. Hevner, S.T. March, J. Park, dan S. Ram, "Design science in information systems research," *MIS Quarterly*, vol. 28, no. 1, pp. 75–105, Mar. 2004.

[23] C. Richardson, "Pattern: API gateway / Backends for frontends," *microservices.io*, 2014–2025. [Online]. Tersedia: https://microservices.io/patterns/apigateway.html
