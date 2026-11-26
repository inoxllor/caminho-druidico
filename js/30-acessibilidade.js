/* ============================================================
   Acessibilidade (feedback dos utilizadores, 2026-11-26):
   - ao mudar de secção pela navegação, o foco passa para o título
     da secção, para o leitor de ecrã anunciar onde se está;
   - o resultado de cada tiragem é anunciado numa zona aria-live;
   - nas boas-vindas, o foco começa no tema que está escolhido.
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);

/* Zona de anúncios: uma só, educada, partilhada por todos os oráculos. */
function liveRegion() {
  let el = $('sr-announce');
  if (!el) {
    el = document.createElement('div');
    el.id = 'sr-announce';
    el.className = 'sr-only';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    document.body.appendChild(el);
  }
  return el;
}
/** Anuncia um texto ao leitor de ecrã (repete mesmo que seja igual ao anterior). */
window.announce = function (text) {
  const el = liveRegion();
  el.textContent = '';
  setTimeout(() => { el.textContent = String(text || ''); }, 60);
};

/* ——— Foco no título ao mudar de secção ——— */
const NAV = 'nav, .sidebar, .bottom-nav, #more-sheet, #search-dialog, .realm-tile, .portal-card';
const prevSwitch = window.switchTab;
if (typeof prevSwitch === 'function') {
  window.switchTab = function (id, ...rest) {
    const from = document.activeElement;
    const viaNav = !!(from && from !== document.body && from.closest && from.closest(NAV));
    const r = prevSwitch.call(this, id, ...rest);
    if (viaNav) {
      requestAnimationFrame(() => {
        const sec = $('tab-' + id);
        const h = sec && sec.querySelector('h1, h2');
        if (!h || sec.classList.contains('hidden')) return;
        if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
        try { h.focus({ preventScroll: true }); } catch { h.focus(); }
      });
    }
    return r;
  };
}

/* ——— Anúncio do resultado das tiragens ——— */
function runeLine(r) {
  const name = r.baseName || String(r.name || '').replace(/ \(invertida\)$/, '');
  return `${r.pos ? r.pos + ': ' : ''}${name}${r.reversed ? ', invertida' : ''}`;
}
function describe(kind) {
  try {
    if (kind === 'runes' && typeof lastRuneReading !== 'undefined' && lastRuneReading.length) {
      const S = window.lastRuneSpreadInfo;
      return `${S ? 'Tiragem ' + S.name : 'Runas'}. ` + lastRuneReading.map(runeLine).join('. ') + '.';
    }
    if (kind === 'ogham' && typeof lastOghamReading !== 'undefined' && lastOghamReading.length) {
      return 'Ogham. ' + lastOghamReading.map(o => `${o.name}, ${o.tree}`).join('. ') + '.';
    }
    if (kind === 'tarot' && typeof lastTarotReading !== 'undefined' && lastTarotReading.length) {
      return `${(typeof lastTarotMeta !== 'undefined' && lastTarotMeta.spread) || 'Tarot'}. ` +
        lastTarotReading.map(t => `${t.pos ? t.pos + ': ' : ''}${t.card?.name || ''}${t.isReversed ? ', invertida' : ''}`).join('. ') + '.';
    }
  } catch { /* nada a anunciar */ }
  return '';
}
[['drawRunes', 'runes'], ['drawOghamCard', 'ogham'], ['drawTarotCard', 'tarot']].forEach(([fn, kind]) => {
  const orig = window[fn];
  if (typeof orig !== 'function') return;
  window[fn] = function (...a) {
    const r = orig.apply(this, a);
    const t = describe(kind);
    if (t) announce(t);
    return r;
  };
});
const origYN = window.drawYesNo;
if (typeof origYN === 'function') {
  window.drawYesNo = function (...a) {
    const r = origYN.apply(this, a);
    setTimeout(() => {
      const box = document.querySelector('.tab-content:not(.hidden) .oc-answer b');
      if (box) announce(`O oráculo responde: ${box.textContent}.`);
    }, 0);
    return r;
  };
}

/* ——— Boas-vindas: o foco começa no tema escolhido (não no primeiro) ——— */
const dlg = $('onboard');
if (dlg) {
  dlg.addEventListener('focusin', function once(e) {
    if (!e.target.closest('.ob-themes')) return;
    const on = dlg.querySelector('.ob-themes [aria-checked="true"]');
    if (on && e.target !== on && !dlg.dataset.themeFocused) { dlg.dataset.themeFocused = '1'; on.focus(); }
  });
  const obs = new MutationObserver(() => {
    if (!dlg.open) return;
    const on = dlg.querySelector('.ob-themes [aria-checked="true"]');
    const first = dlg.querySelector('.ob-themes button');
    if (on && document.activeElement === first && first !== on) on.focus();
  });
  obs.observe(dlg, { attributes: true, attributeFilter: ['open'] });
}
})();
