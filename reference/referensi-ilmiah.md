# Referensi Ilmiah — Tool Registry, Tool RAG, dan LLM Tool-Calling

Dokumen ini berisi referensi akademik dan artikel web yang relevan untuk Tugas Akhir:
**"Implementasi dan Evaluasi Tool Registry untuk Skalabilitas AI Agent Multi-Modul pada Platform ERP Restoran zerlo.id"**

Disusun: 25 Mei 2026  
Topik: Tool RAG | Tool Registry | LLM Function Calling | Context Engineering

---

## 1. Tool RAG — Vector-Based Tool Retrieval

### Gorilla: Large Language Model Connected with Massive APIs
- **Penulis**: Shishir G. Patil, Tianjun Zhang, Xin Wang, Joseph E. Gonzalez
- **Tahun**: 2023 (arXiv Mei 2023, NeurIPS 2024)
- **Venue/URL**: arXiv:2305.15334 — https://arxiv.org/abs/2305.15334
- **Relevansi**: Merupakan paper foundational untuk Tool RAG — membuktikan bahwa LLM tidak dapat memilih API secara akurat dari katalog besar tanpa mekanisme retrieval. Teknik Retriever-Aware Training (RAT) yang diperkenalkan adalah cikal bakal pendekatan Tool Registry berbasis vektor.
- **Ringkasan**: Gorilla adalah model berbasis LLaMA yang di-fine-tune untuk menulis API calls secara akurat dari katalog berisi lebih dari 11.000 instruction-API pairs. Paper ini membuktikan bahwa GPT-4 sering berhalusinasi nama dan argumen API ketika diberikan katalog besar. Dengan menggabungkan document retriever, Gorilla mampu beradaptasi terhadap perubahan dokumentasi API secara real-time. Ini adalah motivasi langsung untuk Tool Registry: jangan expose semua tools ke LLM, retrieval dulu. Selain itu, paper ini melahirkan Berkeley Function Calling Leaderboard (BFCL) yang menjadi standar evaluasi tool-calling.

### ToolLLM: Facilitating Large Language Models to Master 16000+ Real-world APIs
- **Penulis**: Yujia Qin et al. (19 penulis, OpenBMB / Tsinghua University)
- **Tahun**: 2023 (arXiv Juli 2023, ICLR 2024 Spotlight)
- **Venue/URL**: arXiv:2307.16789 — https://arxiv.org/abs/2307.16789
- **Relevansi**: Membuktikan bahwa open-source LLM dapat di-augmentasi dengan neural API retriever untuk menangani 16.000+ API nyata — skala jauh melebihi apa yang dapat di-load ke context window sekaligus. Neural retriever-nya adalah implementasi praktis prinsip Tool RAG yang menjadi landasan untuk Tool Registry berbasis embedding.
- **Ringkasan**: ToolLLM memperkenalkan framework lengkap: ToolBench (dataset instruksi untuk 16.000+ API dari RapidAPI), ToolEval (evaluator otomatis), dan ToolLLaMA (LLaMA yang di-fine-tune dengan neural API retriever). Paper membuktikan bahwa tanpa retriever, performa tool selection turun drastis pada skala ribuan tools. ToolLLaMA mampu menggeneralisasi ke API yang belum pernah dilihat (zero-shot generalization). Hasil ini secara langsung mendukung argumen bahwa Tool Registry dengan filtering berbasis vektor adalah kebutuhan engineering yang valid, bukan sekadar optimasi.

### Toolshed: Scale Tool-Equipped Agents with Advanced RAG-Tool Fusion and Tool Knowledge Bases
- **Penulis**: Elias Lumer (PricewaterhouseCoopers)
- **Tahun**: 2024 (arXiv Oktober 2024)
- **Venue/URL**: arXiv:2410.14594 — https://arxiv.org/abs/2410.14594
- **Relevansi**: Paper paling langsung relevan dengan implementasi Tool Registry thesis ini. Toolshed memperkenalkan konsep Tool Knowledge Base (vector database khusus tools) dan Advanced RAG-Tool Fusion — tiga fase retrieval (pre, intra, post) tanpa fine-tuning model. Arsitektur ini analog dengan Tool Registry yang diimplementasikan di zerlo.id.
- **Ringkasan**: Toolshed mengatasi keterbatasan agent yang tidak bisa menangani tool catalog lebih besar dari API limits model. Dengan menyimpan representasi tool yang di-enrich di knowledge base vektor dan menerapkan query planning + self-reflection, Toolshed mencapai peningkatan 46–56% pada benchmark Recall@5 dibandingkan baseline. Penelitian ini tidak memerlukan fine-tuning apapun, hanya retrieval engineering yang cerdas — prinsip yang sama dengan Tool Registry di zerlo.id.

