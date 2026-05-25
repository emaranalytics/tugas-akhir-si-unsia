// =============================================================================
// DIAGRAM.JS — Architecture & Workflow Diagrams
// Tugas Akhir: Muhammad Ridwan (220101010009) — Universitas Siber Asia
// =============================================================================

// ─── MODULE COLOR MAP (same as simulation.js) ────────────────────────────────
const MOD_COLOR = {
  inventory:  '#3B82F6',
  sales:      '#10B981',
  accounting: '#F59E0B',
  supplier:   '#8B5CF6',
  hr:         '#EC4899',
  compliance: '#EF4444',
  menu:       '#14B8A6',
  customer:   '#F97316',
};

const TOOL_MODULES = [
  'inventory','inventory','inventory','inventory','inventory',
  'sales','sales','sales','sales','sales',
  'accounting','accounting','accounting','accounting','accounting',
  'supplier','supplier','supplier','supplier','supplier',
  'hr','hr','hr',
  'compliance','compliance','compliance',
  'menu','menu',
  'customer','customer',
];

// ─── TAB SWITCHING ────────────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
  const btn = document.querySelector(`.tab[data-tab="${name}"]`);
  if (btn) btn.classList.add('active');
  const pane = document.getElementById(`pane-${name}`);
  if (pane) pane.classList.add('active');
}

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ─── MINI TOOL GRID BUILDER ───────────────────────────────────────────────────
function buildMiniTools(containerId, options = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const {
    visibleModules = null,   // null = all visible; array of module names = only those
    selectedIndex  = -1,     // index of selected tool (-1 = none)
    animate        = false,
  } = options;

  el.innerHTML = '';
  TOOL_MODULES.forEach((mod, i) => {
    const div = document.createElement('div');
    div.className = 'mini-tool';
    div.style.background = MOD_COLOR[mod] || '#ccc';
    div.title = mod;

    if (visibleModules !== null && !visibleModules.includes(mod)) {
      div.classList.add('dim');
    }
    if (selectedIndex === i) {
      div.classList.add('sel');
    }
    if (animate) {
      div.style.transition = `all .3s ease ${i * 0.03}s`;
    }
    el.appendChild(div);
  });
}

// ─── BASELINE ANIMATION ───────────────────────────────────────────────────────
let baselineAnimStep = 0;
let baselineTimer    = null;
let baselineRunning  = false;

const BASELINE_STEPS = [
  {
    desc: 'Query diterima oleh AI Agent',
    activeNodes: ['node-b-user', 'node-b-agent'],
    tokenText: '—',
    toolVisible: null,
    filterSteps: [],
    arrowActive: ['arr-b-1'],
  },
  {
    desc: 'AI Agent memuat SEMUA tools ke konteks — tanpa filter apapun',
    activeNodes: ['node-b-agent', 'node-b-catalog'],
    tokenText: '2.426 token',
    toolVisible: 'all',
    filterSteps: [],
    arrowActive: ['arr-b-2'],
  },
  {
    desc: 'Seluruh 30 tool definitions masuk ke Context Window LLM',
    activeNodes: ['node-b-catalog', 'node-b-context'],
    tokenText: '2.426 token',
    toolVisible: 'all',
    filterSteps: [],
    arrowActive: ['arr-b-3'],
  },
  {
    desc: 'LLM harus memilih dari 30 tools — risiko salah meningkat',
    activeNodes: ['node-b-context', 'node-b-llm'],
    tokenText: '2.426 token',
    toolVisible: 'all',
    filterSteps: [],
    arrowActive: ['arr-b-4'],
  },
  {
    desc: 'Tool dipilih (akurasi 68.8% — 31.2% permintaan salah tool)',
    activeNodes: ['node-b-llm', 'node-b-response'],
    tokenText: '2.426 token',
    toolVisible: 'selected',
    filterSteps: [],
    arrowActive: ['arr-b-5'],
  },
];

function renderBaselineStep(step) {
  const s = BASELINE_STEPS[step];

  // Highlight nodes
  document.querySelectorAll('#pane-baseline .flow-node').forEach(n => n.classList.remove('active-node'));
  s.activeNodes.forEach(id => {
    const n = document.getElementById(id);
    if (n) n.classList.add('active-node');
  });

  // Token count
  const tc = document.getElementById('b-token-count');
  if (tc) tc.textContent = s.tokenText;

  // Mini tools
  if (s.toolVisible === 'all') {
    buildMiniTools('b-mini-tools', { visibleModules: null });
  } else if (s.toolVisible === 'selected') {
    buildMiniTools('b-mini-tools', { visibleModules: null, selectedIndex: 0 });
  } else {
    buildMiniTools('b-mini-tools', { visibleModules: [] });
  }

  // Step description
  const sd = document.getElementById('b-step-desc');
  if (sd) sd.textContent = s.desc;

  // Step counter
  const sc = document.getElementById('b-step-counter');
  if (sc) sc.textContent = `Langkah ${step + 1} / ${BASELINE_STEPS.length}`;

  // Animate arrows - highlight active
  document.querySelectorAll('#pane-baseline .arrow-line').forEach(a => {
    a.classList.remove('animated');
  });
  s.arrowActive.forEach(id => {
    const a = document.getElementById(id);
    if (a) a.classList.add('animated');
  });
}

