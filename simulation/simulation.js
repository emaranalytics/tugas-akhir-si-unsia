// =============================================================================
// SIMULATION.JS — Tool Registry Interactive Demo
// Tugas Akhir: Muhammad Ridwan (220101010009) — Universitas Siber Asia
// =============================================================================

// ─── DATA: Tool Catalog (30 tools, S1 scenario) ──────────────────────────────

const MODULE_META = {
  inventory:  { label: 'Inventory',   color: '#3B82F6', bg: '#EFF6FF' },
  sales:      { label: 'Sales',       color: '#10B981', bg: '#ECFDF5' },
  accounting: { label: 'Accounting',  color: '#F59E0B', bg: '#FFFBEB' },
  supplier:   { label: 'Supplier',    color: '#8B5CF6', bg: '#F5F3FF' },
  hr:         { label: 'HR',          color: '#EC4899', bg: '#FDF2F8' },
  compliance: { label: 'Compliance',  color: '#EF4444', bg: '#FEF2F2' },
  menu:       { label: 'Menu',        color: '#14B8A6', bg: '#F0FDFA' },
  customer:   { label: 'Customer',    color: '#F97316', bg: '#FFF7ED' },
};

const TOOLS = [
  // Inventory (5)
  { id: 'inventory_check_stock',     name: 'Cek Stok',             module: 'inventory',
    desc: 'Memeriksa ketersediaan stok bahan baku atau produk',
    keywords: ['stok', 'cek', 'bahan baku', 'ketersediaan', 'inventory'], tokens: 82 },
  { id: 'inventory_update_stock',    name: 'Update Stok',          module: 'inventory',
    desc: 'Memperbarui jumlah stok setelah transaksi masuk/keluar',
    keywords: ['update', 'stok', 'penyesuaian', 'inventory'], tokens: 78 },
  { id: 'inventory_low_stock_alert', name: 'Alert Stok Rendah',    module: 'inventory',
    desc: 'Daftar item dengan stok di bawah batas minimum',
    keywords: ['stok rendah', 'alert', 'minimum', 'batas'], tokens: 84 },
  { id: 'inventory_admin_tool_01',   name: 'Admin Inventory 01',   module: 'inventory',
    desc: 'Audit stok — operasi administrasi inventaris',
    keywords: ['admin', 'audit', 'inventory'], tokens: 76 },
  { id: 'inventory_admin_tool_02',   name: 'Admin Inventory 02',   module: 'inventory',
    desc: 'Rekonsiliasi stok — sinkronisasi fisik vs sistem',
    keywords: ['rekonsiliasi', 'admin', 'inventory'], tokens: 76 },
  // Sales (5)
  { id: 'sales_daily_revenue',       name: 'Pendapatan Harian',    module: 'sales',
    desc: 'Laporan pendapatan penjualan hari ini secara ringkas',
    keywords: ['penjualan', 'pendapatan', 'laporan', 'harian', 'revenue'], tokens: 80 },
  { id: 'sales_create_order',        name: 'Buat Pesanan',         module: 'sales',
    desc: 'Membuat pesanan penjualan baru untuk pelanggan',
    keywords: ['pesanan', 'order', 'buat', 'penjualan'], tokens: 77 },
  { id: 'sales_cancel_order',        name: 'Batalkan Pesanan',     module: 'sales',
    desc: 'Membatalkan pesanan penjualan yang sudah ada',
    keywords: ['batal', 'cancel', 'order', 'penjualan'], tokens: 76 },
  { id: 'sales_analytical_tool_01',  name: 'Analitik Penjualan 01',module: 'sales',
    desc: 'Analisis tren penjualan mingguan dan bulanan',
    keywords: ['analitik', 'tren', 'penjualan', 'mingguan'], tokens: 83 },
  { id: 'sales_analytical_tool_02',  name: 'Analitik Penjualan 02',module: 'sales',
    desc: 'Analisis performa produk dan kategori terlaris',
    keywords: ['produk', 'terlaris', 'performa', 'kategori'], tokens: 85 },
  // Accounting (5)
  { id: 'accounting_generate_journal', name: 'Generate Jurnal',    module: 'accounting',
    desc: 'Membuat jurnal akuntansi otomatis dari data transaksi',
    keywords: ['jurnal', 'akuntansi', 'generate', 'transaksi'], tokens: 81 },
  { id: 'accounting_view_balance',   name: 'Lihat Neraca',         module: 'accounting',
    desc: 'Melihat saldo akun dan neraca keuangan terkini',
    keywords: ['saldo', 'akun', 'neraca', 'keuangan', 'balance'], tokens: 80 },
  { id: 'accounting_cash_flow',      name: 'Arus Kas',             module: 'accounting',
    desc: 'Laporan arus kas masuk dan keluar periodik',
    keywords: ['kas', 'cash flow', 'arus', 'keuangan', 'laporan'], tokens: 82 },
  { id: 'accounting_admin_tool_01',  name: 'Admin Akuntansi 01',   module: 'accounting',
    desc: 'Rekonsiliasi dan penutupan buku besar keuangan',
    keywords: ['rekonsiliasi', 'buku besar', 'admin', 'akuntansi'], tokens: 79 },
  { id: 'accounting_admin_tool_02',  name: 'Admin Akuntansi 02',   module: 'accounting',
    desc: 'Penutupan periode akuntansi bulanan dan tahunan',
    keywords: ['penutupan', 'periode', 'admin', 'akuntansi'], tokens: 78 },
  // Supplier (5)
  { id: 'supplier_create_po',        name: 'Buat Purchase Order',  module: 'supplier',
    desc: 'Membuat purchase order pengadaan bahan ke supplier',
    keywords: ['purchase order', 'PO', 'supplier', 'beli', 'pengadaan', 'bahan'], tokens: 85 },
  { id: 'supplier_list_vendors',     name: 'Daftar Vendor',        module: 'supplier',
    desc: 'Melihat daftar supplier terdaftar beserta kontak',
    keywords: ['vendor', 'supplier', 'daftar', 'kontak'], tokens: 78 },
  { id: 'supplier_track_delivery',   name: 'Lacak Pengiriman',     module: 'supplier',
    desc: 'Status pengiriman barang dari supplier ke gudang',
    keywords: ['pengiriman', 'lacak', 'delivery', 'tracking', 'status'], tokens: 80 },
  { id: 'supplier_admin_tool_01',    name: 'Admin Supplier 01',    module: 'supplier',
    desc: 'Evaluasi dan penilaian performa supplier berkala',
    keywords: ['evaluasi', 'performa', 'penilaian', 'supplier'], tokens: 79 },
  { id: 'supplier_admin_tool_02',    name: 'Admin Supplier 02',    module: 'supplier',
    desc: 'Manajemen kontrak dan negosiasi syarat supplier',
    keywords: ['kontrak', 'negosiasi', 'supplier', 'admin'], tokens: 78 },
  // HR (3)
  { id: 'hr_attendance',             name: 'Absensi Karyawan',     module: 'hr',
    desc: 'Mencatat dan melihat kehadiran karyawan harian',
    keywords: ['absensi', 'karyawan', 'hadir', 'kehadiran'], tokens: 78 },
  { id: 'hr_payroll',                name: 'Penggajian',           module: 'hr',
    desc: 'Proses penggajian dan cetak slip gaji karyawan',
    keywords: ['gaji', 'payroll', 'karyawan', 'slip'], tokens: 77 },
  { id: 'hr_admin_tool_01',          name: 'Admin HR',             module: 'hr',
    desc: 'Manajemen data profil dan kontrak karyawan',
    keywords: ['data karyawan', 'profil', 'admin', 'hr'], tokens: 76 },
  // Compliance (3)
  { id: 'compliance_halal_cert',     name: 'Sertifikat Halal',     module: 'compliance',
    desc: 'Cek dan pembaruan sertifikat halal produk makanan',
    keywords: ['halal', 'sertifikat', 'compliance', 'produk'], tokens: 80 },
  { id: 'compliance_tax_report',     name: 'Laporan Pajak',        module: 'compliance',
    desc: 'Membuat laporan pajak bulanan dan tahunan usaha',
    keywords: ['pajak', 'tax', 'laporan', 'bulanan', 'tahunan'], tokens: 79 },
  { id: 'compliance_admin_tool_01',  name: 'Admin Compliance',     module: 'compliance',
    desc: 'Audit kepatuhan regulasi operasional restoran',
    keywords: ['audit', 'regulasi', 'kepatuhan', 'compliance'], tokens: 78 },
  // Menu (2)
  { id: 'menu_update_price',         name: 'Update Harga Menu',    module: 'menu',
    desc: 'Memperbarui harga item atau paket menu restoran',
    keywords: ['harga', 'menu', 'update', 'item', 'paket'], tokens: 76 },
  { id: 'menu_add_item',             name: 'Tambah Item Menu',     module: 'menu',
    desc: 'Menambahkan item atau varian baru ke menu aktif',
    keywords: ['menu', 'tambah', 'item', 'varian', 'baru'], tokens: 75 },
  // Customer (2)
  { id: 'customer_feedback',         name: 'Feedback Pelanggan',   module: 'customer',
    desc: 'Melihat dan menganalisis ulasan pelanggan terkini',
    keywords: ['feedback', 'ulasan', 'pelanggan', 'review'], tokens: 78 },
  { id: 'customer_loyalty',          name: 'Program Loyalitas',    module: 'customer',
    desc: 'Manajemen poin reward dan loyalitas pelanggan',
    keywords: ['loyalitas', 'poin', 'reward', 'pelanggan'], tokens: 79 },
];