### COLT: Towards Completeness-Oriented Tool Retrieval for Large Language Models
- **Penulis**: Tim peneliti dari Renmin University of China
- **Tahun**: 2024 (arXiv Mei 2024, CIKM 2024)
- **Venue/URL**: arXiv:2405.16089 — https://arxiv.org/abs/2405.16089
- **Relevansi**: COLT mengidentifikasi kelemahan pendekatan tool retrieval berbasis semantic similarity murni — cenderung mengambil tools yang redundan/mirip daripada complementary. Ini relevan untuk desain Tool Registry yang perlu mengoptimalkan keragaman tools yang dipilih, bukan hanya relevansi individual.
- **Ringkasan**: COLT menggunakan framework dual-view graph collaborative learning dengan tiga bipartite graph (query-scene-tool) untuk menangkap hubungan kolaboratif antar tools, bukan hanya kesamaan semantik dengan query. Hasilnya, BERT-mini (11M parameter) yang dilatih dengan COLT mengalahkan BERT-large (340M parameter) pada ToolLens benchmark. Ini membuktikan bahwa kualitas retrieval lebih ditentukan oleh strategi retrieval daripada ukuran model — argumen kuat untuk investasi pada Tool Registry engineering.

### The Berkeley Function Calling Leaderboard (BFCL): From Tool Use to Agentic Evaluation
- **Penulis**: Shishir G. Patil et al. (UC Berkeley Gorilla project)
- **Tahun**: 2024–2025 (ICML 2025)
- **Venue/URL**: https://gorilla.cs.berkeley.edu/leaderboard.html — Proceedings ICML 2025: https://proceedings.mlr.press/v267/patil25a.html
- **Relevansi**: BFCL adalah benchmark standar industri untuk mengevaluasi function calling LLM. Methodology evaluasi thesis ini (accuracy metric, tool selection correctness) mengikuti pendekatan serupa dengan BFCL — menggunakan AST matching untuk menilai apakah LLM memilih tool yang tepat dengan argumen yang valid.
- **Ringkasan**: BFCL V4 mengevaluasi kemampuan tool-calling LLM secara holistic melalui single-turn calls, hallucination detection, format sensitivity, dan multi-turn interactions. Dataset mencakup ~2.000 question-function-answer pairs dari enterprise real-world (bank, korporasi, open-source). Temuan utama: LLM terkini unggul di single-turn calls, namun memory, dynamic decision-making, dan long-horizon reasoning masih terbuka sebagai tantangan. BFCL V2 (Agustus 2024) menambah live dataset dari kontribusi pengguna.

---

## 2. Tool Registry & Tool Management

### Dynamic ReAct: Scalable Tool Selection for Large-Scale MCP Environments
- **Penulis**: Nishant Gaurav, Adit Akarsh, Ankit Ranjan, Manoj Bajaj
- **Tahun**: 2025 (arXiv September 2025)
- **Venue/URL**: arXiv:2509.20386 — https://arxiv.org/abs/2509.20386
- **Relevansi**: Paper paling langsung memvalidasi pendekatan Tool Registry thesis ini. Dynamic ReAct mengatasi masalah yang persis sama — konteks LLM yang terbatas tidak mampu menampung ratusan/ribuan tools MCP — dan membuktikan bahwa dynamic tool loading mengurangi tool loading hingga 50% sambil mempertahankan task completion accuracy.
- **Ringkasan**: Penelitian ini mengusulkan dan mengevaluasi lima arsitektur yang secara progresif menyempurnakan proses tool selection untuk agent ReAct dalam lingkungan MCP berskala besar. Pendekatan search-and-load yang diusulkan mencapai intelligent tool selection dengan minimal computational overhead. Hasilnya sejajar langsung dengan hasil thesis ini di mana Tool Registry mengurangi visible tools dari 300 ke 15 (−95%) sambil mempertahankan atau meningkatkan akurasi.