function baselineNext() {
  if (baselineAnimStep < BASELINE_STEPS.length - 1) {
    baselineAnimStep++;
    renderBaselineStep(baselineAnimStep);
  }
}
function baselinePrev() {
  if (baselineAnimStep > 0) {
    baselineAnimStep--;
    renderBaselineStep(baselineAnimStep);
  }
}
function baselineReset() {
  baselineAnimStep = 0;
  renderBaselineStep(0);
  if (baselineTimer) clearInterval(baselineTimer);
  baselineRunning = false;
  updatePlayBtn('b-play', false);
}
function baselinePlay() {
  if (baselineRunning) {
    clearInterval(baselineTimer);
    baselineRunning = false;
    updatePlayBtn('b-play', false);
    return;
  }
  baselineRunning = true;
  updatePlayBtn('b-play', true);
  baselineTimer = setInterval(() => {
    if (baselineAnimStep >= BASELINE_STEPS.length - 1) {
      clearInterval(baselineTimer);
      baselineRunning = false;
      updatePlayBtn('b-play', false);
      return;
    }
    baselineAnimStep++;
    renderBaselineStep(baselineAnimStep);
  }, 1500);
}

// ─── REGISTRY ANIMATION ───────────────────────────────────────────────────────
let registryAnimStep = 0;
let registryTimer    = null;
let registryRunning  = false;

const REGISTRY_STEPS = [
  {
    desc: 'Query diterima oleh Tool Registry sebelum diteruskan ke LLM',
    activeNodes: ['node-r-user', 'node-r-registry'],
    tokenText: '—',
    toolVisible: [],
    filterActive: [],
    arrowActive: ['arr-r-1'],
  },
  {
    desc: 'Step 1 — Ekstraksi kata kunci: "stok", "bahan baku", "tepung"',
    activeNodes: ['node-r-registry'],
    tokenText: '—',
    toolVisible: [],
    filterActive: ['fs-1'],
    arrowActive: [],
  },
  {
    desc: 'Step 2 — Filter modul: terdeteksi "inventory" → 5 tools lolos',
    activeNodes: ['node-r-registry', 'node-r-catalog'],
    tokenText: '—',
    toolVisible: ['inventory'],
    filterActive: ['fs-1','fs-2'],
    arrowActive: ['arr-r-catalog'],
  },
  {
    desc: 'Step 3 — Filter role & tier: tidak ada pembatasan tambahan',
    activeNodes: ['node-r-registry'],
    tokenText: '—',
    toolVisible: ['inventory'],
    filterActive: ['fs-1','fs-2','fs-3'],
    arrowActive: [],
  },
  {
    desc: 'Step 4 — Budget cap diterapkan: maksimal 15 tools → 5 tools lolos',
    activeNodes: ['node-r-registry'],
    tokenText: '~893 token',
    toolVisible: ['inventory'],
    filterActive: ['fs-1','fs-2','fs-3','fs-4'],
    arrowActive: [],
  },
  {
    desc: 'Hanya 5 tool relevan dikirim ke LLM — token turun 63%',
    activeNodes: ['node-r-registry', 'node-r-context'],
    tokenText: '~893 token',
    toolVisible: ['inventory'],
    filterActive: ['fs-1','fs-2','fs-3','fs-4'],
    arrowActive: ['arr-r-2'],
  },
  {
    desc: 'LLM memilih dengan akurasi lebih tinggi: 75.0% (+6.3pp)',
    activeNodes: ['node-r-context', 'node-r-llm'],
    tokenText: '~893 token',
    toolVisible: ['inventory'],
    filterActive: ['fs-1','fs-2','fs-3','fs-4'],
    arrowActive: ['arr-r-3'],
  },
  {
    desc: 'Tool dipilih dengan benar: inventory_check_stock ✅',
    activeNodes: ['node-r-llm', 'node-r-response'],
    tokenText: '~893 token',
    toolVisible: ['inventory'],
    selectedIndex: 0,
    filterActive: ['fs-1','fs-2','fs-3','fs-4'],
    arrowActive: ['arr-r-4'],
  },
];

