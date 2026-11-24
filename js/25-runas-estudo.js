/* ============================================================
   Runas no Saber: guia completo das 24 runas (som, nome antigo e
   o que o nome quer dizer, significado direito e invertido) e
   treino em três modos. A galeria de js/06 passa a viver aqui.
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } }
};

/** Som e sentido do nome de cada runa (nomes reconstruídos do proto-germânico). */
const RUNE_LORE = {
  Fehu: { sound: 'f', word: 'gado, riqueza móvel' },
  Uruz: { sound: 'u', word: 'auroque, o boi selvagem' },
  Thurisaz: { sound: 'th', word: 'gigante (thurs), espinho' },
  Ansuz: { sound: 'a', word: 'um deus, os Æsir (Odin)' },
  Raidho: { sound: 'r', word: 'cavalgada, viagem' },
  Kenaz: { sound: 'k', word: 'tocha' },
  Gebo: { sound: 'g', word: 'dádiva, troca' },
  Wunjo: { sound: 'w', word: 'alegria' },
  Hagalaz: { sound: 'h', word: 'granizo' },
  Nauthiz: { sound: 'n', word: 'necessidade' },
  Isa: { sound: 'i', word: 'gelo' },
  Jera: { sound: 'j', word: 'ano, colheita' },
  Eihwaz: { sound: 'ei', word: 'teixo' },
  Perthro: { sound: 'p', word: 'copo de sortes (sentido incerto)' },
  Algiz: { sound: 'z', word: 'alce, proteção' },
  Sowilo: { sound: 's', word: 'sol' },
  Tiwaz: { sound: 't', word: 'o deus Tyr' },
  Berkano: { sound: 'b', word: 'bétula' },
  Ehwaz: { sound: 'e', word: 'cavalo' },
  Mannaz: { sound: 'm', word: 'ser humano' },
  Laguz: { sound: 'l', word: 'água, lago' },
  Ingwaz: { sound: 'ng', word: 'o deus Ing (Freyr)' },
  Dagaz: { sound: 'd', word: 'dia' },
  Othala: { sound: 'o', word: 'herança, terra dos antepassados' }
};
window.RUNE_LORE = RUNE_LORE;
const runes = () => (typeof RUNES_EXTENDED !== 'undefined' ? RUNES_EXTENDED : []);
const short = t => String(t).split(/[,.]/)[0].trim();

/* ——— Guia: cartões com mais informação ——— */
window.renderRuneGallery = function () {
  if (typeof initRuneFilters === 'function') initRuneFilters();
  const grid = $('rune-gallery-grid'), countEl = $('rune-gallery-count');
  if (!grid) return;
  const q = (typeof runeQuery === 'string' ? runeQuery : '').trim().toLowerCase();
  const aett = typeof activeRuneAett === 'string' ? activeRuneAett : 'all';
  const list = runes().filter(r => {
    const l = RUNE_LORE[r.name] || {};
    const text = `${r.name} ${r.aett} ${r.meaning} ${r.reversed} ${l.word || ''}`.toLowerCase();
    return (aett === 'all' || r.aett === aett) && (q.length < 2 || text.includes(q));
  });
  if (countEl) countEl.textContent = `A mostrar ${list.length} de 24 runas`;
  grid.innerHTML = list.map(r => {
    const l = RUNE_LORE[r.name] || {};
    const n = runes().indexOf(r) + 1;
    return `
    <article class="rl-card">
      <div class="rl-top">
        <span class="rl-stone" aria-hidden="true">${esc(r.symbol)}</span>
        <div class="rl-id">
          <h3 class="font-cinzel rl-name">${esc(r.name)}</h3>
          <p class="rl-word">${esc(l.word || '')}</p>
          <div class="rl-chips">
            <span class="oc-chip">Som «${esc(l.sound || '?')}»</span>
            <span class="oc-chip">Aett de ${esc(r.aett)} · ${n}</span>
            ${r.symmetric ? '<span class="oc-chip" title="Igual de qualquer lado: não se inverte">Simétrica</span>' : ''}
          </div>
        </div>
      </div>
      <p class="rl-mean"><b>Direita</b> ${esc(r.meaning)}</p>
      <p class="rl-rev"><b>${r.symmetric ? 'Sombra' : 'Invertida'}</b> ${esc(String(r.reversed).replace(/^Sombra \(simétrica\):\s*/i, ''))}</p>
    </article>`;
  }).join('') || '<p class="text-sm theme-muted">Nenhuma runa corresponde à pesquisa.</p>';
};

/* ——— Treino ——— */
const MODES = {
  glyph: { label: 'Símbolo → nome', ask: 'Que runa é esta?' },
  name: { label: 'Nome → símbolo', ask: 'Qual é o símbolo desta runa?' },
  meaning: { label: 'Sentido → runa', ask: 'Que runa tem este sentido?' }
};
let mode = store.get('druid_rune_quiz_mode', 'glyph');
if (!MODES[mode]) mode = 'glyph';
let current = null, streak = 0;