### AutoTool: Efficient Tool Selection for Large Language Model Agents
- **Penulis**: Jingyi Jia, Qinbin Li (Huazhong University of Science and Technology)
- **Tahun**: 2025 (arXiv November 2025, AAAI 2026)
- **Venue/URL**: arXiv:2511.14650 — https://arxiv.org/abs/2511.14650
- **Relevansi**: AutoTool memperkenalkan konsep "tool usage inertia" — bahwa tool calls mengikuti pola sekuensial yang dapat diprediksi. Ini memberikan justifikasi teoritis tambahan untuk desain Tool Registry berbasis metadata: jika tool calls berpola, maka filtering berbasis modul/role/subscription seperti di zerlo.id sudah mengkaptur sebagian besar inertia tersebut.
- **Ringkasan**: AutoTool adalah framework berbasis directed graph yang mengeksploitasi inertia penggunaan tools — kecenderungan tool invocation mengikuti pola sekuensial yang dapat diprediksi. Graph dibangun dari historical agent trajectories, di mana node adalah tools dan edge adalah transition probabilities. AutoTool mengurangi inference cost hingga 30% sambil mempertahankan task completion rate yang kompetitif. Paper ini diterima di AAAI 2026, membuktikan relevansi topik untuk komunitas AI mainstream.

### ScaleMCP: Dynamic and Auto-Synchronizing Model Context Protocol Tools for LLM Agents
- **Penulis**: Tim peneliti (afiliasi tidak spesifik dalam hasil pencarian)
- **Tahun**: 2025 (arXiv Mei 2025)
- **Venue/URL**: arXiv:2505.06416 — https://arxiv.org/abs/2505.06416
- **Relevansi**: ScaleMCP secara langsung mengatasi masalah yang dihadapi zerlo.id: tool repository yang terus berkembang (zerlo.id punya 1.176 endpoints, 60+ production tools) yang tidak mungkin di-load seluruhnya ke context. Embedding strategy TDWA yang diusulkan (Tool Document Weighted Average) relevan untuk penelitian lanjutan di zerlo.id.
- **Ringkasan**: ScaleMCP menggunakan MCP server sebagai single source of truth dan memungkinkan LLM agent untuk secara otonom menambah tools ke memory-nya sendiri. Sistem auto-sinkronisasi menggunakan CRUD operations memastikan tool catalog selalu up-to-date tanpa manual updates. Evaluasi pada 5.000 financial metric MCP servers menunjukkan peningkatan substansial dalam tool retrieval dan agent invocation performance. Ini adalah visi jangka panjang untuk evolusi Tool Registry di zerlo.id.

### MCP-Flow: Facilitating LLM Agents to Master Real-World, Diverse and Scaling MCP Tools
- **Penulis**: Wenhao Wang, Peizhi Niu, Zhao Xu, et al. (TikTok, SJTU, Zhejiang University, UIUC)
- **Tahun**: 2025 (arXiv Oktober 2025, ACL 2026)
- **Venue/URL**: arXiv:2510.24284 — https://arxiv.org/abs/2510.24284
- **Relevansi**: MCP-Flow menunjukkan skala masalah yang dihadapi thesis ini di level industri: 1.166 MCP servers dengan 11.536 tools membutuhkan automated discovery dan intelligent selection. Penerimaan di ACL 2026 memvalidasi urgensi penelitian tool scaling sebagai area riset aktif.
- **Ringkasan**: MCP-Flow adalah automated web-agent-driven pipeline untuk large-scale server discovery, data synthesis, dan model training. Dataset yang dihasilkan mencakup 68.733 high-quality instruction-function call pairs dan 6.439 trajectories dari 1.166 server dan 11.536 tools — jauh melampaui skala penelitian sebelumnya. Penelitian ini membuktikan bahwa scaling tool catalog ke ribuan tools adalah tantangan nyata industri, bukan hanya skenario hipotetis.