// ─── DATA: Queries ────────────────────────────────────────────────────────────

const QUERIES = [
  {
    id: 'q001',
    text: 'Cek stok bahan baku tepung',
    sub: 'Check flour raw material stock',
    module: 'inventory',
    keywords: ['stok', 'bahan baku', 'tepung'],
    correctTool: 'inventory_check_stock',
    baselineCorrect: false,
    registryCorrect: true,
    ragCorrect: true,
    registryTools: ['inventory_check_stock','inventory_update_stock','inventory_low_stock_alert','inventory_admin_tool_01','inventory_admin_tool_02'],
    ragTopK: [
      { id: 'inventory_check_stock',    score: 0.91 },
      { id: 'inventory_low_stock_alert',score: 0.78 },
      { id: 'inventory_update_stock',   score: 0.72 },
      { id: 'supplier_list_vendors',    score: 0.48 },
      { id: 'supplier_create_po',       score: 0.45 },
      { id: 'inventory_admin_tool_01',  score: 0.44 },
      { id: 'inventory_admin_tool_02',  score: 0.41 },
      { id: 'supplier_track_delivery',  score: 0.38 },
      { id: 'accounting_view_balance',  score: 0.22 },
      { id: 'menu_update_price',        score: 0.18 },
    ],
    baselineResponse: '🤖 Memanggil: <code>inventory_admin_tool_02</code> (rekonsiliasi stok) — ❌ tool salah karena terlalu banyak pilihan serupa',
    registryResponse: '🤖 Memanggil: <code>inventory_check_stock</code> — ✅ Stok tepung terigu: 45 kg (minimum: 20 kg). Stok aman.',
    ragResponse: '🤖 Memanggil: <code>inventory_check_stock</code> — ✅ Stok tepung terigu: 45 kg (minimum: 20 kg). Stok aman.',
  },
  {
    id: 'q022',
    text: 'Buat laporan penjualan hari ini',
    sub: "Generate today's sales report",
    module: 'sales',
    keywords: ['laporan', 'penjualan', 'harian'],
    correctTool: 'sales_daily_revenue',
    baselineCorrect: true,
    registryCorrect: true,
    ragCorrect: true,
    registryTools: ['sales_daily_revenue','sales_create_order','sales_cancel_order','sales_analytical_tool_01','sales_analytical_tool_02'],
    ragTopK: [
      { id: 'sales_daily_revenue',      score: 0.93 },
      { id: 'sales_analytical_tool_01', score: 0.81 },
      { id: 'sales_analytical_tool_02', score: 0.75 },
      { id: 'accounting_cash_flow',     score: 0.54 },
      { id: 'accounting_view_balance',  score: 0.51 },
      { id: 'sales_create_order',       score: 0.48 },
      { id: 'accounting_generate_journal', score: 0.35 },
      { id: 'compliance_tax_report',    score: 0.29 },
      { id: 'sales_cancel_order',       score: 0.26 },
      { id: 'hr_payroll',               score: 0.21 },
    ],
    baselineResponse: '🤖 Memanggil: <code>sales_daily_revenue</code> — ✅ Pendapatan hari ini: Rp 4.250.000 (127 transaksi).',
    registryResponse: '🤖 Memanggil: <code>sales_daily_revenue</code> — ✅ Pendapatan hari ini: Rp 4.250.000 (127 transaksi).',
    ragResponse: '🤖 Memanggil: <code>sales_daily_revenue</code> — ✅ Pendapatan hari ini: Rp 4.250.000 (127 transaksi).',
  },
  {
    id: 'q004',
    text: 'Generate jurnal akuntansi transaksi kemarin',
    sub: "Generate accounting journal for yesterday's transactions",
    module: 'accounting',
    keywords: ['jurnal', 'akuntansi', 'transaksi'],
    correctTool: 'accounting_generate_journal',
    baselineCorrect: false,
    registryCorrect: true,
    ragCorrect: true,
    registryTools: ['accounting_generate_journal','accounting_view_balance','accounting_cash_flow','accounting_admin_tool_01','accounting_admin_tool_02'],
    ragTopK: [
      { id: 'accounting_generate_journal', score: 0.94 },
      { id: 'accounting_admin_tool_01', score: 0.72 },
      { id: 'accounting_view_balance',  score: 0.68 },
      { id: 'accounting_cash_flow',     score: 0.62 },
      { id: 'accounting_admin_tool_02', score: 0.58 },
      { id: 'sales_daily_revenue',      score: 0.41 },
      { id: 'compliance_tax_report',    score: 0.37 },
      { id: 'sales_analytical_tool_01', score: 0.28 },
      { id: 'hr_payroll',               score: 0.22 },
      { id: 'supplier_admin_tool_01',   score: 0.15 },
    ],
    baselineResponse: '🤖 Memanggil: <code>accounting_admin_tool_01</code> (rekonsiliasi) — ❌ tool salah, terlalu mirip dengan generate_journal dalam modul yang sama',
    registryResponse: '🤖 Memanggil: <code>accounting_generate_journal</code> — ✅ Jurnal dibuat: 34 entri dari 34 transaksi tanggal kemarin.',
    ragResponse: '🤖 Memanggil: <code>accounting_generate_journal</code> — ✅ Jurnal dibuat: 34 entri dari 34 transaksi tanggal kemarin.',
  },
  {
    id: 'q003',
    text: 'Buat purchase order ke supplier tepung',
    sub: 'Create purchase order for flour supplier',
    module: 'supplier',
    keywords: ['purchase order', 'supplier', 'tepung', 'pengadaan'],
    correctTool: 'supplier_create_po',
    baselineCorrect: false,
    registryCorrect: true,
    ragCorrect: false,
    registryTools: ['supplier_create_po','supplier_list_vendors','supplier_track_delivery','supplier_admin_tool_01','supplier_admin_tool_02'],
    ragTopK: [
      { id: 'supplier_create_po',       score: 0.88 },
      { id: 'supplier_list_vendors',    score: 0.76 },
      { id: 'supplier_track_delivery',  score: 0.61 },
      { id: 'inventory_check_stock',    score: 0.52 },
      { id: 'inventory_update_stock',   score: 0.47 },
      { id: 'supplier_admin_tool_01',   score: 0.45 },
      { id: 'supplier_admin_tool_02',   score: 0.42 },
      { id: 'accounting_generate_journal', score: 0.31 },
      { id: 'compliance_admin_tool_01', score: 0.18 },
      { id: 'menu_add_item',            score: 0.12 },
    ],
    baselineResponse: '🤖 Memanggil: <code>supplier_list_vendors</code> (daftar vendor) — ❌ tool salah, LLM bingung antara "buat PO" dan "lihat vendor"',
    registryResponse: '🤖 Memanggil: <code>supplier_create_po</code> — ✅ PO-2026-0412 dibuat untuk CV Sumber Terigu: 100 kg @ Rp 12.000.',
    ragResponse: '🤖 Memanggil: <code>supplier_list_vendors</code> — ❌ RAG mengembalikan supplier_list_vendors (skor 0.76) berdekatan dengan supplier_create_po karena keduanya berbicara tentang "supplier"',
  },
];

