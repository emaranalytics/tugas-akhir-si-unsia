# BAB III
# IMPLEMENTASI METODE USULAN

Bab ini menguraikan rancangan dan implementasi artefak Tool Registry beserta kerangka evaluasinya, mengikuti tahap *design and development* pada kerangka *Design Science Research* [15]. Pembahasan dimulai dari analisis sistem eksisting zerlo.id sebagai sumber masalah, dilanjutkan dengan perancangan struktur metadata dan *pipeline* penyaringan, perancangan kerangka evaluasi, lalu penelusuran kode (*code walkthrough*) atas implementasi Tool Registry dan *eval runner*, dan ditutup dengan konfigurasi eksperimen yang dikendalikan.


## 3.1 Analisis Sistem Eksisting

Platform zerlo.id pada tahap *beta testing* mengoperasikan 38 modul bisnis dengan 1.176 *endpoint*, 11 AI Agent aktif, dan lebih dari 60 *tools* produksi. Setiap *tool* didaftarkan ke agen secara statis melalui dekorator *native* Pydantic AI, sebagaimana pola `@agent.tool` yang mendaftarkan seluruh fungsi ke dalam satu himpunan *tool* tunggal. Pada pola tersebut, seluruh definisi *tool* — nama, deskripsi, dan skema parameter — diserialisasi menjadi *FunctionDeclaration* dan diteruskan ke LLM pada setiap panggilan, tanpa memandang relevansinya terhadap permintaan pengguna.

Pendekatan statis ini menimbulkan *bottleneck* yang bersifat O(N) terhadap ukuran katalog: jumlah token input tumbuh proporsional terhadap jumlah *tool* yang terdaftar. Pengukuran awal pada penelitian ini menunjukkan bahwa katalog 300 *tool* (skenario S3) mengonsumsi rata-rata 23.893 token per kueri hanya untuk mendefinisikan *tool* yang tersedia, bahkan sebelum pertanyaan pengguna diproses. Konsumsi token sebesar ini berdampak langsung pada biaya inferensi, latensi respons, dan — sebagaimana dibuktikan oleh fenomena *context rot* yang diuraikan pada Bab II — penurunan akurasi pemilihan *tool* akibat sebagian definisi berada di posisi tengah konteks yang rawan diabaikan.

Kerangka Pydantic AI [23] menyediakan abstraksi `FilteredToolset` yang memungkinkan penyaringan *tool* berdasarkan sebuah predikat tunggal. Namun antarmuka tersebut tidak dirancang untuk penyaringan multi-kriteria yang dibutuhkan platform ERP multi-modul, yakni penyaringan simultan berdasarkan modul, peran (*role*), tingkat langganan (*subscription tier*), dan anggaran token (*token budget*). Kesenjangan antara kemampuan predikat tunggal dan kebutuhan penyaringan multi-kriteria inilah yang menjadi motivasi perancangan artefak Tool Registry pada penelitian ini.


## 3.2 Perancangan Tool Registry

Artefak utama yang dirancang adalah lapisan penyaringan deterministik berbasis metadata terstruktur yang ditempatkan di antara katalog *tool* dan LLM. Rancangan ini mengadaptasi prinsip *smallest possible set of high-signal tokens* dari rekayasa konteks Anthropic [7], yakni meneruskan hanya himpunan *tool* paling relevan dan sekecil mungkin kepada model.

Setiap *tool* direpresentasikan oleh skema metadata terstruktur yang menyimpan atribut penyaringan. Atribut-atribut tersebut dirangkum pada Tabel 3.1.

Tabel 3.1 Atribut Metadata Tool

| Atribut | Tipe | Fungsi dalam Penyaringan |
|---------|------|--------------------------|
| `name` | *string* | Pengenal unik *tool* yang dipanggil LLM |
| `module` | *string* | Modul pemilik *tool*; difilter terhadap modul kueri |
| `op_type` | *string* | Tipe operasi (*read*, *analytical*, *write*, *admin*) |
| `roles` | *list* | Peran yang diizinkan; difilter terhadap peran kueri |
| `tiers` | *list* | Tingkat langganan yang diizinkan; difilter terhadap tier kueri |
| `keywords` | *list* | Kata kunci untuk skoring relevansi terhadap teks kueri |
| `priority` | *int* | Bobot prioritas untuk pengurutan saat skor kata kunci seri |
| `schema_tokens` | *int* | Estimasi biaya token skema *tool* untuk perhitungan anggaran |
| `intent` | *string* | Deskripsi *docstring* singkat: fungsi dan kapan *tool* dipakai |