### AWS Agent Registry: The Future of Managing Agents at Scale
- **Penulis**: Preethi CN (AWS Blog)
- **Tahun**: 2026 (April 2026)
- **Venue/URL**: https://aws.amazon.com/blogs/machine-learning/the-future-of-managing-agents-at-scale-aws-agent-registry-now-in-preview/
- **Relevansi**: AWS Agent Registry adalah bukti adopsi industri (tier hyperscaler) terhadap konsep Agent/Tool Registry. Fitur-fiturnya — metadata management, IAM-based access control, lifecycle tracking, hybrid semantic search — mencerminkan prinsip yang sama dengan Tool Registry di thesis ini, namun di skala enterprise cloud global.
- **Ringkasan**: AWS Agent Registry (preview, April 2026) adalah platform terpusat untuk discovering, sharing, dan reusing AI agents, tools, dan agent skills di seluruh enterprise. Menggunakan hybrid search (keyword + semantic) untuk menemukan capabilities yang relevan, dengan governance berbasis IAM policies. Approval workflow (draft → pending → approved) dan lifecycle tracking menunjukkan bahwa tool management telah menjadi infrastructure concern di tingkat enterprise, bukan sekadar research prototype.

### What is AI Agent Registry — A Complete Guide
- **Penulis**: TrueFoundry (platform MLOps)
- **Tahun**: 2025 (diperbarui September 2025)
- **Venue/URL**: https://www.truefoundry.com/blog/ai-agent-registry
- **Relevansi**: Dokumen industri ini mendefinisikan enam fungsi inti Agent Registry (Registration, Discovery, Metadata Management, Health Monitoring, Access Control, Audit Logging) yang memberikan framework konseptual untuk mengevaluasi kelengkapan implementasi Tool Registry di zerlo.id.
- **Ringkasan**: TrueFoundry mendefinisikan AI Agent Registry sebagai "centralized or federated catalog of running agents and their metadata." Enam fungsi inti yang diidentifikasi mencakup: automated discovery via capability/tag queries, role-based access policies, health monitoring via heartbeats, dan complete audit logging. Adopsi standar emerging seperti Agent2Agent (A2A) dan Model Context Protocol (MCP) menjadi enabler interoperabilitas. Ini mengkontekstualisasikan Tool Registry di zerlo.id sebagai bagian dari tren industri yang lebih luas.

---

## 3. LLM Tool-Calling & Function Calling

### Toolformer: Language Models Can Teach Themselves to Use Tools
- **Penulis**: Timo Schick, Jane Dwivedi-Yu, Roberto Dessi, Roberta Raileanu, Maria Lomeli, Eric Hambro, Luke Zettlemoyer, Nicola Cancedda, Thomas Scialom (Meta AI)
- **Tahun**: 2023 (arXiv Februari 2023, NeurIPS 2023)
- **Venue/URL**: arXiv:2302.04761 — https://arxiv.org/abs/2302.04761 | NeurIPS 2023: https://proceedings.neurips.cc/paper_files/paper/2023/hash/d842425e4bf79ba039352da0f658a906-Abstract-Conference.html
- **Relevansi**: Paper foundational yang membuktikan LLM dapat belajar memanggil tools (calculator, search engine, calendar, translation API) secara self-supervised dari sedikit demonstrations. Ini adalah "proof of concept" bahwa LLM secara natural dapat di-augmentasi dengan external tools — premis dasar yang membuat penelitian Tool Registry relevan.
- **Ringkasan**: Toolformer melatih LLM untuk memutuskan API mana yang dipanggil, kapan memanggilnya, argumen apa yang diberikan, dan bagaimana mengintegrasikan hasilnya ke prediksi token berikutnya — semuanya secara self-supervised tanpa human annotation masif. Model ini mengatasi keterbatasan fundamental LLM dalam aritmetika dan factual lookup. Toolformer menunjukkan bahwa kemampuan tool use dapat di-inject ke LLM dengan overhead training minimal, yang memotivasi investasi pada infrastruktur tool management seperti Tool Registry.