function renderRegistryStep(step) {
  const s = REGISTRY_STEPS[step];

  document.querySelectorAll('#pane-registry .flow-node').forEach(n => n.classList.remove('active-node'));
  s.activeNodes.forEach(id => {
    const n = document.getElementById(id);
    if (n) n.classList.add('active-node');
  });

  const tc = document.getElementById('r-token-count');
  if (tc) tc.textContent = s.tokenText;

  buildMiniTools('r-mini-tools', {
    visibleModules: s.toolVisible,
    selectedIndex: s.selectedIndex ?? -1,
  });

  // Filter steps
  document.querySelectorAll('#pane-registry .filter-step').forEach(f => f.classList.remove('active'));
  s.filterActive.forEach(id => {
    const f = document.getElementById(id);
    if (f) f.classList.add('active');
  });

  const sd = document.getElementById('r-step-desc');
  if (sd) sd.textContent = s.desc;

  const sc = document.getElementById('r-step-counter');
  if (sc) sc.textContent = `Langkah ${step + 1} / ${REGISTRY_STEPS.length}`;

  document.querySelectorAll('#pane-registry .arrow-line').forEach(a => a.classList.remove('animated'));
  s.arrowActive.forEach(id => {
    const a = document.getElementById(id);
    if (a) a.classList.add('animated', 'green');
  });
}

function registryNext()  { if (registryAnimStep < REGISTRY_STEPS.length - 1) { registryAnimStep++; renderRegistryStep(registryAnimStep); } }
function registryPrev()  { if (registryAnimStep > 0) { registryAnimStep--; renderRegistryStep(registryAnimStep); } }
function registryReset() {
  registryAnimStep = 0; renderRegistryStep(0);
  if (registryTimer) clearInterval(registryTimer);
  registryRunning = false; updatePlayBtn('r-play', false);
}
function registryPlay() {
  if (registryRunning) {
    clearInterval(registryTimer); registryRunning = false; updatePlayBtn('r-play', false); return;
  }
  registryRunning = true; updatePlayBtn('r-play', true);
  registryTimer = setInterval(() => {
    if (registryAnimStep >= REGISTRY_STEPS.length - 1) {
      clearInterval(registryTimer); registryRunning = false; updatePlayBtn('r-play', false); return;
    }
    registryAnimStep++; renderRegistryStep(registryAnimStep);
  }, 1500);
}

// ─── RAG ANIMATION ────────────────────────────────────────────────────────────
let ragAnimStep   = 0;
let ragTimer      = null;
let ragRunning    = false;

const SIM_SCORES = [
  { name: 'Cek Stok',         score: 0.91, mod: 'inventory' },
  { name: 'Alert Stok Rendah',score: 0.78, mod: 'inventory' },
  { name: 'Update Stok',      score: 0.72, mod: 'inventory' },
  { name: 'Daftar Vendor',    score: 0.48, mod: 'supplier' },
  { name: 'Buat PO',          score: 0.45, mod: 'supplier' },
  { name: 'Admin Inv. 01',    score: 0.44, mod: 'inventory' },
  { name: 'Admin Inv. 02',    score: 0.41, mod: 'inventory' },
  { name: 'Lacak Pengiriman', score: 0.38, mod: 'supplier' },
];

const RAG_STEPS = [
  {
    desc: 'Query diterima: "Cek stok bahan baku tepung"',
    activeNodes: ['node-rag-user', 'node-rag-embed'],
    arrowActive: ['arr-rag-1'],
    showScores: false,
    topKVisible: [],
    tokenText: '—',
  },
  {
    desc: 'Embedding model mengubah query menjadi vektor dimensi tinggi',
    activeNodes: ['node-rag-embed'],
    arrowActive: [],
    showScores: false,
    topKVisible: [],
    tokenText: '—',
    showVector: true,
  },
  {
    desc: 'Vektor query dikirim ke Vector DB untuk similarity search',
    activeNodes: ['node-rag-embed', 'node-rag-vecdb'],
    arrowActive: ['arr-rag-2'],
    showScores: false,
    topKVisible: [],
    tokenText: '—',
  },
  {
    desc: 'Cosine similarity dihitung antara query vector dan setiap tool vector',
    activeNodes: ['node-rag-vecdb'],
    arrowActive: [],
    showScores: true,
    topKVisible: [],
    tokenText: '—',
  },
  {
    desc: 'Top-8 tools dengan similarity tertinggi dipilih',
    activeNodes: ['node-rag-vecdb', 'node-rag-context'],
    arrowActive: ['arr-rag-3'],
    showScores: true,
    topKVisible: ['inventory','supplier'],
    tokenText: '~950 token',
  },
  {
    desc: 'Tools relevan masuk ke Context Window LLM',
    activeNodes: ['node-rag-context', 'node-rag-llm'],
    arrowActive: ['arr-rag-4'],
    showScores: true,
    topKVisible: ['inventory','supplier'],
    tokenText: '~950 token',
  },
  {
    desc: 'LLM memilih tool dari kandidat top-k',
    activeNodes: ['node-rag-llm', 'node-rag-response'],
    arrowActive: ['arr-rag-5'],
    showScores: true,
    topKVisible: ['inventory','supplier'],
    selectedIndex: 0,
    tokenText: '~950 token',
  },
];