// ─── STATE ────────────────────────────────────────────────────────────────────

const state = {
  activeTab: 'baseline',
  baseline: { queryIdx: -1, step: -1, playing: false, timer: null },
  registry: { queryIdx: -1, step: -1, playing: false, timer: null },
  rag:      { queryIdx: -1, step: -1, playing: false, timer: null },
};

// ─── STEP DEFINITIONS ─────────────────────────────────────────────────────────

function buildBaselineSteps(q) {
  const totalTokens = TOOLS.reduce((s, t) => s + t.tokens, 0) + 20 + 50; // tools + query + resp
  return [
    {
      phase: 'receive',
      icon: '📨',
      title: 'Query Diterima',
      desc: `AI Agent menerima permintaan: <em>"${q.text}"</em><br><small>${q.sub}</small>`,
      highlightTools: [],
      dimTools: TOOLS.map(t => t.id),
      tokens: 0,
      toolsVisibleCount: 0,
      statusMsg: 'Menunggu...',
    },
    {
      phase: 'loading',
      icon: '📦',
      title: 'Memuat Semua Tools',
      desc: `<strong>Tanpa filter</strong> — seluruh <strong>${TOOLS.length} tool</strong> dari katalog dimuat ke dalam <em>context window</em> LLM. Token bertambah seiring setiap tool definition dibaca.`,
      highlightTools: TOOLS.map(t => t.id),
      dimTools: [],
      tokens: totalTokens,
      toolsVisibleCount: TOOLS.length,
      statusMsg: `Memuat ${TOOLS.length} tools...`,
      warning: `⚠️ Semua ${TOOLS.length} tool dimuat tanpa seleksi!`,
    },
    {
      phase: 'send',
      icon: '📤',
      title: 'Mengirim ke LLM',
      desc: `<strong>${totalTokens.toLocaleString()} token</strong> dikirim ke Gemini 2.5 Flash Lite: ${TOOLS.length} tool definitions + query pengguna.<br><small>Biaya naik linier: O(N) terhadap jumlah tool.</small>`,
      highlightTools: TOOLS.map(t => t.id),
      dimTools: [],
      tokens: totalTokens,
      toolsVisibleCount: TOOLS.length,
      statusMsg: 'Mengirim ke LLM...',
    },
    {
      phase: 'processing',
      icon: '🧠',
      title: 'LLM Memproses',
      desc: `LLM harus <strong>membaca dan mempertimbangkan ${TOOLS.length} tool</strong> sekaligus. Semakin banyak tool, semakin besar risiko salah pilih (<em>context rot</em>).`,
      highlightTools: TOOLS.map(t => t.id),
      dimTools: [],
      tokens: totalTokens,
      toolsVisibleCount: TOOLS.length,
      statusMsg: 'LLM berpikir...',
      loading: true,
    },
    {
      phase: 'selected',
      icon: q.baselineCorrect ? '✅' : '❌',
      title: q.baselineCorrect ? 'Tool Dipilih — Benar' : 'Tool Dipilih — Salah!',
      desc: q.baselineCorrect
        ? `LLM memilih tool yang tepat. Namun dengan ${TOOLS.length} tools, akurasi rata-rata hanya <strong>68.8%</strong> — 31.2% permintaan dipilihkan tool yang salah.`
        : `LLM <strong>salah memilih tool</strong>. Terlalu banyak pilihan serupa dalam modul yang sama menyebabkan ambiguitas.<br>Akurasi S1 baseline: <strong>68.8%</strong>.`,
      highlightTools: TOOLS.map(t => t.id),
      dimTools: [],
      selectedTool: q.baselineCorrect ? q.correctTool : (TOOLS.find(t => t.module === q.module && t.id !== q.correctTool)?.id),
      tokens: totalTokens,
      toolsVisibleCount: TOOLS.length,
      statusMsg: q.baselineCorrect ? 'Berhasil' : 'Tool salah dipilih',
    },
    {
      phase: 'done',
      icon: '💬',
      title: 'Respons Dikirim ke Pengguna',
      desc: `Total biaya: <strong>${totalTokens.toLocaleString()} token</strong>.<br>Jika katalog berkembang ke 100 tools → ~8.000 token; 300 tools → ~24.000 token. Biaya tumbuh <strong>linier</strong>.`,
      highlightTools: TOOLS.map(t => t.id),
      dimTools: [],
      tokens: totalTokens,
      toolsVisibleCount: TOOLS.length,
      chatMsg: q.baselineResponse,
      statusMsg: 'Selesai',
    },
  ];
}