### ReAct: Synergizing Reasoning and Acting in Language Models
- **Penulis**: Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao (Google / Princeton)
- **Tahun**: 2023 (arXiv Oktober 2022, ICLR 2023)
- **Venue/URL**: arXiv:2210.03629 — https://arxiv.org/abs/2210.03629
- **Relevansi**: ReAct adalah framework agent paling berpengaruh yang menginterleave reasoning traces dengan tool actions. Implementasi AI agent di zerlo.id (berbasis Pydantic AI) mengikuti paradigma ReAct — agent berpikir (Thought), bertindak memanggil tool (Action), mengamati hasil (Observation), lalu iterasi. Tool Registry bekerja di layer sebelum Action: memfilter tools yang tersedia sebelum LLM memilih.
- **Ringkasan**: ReAct menggabungkan chain-of-thought reasoning dengan tool use dalam interleaved manner, memungkinkan model untuk menginduktif, melacak, dan memperbarui rencana aksi sambil berinteraksi dengan lingkungan eksternal (knowledge bases, APIs). Pada benchmark ALFWorld dan WebShop, ReAct mengungguli imitation learning dan reinforcement learning dengan margin absolut 34% dan 10% masing-masing. Paper ini menjadi referensi standar untuk arsitektur AI agent modern.

### OpenAI Function Calling API
- **Penulis**: OpenAI
- **Tahun**: 2023 (diumumkan Juni 2023)
- **Venue/URL**: https://openai.com/index/function-calling-and-other-api-updates/
- **Relevansi**: Pengumuman resmi OpenAI yang menjadikan function calling sebagai fitur production-ready LLM pertama kali. Ini adalah titik infleksi industri yang memvalidasi tool use sebagai kapabilitas inti LLM dan membuka jalan untuk penelitian Tool Registry. Google Gemini (backend thesis ini) mengadopsi mekanisme serupa sebagai native function calling.
- **Ringkasan**: Pada Juni 2023, OpenAI merilis function calling untuk gpt-4-0613 dan gpt-3.5-turbo-0613 — memungkinkan developer mendefinisikan functions dan memiliki model menghasilkan JSON terstruktur berisi argumen untuk memanggil functions tersebut. Model di-fine-tune untuk mendeteksi kapan function perlu dipanggil berdasarkan input pengguna dan menghasilkan JSON yang sesuai dengan function signature. Ini mendefinisikan standar de facto untuk LLM tool calling yang diadopsi oleh Anthropic, Google, dan vendor lain.

### Google Gemini Native Function Calling (Google Gen AI SDK)
- **Penulis**: Google DeepMind / Google
- **Tahun**: 2024–2025
- **Venue/URL**: https://ai.google.dev/gemini-api/docs/function-calling
- **Relevansi**: Thesis ini menggunakan Google Gen AI SDK dengan Gemini 2.5 Flash Lite sebagai backend. Pemahaman tentang mekanisme native function calling Gemini — bagaimana tools didefinisikan, di-pass ke model, dan dipilih — adalah fondasi teknis langsung untuk implementasi Tool Registry yang dievaluasi.
- **Ringkasan**: Gemini mendukung native function calling di mana developer mendefinisikan tool schemas sebagai JSON Schema yang di-pass ke model sebelum inference. Model memutuskan tool mana yang dipanggil berdasarkan konteks percakapan dan tool definitions yang tersedia. Pada eksperimen thesis ini (Gemini Native v2, n=558), mekanisme ini digunakan untuk mengukur efek Tool Registry terhadap token usage dan accuracy — dengan Registry memfilter tools sebelum dikirim ke Gemini, menghasilkan pengurangan token 63–95% lintas skenario.

---

## 4. Context Engineering & Context Rot

### Lost in the Middle: How Language Models Use Long Contexts
- **Penulis**: Nelson F. Liu, Kevin Lin, John Hewitt, Ashwin Paranjape, Michele Bevilacqua, Fabio Petroni, Percy Liang (Stanford / Meta AI)
- **Tahun**: 2024 (arXiv Juli 2023, TACL 2024)
- **Venue/URL**: arXiv:2307.03172 — https://arxiv.org/abs/2307.03172 | TACL Vol. 12: https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630
- **Relevansi**: Paper ini adalah justifikasi teoritis paling kuat untuk keberadaan Tool Registry. Jika LLM mengalami degradasi signifikan ketika informasi relevan berada di tengah context panjang ("lost in the middle"), maka memberikan 300 tool definitions sekaligus ke LLM (seperti S3 baseline di thesis ini: 23.893 tokens) secara inherent menurunkan akurasi tool selection. Tool Registry yang mengurangi visible tools ke 15 (1.239 tokens) menghilangkan masalah ini.
- **Ringkasan**: Penelitian Liu et al. menganalisis performa LLM pada multi-document QA dan key-value retrieval. Mereka menemukan bahwa performa optimal ketika informasi relevan ada di awal atau akhir context, dan turun signifikan ketika informasi berada di tengah context panjang. Efek ini muncul bahkan pada model yang secara eksplisit dirancang untuk long context. Paper ini di-publish di Transactions of the Association for Computational Linguistics (TACL) Vol. 12, pp. 157–173, dan menjadi salah satu paper paling banyak dikutip dalam penelitian context engineering.

