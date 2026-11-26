/* ============================================================
   Grove e leituras (feedback dos utilizadores, 2026-11-26):
   - partilhar um ritual por link ou código QR (gerado aqui mesmo,
     sem serviços externos) e imprimi-lo em A5;
   - escolher o lugar do grove (em vez de Alenquer por omissão);
   - histórico de leituras em calendário, com a pergunta guardada.
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const toast = m => { if (typeof showToast === 'function') showToast(m); };
const ls = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* nada */ } }
};

/* ——— Código QR local (js/vendor-qrcode.js, MIT) ——— */
window.qrSVG = function (text, cell = 4) {
  if (typeof qrcode !== 'function') return '';
  const qr = qrcode(0, 'L');
  if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  qr.addData(text, 'Byte');
  qr.make();
  return qr.createSvgTag({ cellSize: cell, margin: 2, scalable: true, alt: 'Código QR' });
};

/* ——— Partilhar um ritual por link ——— */
const FIELDS = ['rit-title', 'rit-peace', 'rit-intent', 'rit-elem', 'rit-blessing', 'rit-words'];
const b64 = { enc: s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))) };
function ritualLink() {
  const data = {};
  FIELDS.forEach(id => { const el = $(id); if (el && el.value) data[id.slice(4)] = el.value; });
  const base = location.href.split('#')[0];
  return `${base}#ritual=${b64.enc(JSON.stringify(data))}`;
}
function shareDialog() {
  let d = $('share-ritual-dialog');
  if (d) return d;
  d = document.createElement('dialog');
  d.id = 'share-ritual-dialog';
  d.className = 'modal settings-dialog';
  d.setAttribute('aria-labelledby', 'share-ritual-title');
  d.innerHTML = `<div class="sd-head"><h2 id="share-ritual-title" class="font-cinzel text-lg font-bold theme-title">Partilhar o ritual</h2>
      <button type="button" class="sd-close" aria-label="Fechar" data-close><svg class="ic" aria-hidden="true"><use href="#i-close"></use></svg></button></div>
    <p class="text-sm theme-muted">Os membros do grove leem o código com a câmara do telemóvel ou abrem o link. O ritual vai dentro do próprio link: não fica guardado em nenhum servidor.</p>
    <div class="qr-box" id="share-ritual-qr"></div>
    <div class="flex gap-2 mt-3"><input id="share-ritual-url" readonly class="flex-1 min-w-0 theme-inner border rounded-lg px-3 py-2 text-xs" aria-label="Link do ritual">
      <button type="button" id="share-ritual-copy" class="bg-[var(--btn-primary)] text-[var(--on-primary)] font-semibold text-sm px-3 py-2 rounded-lg cursor-pointer">Copiar</button></div>`;
  document.body.appendChild(d);
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  d.querySelector('#share-ritual-copy').addEventListener('click', async () => {
    const v = $('share-ritual-url').value;
    try { await navigator.clipboard.writeText(v); toast('Link copiado.'); } catch { $('share-ritual-url').select(); toast('Selecione e copie o link.'); }
  });
  return d;
}
window.shareRitualLink = async function () {
  const url = ritualLink();
  if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
    try { await navigator.share({ title: $('rit-title')?.value || 'Ritual do grove', url }); return; } catch { /* segue para o diálogo */ }
  }
  const d = shareDialog();
  $('share-ritual-url').value = url;
  $('share-ritual-qr').innerHTML = url.length < 2300 ? qrSVG(url) : '<p class="text-sm theme-muted">O ritual é longo demais para um código QR: use o link.</p>';
  if (!d.open) { try { d.showModal(); } catch { d.setAttribute('open', ''); } }
};
function loadRitualFromLink() {
  const m = location.hash.match(/^#ritual=([\w-]+)/);
  if (!m) return;
  try {
    const data = JSON.parse(b64.dec(m[1]));
    FIELDS.forEach(id => { const el = $(id), v = data[id.slice(4)]; if (el && typeof v === 'string') el.value = v.slice(0, 2000); });
    if (typeof updateRitualPreview === 'function') updateRitualPreview();
    if (typeof switchTab === 'function') switchTab('ritual');
    history.replaceState(null, '', location.pathname + location.search);
    toast('Ritual partilhado aberto.');
  } catch { toast('Não foi possível abrir o ritual deste link.'); }
}

/* ——— Imprimir o pergaminho em A5 ——— */
window.printRitualA5 = function () {
  if (typeof updateRitualPreview === 'function') updateRitualPreview();
  document.body.classList.add('print-ritual');
  const done = () => { document.body.classList.remove('print-ritual'); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
  setTimeout(done, 1500);
};

function addRitualButtons() {
  const pdf = document.querySelector('button[onclick="exportRitualPDF()"]');
  if (!pdf || $('ritual-share-row')) return;
  const row = document.createElement('div');
  row.id = 'ritual-share-row';
  row.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3';
  row.innerHTML = `<button type="button" onclick="shareRitualLink()" class="w-full theme-inner border text-sm theme-title font-semibold py-3 rounded-lg cursor-pointer">Partilhar com o grove (link e QR)</button>
    <button type="button" onclick="printRitualA5()" class="w-full theme-inner border text-sm theme-title font-semibold py-3 rounded-lg cursor-pointer">Imprimir em A5</button>`;
  pdf.parentElement.after(row);
}

/* ——— Lugar do grove ——— */
window.setGrovePlace = async function () {
  const q = $('grove-place-q')?.value.trim();
  const out = $('grove-place-status');
  if (!q) { out.textContent = 'Escreva o nome de uma localidade.'; return; }
  out.textContent = 'A procurar…';
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`, { headers: { 'Accept-Language': 'pt' } });
    const [hit] = r.ok ? await r.json() : [];
    if (!hit) { out.textContent = 'Não encontrei esse lugar. Experimente «Sintra, Portugal».'; return; }
    const lat = +hit.lat, lon = +hit.lon;
    const label = String(hit.display_name || q).split(',').slice(0, 2).join(',').trim();
    ls.set('druid_lat', lat.toFixed(4)); ls.set('druid_lon', lon.toFixed(4)); ls.set('druid_loc_label', label);
    try { localStorage.removeItem('druid_weather_cache'); } catch { /* nada */ }
    ['updateAstronomy', 'updateAstronomyCharts'].forEach(f => { try { typeof window[f] === 'function' && window[f](); } catch { /* nada */ } });
    try { typeof fetchLocalWeather === 'function' && fetchLocalWeather(lat, lon); } catch { /* nada */ }
    out.textContent = `Lugar do grove: ${label} (${lat.toFixed(2)}, ${lon.toFixed(2)}). A Lua, o Sol e o tempo passam a usar este lugar.`;
    toast('Lugar do grove guardado.');
  } catch { out.textContent = 'Sem ligação: não foi possível procurar o lugar.'; }
};
function addGrovePlace() {
  const card = document.querySelector('#tab-grove .theme-card');
  if (!card || $('grove-place')) return;
  const box = document.createElement('div');
  box.id = 'grove-place';
  box.className = 'theme-inner border rounded-xl p-4 space-y-2';
  box.innerHTML = `<h3 class="font-cinzel text-base font-bold theme-title">Lugar do grove</h3>
    <p class="text-sm theme-muted">Usado para a Lua, o nascer e o pôr do Sol e o tempo, em vez de Alenquer. Agora: <b id="grove-place-now">${esc(ls.get('druid_loc_label', 'Alenquer, PT (por omissão)'))}</b>.</p>
    <div class="flex gap-2"><input id="grove-place-q" type="search" placeholder="Ex.: Sintra, Portugal" aria-label="Localidade do grove" class="flex-1 min-w-0 theme-card border rounded-lg px-3 py-2 text-sm" onkeydown="if(event.key==='Enter')setGrovePlace()">
      <button type="button" onclick="setGrovePlace()" class="bg-[var(--btn-primary)] text-[var(--on-primary)] font-semibold text-sm px-4 py-2 rounded-lg cursor-pointer">Guardar</button></div>
    <p id="grove-place-status" class="text-xs theme-muted" role="status"></p>`;
  card.appendChild(box);
}

/* ——— Leituras: pergunta guardada e calendário ——— */
const QID = { runes: 'rune-question', ogham: 'ogham-question', tarot: 'tarot-question' };
const prevRecord = window.recordReading;
if (typeof prevRecord === 'function') {
  window.recordReading = function (type) {
    prevRecord(type);
    try {
      const log = JSON.parse(localStorage.getItem('druid_readings') || '[]');
      if (!log.length) return;
      const q = $(QID[type])?.value.trim();
      const spread = type === 'runes' ? window.lastRuneSpreadInfo?.name : type === 'tarot' && typeof lastTarotMeta !== 'undefined' ? lastTarotMeta.spread : '';
      if (q) log[0].q = q;
      if (spread) log[0].spread = spread;
      localStorage.setItem('druid_readings', JSON.stringify(log));
      renderCalendar();
    } catch { /* nada */ }
  };
}
let calMonth = null, calDay = null;
const NAMES = { ogham: 'Ogham', runes: 'Runas', tarot: 'Tarot' };
function dayKey(t) { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
function renderCalendar() {
  const host = $('reading-history');
  if (!host) return;
  let box = $('reading-cal');
  if (!box) {
    box = document.createElement('div');
    box.id = 'reading-cal';
    box.className = 'reading-cal';
    host.querySelector('summary').after(box);
  }
  const log = (() => { try { return JSON.parse(localStorage.getItem('druid_readings') || '[]'); } catch { return []; } })();
  const now = new Date();
  if (!calMonth) calMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const lead = (new Date(y, m, 1).getDay() + 6) % 7; // semana começa à segunda
  const byDay = {};
  log.forEach(r => { (byDay[dayKey(r.t)] = byDay[dayKey(r.t)] || []).push(r); });
  const t0 = calMonth.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  const title = t0.charAt(0).toUpperCase() + t0.slice(1);
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<span></span>';
  for (let d = 1; d <= days; d++) {
    const k = `${y}-${m}-${d}`, list = byDay[k] || [];
    const today = y === now.getFullYear() && m === now.getMonth() && d === now.getDate();
    cells += list.length
      ? `<button type="button" data-day="${k}" class="${calDay === k ? 'is-sel' : ''}${today ? ' is-today' : ''}" aria-label="${d}: ${list.length} leitura${list.length > 1 ? 's' : ''}">${d}<i aria-hidden="true">${'•'.repeat(Math.min(3, list.length))}</i></button>`
      : `<span class="${today ? 'is-today' : ''}">${d}</span>`;
  }
  const sel = calDay ? (byDay[calDay] || []) : [];
  box.innerHTML = `<div class="rc-head"><button type="button" data-nav="-1" aria-label="Mês anterior">‹</button><b>${esc(title)}</b><button type="button" data-nav="1" aria-label="Mês seguinte">›</button></div>
    <div class="rc-grid"><abbr title="segunda">S</abbr><abbr title="terça">T</abbr><abbr title="quarta">Q</abbr><abbr title="quinta">Q</abbr><abbr title="sexta">S</abbr><abbr title="sábado">S</abbr><abbr title="domingo">D</abbr>${cells}</div>
    ${sel.length ? `<ul class="rc-day">${sel.map(r => `<li><span class="theme-muted">${new Date(r.t).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} · ${NAMES[r.type] || ''}${r.spread ? ' · ' + esc(r.spread) : ''}</span>
      ${r.q ? `<div class="rc-q">«${esc(r.q)}»</div>` : ''}<div class="theme-title">${esc((r.lines || []).join(' · '))}</div></li>`).join('')}</ul>` : '<p class="text-xs theme-muted">Toque num dia marcado para ver as leituras.</p>'}`;
  box.onclick = e => {
    const nav = e.target.closest('[data-nav]');
    if (nav) { calMonth = new Date(y, m + Number(nav.dataset.nav), 1); calDay = null; renderCalendar(); return; }
    const day = e.target.closest('[data-day]');
    if (day) { calDay = calDay === day.dataset.day ? null : day.dataset.day; renderCalendar(); }
  };
}

function init() { addRitualButtons(); addGrovePlace(); renderCalendar(); loadRitualFromLink(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 350));
else setTimeout(init, 350);
})();
