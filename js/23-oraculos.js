/* ============================================================
   Apresentação das leituras de Ogham e Runas: cada letra é uma
   vara de madeira gravada e cada runa uma pedra; as tiragens têm
   disposições próprias (linha das Nornas, roda dos elementos) e a
   resposta Sim/Não tem destaque. Usado por drawOghamCard,
   drawRunes e drawYesNo.
   ============================================================ */
(() => {
const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Marcação do estado vazio de cada oráculo (também usada pelo Tarot). */
const EMPTY = {
  ogham: '<div class="oracle-empty"><div class="oe-art oe-staves" aria-hidden="true"><span>ᚁ</span><span>ᚇ</span><span>ᚉ</span></div><p class="oe-text">Respire fundo, formule a sua pergunta e escolha uma tiragem.</p></div>',
  runes: '<div class="oracle-empty"><div class="oe-art oe-stones" aria-hidden="true"><span>ᚠ</span><span>ᚨ</span><span>ᛟ</span></div><p class="oe-text">Respire fundo, formule a sua pergunta e escolha uma tiragem.</p></div>',
  tarot: '<div class="oracle-empty"><div class="oe-art oe-cards" aria-hidden="true"><span></span><span></span><span></span></div><p class="oe-text">Formule a pergunta, se quiser, e escolha uma tiragem.</p></div>'
};
window.ORACLE_EMPTY = EMPTY;

function runeExtra(name) {
  const list = typeof RUNES_EXTENDED !== 'undefined' ? RUNES_EXTENDED : [];
  return list.find(r => r.name === name) || null;
}

/**
 * Lança uma runa: as que não são simétricas podem sair invertidas (35%).
 * Devolve uma cópia; se invertida, o nome e o significado passam a ser os da
 * posição invertida, para o diário, a partilha e a interpretação usarem o certo.
 */
window.castRune = function (r, chance = 0.35) {
  const x = runeExtra(r.name);
  if (!x || x.symmetric || !x.reversed || Math.random() >= chance) return { ...r, reversed: false };
  return { ...r, baseName: r.name, name: `${r.name} (invertida)`, upright: r.meaning, meaning: x.reversed, reversed: true };
};

/** Avisa quando uma ou mais runas saem invertidas. */
window.noticeReversedRunes = function (items) {
  const n = items.filter(r => r.reversed).length;
  if (n && typeof showToast === 'function') showToast(n === 1 ? (items.length === 1 ? 'A runa saiu invertida.' : '1 runa saiu invertida.') : `${n} runas saíram invertidas.`);
};

function oghamObject(o) {
  return `<div class="oc-object oc-stave" aria-hidden="true"><span class="stave-glyph">${escH(o.symbol)}</span></div>`;
}
function runeObject(r, i) {
  const tilt = [-4, 3, -2, 5, -3][i % 5];
  return `<div class="oc-object oc-stone${r.reversed ? ' is-reversed' : ''}" style="--tilt:${tilt}deg" aria-hidden="true"><span class="stone-glyph">${escH(r.symbol)}</span></div>`;
}

function oghamBody(o) {
  const lore = (window.OGHAM_LORE || {})[o.name];
  const tree = String(o.tree || '');
  return `
    <h3 class="oc-name font-cinzel">${escH(o.name)}</h3>
    <p class="oc-sub">${escH(tree)}</p>
    <div class="oc-chips">
      ${o.aicme ? `<span class="oc-chip">${escH(o.aicme)}</span>` : ''}
      ${o.month ? `<span class="oc-chip">${escH(o.month)}</span>` : ''}
    </div>
    <p class="oc-meaning">${escH(o.meaning)}</p>
    ${lore ? `<p class="oc-extra"><span>Bríatharogam</span> «${escH(lore.kenningPt)}»</p>` : ''}
    ${o.herb ? `<p class="oc-extra"><span>Ervas</span> ${escH(o.herb)}</p>` : ''}`;
}
/** Mensagem da runa segundo o manual (js/29-runas-tiragens.js). */
function runeMessage(name) {
  const m = (window.RUNE_MESSAGES || {})[name];
  return m ? `<p class="oc-extra oc-msg"><span>Mensagem</span> ${escH(m)}</p>` : '';
}
function runeBody(r) {
  const name = r.baseName || r.name;
  const x = runeExtra(name);
  if (r.reversed) {
    return `
    <h3 class="oc-name font-cinzel">${escH(name)}</h3>
    <div class="oc-chips">
      <span class="oc-chip oc-chip-rev" title="A runa saiu de cabeça para baixo">⟲ Invertida</span>
      ${x && x.aett ? `<span class="oc-chip">Aett de ${escH(x.aett)}</span>` : ''}
    </div>
    <p class="oc-meaning">${escH(r.meaning)}</p>
    <p class="oc-extra"><span>Direita</span> ${escH(r.upright)}</p>${runeMessage(name)}`;
  }
  return `
    <h3 class="oc-name font-cinzel">${escH(name)}</h3>
    <div class="oc-chips">
      ${x && x.aett ? `<span class="oc-chip">Aett de ${escH(x.aett)}</span>` : ''}
      ${x && x.symmetric ? '<span class="oc-chip" title="Igual de qualquer lado: não se inverte">Simétrica</span>' : ''}
    </div>
    <p class="oc-meaning">${escH(r.meaning)}</p>
    ${x && x.reversed ? `<p class="oc-extra"><span>${x.symmetric ? 'Sombra' : 'Se invertida'}</span> ${escH(String(x.reversed).replace(/^Sombra \(simétrica\):\s*/i, ''))}</p>` : ''}${runeMessage(name)}`;
}

/**
 * Desenha uma leitura.
 * @param {'ogham'|'runes'} system
 * @param {Array} items letras ou runas tiradas
 * @param {string[]} labels nome de cada posição
 * @param {{answer?: 'Sim'|'Não'}} [opts]
 */
window.renderOracleReading = function (system, items, labels, opts = {}) {
  const el = document.getElementById(system === 'ogham' ? 'ogham-card' : 'rune-card');
  if (!el) return;
  const n = items.length;
  const S = opts.spread;
  if (S && n > 1) return renderSpread(el, system, items, labels, S);
  const layout = opts.answer ? 'yn' : n === 1 ? 'single' : n === 3 ? 'row' : 'cross';
  const areas = ['c', 'n', 'e', 's', 'w'];
  const cards = items.map((it, i) => `
    <article class="oc-card oc-${system}${it.reversed ? ' is-reversed' : ''}" ${layout === 'cross' ? `style="grid-area:${areas[i]}"` : ''}>
      ${n > 1 ? `<span class="oc-num" aria-hidden="true">${i + 1}</span>` : ''}
      ${system === 'ogham' ? oghamObject(it) : runeObject(it, i)}
      <div class="oc-body">
        <p class="oc-pos">${escH(labels[i] || '')}</p>
        ${it.hint ? `<p class="oc-hint">${escH(it.hint)}</p>` : ''}
        ${system === 'ogham' ? oghamBody(it) : runeBody(it)}
      </div>
    </article>`).join('');
  const answer = opts.answer
    ? `<div class="oc-answer ${opts.answer === 'Sim' ? 'is-yes' : 'is-no'}" role="status"><span>O oráculo responde</span><b class="font-cinzel">${escH(opts.answer)}</b></div>`
    : '';
  const head = S ? `<p class="rs-title font-cinzel">${escH(S.name)}</p>` : '';
  el.classList.remove('draw-area');
  el.innerHTML = `${answer}${head}<div class="grid oc-spread oc-${layout}">${cards}</div>`;
};

/**
 * Tiragem com casas (manual «Runas»): mapa da disposição, regra de leitura e
 * cada runa na sua casa. No telemóvel as runas ficam em coluna pela ordem de
 * leitura; a partir de 768 px ocupam a disposição do manual.
 */
function renderSpread(el, system, items, labels, S) {
  const cards = items.map((it, i) => `
    <article class="oc-card oc-${system}${it.reversed ? ' is-reversed' : ''}" style="grid-area:${String.fromCharCode(97 + i)}">
      <span class="oc-num" aria-hidden="true">${i + 1}.ª</span>
      ${system === 'ogham' ? oghamObject(it) : runeObject(it, i)}
      <div class="oc-body">
        <p class="oc-pos"><span class="sr-only">${i + 1}.ª runa: </span>${escH(labels[i] || '')}</p>
        ${S.pos[i] && S.pos[i][1] ? `<p class="oc-hint">${escH(S.pos[i][1])}</p>` : ''}
        ${system === 'ogham' ? oghamBody(it) : runeBody(it)}
      </div>
    </article>`).join('');
  el.classList.remove('draw-area');
  el.innerHTML = `
    <div class="rs-head">
      ${typeof runeSpreadMap === 'function' ? runeSpreadMap(S) : ''}
      <div class="rs-text">
        <p class="rs-title font-cinzel">${escH(S.name)}</p>
        <p class="rs-how">${escH(S.how || '')}</p>
      </div>
    </div>
    <div class="grid oc-spread oc-rs" style='${runeSpreadGridStyle(S)}'>${cards}</div>`;
}
})();
