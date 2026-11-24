/* ============================================================
   Estudo do Ogham: nomes antigos e Bríatharogam (os «kennings»
   medievais), as cinco forfeda, escrever em Ogham e treino das
   20 letras. Acrescenta-se ao «Guia Completo das 20 Letras».
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const esc = window.esc || (s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } }
};

/* Nome em irlandês antigo, o que a palavra significa e o kenning do
   Bríatharogam Morainn mac Moín (Ogham das palavras de Morann), segundo
   os manuscritos medievais (In Lebor Ogaim / Auraicept na nÉces).
   Traduções aproximadas: vários nomes têm sentido incerto, e a ligação de
   cada letra a uma árvore é em parte uma leitura posterior. */
const OGHAM_LORE = {
  Beith:  { old: 'Beithe',  word: 'vidoeiro', kenning: 'Féochos foltchaín', kenningPt: 'tronco murcho de bela cabeleira', sound: 'B' },
  Luis:   { old: 'Luis',    word: 'chama ou erva (mais tarde, sorveira)', kenning: 'Lí súla', kenningPt: 'brilho do olhar', sound: 'L' },
  Fearn:  { old: 'Fern',    word: 'amieiro', kenning: 'Airenach fían', kenningPt: 'vanguarda dos guerreiros (o escudo)', sound: 'F / V' },
  Saille: { old: 'Sail',    word: 'salgueiro', kenning: 'Lí n-aimbi', kenningPt: 'palidez de quem já não vive', sound: 'S' },
  Nion:   { old: 'Nin',     word: 'forquilha, ramo bifurcado (mais tarde, freixo)', kenning: 'Costud síde', kenningPt: 'o estabelecer da paz', sound: 'N' },
  Huath:  { old: 'Úath',    word: 'medo, horror (mais tarde, espinheiro)', kenning: 'Conal cúan', kenningPt: 'assembleia de matilhas de cães', sound: 'H' },
  Duir:   { old: 'Dair',    word: 'carvalho', kenning: 'Ardam dossaib', kenningPt: 'o mais alto dos arbustos', sound: 'D' },
  Tinne:  { old: 'Tinne',   word: 'barra de metal (mais tarde, azevinho)', kenning: 'Trian n-airm', kenningPt: 'um terço de uma arma', sound: 'T' },
  Coll:   { old: 'Coll',    word: 'aveleira', kenning: 'Caíniu fedaib', kenningPt: 'a mais bela das árvores', sound: 'C / K' },
  Quert:  { old: 'Cert',    word: 'arbusto, trapo (mais tarde, macieira)', kenning: 'Clithar mbaiscell', kenningPt: 'abrigo de um louco', sound: 'Q / CU' },
  Muin:   { old: 'Muin',    word: 'pescoço, astúcia ou amor (mais tarde, videira)', kenning: 'Tressam fedmae', kenningPt: 'o mais forte no esforço', sound: 'M' },
  Gort:   { old: 'Gort',    word: 'campo cultivado (mais tarde, hera)', kenning: 'Milsiu féraib', kenningPt: 'mais doce do que as ervas', sound: 'G' },
  Ngetal: { old: 'nGétal',  word: 'ferida, matança (mais tarde, junco ou giesta)', kenning: 'Étiud midach', kenningPt: 'manto dos médicos', sound: 'NG' },
  Straif: { old: 'Straif',  word: 'enxofre (mais tarde, abrunheiro)', kenning: 'Tressam rúamna', kenningPt: 'o mais forte dos tingidos de vermelho', sound: 'Z / ST' },
  Ruis:   { old: 'Ruis',    word: 'vermelhidão (mais tarde, sabugueiro)', kenning: 'Tindi rucci', kenningPt: 'o mais intenso dos rubores', sound: 'R' },
  Ailm:   { old: 'Ailm',    word: 'pinheiro (sentido incerto)', kenning: 'Ardam íachtaib', kenningPt: 'o mais alto dos gemidos', sound: 'A' },
  Onn:    { old: 'Onn',     word: 'freixo (mais tarde, tojo)', kenning: 'Congnamaid echraide', kenningPt: 'auxiliar dos cavalos (a roda do carro)', sound: 'O' },
  Ur:     { old: 'Úr',      word: 'terra, solo (mais tarde, urze)', kenning: 'Úaraib adbaib', kenningPt: 'em moradas frias', sound: 'U' },
  Eadha:  { old: 'Edad',    word: 'sentido incerto (mais tarde, choupo-tremedor)', kenning: 'Érgnaid fid', kenningPt: 'árvore distinta', sound: 'E' },
  Ioho:   { old: 'Idad',    word: 'teixo', kenning: 'Sinem fedaib', kenningPt: 'a mais antiga das árvores', sound: 'I' }
};