### Context Rot: The Emerging Challenge That Could Hold Back LLM Progress
- **Penulis**: Timothy B. Lee (Understanding AI newsletter)
- **Tahun**: 2025 (November 2025)
- **Venue/URL**: https://www.understandingai.org/p/context-rot-the-emerging-challenge
- **Relevansi**: Artikel ini memberikan penjelasan yang accessible tentang mengapa context rot terjadi secara arsitektural (attention mechanism yang scale O(n²)) dan mendokumentasikan penurunan performa empiris: Claude 3.5 Sonnet turun dari 88% ke 30% akurasi ketika context bertambah dari pendek ke 32.000 tokens. Data ini mendukung framing penelitian thesis bahwa pengurangan token adalah kebutuhan fungsional, bukan sekadar optimasi biaya.
- **Ringkasan**: Lee berargumen bahwa meskipun LLM memiliki context window hingga jutaan tokens, performance degradasi sudah terjadi jauh sebelum limit tercapai karena attention mechanism memiliki scaling properties yang buruk — setiap token baru meningkatkan computational demand secara kuadratik. Adobe study yang dikutip menunjukkan Claude 3.5 Sonnet turun dari 88% ke 30% untuk two-hop reasoning ketika context diperpanjang ke 32.000 tokens. Testing lintas 18 frontier models menemukan bahwa setiap model mengalami degradasi seiring panjang context bertambah.

### Effective Context Engineering for AI Agents
- **Penulis**: Prithvi Rajasekaran, Ethan Dixon, Carly Ryan, Jeremy Hadfield (Anthropic Applied AI)
- **Tahun**: 2025 (September 2025)
- **Venue/URL**: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **Relevansi**: Panduan resmi dari Anthropic untuk context engineering AI agents secara langsung mendukung motivasi Tool Registry thesis ini. Anthropic secara eksplisit menyatakan bahwa "bloated tool sets" menyebabkan kegagalan agent dan merekomendasikan minimal, well-designed tool sets — persis prinsip yang diimplementasikan Tool Registry di zerlo.id.
- **Ringkasan**: Paper engineering Anthropic mendefinisikan context engineering sebagai "strategi untuk mengkurasi dan mempertahankan optimal set tokens selama LLM inference." Tiga temuan kunci relevan untuk thesis: (1) seiring jumlah tokens meningkat, kemampuan model untuk recall informasi akurat menurun (context rot); (2) "bloated tool sets" menyebabkan ambiguous decision points dan agent failure; (3) tujuan optimal adalah menemukan "smallest possible set of high-signal tokens." Tool Registry di zerlo.id adalah implementasi langsung dari prinsip ketiga.

### Context Length Alone Hurts LLM Performance Despite Perfect Retrieval
- **Penulis**: Tim peneliti (afiliasi tidak teridentifikasi dari pencarian)
- **Tahun**: 2025 (arXiv Oktober 2025)
- **Venue/URL**: arXiv:2510.05381 — https://arxiv.org/abs/2510.05381
- **Relevansi**: Paper ini memberikan bukti tambahan bahwa panjang context itu sendiri (bukan hanya kualitas retrieval) menurunkan performa LLM — memperkuat argumen bahwa Tool Registry yang memperpendek context adalah intervensi yang valid secara ilmiah.
- **Ringkasan**: Penelitian ini memisahkan efek panjang context dari kualitas retrieval dengan mengendalikan perfect retrieval (informasi relevan selalu ada) dan hanya memvariasikan total panjang context. Hasilnya menunjukkan degradasi performa yang signifikan semata-mata karena context lebih panjang, bahkan ketika semua informasi relevan tersedia. Ini membantah argumen bahwa "context window yang besar sudah cukup" dan mendukung pendekatan Tool Registry yang secara aktif mempersingkat context.