Proses penyaringan dirancang sebagai *pipeline* lima tahap berurutan. Tiga tahap pertama bersifat *hard filter* yang menggugurkan *tool* tidak memenuhi syarat (modul, peran, dan tier), sedangkan dua tahap terakhir melakukan skoring relevansi dan pembatasan jumlah keluaran. Arsitektur lengkap *pipeline* tersebut, mulai dari permintaan pengguna hingga keluaran *tool* yang dipanggil LLM, diilustrasikan pada Gambar 3.1.

![Arsitektur Tool Registry](assets/diagrams/arsitektur-tool-registry.png)

Gambar 3.1 Arsitektur Pipeline Penyaringan Tool Registry

Sebagaimana ditunjukkan pada Gambar 3.1, katalog `ToolMeta` disaring secara berurutan terhadap konteks kueri, lalu sisa kandidat diurutkan berdasarkan tumpang-tindih kata kunci, prioritas, dan *hash* stabil sebagai pemecah seri yang deterministik. Hasil akhir dibatasi oleh *budget cap* sebesar 15 *tool* sebelum diserialisasi menjadi *FunctionDeclaration*. Dengan demikian, jumlah *tool* yang terlihat oleh LLM bersifat konstan (O(1) terhadap anggaran) meskipun ukuran katalog bertambah — properti yang menjadi dasar pengujian skalabilitas *sub-linear* pada Bab IV.


## 3.3 Perancangan Eval Framework

Untuk mengukur dampak Tool Registry secara kuantitatif, dirancang kerangka evaluasi yang membandingkan dua mode pada katalog identik: mode *baseline* yang meneruskan seluruh *tool* katalog ke LLM, dan mode *registry* yang menerapkan *pipeline* penyaringan terlebih dahulu. Perbandingan berpasangan ini memastikan bahwa selisih metrik yang teramati murni disebabkan oleh perlakuan penyaringan, bukan oleh perbedaan kueri atau katalog.

Evaluasi dijalankan pada empat skenario katalog dengan ukuran bertingkat untuk menguji perilaku penskalaan. Definisi tiap skenario dirangkum pada Tabel 3.2.

Tabel 3.2 Definisi Skenario Eksperimen

| Skenario | Jumlah Modul | Tool per Modul | Total Tool | Status Eksekusi |
|----------|--------------|----------------|------------|-----------------|
| S1 | 3 | 10 | 30 | *Live* (Gemini) |
| S2 | 5 | 20 | 100 | *Live* (Gemini) |
| S3 | 10 | 30 | 300 | *Live* (Gemini) |
| S4 | 20 | 50 | 1.000 | Simulasi deterministik |

Skenario S1–S3 dijalankan secara *live* terhadap LLM, sedangkan S4 (1.000 *tool*) hanya disimulasikan secara deterministik untuk mengilustrasikan tren penskalaan tanpa membebani kuota inferensi. Dataset evaluasi terdiri dari 100 kueri berbahasa Indonesia yang dirancang menyerupai permintaan operasional restoran nyata, dengan komposisi sebagaimana disajikan pada Tabel 3.3.

Tabel 3.3 Komposisi Dataset 100 Kueri

| Kategori Kueri | Jumlah | Tujuan Pengujian |
|----------------|--------|------------------|
| *Single-domain* | 50 | Pemilihan *tool* pada satu modul tunggal |
| *Cross-domain* | 30 | Disambiguasi antar-dua modul terkait |
| *Adversarial* | 20 | Ketahanan terhadap *prompt injection* dan instruksi menyesatkan |
| **Total** | **100** | — |

Setiap kueri dilengkapi metadata konteks (modul, peran, tier) serta `expected_tool` sebagai *ground truth* untuk penilaian akurasi. Pada *backend* LLM, setiap kueri diulang sebanyak tiga kali (*repeat runs*) per skenario guna menangkap variabilitas keluaran model. Alur kerja kerangka evaluasi secara keseluruhan — dari pembangkitan dataset, percabangan mode, pemanggilan LLM, hingga pencatatan metrik dan uji statistik — diilustrasikan pada Gambar 3.2.

