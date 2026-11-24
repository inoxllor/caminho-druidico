/* ============================================================
   AJUSTES v2: novas funcionalidades & árvore por data
   ============================================================ */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function getCelticTree(d) {
    const md = (d.getMonth() + 1) * 100 + d.getDate();
    const ranges = [[1224, 1231, 'Beith'], [101, 120, 'Beith'], [121, 217, 'Luis'], [218, 317, 'Fearn'], [318, 414, 'Saille'],
        [415, 512, 'Nion'], [513, 609, 'Huath'], [610, 707, 'Duir'], [708, 804, 'Tinne'], [805, 901, 'Coll'],
        [902, 929, 'Muin'], [930, 1027, 'Gort'], [1028, 1124, 'Ngetal'], [1125, 1223, 'Straif']];
    const hit = ranges.find(r => md >= r[0] && md <= r[1]);
    return OGHAM_DATA.find(o => o.name === (hit ? hit[2] : 'Beith')) || OGHAM_DATA[0];
}

function renderDailyFew() {
    const el = document.getElementById('daily-few');
    if (!el) return;
    const d = new Date();
    const seed = ((d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) * 9301 + 49297) % 233280;
    const o = OGHAM_DATA[seed % OGHAM_DATA.length];
    el.innerHTML = `
        <span class="text-5xl theme-glyph font-bold leading-none shrink-0" aria-hidden="true">${o.symbol}</span>
        <div class="flex-1 min-w-0">
            <p class="text-sm theme-muted">Letra Ogham do dia</p>
            <h3 class="text-base font-semibold theme-info-hl">${o.name} · ${o.tree}</h3>
            <p class="text-sm theme-muted leading-relaxed mt-1">${o.meaning}</p>
            <button type="button" onclick="dailyToJournal()" class="btn-link">Guardar no Diário</button>
        </div>`;
    el.dataset.text = `LETRA OGHAM DO DIA: ${o.symbol} ${o.name} (${o.tree}): ${o.meaning}`;
    const h = document.getElementById('tm-hint-signs'); if (h) h.textContent = `${o.symbol} ${o.name} · ${o.tree.split(' (')[0]}`;
}
function appendToJournal(text) {
    const area = document.getElementById('journal-input');
    area.value = (area.value + `\n--- [${new Date().toLocaleString('pt-PT')}] ${text}\n`).trimStart();
    autoSaveJournal();
    showToast('Guardado no Diário!');
}
function dailyToJournal() { appendToJournal(document.getElementById('daily-few').dataset.text); }

function getReadingLog() { try { return JSON.parse(localStorage.getItem('druid_readings') || '[]'); } catch { return []; } }
function recordReading(type) {
    const lines = type === 'ogham' ? lastOghamReading.map(o => `${o.symbol} ${o.name}`)
        : type === 'runes' ? lastRuneReading.map(r => `${r.symbol} ${r.name}`)
        : lastTarotReading.map(t => `${t.card.name}${t.isReversed ? ' (inv.)' : ''}`);
    if (!lines.length) return;
    const log = getReadingLog();
    log.unshift({ t: Date.now(), type, lines });
    localStorage.setItem('druid_readings', JSON.stringify(log.slice(0, 30)));
    renderReadingLog();
}
function renderReadingLog() {
    const list = document.getElementById('history-list');
    if (!list) return;
    const log = getReadingLog();
    const names = { ogham: 'Ogham', runes: 'Runas', tarot: 'Tarot' };
    document.getElementById('history-count').textContent = log.length ? `(${log.length})` : '';
    list.innerHTML = log.length ? log.map((r, i) => `
        <div class="theme-inner border rounded-lg p-3 flex items-center justify-between gap-3">
            <div class="min-w-0"><span class="theme-muted">${new Date(r.t).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })} · ${names[r.type]}</span>
            <div class="theme-title truncate">${esc(r.lines.join(' · '))}</div></div>
            <button onclick="logToJournal(${i})" class="theme-accent font-semibold cursor-pointer whitespace-nowrap">Para o Diário</button>
        </div>`).join('') : '<p class="theme-muted">Ainda não fez nenhuma leitura.</p>';
}
function logToJournal(i) { const r = getReadingLog()[i]; if (r) appendToJournal(`${r.type.toUpperCase()}: ${r.lines.join(' · ')}`); }
function clearReadingLog() { if (confirm('Limpar o histórico de leituras?')) { localStorage.removeItem('druid_readings'); renderReadingLog(); } }
['drawOghamCard:ogham', 'drawRunes:runes', 'drawTarotCard:tarot'].forEach(p => {
    const [fn, type] = p.split(':'), orig = window[fn];
    if (typeof orig === 'function') window[fn] = function (...a) { const r = orig.apply(this, a); recordReading(type); return r; };
});

function searchJournal(q) {
    const out = document.getElementById('journal-search-results');
    q = q.trim().toLowerCase();
    if (q.length < 2) { out.classList.add('hidden'); out.innerHTML = ''; return; }
    const hits = document.getElementById('journal-input').value.split('\n').filter(l => l.toLowerCase().includes(q));
    out.classList.remove('hidden');
    out.innerHTML = hits.length ? hits.slice(0, 30).map(l => `<div class="py-1 border-b border-[var(--border-color)]">${esc(l)}</div>`).join('') : 'Sem resultados.';
}
function updateWordCount() {
    const v = document.getElementById('journal-input').value.trim();
    document.getElementById('journal-wordcount').textContent = `${v ? v.split(/\s+/).length : 0} palavras`;
}
const _autoSaveJournal = autoSaveJournal;
autoSaveJournal = function () { _autoSaveJournal(); updateWordCount(); };

const _switchTab = switchTab;
switchTab = function (id) {
    _switchTab(id);
    try { localStorage.setItem('druid_tab', id); } catch {}
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    document.querySelectorAll('[aria-current]').forEach(e => e.removeAttribute('aria-current'));
    ['desk', 'mob', 'bot'].forEach(p => { const b = document.getElementById(`${p}-nav-${id}`); if (b) b.setAttribute('aria-current', 'page'); });
    const t = document.getElementById('tab-' + id);
    if (t) { t.classList.remove('tab-in'); void t.offsetWidth; t.classList.add('tab-in'); }
    window.scrollTo({ top: 0 });
};
window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (document.getElementById('tab-' + id)) switchTab(id); });

window.addEventListener('DOMContentLoaded', () => {
    renderDailyFew();
    renderReadingLog();
    updateWordCount();
    const id = location.hash.slice(1);
    if (id && document.getElementById('tab-' + id)) switchTab(id);
});