/* As cinco forfeda («letras suplementares»), acrescentadas no período
   dos manuscritos sobretudo para ditongos. */
const FORFEDA = [
  { symbol: 'ᚕ', name: 'Ébad', sound: 'EA / K', note: 'Associada ao álamo ou ao salmão do conhecimento. Sabedoria que chega de repente.' },
  { symbol: 'ᚖ', name: 'Óir', sound: 'OI / TH', note: 'Associada ao fuso e ao ouro. O fio que liga, a doçura do que é precioso.' },
  { symbol: 'ᚗ', name: 'Uilleann', sound: 'UI / PE', note: 'Associada à madressilva e ao «cotovelo». Abraço, laços e desejo.' },
  { symbol: 'ᚘ', name: 'Ifín (Pín)', sound: 'IA / IO / P', note: 'Associada à groselheira-espinhosa e ao pinheiro. Doçura que exige cuidado.' },
  { symbol: 'ᚙ', name: 'Emancholl', sound: 'AE / X', note: '«Aveleira gémea». O Coll redobrado: inspiração concentrada.' }
];

/* ——— Escrever em Ogham ——— */
const DIGRAPHS = [['ng', 'ᚍ'], ['st', 'ᚎ'], ['ea', 'ᚕ'], ['oi', 'ᚖ'], ['ui', 'ᚗ'], ['ia', 'ᚘ'], ['io', 'ᚘ'], ['ae', 'ᚙ'], ['ch', 'ᚉᚆ'], ['qu', 'ᚊ']];
const SINGLE = {
  b: 'ᚁ', l: 'ᚂ', f: 'ᚃ', v: 'ᚃ', s: 'ᚄ', n: 'ᚅ', h: 'ᚆ', d: 'ᚇ', t: 'ᚈ', c: 'ᚉ', k: 'ᚉ', q: 'ᚊ',
  m: 'ᚋ', g: 'ᚌ', z: 'ᚎ', r: 'ᚏ', a: 'ᚐ', o: 'ᚑ', u: 'ᚒ', e: 'ᚓ', i: 'ᚔ', p: 'ᚚ',
  w: 'ᚒ', y: 'ᚔ', j: 'ᚔ', x: 'ᚉᚄ'
};
const SPACE = ' ';   // espaço Ogham (a linha contínua)
const OPEN = '᚛', CLOSE = '᚜';

/** Converte texto latino em Ogham. useForfeda: usa as forfeda para ditongos. */
function toOgham(text, { useForfeda = true } = {}) {
  const clean = String(text).toLowerCase()
    .replace(/ç/g, 's').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const words = clean.split(' ').map(w => {
    let out = '';
    for (let i = 0; i < w.length;) {
      const pair = w.slice(i, i + 2);
      const dg = DIGRAPHS.find(([k]) => k === pair && (useForfeda || !/^(ea|oi|ui|ia|io|ae)$/.test(k)));
      if (dg) { out += dg[1]; i += 2; continue; }
      out += SINGLE[w[i]] || ''; i += 1;
    }
    return out;
  });
  return OPEN + words.join(SPACE) + CLOSE;
}
window.toOgham = toOgham;

/* ——— Cartões do guia com o saber antigo ——— */
const baseRender = window.renderHerbalList;
if (typeof baseRender === 'function') {
  window.renderHerbalList = function (filter = '') {
    baseRender(filter);
    const list = $('tree-list');
    if (!list) return;
    list.querySelectorAll(':scope > div').forEach(card => {
      const h = card.querySelector('h3');
      const name = h && h.textContent.split('•')[0].trim();
      const lore = OGHAM_LORE[name];
      if (!lore || card.querySelector('.ogham-lore')) return;
      const box = document.createElement('div');
      box.className = 'ogham-lore';
      box.innerHTML = `
        <p><span class="lore-k">Nome antigo</span> <i>${esc(lore.old)}</i>: ${esc(lore.word)} · som ${esc(lore.sound)}</p>
        <p><span class="lore-k">Bríatharogam</span> <i>${esc(lore.kenning)}</i>: «${esc(lore.kenningPt)}»</p>`;
      card.appendChild(box);
    });
  };
}