function buildRegistrySteps(q) {
  const filteredTools = q.registryTools;
  const otherTools = TOOLS.filter(t => !filteredTools.includes(t.id)).map(t => t.id);
  const filteredTokens = filteredTools.reduce((s, id) => {
    const t = TOOLS.find(x => x.id === id);
    return s + (t ? t.tokens : 0);
  }, 0) + 20 + 50;

  return [
    {
      phase: 'receive',
      icon: '📨',
      title: 'Query Diterima oleh Tool Registry',
      desc: `Permintaan masuk: <em>"${q.text}"</em><br><small>${q.sub}</small><br><br>Tool Registry mencegat query <strong>sebelum diteruskan ke LLM</strong>.`,
      highlightTools: [],
      dimTools: TOOLS.map(t => t.id),
      tokens: 0,
      toolsVisibleCount: 0,
      statusMsg: 'Registry aktif...',
    },
    {
      phase: 'keywords',
      icon: '🔑',
      title: 'Ekstraksi Kata Kunci',
      desc: `Registry mengekstrak kata kunci dari query:<br><div class="kw-chips">${q.keywords.map(k => `<span class="kw-chip">${k}</span>`).join('')}</div><br>Kata kunci dicocokkan dengan atribut <code>keywords[]</code> setiap tool di katalog.`,
      highlightTools: [],
      dimTools: TOOLS.map(t => t.id),
      tokens: 0,
      toolsVisibleCount: 0,
      statusMsg: 'Mengekstrak keywords...',
      pipeline: ['keywords'],
    },
    {
      phase: 'module',
      icon: '🗂️',
      title: `Filter Modul: <em>${q.module}</em>`,
      desc: `Modul <strong>${q.module}</strong> terdeteksi dari kata kunci. Registry memfilter — hanya tool dari modul ini yang dipertimbangkan.<br><br><strong>${filteredTools.length} tool lolos</strong> dari total ${TOOLS.length}.`,
      highlightTools: filteredTools,
      dimTools: otherTools,
      tokens: 0,
      toolsVisibleCount: filteredTools.length,
      statusMsg: `Filter modul: ${q.module}`,
      pipeline: ['keywords', 'module'],
    },
    {
      phase: 'scoring',
      icon: '📊',
      title: 'Scoring & Budget Cap',
      desc: `Tool diperingkat berdasarkan skor relevansi keyword.<br>Budget cap diterapkan: <strong>≤ 15 tools per panggilan</strong>.<br><br>Hasil: <strong>${filteredTools.length} tool</strong> diteruskan (dari maksimum 15).`,
      highlightTools: filteredTools,
      dimTools: otherTools,
      tokens: filteredTokens,
      toolsVisibleCount: filteredTools.length,
      statusMsg: 'Scoring & budget cap...',
      pipeline: ['keywords', 'module', 'budget'],
    },
    {
      phase: 'send',
      icon: '📤',
      title: 'Mengirim ke LLM — Hemat Token!',
      desc: `Hanya <strong>${filteredTools.length} tool</strong> dikirim ke LLM.<br>Token: <strong>${filteredTokens.toLocaleString()}</strong> vs baseline ${(TOOLS.reduce((s,t)=>s+t.tokens,0)+70).toLocaleString()}<br><span class="badge-green">Penghematan: ~63%</span>`,
      highlightTools: filteredTools,
      dimTools: otherTools,
      tokens: filteredTokens,
      toolsVisibleCount: filteredTools.length,
      statusMsg: 'Mengirim ke LLM...',
      pipeline: ['keywords', 'module', 'budget', 'llm'],
    },
    {
      phase: 'processing',
      icon: '🧠',
      title: 'LLM Memproses — Konteks Bersih',
      desc: `LLM hanya melihat <strong>${filteredTools.length} tool</strong> yang relevan. Tidak ada noise dari modul lain.<br><em>Akurasi meningkat karena konteks lebih fokus.</em>`,
      highlightTools: filteredTools,
      dimTools: otherTools,
      tokens: filteredTokens,
      toolsVisibleCount: filteredTools.length,
      statusMsg: 'LLM berpikir...',
      loading: true,
      pipeline: ['keywords', 'module', 'budget', 'llm'],
    },
    {
      phase: 'selected',
      icon: '✅',
      title: 'Tool Dipilih — Benar!',
      desc: `LLM memilih <code>${q.correctTool}</code> dengan benar.<br>Akurasi S1 registry: <strong>75.0%</strong> (+6.3pp dari baseline 68.8%).`,
      highlightTools: filteredTools,
      dimTools: otherTools,
      selectedTool: q.correctTool,
      tokens: filteredTokens,
      toolsVisibleCount: filteredTools.length,
      statusMsg: 'Berhasil ✅',
      pipeline: ['keywords', 'module', 'budget', 'llm'],
    },
    {
      phase: 'done',
      icon: '💬',
      title: 'Respons Dikirim — Efisien!',
      desc: `Token: <strong>${filteredTokens.toLocaleString()}</strong> (hemat ~63% vs baseline).<br>Saat katalog berkembang ke 300 tools → registry <em>tetap</em> ~${filteredTokens.toLocaleString()} token. <span class="badge-green">O(1) terhadap ukuran katalog!</span>`,
      highlightTools: filteredTools,
      dimTools: otherTools,
      tokens: filteredTokens,
      toolsVisibleCount: filteredTools.length,
      chatMsg: q.registryResponse,
      statusMsg: 'Selesai ✅',
      pipeline: ['keywords', 'module', 'budget', 'llm'],
    },
  ];
}

function buildRagSteps(q) {
  const topK = q.ragTopK.slice(0, 10);
  const topKIds = topK.map(x => x.id);
  const otherTools = TOOLS.filter(t => !topKIds.includes(t.id)).map(t => t.id);
  const topKTokens = topKIds.reduce((s, id) => {
    const t = TOOLS.find(x => x.id === id);
    return s + (t ? t.tokens : 0);
  }, 0) + 20 + 50;

  const vectorStr = '[0.82, −0.31, 0.45, 0.11, −0.67, 0.23, ...]';

  return [
    {
      phase: 'receive',
      icon: '📨',
      title: 'Query Diterima',
      desc: `Query masuk: <em>"${q.text}"</em><br><small>${q.sub}</small><br><br>Tool RAG akan mengubah query ini menjadi <em>embedding vector</em> sebelum mencari tools.`,
      highlightTools: [],
      dimTools: TOOLS.map(t => t.id),
      tokens: 0,
      toolsVisibleCount: 0,
      statusMsg: 'Menginisialisasi RAG...',
    },
    {
      phase: 'embed',
      icon: '🔢',
      title: 'Query → Embedding Vector',
      desc: `Model embedding (misal: text-embedding-004) mengubah query menjadi vektor berdimensi tinggi:<br><code class="vector-code">${vectorStr}</code><br><br>Vektor ini merepresentasikan <em>makna semantik</em> query.`,
      highlightTools: [],
      dimTools: TOOLS.map(t => t.id),
      tokens: 0,
      toolsVisibleCount: 0,
      statusMsg: 'Embedding query...',
      ragPhase: 'embed',
    },
    {
      phase: 'search',
      icon: '🔍',
      title: 'Pencarian Kemiripan di Vector DB',
      desc: `Cosine similarity dihitung antara vektor query dan vektor setiap tool dalam <em>vector database</em>. Tool dengan kemiripan tertinggi dipilih sebagai kandidat.<br><br><strong>Infrastruktur dibutuhkan:</strong> model embedding + vector DB.`,
      highlightTools: [],
      dimTools: TOOLS.map(t => t.id),
      tokens: 0,
      toolsVisibleCount: 0,
      statusMsg: 'Menghitung similarity...',
      ragPhase: 'search',
      ragScores: topK,
    },
    {
      phase: 'topk',
      icon: '🎯',
      title: `Top-${topK.length} Tools Dipilih`,
      desc: `${topK.length} tool dengan skor kemiripan tertinggi dikembalikan oleh vector DB dan diteruskan ke LLM.<br><br>${q.ragCorrect ? '<span class="badge-green">Tool yang benar ada di top-k</span>' : '<span class="badge-red">⚠️ Tool yang benar tidak di posisi teratas — RAG bisa salah untuk query ambigu</span>'}`,
      highlightTools: topKIds,
      dimTools: otherTools,
      tokens: topKTokens,
      toolsVisibleCount: topK.length,
      statusMsg: 'Top-k dipilih',
      ragPhase: 'topk',
      ragScores: topK,
    },
    {
      phase: 'send',
      icon: '📤',
      title: 'Mengirim ke LLM',
      desc: `${topK.length} tool kandidat dikirim ke LLM.<br>Token: <strong>${topKTokens.toLocaleString()}</strong> — efisien seperti registry.<br><br><em>Namun RAG membutuhkan langkah embedding dan vector search sebelumnya.</em>`,
      highlightTools: topKIds,
      dimTools: otherTools,
      tokens: topKTokens,
      toolsVisibleCount: topK.length,
      statusMsg: 'Mengirim ke LLM...',
      ragPhase: 'topk',
      ragScores: topK,
    },
    {
      phase: 'processing',
      icon: '🧠',
      title: 'LLM Memproses',
      desc: `LLM memilih dari ${topK.length} tool kandidat.<br>${q.ragCorrect ? 'Tool yang benar ada dalam kandidat.' : '⚠️ Tool yang benar bersaing dengan kandidat lain yang mirip secara semantik.'}`,
      highlightTools: topKIds,
      dimTools: otherTools,
      tokens: topKTokens,
      toolsVisibleCount: topK.length,
      statusMsg: 'LLM berpikir...',
      loading: true,
      ragPhase: 'topk',
      ragScores: topK,
    },
    {
      phase: 'selected',
      icon: q.ragCorrect ? '✅' : '❌',
      title: q.ragCorrect ? 'Tool Dipilih — Benar' : 'Tool Dipilih — Salah',
      desc: q.ragCorrect
        ? `RAG berhasil mengidentifikasi tool yang tepat. Kemiripan semantik cukup untuk membedakan tool yang relevan.`
        : `RAG memilih tool yang salah karena dua tool dalam domain yang sama memiliki vektor yang berdekatan — semantik kurang dapat membedakan operasi spesifik.`,
      highlightTools: topKIds,
      dimTools: otherTools,
      selectedTool: q.ragCorrect ? q.correctTool : topK[1]?.id,
      tokens: topKTokens,
      toolsVisibleCount: topK.length,
      statusMsg: q.ragCorrect ? 'Berhasil' : 'Tool salah dipilih',
      ragPhase: 'topk',
      ragScores: topK,
    },
    {
      phase: 'done',
      icon: '💬',
      title: 'Respons Dikirim',
      desc: `Token: <strong>${topKTokens.toLocaleString()}</strong> — serupa dengan registry.<br><strong>Kelebihan RAG:</strong> memahami makna semantik, cocok untuk ribuan tools.<br><strong>Kekurangan RAG:</strong> butuh vector DB + embedding model + sinkronisasi katalog.`,
      highlightTools: topKIds,
      dimTools: otherTools,
      tokens: topKTokens,
      toolsVisibleCount: topK.length,
      chatMsg: q.ragResponse,
      statusMsg: 'Selesai',
      ragPhase: 'done',
      ragScores: topK,
    },
  ];
}