function renderRagStep(step) {
  const s = RAG_STEPS[step];

  document.querySelectorAll('#pane-rag .flow-node').forEach(n => n.classList.remove('active-node'));
  s.activeNodes.forEach(id => {
    const n = document.getElementById(id);
    if (n) n.classList.add('active-node');
  });

  const tc = document.getElementById('rag-token-count');
  if (tc) tc.textContent = s.tokenText;

  buildMiniTools('rag-mini-tools', {
    visibleModules: s.topKVisible.length ? s.topKVisible : (step < 4 ? [] : null),
    selectedIndex: s.selectedIndex ?? -1,
  });

  // Similarity score bars
  const scoreContainer = document.getElementById('rag-sim-scores');
  if (scoreContainer) {
    if (s.showScores) {
      scoreContainer.style.display = 'block';
      scoreContainer.querySelectorAll('.sim-bar-fill').forEach((bar, i) => {
        bar.style.width = Math.round(SIM_SCORES[i].score * 100) + '%';
      });
    } else {
      scoreContainer.style.display = 'none';
    }
  }

  // Vector display
  const vd = document.getElementById('rag-vector-display');
  if (vd) vd.style.display = s.showVector ? 'block' : 'none';

  const sd = document.getElementById('rag-step-desc');
  if (sd) sd.textContent = s.desc;

  const sc = document.getElementById('rag-step-counter');
  if (sc) sc.textContent = `Langkah ${step + 1} / ${RAG_STEPS.length}`;

  document.querySelectorAll('#pane-rag .arrow-line').forEach(a => {
    a.classList.remove('animated', 'green', 'purple');
  });
  s.arrowActive.forEach(id => {
    const a = document.getElementById(id);
    if (a) a.classList.add('animated', 'purple');
  });
}

function ragNext()  { if (ragAnimStep < RAG_STEPS.length - 1) { ragAnimStep++; renderRagStep(ragAnimStep); } }
function ragPrev()  { if (ragAnimStep > 0) { ragAnimStep--; renderRagStep(ragAnimStep); } }
function ragReset() {
  ragAnimStep = 0; renderRagStep(0);
  if (ragTimer) clearInterval(ragTimer);
  ragRunning = false; updatePlayBtn('rag-play', false);
}
function ragPlay() {
  if (ragRunning) {
    clearInterval(ragTimer); ragRunning = false; updatePlayBtn('rag-play', false); return;
  }
  ragRunning = true; updatePlayBtn('rag-play', true);
  ragTimer = setInterval(() => {
    if (ragAnimStep >= RAG_STEPS.length - 1) {
      clearInterval(ragTimer); ragRunning = false; updatePlayBtn('rag-play', false); return;
    }
    ragAnimStep++; renderRagStep(ragAnimStep);
  }, 1600);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function updatePlayBtn(id, playing) {
  const btn = document.getElementById(id);
  if (!btn) return;
  if (playing) {
    btn.textContent = '⏸ Pause';
    btn.classList.add('active');
  } else {
    btn.textContent = '▶ Play Otomatis';
    btn.classList.remove('active');
  }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Build initial mini tool grids
  buildMiniTools('b-mini-tools', { visibleModules: [] });
  buildMiniTools('r-mini-tools', { visibleModules: [] });
  buildMiniTools('rag-mini-tools', { visibleModules: [] });

  // Render step 0 for each
  renderBaselineStep(0);
  renderRegistryStep(0);
  renderRagStep(0);

  // Build similarity score bars (initially hidden)
  const scoreContainer = document.getElementById('rag-sim-scores');
  if (scoreContainer) {
    scoreContainer.innerHTML = SIM_SCORES.map(s =>
      `<div class="sim-bar-row">
        <div class="sim-bar-name">${s.name}</div>
        <div class="sim-bar-track">
          <div class="sim-bar-fill" style="width:0%;background:${MOD_COLOR[s.mod]}"></div>
        </div>
        <div class="sim-bar-val">${s.score.toFixed(2)}</div>
      </div>`
    ).join('');
    scoreContainer.style.display = 'none';
  }

  // Comparison tab architecture columns (mini flows)
  buildComparisonFlows();
});

function buildComparisonFlows() {
  // These are static, already in HTML
  // Just build the mini tool grids for comparison
  buildMiniTools('cmp-b-tools', { visibleModules: null });
  buildMiniTools('cmp-r-tools', { visibleModules: ['inventory'] });
  buildMiniTools('cmp-rag-tools', { visibleModules: ['inventory','supplier'] });
}