/* ——— Painel de estudo ——— */
function renderStudyPanel() {
  const host = $('tab-herbal');
  if (!host || $('ogham-study')) return;
  const panel = document.createElement('div');
  panel.id = 'ogham-study';
  panel.className = 'theme-card border rounded-2xl p-6 lg:p-8 space-y-5';
  panel.innerHTML = `
    <div>
      <div class="eyebrow">Estudo do Ogham</div>
      <h2 class="font-cinzel text-2xl font-bold theme-title mt-1">Aprender as letras das árvores</h2>
      <p class="text-sm theme-muted mt-1">O Ogham escreve-se ao longo de uma linha (o <i>druim</i>, a aresta da pedra ou da vara), de baixo para cima ou da esquerda para a direita, com a marca ᚛ a abrir e ᚜ a fechar.</p>
    </div>
    <div class="study-grid">
      <div class="theme-inner border rounded-xl p-4 space-y-3">
        <h3 class="font-cinzel text-base font-bold theme-title">Escrever em Ogham</h3>
        <label class="text-xs theme-muted block" for="ogham-write-input">Nome ou frase</label>
        <input id="ogham-write-input" type="text" maxlength="60" placeholder="Ex.: Brígida" class="w-full theme-card border rounded-lg px-3 py-2 text-sm" autocomplete="off">
        <label class="study-check text-xs theme-muted"><input id="ogham-write-forfeda" type="checkbox" checked> Usar forfeda para ditongos (ea, oi, ui, ia, ae)</label>
        <div id="ogham-write-out" class="ogham-write-out" aria-live="polite" lang="sga-Ogam"></div>
        <div class="flex flex-wrap gap-2">
          <button type="button" id="ogham-write-vertical" class="theme-card border text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer" aria-pressed="false">Ver na vertical</button>
          <button type="button" id="ogham-write-copy" class="theme-card border text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer">Copiar</button>
        </div>
      </div>
      <div class="theme-inner border rounded-xl p-4 space-y-3">
        <h3 class="font-cinzel text-base font-bold theme-title">Treino das 20 letras</h3>
        <p class="text-sm theme-muted">Que letra é esta?</p>
        <div id="ogham-quiz-glyph" class="ogham-quiz-glyph theme-glyph" aria-live="polite"></div>
        <div id="ogham-quiz-options" class="study-options" role="group" aria-label="Opções de resposta"></div>
        <p id="ogham-quiz-feedback" class="text-sm theme-title quiz-feedback" role="status"></p>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span id="ogham-quiz-score" class="text-xs theme-muted"></span>
          <button type="button" id="ogham-quiz-next" class="theme-card border text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer">Outra letra</button>
        </div>
      </div>
    </div>
    <div class="theme-inner border rounded-xl p-4 space-y-3">
      <h3 class="font-cinzel text-base font-bold theme-title">As cinco forfeda</h3>
      <p class="text-sm theme-muted">Letras suplementares acrescentadas mais tarde, sobretudo para ditongos. Não entram nas tiragens tradicionais de 20 letras.</p>
      <div class="forfeda-list">${FORFEDA.map(f => `
        <div class="forfeda-item"><span class="forfeda-glyph theme-glyph">${f.symbol}</span>
          <div><b class="theme-title">${esc(f.name)}</b> <span class="text-xs theme-muted">· ${esc(f.sound)}</span>
          <p class="text-sm theme-muted">${esc(f.note)}</p></div></div>`).join('')}
      </div>
      <p class="text-xs theme-muted">Os nomes antigos e os kennings do Bríatharogam vêm dos manuscritos irlandeses medievais. As traduções são aproximadas: vários nomes têm sentido incerto, e a associação de cada letra a uma árvore e a um mês é em parte uma leitura moderna (o «calendário das árvores» é do séc. XX).</p>
    </div>`;
  const first = host.firstElementChild;
  host.insertBefore(panel, first ? first.nextSibling : null);

  // Escrever
  const input = $('ogham-write-input'), out = $('ogham-write-out'), forf = $('ogham-write-forfeda');
  const update = () => {
    const o = toOgham(input.value, { useForfeda: forf.checked });
    out.textContent = o || '᚛ ᚜';
    store.set('druid_ogham_write', input.value);
  };
  input.value = store.get('druid_ogham_write', '');
  input.addEventListener('input', update); forf.addEventListener('change', update); update();
  $('ogham-write-vertical').addEventListener('click', e => {
    const on = out.classList.toggle('vertical');
    e.currentTarget.setAttribute('aria-pressed', String(on));
    e.currentTarget.textContent = on ? 'Ver na horizontal' : 'Ver na vertical';
  });
  $('ogham-write-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(out.textContent); showToast('Ogham copiado.'); }
    catch { showToast('Não foi possível copiar. Selecione o texto e copie à mão.'); }
  });

  // Treino
  $('ogham-quiz-next').addEventListener('click', nextQuestion);
  nextQuestion();
}

