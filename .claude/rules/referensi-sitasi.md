# Rule: Referensi Akademik untuk Sitasi

Gunakan file ini saat menulis bab yang memerlukan kutipan ilmiah.
Untuk ringkasan lengkap tiap referensi, baca: `reference/referensi-ilmiah.md`

---

## Sitasi Wajib per Topik

### Tool RAG (Bab 2.3 + Bab 5 Future Work)

| ID | Kutip sebagai | Konteks penggunaan |
|----|---------------|--------------------|
| [Gorilla] | Patil et al., NeurIPS 2024 — arXiv:2305.15334 | "LLM berhalusinasi API call tanpa retrieval [ref]" |
| [ToolLLM] | Qin et al., ICLR 2024 — arXiv:2307.16789 | "Neural retriever untuk 16.000+ API nyata [ref]" |
| [Toolshed] | Lumer (PwC), 2024 — arXiv:2410.14594 | "3-fase RAG-Tool Fusion mencapai +46–56% Recall@5 [ref]" |
| [COLT] | Renmin Univ., CIKM 2024 — arXiv:2405.16089 | "Retrieval berbasis keragaman tool (bukan similarity murni) [ref]" |
| [BFCL] | Patil et al., ICML 2025 | "Benchmark standar evaluasi function calling LLM [ref]" |

### Tool Registry & Tool Management (Bab 2.4 + Bab 4 Pembahasan)

| ID | Kutip sebagai | Konteks penggunaan |
|----|---------------|--------------------|
| [DynReAct] | Gaurav et al., arXiv:2509.20386, Sep 2025 | "Dynamic tool loading mengurangi tool loading 50% sambil mempertahankan akurasi [ref]" |
| [AutoTool] | Jia & Li, AAAI 2026 — arXiv:2511.14650 | "Tool usage inertia: pola sekuensial tool calls dapat diprediksi [ref]" |
| [ScaleMCP] | arXiv:2505.06416, 2025 | "Auto-sync tool registry untuk MCP environment dinamis [ref]" |
| [MCPFlow] | Wang et al., ACL 2026 — arXiv:2510.24284 | "11.536 tools di 1.166 MCP server — validasi skala industri [ref]" |
| [AWSReg] | Preethi CN, AWS Blog, April 2026 | "Adopsi hyperscaler: AWS Agent Registry dengan hybrid search + IAM [ref]" |
| [TrueFoundry] | TrueFoundry, 2025 | "Enam fungsi inti agent registry: discovery, metadata, health, RBAC, audit [ref]" |
| [RedHat] | Kolchinsky (Red Hat), Nov 2025 | "Tool RAG dapat melipattigakan akurasi tool invocation sambil mempersingkat prompt [ref]" |

### LLM Tool-Calling Foundational (Bab 2.1)

| ID | Kutip sebagai | Konteks penggunaan |
|----|---------------|--------------------|
| [Toolformer] | Schick et al., NeurIPS 2023 — arXiv:2302.04761 | "LLM dapat belajar memanggil tools secara self-supervised [ref]" |
| [ReAct] | Yao et al., ICLR 2023 — arXiv:2210.03629 | "Framework agent: Thought→Action→Observation [ref]" |
| [OAIFunc] | OpenAI, Juni 2023 | "Function calling sebagai fitur LLM production-ready pertama [ref]" |
| [GeminiFC] | Google DeepMind, 2024 | "Native function calling Gemini: FunctionDeclaration, mode=ANY [ref]" |

### Context Engineering & Context Rot (Bab 2.2 + Bab 5 Threats)

| ID | Kutip sebagai | Konteks penggunaan |
|----|---------------|--------------------|
| [LostMiddle] | Liu et al., TACL 2024 — arXiv:2307.03172 | "Performa LLM menurun saat informasi relevan di tengah konteks panjang [ref]" |
| [CtxRot] | Timothy B. Lee, Understanding AI, Nov 2025 | "Claude 3.5 Sonnet: 88%→30% akurasi saat context mencapai 32K tokens [ref]" |
| [AnthropicCtx] | Rajasekaran et al. (Anthropic), Sep 2025 | "'Bloated tool sets cause agent failure' — minimal token set principle [ref]" |
| [CtxLen] | arXiv:2510.05381, Okt 2025 | "Context length sendiri (bukan retrieval quality) menurunkan performa LLM [ref]" |

### Metodologi Penelitian (Bab 2 + Bab 3)

| ID | Kutip sebagai | Konteks penggunaan |
|----|---------------|--------------------|
| [DSR] | Hevner et al., MIS Quarterly, 2004 | "Design Science Research: problem → objective → design → demo → evaluation [ref]" |
| [Microservice] | Richardson, microservices.io, 2014–2025 | "Tool Registry terinspirasi pola service registry + API gateway microservices [ref]" |

---

## Format IEEE untuk Referensi Kunci

```
[1]  N.F. Liu, K. Lin, J. Hewitt, A. Paranjape, M. Bevilacqua, F. Petroni, dan P. Liang, "Lost in the middle: How language models use long contexts," Trans. Assoc. Comput. Linguistics, vol. 12, pp. 157–173, 2024.
[2]  T. Schick, J. Dwivedi-Yu, R. Dessi, R. Raileanu, M. Lomeli, E. Hambro, L. Zettlemoyer, N. Cancedda, dan T. Scialom, "Toolformer: Language models can teach themselves to use tools," in Proc. Adv. Neural Inf. Process. Syst. (NeurIPS), 2023.
[3]  S. Yao, J. Zhao, D. Yu, N. Du, I. Shafran, K. Narasimhan, dan Y. Cao, "ReAct: Synergizing reasoning and acting in language models," in Proc. Int. Conf. Learn. Representations (ICLR), 2023.
[4]  S.G. Patil, T. Zhang, X. Wang, dan J.E. Gonzalez, "Gorilla: Large language model connected with massive APIs," in Proc. Adv. Neural Inf. Process. Syst. (NeurIPS), 2024. arXiv:2305.15334.
[5]  Y. Qin et al., "ToolLLM: Facilitating large language models to master 16000+ real-world APIs," in Proc. Int. Conf. Learn. Representations (ICLR), 2024. arXiv:2307.16789.
[6]  E. Lumer, "Toolshed: Scale tool-equipped agents with advanced RAG-tool fusion and tool knowledge bases," arXiv:2410.14594, 2024.
[7]  N. Gaurav, A. Akarsh, A. Ranjan, dan M. Bajaj, "Dynamic ReAct: Scalable tool selection for large-scale MCP environments," arXiv:2509.20386, 2025.
[8]  J. Jia dan Q. Li, "AutoTool: Efficient tool selection for large language model agents," in Proc. AAAI Conf. Artif. Intell. (AAAI), 2026. arXiv:2511.14650.
[9]  W. Wang et al., "MCP-Flow: Facilitating LLM agents to master real-world, diverse and scaling MCP tools," in Proc. Assoc. Comput. Linguistics (ACL), 2026. arXiv:2510.24284.
[10] P. Rajasekaran, E. Dixon, C. Ryan, dan J. Hadfield, "Effective context engineering for AI agents," Anthropic Engineering Blog, Sep. 2025.
[11] A.R. Hevner, S.T. March, J. Park, dan S. Ram, "Design science in information systems research," MIS Quarterly, vol. 28, no. 1, pp. 75–105, Mar. 2004.
```

> Lengkapi nomor urut sesuai kemunculan pertama di naskah. File lengkap ada di `reference/referensi-ilmiah.md`.
