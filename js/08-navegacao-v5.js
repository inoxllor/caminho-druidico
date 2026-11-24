/* ============================================================
   v5: navegação (folha "Mais"), Grimório com detalhe, Roda com
   destaque do próximo festival e bibliotecas carregadas a pedido
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const BOTTOM_TABS = ['today', 'oracle', 'runes', 'tarot', 'astro', 'wheel', 'journal'];

// Folha "Mais" e diálogos: fecham ao tocar fora
const sheet = $('more-sheet');
window.openMore = () => { if (sheet && !sheet.open) sheet.showModal(); };
window.closeMore = () => { if (sheet && sheet.open) sheet.close(); };
document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

const _sw = switchTab;
switchTab = function (id) {
  _sw(id);
  closeMore();
  document.querySelectorAll('.sheet-item[data-tab]').forEach(b => {
    const on = b.dataset.tab === id;
    b.classList.toggle('active', on);
    if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  const more = $('bot-nav-more'), inBar = BOTTOM_TABS.includes(id);
  if (more) { more.classList.toggle('active', !inBar); more.classList.toggle('theme-muted', inBar); }
};

// Tarot: nada é sorteado sozinho e a tiragem sobrevive à visita ao Grimório
let keptDraw = null;
const TAROT_EMPTY = '<p class="text-sm theme-muted text-center">Formule a pergunta, se quiser, e escolha uma tiragem.</p>';
window.restoreTarotDraw = function () {
  const c = $('tarot-card-container');
  c.textContent = '';
  if (keptDraw) c.appendChild(keptDraw); else c.innerHTML = TAROT_EMPTY;
  c.classList.toggle('draw-area', !keptDraw);
  $('tarot-save-bar').classList.toggle('hidden', !keptDraw);
  if (keptDraw) updateTarotReveal();
};
const _stm = switchTarotMode;
switchTarotMode = function (m) {
  const c = $('tarot-card-container');
  if (c.querySelector('[data-tarot-slot]')) keptDraw = c.firstElementChild;
  _stm(m);
  if (m === 'gallery') { c.classList.remove('draw-area'); $('tarot-save-bar').classList.add('hidden'); }
  ['draw', 'gallery'].forEach(k => $('tarot-mode-' + k).setAttribute('aria-pressed', k === m));
};
const _dt = drawTarotCard;
drawTarotCard = function (n) {
  keptDraw = null;
  _dt(n);
  $('tarot-card-container').classList.remove('draw-area');
};
window.openTarotDetail = function (id) {
  const c = NORDIC_TAROT_DECK.find(x => x.id === id), d = $('tarot-detail');
  if (!c || !d) return;
  const art = c.artDesc || describeTarotArt(c);
  $('tarot-detail-body').innerHTML = `
    <div style="max-width:196px;margin:0 auto">${tarotFaceHTML(c)}</div>
    <div>
      <h3 id="tarot-detail-title" class="font-cinzel text-xl font-bold theme-title">${esc(c.name)}</h3>
      <p class="text-xs theme-muted mt-1">${esc(c.num)} • ${esc(c.title)} • ${esc(c.realm)}${c.rune ? ' • ' + c.rune : ''}</p>
    </div>
    <div class="theme-inner border rounded-lg p-3 text-left">
      <p class="text-xs font-semibold theme-accent uppercase tracking-wide">Descrição da imagem</p>
      <p class="text-sm theme-title leading-relaxed mt-1">${esc(art)}</p>
    </div>
    <div class="theme-inner border rounded-lg p-3 text-left">
      <p class="text-xs font-semibold c-ok uppercase tracking-wide">Direita</p>
      <p class="text-sm theme-title leading-relaxed mt-1">${esc(c.upright)}</p>
    </div>
    <div class="theme-inner border rounded-lg p-3 text-left">
      <p class="text-xs font-semibold c-danger uppercase tracking-wide">Invertida</p>
      <p class="text-sm theme-title leading-relaxed mt-1">${esc(c.reversed)}</p>
    </div>`;
  d.showModal();
};

// Roda do Ano: marca e abre o próximo festival
const FEST_ID = { Yule: 1, Imbolc: 2, Ostara: 3, Beltane: 4, Litha: 5, Lughnasadh: 6, Mabon: 7, Samhain: 8 };
function markNextFestival() {
  const n = window.__druid.nextFestival();
  window.__nextFestId = FEST_ID[n.name];
  document.querySelectorAll('.wheel-node').forEach(g => g.classList.toggle('is-next', +g.dataset.fest === window.__nextFestId));
  const b = $('fest-next-badge');
  if (b) b.textContent = n.days === 0 ? 'É hoje' : `Próximo festival · em ${n.days} dia${n.days === 1 ? '' : 's'}`;
}

// Bibliotecas de exportação: só são descarregadas quando são precisas
const LIBS = {
  jspdf: ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', () => window.jspdf],
  jszip: ['https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', () => window.JSZip]
};
const pending = {};
function loadLib(k) {
  const [src, ok] = LIBS[k];
  if (ok()) return Promise.resolve();
  return pending[k] || (pending[k] = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.dataset.lazy = '1';
    s.onload = res;
    s.onerror = () => { delete pending[k]; s.remove(); rej(new Error(k)); };
    document.head.appendChild(s);
  }));
}
window.loadLib = loadLib;
[['exportRitualPDF', 'jspdf'], ['exportTarotPDF', 'jspdf'], ['downloadProjectZip', 'jszip']].forEach(([fn, lib]) => {
  const orig = window[fn];
  window[fn] = async function (...a) {
    try { await loadLib(lib); } catch { return showToast('Sem ligação: não foi possível carregar a biblioteca de exportação.'); }
    return orig.apply(this, a);
  };
});

window.addEventListener('DOMContentLoaded', () => {
  markNextFestival();
  selectFestival(window.__nextFestId || 8);
  setTarotFilter('all');
  switchRuneMode('draw');
});
})();