![Alur Kerja Eval Framework](assets/diagrams/alur-eval-runner.png)

Gambar 3.2 Alur Kerja Kerangka Evaluasi Baseline dan Registry

Empat metrik dicatat pada setiap pemanggilan: jumlah token (input dan output), latensi respons, *tool* yang terpilih beserta status kebenarannya terhadap `expected_tool`, dan jumlah *tool* yang terlihat oleh model. Seluruh metrik disimpan dalam format JSONL inkremental sebagaimana diuraikan pada Sub-bab 3.5.


## 3.4 Implementasi Tool Registry

Skema metadata diimplementasikan sebagai *dataclass* `ToolDef` yang bersifat *immutable* (`frozen=True`) untuk menjamin determinisme katalog selama eksekusi. Implementasi skema tersebut disajikan pada Kode Program 3.1.

Kode Program 3.1 Skema Metadata `ToolDef`

```
@dataclass(frozen=True)
class ToolDef:
    name: str
    module: str
    op_type: str
    roles: list[str]
    tiers: list[str]
    keywords: list[str]
    priority: int
    schema_tokens: int
    intent: str = ""  # docstring-style: what this tool does and when to use it
```

Inti dari artefak adalah fungsi `registry_filter()` yang merealisasikan *pipeline* lima tahap pada Gambar 3.1. Fungsi ini menerima objek kueri, daftar *tool* skenario, dan anggaran (*budget*), lalu mengembalikan subset *tool* terurut yang dibatasi oleh anggaran. Implementasinya disajikan pada Kode Program 3.2.

Kode Program 3.2 Fungsi `registry_filter()`

```
def registry_filter(query: QueryDef, tools: list[ToolDef], budget: int) -> list[ToolDef]:
    query_terms = set(query.text.lower().replace(".", "").replace(",", "").split())
    ranked: list[tuple[int, int, float, ToolDef]] = []
    for tool in tools:
        if tool.module not in query.modules:
            continue
        if query.role not in tool.roles:
            continue
        if query.tier not in tool.tiers:
            continue
        overlap = len(query_terms.intersection(tool.keywords))
        ranked.append((overlap, -tool.priority, -stable_unit(query.query_id, tool.name), tool))
    ranked.sort(reverse=True)
    return [tool for *_unused, tool in ranked[:budget]]
```

Tiga pernyataan `continue` pada Kode Program 3.2 merealisasikan *hard filter* modul, peran, dan tier; *tool* yang gugur tidak ikut diperingkat. Kandidat yang lolos diberi skor berupa *tuple* `(overlap, -priority, -hash)` yang diurutkan secara menurun: jumlah tumpang-tindih kata kunci menjadi kunci utama, prioritas *tool* menjadi pemecah seri pertama, dan nilai *hash* stabil dari pasangan `(query_id, tool.name)` menjadi pemecah seri terakhir. Penggunaan *hash* deterministik — bukan urutan acak — memastikan bahwa keluaran *pipeline* dapat direproduksi secara identik pada setiap eksekusi, sebuah syarat penting bagi validitas eksperimen. Akhirnya, *slicing* `[:budget]` menerapkan *budget cap* yang menjamin jumlah keluaran tidak pernah melampaui 15 *tool*.

Selain penyaringan, dirancang pula fungsi `registry_memory()` untuk mengukur jejak memori (*memory footprint*) katalog metadata. Fungsi tersebut membangun representasi *dictionary* dari seluruh *tool* lalu menghitung ukuran totalnya secara rekursif menggunakan `deep_size()`, sehingga *overhead* memori registry dapat dianalisis pada Bab IV.


## 3.5 Implementasi Eval Runner

*Eval runner* bertanggung jawab menjalankan matriks eksperimen (skenario × mode × kueri × pengulangan) dan mencatat hasilnya. Untuk menjamin reprodusibilitas dan ketahanan terhadap gangguan jaringan saat memanggil LLM, *runner* dirancang bersifat *resume-safe*: setiap hasil ditulis segera (*append*) ke berkas JSONL, dan eksekusi yang terputus dapat dilanjutkan tanpa mengulang panggilan yang telah selesai. Mekanisme ini diwujudkan dengan memuat kunci `(scenario, mode, query_id, repeat_idx)` yang telah ada di disk, lalu melewati kombinasi yang sudah tercatat, sebagaimana disajikan pada Kode Program 3.3.