// ─── DOM HELPERS ──────────────────────────────────────────────────────────────

function el(id) { return document.getElementById(id); }

function animateCounter(elementId, target, duration = 900) {
  const elem = el(elementId);
  if (!elem) return;
  const start = performance.now();
  const from = parseInt(elem.dataset.current || '0');
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (target - from) * ease);
    elem.textContent = current === 0 ? '—' : current.toLocaleString();
    elem.dataset.current = current;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function buildToolCard(tool) {
  const m = MODULE_META[tool.module];
  const card = document.createElement('div');
  card.className = 'tool-card dimmed';
  card.id = `tool-${tool.module.substring(0,3)}-${tool.id}`;
  card.dataset.toolId = tool.id;
  card.dataset.module = tool.module;
  card.innerHTML = `
    <div class="tool-card-header" style="border-left: 4px solid ${m.color}">
      <span class="tool-module-badge" style="background:${m.bg};color:${m.color}">${m.label}</span>
      <span class="tool-tokens">${tool.tokens}t</span>
    </div>
    <div class="tool-card-name">${tool.name}</div>
    <div class="tool-card-id">${tool.id}</div>
    <div class="tool-card-desc">${tool.desc}</div>
  `;
  return card;
}

function setToolStates(gridId, step) {
  const grid = el(gridId);
  if (!grid) return;
  const cards = grid.querySelectorAll('.tool-card');
  cards.forEach(card => {
    const tid = card.dataset.toolId;
    card.classList.remove('visible', 'dimmed', 'selected', 'pulse');
    if (step.selectedTool && step.selectedTool === tid) {
      card.classList.add('selected', 'pulse');
    } else if (step.highlightTools && step.highlightTools.includes(tid)) {
      card.classList.add('visible');
    } else if (step.dimTools && step.dimTools.includes(tid)) {
      card.classList.add('dimmed');
    } else {
      card.classList.add('dimmed');
    }
  });
}