---

## 5. Artikel Web & Blog

### Tool RAG: The Next Breakthrough in Scalable AI Agents
- **Penulis**: Ilya Kolchinsky (Red Hat)
- **Tahun**: 2025 (November 2025)
- **Venue/URL**: https://next.redhat.com/2025/11/26/tool-rag-the-next-breakthrough-in-scalable-ai-agents/
- **Relevansi**: Artikel industri dari Red Hat yang secara independen sampai pada kesimpulan yang sama dengan thesis ini: pemberian semua tools ke LLM sekaligus menurunkan akurasi secara drastis, dan solusinya adalah Tool RAG. Artikel menyebut bahwa "intelligent tool retrieval can triple tool invocation accuracy while reducing prompt length in half" — temuan yang selaras dengan hasil eksperimen thesis (akurasi meningkat 6.3pp, prompt berkurang 63–95%).
- **Ringkasan**: Kolchinsky mengidentifikasi masalah inti Tool RAG: "context overload leads to incorrect tool selection, failed actions, and hallucinations" ketika LLM diberi ratusan atau ribuan tools. Solusi Tool RAG menerapkan prinsip RAG klasik ke tool selection. Tantangan yang diidentifikasi mencakup retrieval quality, tool compatibility, safety/permission controls, dan multi-step reasoning. Red Hat berencana mengembangkan production-grade Tool RAG solution — ini memvalidasi thesis bahwa ini adalah kebutuhan engineering nyata, bukan hanya eksperimen akademis.

### Context Rot: Why LLMs Degrade as Context Grows
- **Penulis**: Morph (platform AI)
- **Tahun**: 2025
- **Venue/URL**: https://www.morphllm.com/context-rot
- **Relevansi**: Dokumen industri yang mendokumentasikan 10–25% accuracy degradation untuk informasi di tengah context — data empiris yang memperkuat justifikasi Tool Registry.
- **Ringkasan**: Dokumen ini mendeskripsikan context rot sebagai "degradasi kualitas output LLM yang terjadi seiring input context bertambah panjang, bahkan ketika context window belum penuh." Testing lintas multiple models menunjukkan 10–25% accuracy degradation untuk informasi di tengah context window. Model dengan context window 200K tokens mulai menunjukkan measurable quality loss sekitar 130K tokens. Untuk AI agents yang mengakumulasi context selama multi-turn interactions, context rot bersifat kumulatif dan memerlukan solusi struktural seperti Tool Registry.

### Microservices Service Registry and API Gateway — Foundational Patterns
- **Penulis**: Chris Richardson (microservices.io)
- **Tahun**: Ongoing (2014–sekarang, diperbarui berkala)
- **Venue/URL**: https://microservices.io/patterns/apigateway.html
- **Relevansi**: Tool Registry yang diimplementasikan di zerlo.id terinspirasi dari pola arsitektur microservices: service registry (Consul, etcd) dan API gateway sebagai single entry point yang merutekan requests ke services yang tepat. Pola ini memberikan preseden software engineering yang matang untuk konsep Tool Registry.
- **Ringkasan**: Pola API Gateway / Backends for Frontends mendefinisikan single entry point untuk client requests yang merutekan ke backend services yang tepat, mengagregasi hasil, dan mengelola autentikasi. Service registry menyimpan metadata service (lokasi, kapabilitas, status health) untuk enable service discovery. Tool Registry di zerlo.id mengadaptasi pola ini ke domain AI agents: LLM agent adalah "client", tools adalah "services", dan Tool Registry adalah kombinasi service registry + API gateway yang memfilter tools berdasarkan metadata (modul, role, subscription tier, token budget).

---

## 6. Ringkasan Relevansi untuk Thesis

Tabel berikut memetakan setiap referensi ke bagian thesis yang didukungnya:

| # | Referensi | Bab 2 (Tinjauan Pustaka) | Bab 3 (Metodologi) | Bab 4 (Hasil) | Bab 5 (Kesimpulan/Future Work) |
|---|-----------|:------------------------:|:-------------------:|:-------------:|:------------------------------:|
| 1 | Gorilla (Patil et al., 2023) | ✓ Tool RAG foundations | | ✓ Benchmark comparison | |
| 2 | ToolLLM/ToolBench (Qin et al., 2023) | ✓ Tool RAG at scale | ✓ Dataset design | ✓ Scale validation | |
| 3 | Toolshed (Lumer, 2024) | ✓ RAG-Tool Fusion | ✓ Registry architecture | ✓ Direct comparison | ✓ Extension ideas |
| 4 | COLT (2024) | ✓ Retrieval diversity | | | ✓ Future: diverse retrieval |
| 5 | BFCL (Patil et al., 2025) | ✓ Evaluation standard | ✓ Accuracy metric design | ✓ Methodology validation | |
| 6 | Dynamic ReAct (Gaurav et al., 2025) | ✓ MCP tool scaling | ✓ Architecture comparison | ✓ Results validation | ✓ MCP integration |
| 7 | AutoTool (Jia & Li, 2025) | ✓ Tool inertia concept | | ✓ Cost reduction | ✓ Graph-based extension |
| 8 | ScaleMCP (2025) | ✓ Auto-sync registry | | | ✓ Future: live sync |
| 9 | MCP-Flow (Wang et al., 2025) | ✓ Industry-scale tools | | | ✓ Future: larger catalog |
| 10 | AWS Agent Registry (2026) | ✓ Industry adoption | | | ✓ Enterprise direction |
| 11 | TrueFoundry Agent Registry Guide | ✓ Registry definition | ✓ Feature completeness | | |
| 12 | Toolformer (Schick et al., 2023) | ✓ Tool use foundations | | | |
| 13 | ReAct (Yao et al., 2023) | ✓ Agent architecture | ✓ Agent framework | | |
| 14 | OpenAI Function Calling (2023) | ✓ Industry standard | ✓ Gemini comparison | | |
| 15 | Google Gemini Function Calling | ✓ Backend reference | ✓ Technical foundation | ✓ Backend validation | |
| 16 | Lost in the Middle (Liu et al., 2024) | ✓ Context degradation | ✓ Motivates filtering | ✓ Explains accuracy gap | |
| 17 | Context Rot (Lee, 2025) | ✓ Architecture limits | ✓ Problem framing | ✓ Token reduction rationale | |
| 18 | Anthropic Context Engineering (2025) | ✓ Tool set discipline | ✓ Design principles | ✓ Industry validation | ✓ Best practices |
| 19 | Context Length Hurts LLM (2025) | ✓ Empirical evidence | | ✓ Supports results | |
| 20 | Tool RAG Blog — Red Hat (2025) | ✓ Industry framing | | ✓ Cross-validation | ✓ Production roadmap |
| 21 | Microservices Service Registry Pattern | ✓ Software engineering analogy | ✓ Architecture inspiration | | |

### Prioritas Pengutipan untuk Bab 2

Referensi berikut wajib dikutip untuk mendukung argumen utama:

1. **Motivasi Tool Registry** (context rot + degradasi akurasi): Liu et al. 2024, Anthropic 2025, Lee 2025
2. **Tool RAG sebagai solusi**: Patil et al. 2023 (Gorilla), Qin et al. 2023 (ToolLLM), Lumer 2024 (Toolshed)
3. **Fondasi arsitektur agent**: Yao et al. 2023 (ReAct), Schick et al. 2023 (Toolformer)
4. **Validasi industry**: Red Hat 2025, AWS 2026, OpenAI 2023, Dynamic ReAct 2025

---

*Catatan metodologi*: Semua detail paper (judul, penulis, tahun, venue, arXiv ID) diverifikasi dari arXiv, Semantic Scholar, atau halaman resmi konferensi. Referensi yang bersumber dari blog industri (Red Hat, AWS, Anthropic, TrueFoundry) ditandai jelas sebagai artikel web/blog, bukan paper peer-reviewed. Artikel web digunakan sebagai bukti adopsi industri dan praktisi, bukan sebagai klaim ilmiah utama.