function renderStudy() {
  const host = $('tab-runelore');
  if (!host || $('rune-study')) return;
  const box = document.createElement('div');
  box.id = 'rune-study';
  box.className = 'theme-card border rounded-2xl p-5 lg:p-8 space-y-4';
  box.innerHTML = `
    <div>
      <p class="eyebrow">Treino</p>
      <h3 class="font-cinzel text-xl font-bold theme-title mt-1">Decorar as 24 runas</h3>
      <p class="text-sm theme-muted mt-1">Escolha um modo e responda. As respostas certas seguidas contam como série; a pontuação fica guardada neste dispositivo.</p>
    </div>
    <div class="seg rq-modes" role="group" aria-label="Modo de treino">
      ${Object.entries(MODES).map(([k, m]) => `<button type="button" data-mode="${k}" aria-pressed="${k === mode}" class="rq-mode">${esc(m.label)}</button>`).join('')}
    </div>
    <div class="theme-inner border rounded-xl rq-stage">
      <p id="rune-quiz-ask" class="text-sm theme-muted"></p>
      <div id="rune-quiz-prompt" class="rq-prompt" aria-live="polite"></div>
      <div id="rune-quiz-options" class="rq-options" role="group" aria-label="Opções de resposta"></div>
      <p id="rune-quiz-feedback" class="rq-feedback" role="status"></p>
      <div class="rq-foot">
        <span id="rune-quiz-score" class="text-xs theme-muted"></span>
        <button type="button" id="rune-quiz-next" class="theme-card border text-sm font-semibold py-2 px-4 rounded-lg cursor-pointer">Outra runa</button>
      </div>
    </div>
    <details class="rq-table">
      <summary class="text-sm font-semibold theme-title">Ver a tabela das 24 runas por aett</summary>
      <div class="rq-aettir">${['Freyr', 'Heimdall', 'Tyr'].map(a => `
        <div><p class="eyebrow">Aett de ${a}</p><div class="rq-row">${runes().filter(r => r.aett === a).map(r => `
          <span class="rq-cell" title="${esc(r.name)}"><b>${esc(r.symbol)}</b><i>${esc((RUNE_LORE[r.name] || {}).sound || '')}</i></span>`).join('')}</div></div>`).join('')}
      </div>
    </details>`;
  host.appendChild(box);
  box.querySelectorAll('.rq-mode').forEach(b => b.addEventListener('click', () => {
    mode = b.dataset.mode; store.set('druid_rune_quiz_mode', mode);
    box.querySelectorAll('.rq-mode').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    streak = 0; next();
  }));
  $('rune-quiz-next').addEventListener('click', next);
  next();
}

function next() {
  const list = runes();
  if (!list.length) return;
  const pick = () => list[Math.floor(Math.random() * list.length)];
  let ans = pick();
  if (current && ans.name === current.name) ans = pick();
  const opts = new Set([ans]);
  while (opts.size < 4) opts.add(pick());
  current = ans;
  $('rune-quiz-ask').textContent = MODES[mode].ask;
  const prompt = $('rune-quiz-prompt');
  prompt.className = 'rq-prompt rq-' + mode;
  prompt.textContent = mode === 'glyph' ? ans.symbol : mode === 'name' ? ans.name : short(ans.meaning);
  $('rune-quiz-feedback').textContent = '';
  const box = $('rune-quiz-options');
  box.className = 'rq-options' + (mode === 'name' ? ' rq-glyphs' : '');
  box.innerHTML = [...opts].sort(() => Math.random() - 0.5).map(r =>
    `<button type="button" class="rq-opt" data-name="${esc(r.name)}" ${mode === 'name' ? `aria-label="${esc(r.name)}"` : ''}>${esc(mode === 'name' ? r.symbol : r.name)}</button>`).join('');
  box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => answer(b)));
  score();
}

function answer(btn) {
  const ok = btn.dataset.name === current.name;
  const s = store.get('druid_rune_quiz', { right: 0, total: 0, best: 0 });
  s.total += 1;
  if (ok) { s.right += 1; streak += 1; s.best = Math.max(s.best || 0, streak); } else streak = 0;
  store.set('druid_rune_quiz', s);
  $('rune-quiz-options').querySelectorAll('button').forEach(b => {
    b.disabled = true;
    if (b.dataset.name === current.name) b.classList.add('quiz-right');
    else if (b === btn) b.classList.add('quiz-wrong');
  });
  const l = RUNE_LORE[current.name] || {};
  $('rune-quiz-feedback').innerHTML = `${ok ? '<b class="rq-ok">✓ Certo!</b>' : `<b class="rq-bad">✗ Era ${esc(current.name)}.</b>`} ` +
    `<span class="rq-glyph-inline">${esc(current.symbol)}</span> ${esc(current.name)}: som «${esc(l.sound || '?')}», «${esc(l.word || '')}». ${esc(current.meaning)}`;
  score();
}

function score() {
  const s = store.get('druid_rune_quiz', { right: 0, total: 0, best: 0 });
  const el = $('rune-quiz-score');
  if (el) el.textContent = s.total
    ? `Acertos: ${s.right} de ${s.total} (${Math.round(100 * s.right / s.total)}%)${streak > 1 ? ` · série de ${streak}` : ''}${s.best > 1 ? ` · melhor série ${s.best}` : ''}`
    : 'Ainda sem respostas.';
}

const init = () => { renderStudy(); window.renderRuneGallery(); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
