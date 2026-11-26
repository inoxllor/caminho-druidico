/* ============================================================
   Navegação e leitura (feedback dos utilizadores, 2026-11-26):
   - painel «Ambiente & ajustes» (tema, tamanho do texto, Lanterna,
     Zen, Modo Bosque e Awen), em vez de botões soltos no topo;
   - fichas: o guia das árvores & ervas e as 24 runas aparecem em
     grelha compacta; cada ficha abre um painel com tudo;
   - «Continuar onde parei» no Hoje.
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ls = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* sem armazenamento */ } }
};

/* ——— Ambiente & ajustes ——— */
let settingsOpener = null;
window.openSettings = function () {
  const d = $('settings-dialog');
  if (!d) return;
  settingsOpener = document.activeElement;
  if (!d.open) { try { d.showModal(); } catch { d.setAttribute('open', ''); } }
};
window.closeSettings = function () {
  const d = $('settings-dialog');
  if (d && d.open) d.close();
};
const sd = $('settings-dialog');
if (sd) {
  sd.addEventListener('click', e => { if (e.target === sd) sd.close(); });
  sd.addEventListener('close', () => { try { settingsOpener && document.contains(settingsOpener) && settingsOpener.focus(); } catch { /* nada */ } });
}

/* ——— Fichas ——— */
const FICHAS = [
  // contentor, item, partes que ficam visíveis na grelha, nome da ficha
  { list: 'tree-list', item: '[data-tree]', keep: ':scope > div:first-child, :scope > figure, :scope > h3', name: el => el.querySelector('h3')?.textContent || el.dataset.tree },
  { list: 'rune-gallery-grid', item: '.rl-card', keep: ':scope > .rl-top', name: el => el.querySelector('.rl-top')?.textContent.replace(/\s+/g, ' ').trim() }
];
let current = null; // { el, placeholder }

function fichaDialog() {
  let d = $('ficha-dialog');
  if (d) return d;
  d = document.createElement('dialog');
  d.id = 'ficha-dialog';
  d.className = 'modal ficha-dialog';
  d.setAttribute('aria-labelledby', 'ficha-title');
  d.innerHTML = `<div class="sd-head"><h2 id="ficha-title" class="sr-only">Ficha</h2>
    <button type="button" class="sd-close" aria-label="Fechar a ficha" data-close><svg class="ic" aria-hidden="true"><use href="#i-close"></use></svg></button></div>
    <div class="ficha-body"></div>`;
  document.body.appendChild(d);
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  d.addEventListener('close', closeFicha);
  return d;
}
function closeFicha() {
  if (!current) return;
  const { el, placeholder, opener } = current;
  el.classList.remove('fc-open');
  placeholder.replaceWith(el);
  current = null;
  try { (opener && document.contains(opener) ? opener : el.querySelector('.fc-open-btn'))?.focus(); } catch { /* nada */ }
}
function openFicha(el, cfg, opener) {
  const d = fichaDialog();
  if (current) closeFicha();
  const placeholder = document.createElement('div');
  placeholder.className = 'fc-placeholder';
  placeholder.style.display = 'none';
  el.before(placeholder);
  current = { el, placeholder, opener };
  $('ficha-title').textContent = cfg.name(el) || 'Ficha';
  el.classList.add('fc-open');
  d.querySelector('.ficha-body').appendChild(el);
  if (!d.open) { try { d.showModal(); } catch { d.setAttribute('open', ''); } }
  d.querySelector('.ficha-body').scrollTop = 0;
}
window.openFichaFor = function (el) {
  const cfg = FICHAS.find(c => el.closest('#' + c.list));
  if (cfg) openFicha(el, cfg);
};

function decorate(cfg) {
  const list = $(cfg.list);
  if (!list) return;
  list.classList.add('fichas', 'fichas-' + cfg.list);
  list.querySelectorAll(':scope > ' + cfg.item).forEach(el => {
    if (el.dataset.fc) return;
    el.dataset.fc = '1';
    el.classList.add('fc-item');
    el.querySelectorAll(cfg.keep).forEach(k => k.classList.add('fc-keep'));
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'fc-open-btn';
    b.setAttribute('aria-label', `Abrir a ficha: ${cfg.name(el) || ''}`);
    b.addEventListener('click', () => openFicha(el, cfg, b));
    el.appendChild(b);
  });
}
function watch(cfg) {
  const list = $(cfg.list);
  if (!list) return;
  decorate(cfg);
  new MutationObserver(() => decorate(cfg)).observe(list, { childList: true });
}
function initFichas() { FICHAS.forEach(c => { watch(c); watchFound(c); }); }

/* Pesquisa global e «Roda das árvores»: quando uma ficha é assinalada
   (classe is-found), abre-se logo o painel dessa ficha. */
function watchFound(cfg) {
  const list = $(cfg.list);
  if (!list) return;
  new MutationObserver(ms => {
    for (const m of ms) {
      const el = m.target;
      if (el.classList && el.classList.contains('fc-item') && el.classList.contains('is-found') && !el.classList.contains('fc-open')) {
        el.classList.remove('is-found');
        openFicha(el, cfg);
        return;
      }
    }
  }).observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] });
}

/* ——— Continuar onde parei ——— */
const SKIP = new Set(['today']);
function tabLabel(id) {
  const b = $('desk-nav-' + id);
  return b ? b.textContent.trim() : '';
}
function renderResume() {
  const host = $('tab-today');
  if (!host) return;
  let box = $('today-resume');
  const last = ls.get('druid_last_tab', '');
  const name = last && tabLabel(last);
  if (!name) { if (box) box.remove(); return; }
  if (!box) {
    box = document.createElement('button');
    box.type = 'button';
    box.id = 'today-resume';
    box.className = 'today-resume';
    const feat = $('today-feature');
    (feat || host.firstElementChild).before(box);
  }
  box.innerHTML = `<svg class="ic" aria-hidden="true"><use href="#i-redo"></use></svg><span>Continuar onde parei: <b>${esc(name)}</b></span><span aria-hidden="true">→</span>`;
  box.onclick = () => switchTab(last);
}
const prev = window.switchTab;
if (typeof prev === 'function') {
  window.switchTab = function (id, ...rest) {
    const r = prev.call(this, id, ...rest);
    if (!SKIP.has(id) && !String(id).startsWith('portal-') && tabLabel(id)) ls.set('druid_last_tab', id);
    if (id === 'today') renderResume();
    return r;
  };
}

function init() { initFichas(); renderResume(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 300));
else setTimeout(init, 300);
})();