let quizAnswer = null;
function nextQuestion() {
  const data = window.OGHAM_DATA || (typeof OGHAM_DATA !== 'undefined' ? OGHAM_DATA : []);
  if (!data.length) return;
  const pick = () => data[Math.floor(Math.random() * data.length)];
  let ans = pick();
  if (quizAnswer && ans.name === quizAnswer.name) ans = pick();
  const opts = new Set([ans.name]);
  while (opts.size < 4) opts.add(pick().name);
  const options = [...opts].sort(() => Math.random() - 0.5);
  quizAnswer = ans;
  $('ogham-quiz-glyph').textContent = ans.symbol;
  $('ogham-quiz-feedback').textContent = '';
  const box = $('ogham-quiz-options');
  box.innerHTML = options.map(n => `<button type="button" class="theme-card border text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer" data-name="${esc(n)}">${esc(n)}</button>`).join('');
  box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => answer(b)));
  renderScore();
}

function answer(btn) {
  const box = $('ogham-quiz-options');
  const ok = btn.dataset.name === quizAnswer.name;
  const s = store.get('druid_ogham_quiz', { right: 0, total: 0 });
  s.total += 1; if (ok) s.right += 1;
  store.set('druid_ogham_quiz', s);
  box.querySelectorAll('button').forEach(b => {
    b.disabled = true;
    if (b.dataset.name === quizAnswer.name) b.classList.add('quiz-right');
    else if (b === btn) b.classList.add('quiz-wrong');
  });
  const lore = OGHAM_LORE[quizAnswer.name];
  $('ogham-quiz-feedback').textContent = (ok ? '✓ Certo! ' : `✗ Era ${quizAnswer.name}. `) +
    `${quizAnswer.name} (${quizAnswer.tree})${lore ? `, som ${lore.sound}` : ''}.`;
  renderScore();
}

function renderScore() {
  const s = store.get('druid_ogham_quiz', { right: 0, total: 0 });
  const el = $('ogham-quiz-score');
  if (el) el.textContent = s.total ? `Acertos: ${s.right} de ${s.total} (${Math.round(100 * s.right / s.total)}%)` : 'Ainda sem respostas.';
}

/* Atalho a partir do oráculo de Ogham */
function addOracleShortcut() {
  const tab = $('tab-oracle');
  if (!tab || $('ogham-study-link')) return;
  const p = document.createElement('p');
  p.id = 'ogham-study-link';
  p.className = 'text-center';
  p.innerHTML = '<button type="button" class="theme-inner theme-muted border text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer">Estudar as letras e escrever em Ogham</button>';
  p.querySelector('button').addEventListener('click', () => {
    switchTab('herbal');
    setTimeout(() => $('ogham-study')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  });
  const hist = $('reading-history');
  tab.insertBefore(p, hist || null);
}

window.OGHAM_LORE = OGHAM_LORE;
window.OGHAM_FORFEDA = FORFEDA;
const init = () => { renderStudyPanel(); addOracleShortcut(); if ($('tree-list')) window.renderHerbalList($('herbal-search')?.value || ''); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