function buildToolGrid(gridId) {
  const grid = el(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  TOOLS.forEach(tool => grid.appendChild(buildToolCard(tool)));
}

function populateQuerySelect(selectId, approach) {
  const sel = el(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">— Pilih Query Contoh —</option>';
  QUERIES.forEach((q, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${q.id}: "${q.text}"`;
    sel.appendChild(opt);
  });
}

function addChatMessage(msgsId, html, role = 'user') {
  const msgs = el(msgsId);
  if (!msgs) return;
  const placeholder = msgs.querySelector('.chat-placeholder');
  if (placeholder) placeholder.remove();

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;
  bubble.innerHTML = html;
  msgs.appendChild(bubble);
  msgs.scrollTop = msgs.scrollHeight;
}

function clearChat(msgsId) {
  const msgs = el(msgsId);
  if (!msgs) return;
  msgs.innerHTML = '<div class="chat-placeholder">Pilih query dan klik ▶ Jalankan untuk memulai simulasi</div>';
}

// ─── STEP RENDERER ────────────────────────────────────────────────────────────

function renderStep(approach, stepIndex, steps) {
  const s = steps[stepIndex];
  const prefix = approach;

  // Step progress
  const prog = el(`${prefix}-steps-progress`);
  if (prog) {
    prog.innerHTML = steps.map((st, i) => `
      <div class="step-dot ${i < stepIndex ? 'done' : i === stepIndex ? 'active' : ''}" title="${st.title}">
        <span>${i + 1}</span>
      </div>
    `).join('<div class="step-line"></div>');
  }

  // Current step panel
  const panel = el(`${prefix}-current-step`);
  if (panel) {
    let extra = '';

    if (s.loading) {
      extra += '<div class="loading-dots"><span></span><span></span><span></span></div>';
    }
    if (s.warning) {
      extra += `<div class="step-warning">${s.warning}</div>`;
    }
    if (s.pipeline) {
      extra += buildPipelineViz(s.pipeline);
    }
    if (s.ragScores) {
      extra += buildRagScoreViz(s.ragScores, steps[stepIndex].phase === 'search' ? 0 : 1);
    }

    panel.innerHTML = `
      <div class="step-header">
        <span class="step-icon">${s.icon}</span>
        <span class="step-title">${s.title}</span>
      </div>
      <div class="step-desc">${s.desc}</div>
      ${extra}
    `;
  }

  // Metrics
  animateCounter(`${prefix}-token-count`, s.tokens);
  const tv = el(`${prefix}-tools-visible`);
  if (tv) tv.textContent = s.toolsVisibleCount === 0 ? '—' : `${s.toolsVisibleCount} / ${TOOLS.length}`;
  const acc = el(`${prefix}-accuracy`);
  if (acc) {
    if (s.phase === 'selected' || s.phase === 'done') {
      const correct = approach === 'baseline' ? state.baseline.query?.baselineCorrect
        : approach === 'registry' ? state.registry.query?.registryCorrect
        : state.rag.query?.ragCorrect;
      acc.innerHTML = correct
        ? '<span class="badge-green">✅ Benar</span>'
        : '<span class="badge-red">❌ Salah</span>';
    } else {
      acc.textContent = '—';
    }
  }

  // Tool grid
  setToolStates(`${prefix}-tools-grid`, s);

  // Chat message on done
  if (s.chatMsg) {
    const query = getQuery(approach);
    if (query) {
      clearChat(`${prefix}-messages`);
      addChatMessage(`${prefix}-messages`, `<strong>Pengguna:</strong> ${query.text}`, 'user');
      setTimeout(() => {
        addChatMessage(`${prefix}-messages`, s.chatMsg, 'bot');
      }, 400);
    }
  }

  // Status
  const statusEl = el(`${prefix}-chat-status`);
  if (statusEl) {
    statusEl.textContent = s.statusMsg || '';
    statusEl.className = 'chat-status ' + (s.phase === 'done' ? (getQuery(approach)?.[`${approach}Correct`] ? 'ok' : 'err') : 'active');
  }

  // Update step counter
  const sc = el(`${prefix}-step-counter`);
  if (sc) sc.textContent = `${stepIndex + 1} / ${steps.length}`;

  // Update button states
  const prevBtn = el(`${prefix}-prev`);
  const nextBtn = el(`${prefix}-next`);
  if (prevBtn) prevBtn.disabled = stepIndex <= 0;
  if (nextBtn) nextBtn.disabled = stepIndex >= steps.length - 1;
}

function buildPipelineViz(active) {
  const stages = [
    { key: 'keywords', label: '🔑 Kata Kunci' },
    { key: 'module',   label: '🗂️ Filter Modul' },
    { key: 'budget',   label: '💰 Budget Cap' },
    { key: 'llm',      label: '🧠 LLM' },
  ];
  const html = stages.map((s, i) => {
    const cls = active.includes(s.key) ? 'pipe-stage active' : 'pipe-stage';
    const arrow = i < stages.length - 1 ? '<div class="pipe-arrow">→</div>' : '';
    return `<div class="${cls}">${s.label}</div>${arrow}`;
  }).join('');
  return `<div class="pipeline-viz">${html}</div>`;
}

function buildRagScoreViz(scores, animate) {
  const items = scores.slice(0, 8).map(s => {
    const tool = TOOLS.find(t => t.id === s.id);
    const m = MODULE_META[tool?.module] || { color: '#888', label: '' };
    const pct = Math.round(s.score * 100);
    return `
      <div class="rag-score-row">
        <div class="rag-score-name" title="${s.id}">${tool?.name || s.id}</div>
        <div class="rag-score-bar-wrap">
          <div class="rag-score-bar" style="width:${animate ? pct : 0}%;background:${m.color};transition:width 0.8s ease ${animate * 0.1}s">
          </div>
        </div>
        <div class="rag-score-val">${s.score.toFixed(2)}</div>
      </div>
    `;
  }).join('');
  return `<div class="rag-scores">${items}</div>`;
}

// ─── SIMULATION CONTROL ───────────────────────────────────────────────────────

function getQuery(approach) {
  const s = state[approach];
  return s.queryIdx >= 0 ? QUERIES[s.queryIdx] : null;
}

function getSteps(approach) {
  const q = getQuery(approach);
  if (!q) return [];
  if (approach === 'baseline') return buildBaselineSteps(q);
  if (approach === 'registry') return buildRegistrySteps(q);
  if (approach === 'rag')      return buildRagSteps(q);
  return [];
}

function initApproach(approach) {
  const s = state[approach];
  const q = getQuery(approach);
  if (!q) return;
  const steps = getSteps(approach);
  s.steps = steps;
  s.step = 0;
  clearChat(`${approach}-messages`);
  resetTokenDisplay(approach);
  renderStep(approach, 0, steps);
  el(`${approach}-prev`).disabled = true;
  el(`${approach}-next`).disabled = false;
  el(`${approach}-reset`).disabled = false;
}

function resetTokenDisplay(approach) {
  const el2 = el(`${approach}-token-count`);
  if (el2) { el2.textContent = '—'; el2.dataset.current = '0'; }
  const tv = el(`${approach}-tools-visible`);
  if (tv) tv.textContent = '—';
  const acc = el(`${approach}-accuracy`);
  if (acc) acc.textContent = '—';
}

function stepForward(approach) {
  const s = state[approach];
  const steps = s.steps;
  if (!steps || s.step >= steps.length - 1) return;
  s.step++;
  renderStep(approach, s.step, steps);
}

function stepBack(approach) {
  const s = state[approach];
  const steps = s.steps;
  if (!steps || s.step <= 0) return;
  s.step--;
  renderStep(approach, s.step, steps);
}

function resetApproach(approach) {
  const s = state[approach];
  if (s.timer) clearTimeout(s.timer);
  s.playing = false;
  s.step = 0;
  clearChat(`${approach}-messages`);
  resetTokenDisplay(approach);
  const steps = s.steps;
  if (steps && steps.length) {
    renderStep(approach, 0, steps);
  }
  const panel = el(`${approach}-current-step`);
  if (panel) panel.innerHTML = '<div class="step-waiting">Simulasi di-reset. Klik "Berikutnya" untuk mulai.</div>';
  const grid = el(`${approach}-tools-grid`);
  if (grid) {
    grid.querySelectorAll('.tool-card').forEach(c => {
      c.classList.remove('visible','selected','pulse');
      c.classList.add('dimmed');
    });
  }
}

function playAll(approach) {
  const s = state[approach];
  const steps = s.steps;
  if (!steps) return;
  s.playing = true;
  const DELAY = 1600;
  function tick() {
    if (!s.playing || s.step >= steps.length - 1) {
      s.playing = false;
      return;
    }
    s.step++;
    renderStep(approach, s.step, steps);
    s.timer = setTimeout(tick, DELAY);
  }
  s.timer = setTimeout(tick, 400);
}

// ─── TAB SWITCHING ────────────────────────────────────────────────────────────

function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
  const btn = document.querySelector(`.tab[data-tab="${tabName}"]`);
  if (btn) btn.classList.add('active');
  const pane = el(`pane-${tabName}`);
  if (pane) pane.classList.add('active');
  state.activeTab = tabName;

  if (tabName === 'comparison') renderComparison();
}

function toggleHelp() {
  const m = el('helpOverlay');
  m.classList.toggle('visible');
}

// ─── COMPARISON TAB ───────────────────────────────────────────────────────────

function renderComparison() {
  const pane = el('pane-comparison');
  if (!pane || pane.dataset.rendered) return;
  pane.dataset.rendered = '1';

  const baselineTokens = [2426, 7985, 23893];
  const registryTokens = [893, 1241, 1239];
  const ragTokens = [950, 1280, 1310];
  const scenarios = ['S1 (30 tools)', 'S2 (100 tools)', 'S3 (300 tools)'];
  const maxToken = 25000;

  function bar(val, color, label) {
    const pct = Math.round((val / maxToken) * 100);
    return `
      <div class="cmp-bar-row">
        <div class="cmp-bar-label">${label}</div>
        <div class="cmp-bar-track">
          <div class="cmp-bar" style="width:0%;background:${color}" data-target="${pct}"></div>
          <span class="cmp-bar-value">${val.toLocaleString()}</span>
        </div>
      </div>`;
  }

  const tokenSection = scenarios.map((sc, i) => `
    <div class="cmp-scenario">
      <h4>${sc}</h4>
      ${bar(baselineTokens[i], '#EF4444', '❌ Baseline')}
      ${bar(registryTokens[i], '#10B981', '✅ Tool Registry')}
      ${bar(ragTokens[i],       '#8B5CF6', '🔍 Tool RAG')}
    </div>
  `).join('');

  pane.innerHTML = `
    <div class="cmp-container">
      <div class="cmp-header">
        <h2>📊 Perbandingan Tiga Pendekatan Tool Management</h2>
        <p>Berdasarkan hasil eksperimen resmi Gemini Native v2 (n=558, 100 query × 3 repeat × 3 skenario)</p>
      </div>

      <section class="cmp-section">
        <h3>Token Usage — Semakin Rendah Semakin Baik</h3>
        <div class="cmp-token-grid">${tokenSection}</div>
      </section>

      <section class="cmp-section">
        <h3>Perbandingan Metrik Utama</h3>
        <div class="cmp-table-wrap">
          <table class="cmp-table">
            <thead>
              <tr>
                <th>Metrik</th>
                <th class="bad">⚠️ Baseline</th>
                <th class="good">✅ Tool Registry</th>
                <th class="mid">🔍 Tool RAG</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Token S1 (30 tools)</td><td class="bad">2.426</td><td class="good">893 <small>(−63%)</small></td><td class="mid">~950 <small>(−61%)</small></td></tr>
              <tr><td>Token S3 (300 tools)</td><td class="bad">23.893</td><td class="good">1.239 <small>(−95%)</small></td><td class="mid">~1.310 <small>(−95%)</small></td></tr>
              <tr><td>Akurasi S1</td><td class="bad">68.8%</td><td class="good">75.0% <small>(+6.3pp)</small></td><td class="mid">~73% <small>(+4pp est.)</small></td></tr>
              <tr><td>Akurasi S3</td><td class="bad">71.4%</td><td class="good">77.6% <small>(+6.3pp)</small></td><td class="mid">~74% <small>(+3pp est.)</small></td></tr>
              <tr><td>Scalability</td><td class="bad">O(N) — linier</td><td class="good">O(1) — konstan</td><td class="mid">O(1) — konstan</td></tr>
              <tr><td>Uji Statistik Token</td><td>—</td><td class="good">Wilcoxon p&lt;0.0001<br>Cohen's d ≥ 11</td><td class="mid">Belum diuji</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="cmp-section">
        <h3>Infrastruktur yang Dibutuhkan</h3>
        <div class="cmp-table-wrap">
          <table class="cmp-table">
            <thead>
              <tr>
                <th>Komponen</th>
                <th class="bad">Baseline</th>
                <th class="good">Tool Registry</th>
                <th class="mid">Tool RAG</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Vector Database</td><td>❌ Tidak</td><td class="good">❌ Tidak perlu</td><td class="mid">✅ Diperlukan</td></tr>
              <tr><td>Embedding Model</td><td>❌ Tidak</td><td class="good">❌ Tidak perlu</td><td class="mid">✅ Diperlukan</td></tr>
              <tr><td>Metadata Tool</td><td>❌ Tidak</td><td class="good">✅ Ya (terstruktur)</td><td class="mid">Opsional</td></tr>
              <tr><td>Sinkronisasi Katalog</td><td>Manual</td><td class="good">Manual / otomatis</td><td class="mid">Auto-sync vektor</td></tr>
              <tr><td>Latensi Tambahan</td><td>—</td><td class="good">&lt; 1 ms (in-memory)</td><td class="mid">50–200 ms (embedding)</td></tr>
              <tr><td>Cocok untuk</td><td>Prototype kecil</td><td class="good">ERP terstruktur (zerlo.id)</td><td class="mid">Ribuan tools tidak terstruktur</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="cmp-section cmp-conclusion">
        <h3>🏆 Mengapa Tool Registry Dipilih untuk zerlo.id?</h3>
        <div class="conclusion-grid">
          <div class="conclusion-card good">
            <div class="cc-icon">🗂️</div>
            <h4>Struktur Metadata Ada</h4>
            <p>zerlo.id sudah memiliki 38 modul terstruktur, RBAC, dan subscription tier — metadata yang dibutuhkan Tool Registry sudah tersedia secara alami.</p>
          </div>
          <div class="conclusion-card good">
            <div class="cc-icon">⚡</div>
            <h4>Zero Infrastructure Overhead</h4>
            <p>Tidak butuh vector DB atau embedding model — filter berjalan in-memory dengan Python dict. Latensi tambahan &lt; 1 ms.</p>
          </div>
          <div class="conclusion-card good">
            <div class="cc-icon">📈</div>
            <h4>Terbukti Secara Statistik</h4>
            <p>Wilcoxon p &lt; 0.0001, Cohen's d ≥ 11 di semua skenario. Penghematan token 63–95% terbukti bukan kebetulan.</p>
          </div>
          <div class="conclusion-card mid">
            <div class="cc-icon">🔮</div>
            <h4>Tool RAG sebagai Future Work</h4>
            <p>Saat zerlo.id berkembang ke ribuan tools tanpa struktur modul yang jelas, Tool RAG menjadi pilihan yang tepat sebagai tahap lanjutan.</p>
          </div>
        </div>
      </section>

      <section class="cmp-section cmp-scalability">
        <h3>📐 Skalabilitas: Baseline O(N) vs Registry O(1)</h3>

        <div class="scale-viz">
          <!-- BASELINE row — normalized against its own max: 80.070 token -->
          <div class="scale-row" id="scale-baseline">
            <div class="scale-label-col">
              <span class="scale-label">⚠️ Baseline</span>
              <span class="scale-maxlabel">maks: 80.070 token</span>
            </div>
            <div class="scale-bars">
              ${(() => {
                const ns     = [30, 100, 300, 1000];
                const tokens = ns.map(n => Math.round(n * 80 + 70));
                const maxTok = tokens[tokens.length - 1];
                const colors = ['#FCA5A5','#F87171','#EF4444','#DC2626'];
                const ratios = [null, null, '19×', '64×'];
                return tokens.map((tok, i) => {
                  const pct = Math.round(tok / maxTok * 100);
                  return `<div class="scale-item">
                    <div class="scale-bar-v" style="height:${pct}%;background:${colors[i]}">
                      ${ratios[i] ? `<span class="scale-ratio">${ratios[i]}</span>` : ''}
                    </div>
                    <div class="scale-n">${ns[i]}</div>
                    <div class="scale-t">${tok.toLocaleString()}t</div>
                  </div>`;
                }).join('');
              })()}
            </div>
          </div>

          <!-- REGISTRY row — normalized against its own max: 1.250 token -->
          <div class="scale-row" id="scale-registry">
            <div class="scale-label-col">
              <span class="scale-label">🗂️ Registry</span>
              <span class="scale-maxlabel">maks: 1.250 token</span>
            </div>
            <div class="scale-bars">
              ${(() => {
                const ns     = [30, 100, 300, 1000];
                const tokens = [893, 1241, 1239, 1250];
                const maxTok = Math.max(...tokens);
                return tokens.map((tok, i) => {
                  const pct = Math.round(tok / maxTok * 100);
                  return `<div class="scale-item">
                    <div class="scale-bar-v" style="height:${pct}%;background:#10B981"></div>
                    <div class="scale-n">${ns[i]}</div>
                    <div class="scale-t">${tok.toLocaleString()}t</div>
                  </div>`;
                }).join('');
              })()}
            </div>
          </div>
        </div>

        <div class="scale-ratios-row">
          <span class="scale-ratio-chip">S1 (30 tools): <strong>2.470 ÷ 893 = 2,8×</strong></span>
          <span class="scale-ratio-chip">S2 (100 tools): <strong>8.070 ÷ 1.241 = 6,5×</strong></span>
          <span class="scale-ratio-chip scale-ratio-highlight">S3 (300 tools): <strong>24.070 ÷ 1.239 = 19,4×</strong></span>
          <span class="scale-ratio-chip scale-ratio-highlight">S4 (1.000 tools): <strong>80.070 ÷ 1.250 = 64×</strong></span>
        </div>
        <p class="scale-caption">
          Sumbu X: jumlah tools dalam katalog · Sumbu Y: token per panggilan LLM
          (tiap baris dinormalisasi terhadap maksimum barisnya sendiri)<br>
          Registry selalu ≤ 1.250 token apapun ukuran katalog — <strong>O(1) terhadap N</strong>
        </p>
      </section>
    </div>
  `;

  // Animate bars after DOM inserted
  requestAnimationFrame(() => {
    setTimeout(() => {
      pane.querySelectorAll('.cmp-bar').forEach(b => {
        b.style.width = b.dataset.target + '%';
      });
    }, 300);
  });
}

// ─── INITIALIZATION ───────────────────────────────────────────────────────────

function initApproachPane(approach, title, introText, metricValue, metricLabel, metricClass) {
  const pane = el(`pane-${approach}`);
  if (!pane) return;

  const introIcon = approach === 'baseline' ? '⚠️' : approach === 'registry' ? '🗂️' : '🔍';
  const engineLabel = approach === 'baseline' ? 'Engine — Baseline (Tanpa Filter)'
    : approach === 'registry' ? 'Engine — Tool Registry (Filter Metadata)'
    : 'Engine — Tool RAG (Pencarian Semantik)';

  pane.innerHTML = `
    <div class="tab-intro ${approach}-intro">
      <div class="intro-icon">${introIcon}</div>
      <div class="intro-content">
        <h2>${title}</h2>
        <p>${introText}</p>
      </div>
      <div class="intro-metric ${metricClass}">
        <div class="metric-val">${metricValue}</div>
        <div class="metric-lbl">${metricLabel}</div>
      </div>
    </div>

    <div class="sim-container">
      <div class="sim-left">
        <div class="chat-panel">
          <div class="chat-header">
            <span>🤖 zerlo.id AI Agent</span>
            <span class="chat-status" id="${approach}-chat-status">Siap</span>
          </div>
          <div class="chat-messages" id="${approach}-messages">
            <div class="chat-placeholder">Pilih query di bawah dan klik ▶ Jalankan untuk memulai simulasi</div>
          </div>
          <div class="chat-controls-row">
            <select class="query-select" id="${approach}-query-select">
              <option value="">— Pilih Query Contoh —</option>
            </select>
            <div class="chat-btns">
              <button class="btn-play" id="${approach}-play" disabled>▶ Jalankan</button>
              <button class="btn-reset" id="${approach}-reset" disabled>↺ Reset</button>
            </div>
          </div>
        </div>
      </div>

      <div class="sim-right">
        <div class="engine-panel">
          <div class="engine-header">⚙️ ${engineLabel}</div>
          <div class="steps-progress" id="${approach}-steps-progress">
            <div class="step-waiting-small">Menunggu query dipilih...</div>
          </div>
          <div class="current-step" id="${approach}-current-step">
            <div class="step-waiting">Pilih query dan klik ▶ Jalankan atau "Berikutnya" untuk melihat langkah demi langkah</div>
          </div>
          <div class="metrics-row">
            <div class="metric-box token-box">
              <div class="metric-box-label">Token Digunakan</div>
              <div class="metric-box-value" id="${approach}-token-count" data-current="0">—</div>
            </div>
            <div class="metric-box">
              <div class="metric-box-label">Tools Terlihat LLM</div>
              <div class="metric-box-value" id="${approach}-tools-visible">—</div>
            </div>
            <div class="metric-box">
              <div class="metric-box-label">Hasil Pemilihan</div>
              <div class="metric-box-value" id="${approach}-accuracy">—</div>
            </div>
          </div>
          <div class="step-nav">
            <button class="btn-step-nav" id="${approach}-prev" disabled>◀ Sebelumnya</button>
            <span class="step-counter" id="${approach}-step-counter">— / —</span>
            <button class="btn-step-nav" id="${approach}-next" disabled>Berikutnya ▶</button>
          </div>
        </div>
      </div>
    </div>

    <div class="tools-section">
      <div class="tools-header">
        <h3>Katalog Tools — S1 (${TOOLS.length} Tools) <small>Visualisasi tools yang terlihat LLM</small></h3>
        <div class="tools-legend">
          ${Object.entries(MODULE_META).map(([k,v]) =>
            `<span class="leg-item"><span class="leg-dot" style="background:${v.color}"></span>${v.label}</span>`
          ).join('')}
          <span class="leg-sep">|</span>
          <span class="leg-item"><span class="leg-state visible-dot"></span>Terlihat LLM</span>
          <span class="leg-item"><span class="leg-state dimmed-dot"></span>Tidak Terlihat</span>
          <span class="leg-item"><span class="leg-state selected-dot"></span>Dipilih</span>
        </div>
      </div>
      <div class="tools-grid" id="${approach}-tools-grid"></div>
    </div>
  `;

  // Build tool grid
  buildToolGrid(`${approach}-tools-grid`);

  // Populate query select
  populateQuerySelect(`${approach}-query-select`, approach);

  // Event listeners
  el(`${approach}-query-select`).addEventListener('change', (e) => {
    const idx = parseInt(e.target.value);
    if (isNaN(idx)) { state[approach].queryIdx = -1; return; }
    state[approach].queryIdx = idx;
    state[approach].query = QUERIES[idx];
    clearChat(`${approach}-messages`);
    el(`${approach}-play`).disabled = false;
    el(`${approach}-reset`).disabled = false;
    el(`${approach}-current-step`).innerHTML = '<div class="step-waiting">Query dipilih. Klik ▶ Jalankan atau "Berikutnya" untuk memulai.</div>';
    el(`${approach}-steps-progress`).innerHTML = '';
    resetTokenDisplay(approach);
    // Reset tool grid
    el(`${approach}-tools-grid`).querySelectorAll('.tool-card').forEach(c => {
      c.classList.remove('visible','selected','pulse');
      c.classList.add('dimmed');
    });
    state[approach].steps = null;
    state[approach].step = -1;
    el(`${approach}-next`).disabled = false;
    el(`${approach}-prev`).disabled = true;
    el(`${approach}-step-counter`).textContent = '— / —';
  });

  el(`${approach}-play`).addEventListener('click', () => {
    const s = state[approach];
    if (!s.steps) {
      initApproach(approach);
    }
    playAll(approach);
  });

  el(`${approach}-reset`).addEventListener('click', () => {
    if (state[approach].steps) {
      resetApproach(approach);
    }
  });

  el(`${approach}-next`).addEventListener('click', () => {
    const s = state[approach];
    if (!s.steps) {
      initApproach(approach);
    } else {
      stepForward(approach);
    }
  });

  el(`${approach}-prev`).addEventListener('click', () => stepBack(approach));
}

document.addEventListener('DOMContentLoaded', () => {
  // Init all 3 simulation tabs
  initApproachPane(
    'baseline',
    'Pendekatan Baseline: Semua Tools Dimuat ke Konteks LLM',
    'AI Agent menerima <strong>seluruh katalog tools</strong> tanpa filter. Token bertambah linier: O(N) terhadap jumlah tools. Skenario S3 dengan 300 tools = <strong>23.893 token per query</strong>.',
    '23.893 token',
    'Token S3 (300 tools) — tanpa filter',
    'bad'
  );

  initApproachPane(
    'registry',
    'Tool Registry: Filter Deterministik Berbasis Metadata',
    'Registry memfilter katalog berdasarkan <strong>modul, role, tier,</strong> dan <strong>budget cap</strong> sebelum diteruskan ke LLM. Token konstan ≈ <strong>1.239 token</strong> meski katalog berkembang ke 300 tools.',
    '−95% token',
    'Penghematan di S3 vs baseline (p < 0.0001)',
    'good'
  );

  initApproachPane(
    'rag',
    'Tool RAG: Pencarian Semantik Berbasis Embedding',
    'Query diubah menjadi <em>embedding vector</em>, lalu cosine similarity digunakan untuk menemukan tools paling relevan secara semantik. Efektif untuk katalog besar tanpa struktur modul, namun membutuhkan <strong>vector DB + embedding model</strong>.',
    'Vector DB',
    'Infrastruktur tambahan diperlukan',
    'mid'
  );

  // Tab switching
  document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Help modal
  el('helpBtn').addEventListener('click', toggleHelp);
  el('helpClose').addEventListener('click', toggleHelp);
  el('helpOverlay').addEventListener('click', (e) => {
    if (e.target === el('helpOverlay')) toggleHelp();
  });

  // Module legend in help
  const legendEl = el('helpModuleLegend');
  if (legendEl) {
    legendEl.innerHTML = Object.entries(MODULE_META).map(([k, v]) =>
      `<span class="help-module-badge" style="background:${v.bg};color:${v.color};border:1px solid ${v.color}">${v.label}</span>`
    ).join('');
  }
});