Kode Program 3.3 Mekanisme *Resume* pada Eval Runner

```
for mode in modes:
    for query in queries_for_scenario:
        for repeat_idx in range(n_repeats):
            key = (scenario, mode, query.query_id, repeat_idx)
            if key in done_keys:
                continue  # sudah ada di disk — lewati
            row = backend.call(
                mode=mode, scenario=scenario, query=query,
                tools_for_scenario=tools_for_scenario,
                registry_memory_bytes=memory_bytes,
                config=config, repeat_idx=repeat_idx,
            )
            rows.append(row)
            _flush(row)  # tulis segera ke JSONL (append)
```

Pemanggilan `_flush(row)` setelah setiap panggilan memastikan bahwa data tidak hilang apabila proses terhenti, sehingga eksperimen panjang yang melibatkan ratusan panggilan LLM dapat dijalankan secara bertahap. Setelah seluruh baris terkumpul, *runner* memanggil modul `summarize()` untuk menghasilkan `summary.csv`, modul uji statistik untuk menghasilkan `statistical_tests.csv`, dan *report generator* untuk menyusun laporan Markdown. Arsitektur *append-only* ini juga memungkinkan agregasi lintas-eksekusi: berkas JSONL dari beberapa sesi dapat digabungkan menjadi satu ringkasan yang konsisten.


## 3.6 Setup Eksperimen

Eksperimen resmi menggunakan model Gemini 2.5 Flash Lite melalui Google Gen AI SDK dengan mekanisme *native function calling* [2]. Seluruh parameter inferensi dikendalikan untuk meminimalkan variabel pengganggu (*confounding variable*), sebagaimana dirangkum pada Tabel 3.4.

Tabel 3.4 Parameter Setup Eksperimen

| Parameter | Nilai | Justifikasi |
|-----------|-------|-------------|
| Model | `gemini-2.5-flash-lite` | Model produksi zerlo.id, biaya rendah |
| `temperature` | 0 | Determinisme maksimal keluaran model |
| `mode` (*function calling*) | ANY | Memaksa model selalu memanggil satu *tool* |
| `max_output_tokens` | 32 | Cukup untuk satu pemanggilan *tool* |
| *Tool budget* (registry) | 15 | Batas maksimal *tool* yang diteruskan |
| *Repeat runs* | 3 | Menangkap variabilitas keluaran model |
| Total rekaman | 558 | 279 *baseline* + 279 *registry* |

Penetapan `temperature=0` dan `mode=ANY` memaksa model bersifat deterministik dan selalu memilih tepat satu *tool*, sehingga akurasi dapat dinilai secara biner terhadap `expected_tool`. Konfigurasi pemanggilan model diimplementasikan melalui objek `GenerateContentConfig` sebagaimana disajikan pada Kode Program 3.4.

Kode Program 3.4 Konfigurasi Pemanggilan Gemini

```
gen_config = types.GenerateContentConfig(
    system_instruction=(
        "Anda adalah router tool ERP restoran. "
        "Pilih dan panggil SATU tool yang paling tepat untuk permintaan pengguna."
    ),
    tools=[types.Tool(function_declarations=fn_decls)],
    tool_config=types.ToolConfig(
        function_calling_config=types.FunctionCallingConfig(
            mode="ANY",
            allowed_function_names=list(tool_names),
        )
    ),
    temperature=0,
    max_output_tokens=32,
)
```

Perbedaan tunggal antara mode *baseline* dan *registry* terletak pada himpunan `fn_decls`: pada mode *baseline*, himpunan ini berisi seluruh *tool* katalog (30/100/300), sedangkan pada mode *registry* himpunan ini merupakan keluaran `registry_filter()` yang dibatasi 15 *tool*. Dengan menjaga seluruh parameter lain identik, eksperimen ini mengisolasi dampak penyaringan sebagai satu-satunya perlakuan, sehingga hasil yang dianalisis pada Bab IV dapat diatribusikan secara valid kepada Tool Registry. Untuk meredam kegagalan transien akibat batas laju (*rate limit*) layanan, *backend* dilengkapi mekanisme *retry* dengan *exponential backoff* hingga lima kali percobaan.
