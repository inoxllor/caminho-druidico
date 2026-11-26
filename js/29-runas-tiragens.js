/* ============================================================
   Tiragens de runas segundo o manual «Runas» (Bosque do Cervo,
   Henry Barbosa, 2021): casas e disposição de cada tiragem, regras
   de leitura e a mensagem de cada runa.

   Regras do manual:
   - lê-se da direita para a esquerda;
   - lê-se de cima para baixo;
   - nas leituras circulares, no sentido dos ponteiros do relógio.

   Cada tiragem tem `grid`: as linhas da disposição, com uma letra
   por casa (a = 1.ª runa, b = 2.ª, …) e «.» para espaço vazio.
   ============================================================ */
(() => {
const RUNE_SPREADS = {
  conselho: {
    name: 'Conselho', short: '1 runa · mensagem',
    intro: 'Uma só runa: a mensagem para ser absorvida.',
    grid: ['a'],
    pos: [['Conselho', 'Mensagem para ser absorvida.']],
    how: 'Leia a runa como um conselho único: uma força a honrar ou um aviso a escutar.'
  },
  nornas: {
    name: 'Passado · Presente · Futuro', short: '3 runas · conselho simples',
    intro: 'Três runas em linha, lidas da direita para a esquerda.',
    grid: ['c b a'],
    pos: [
      ['Passado', 'As situações que levaram ao dia de hoje.'],
      ['Presente', 'A situação presente e o que pode estar oculto ao consulente.'],
      ['Futuro', 'O conselho ou a direção para um futuro que pode ser construído.']
    ],
    how: 'Comece pela runa da direita (o passado), passe à do meio (o presente e o que está oculto) e termine na da esquerda, que dá o conselho para o futuro.'
  },
  amor: {
    name: 'Amor', short: '5 runas · relação',
    intro: 'Duas filas de duas runas e uma em baixo, ao centro.',
    grid: ['b b a a', 'd d c c', '. e e .'],
    pos: [
      ['Intenções', 'O que se procura e se deseja nesta relação.'],
      ['Sentimentos', 'O que se sente de verdade.'],
      ['Superação', 'O que é preciso ultrapassar.'],
      ['União', 'O que une e pode fortalecer o laço.'],
      ['Resultado', 'Para onde a relação tende.']
    ],
    how: 'Leia cada fila da direita para a esquerda, de cima para baixo, e feche com o Resultado.'
  },
  trabalho: {
    name: 'Trabalho', short: '4 runas · carreira e projetos',
    intro: 'Duas filas de duas runas.',
    // O quadro do manual numera a fila de baixo «4.ª Obstáculos – 5.ª Investimento»
    // e não tem 3.ª casa: são quatro runas, pela ordem do manual.
    grid: ['b a', 'c d'],
    pos: [
      ['Objetivo', 'A meta que se quer alcançar.'],
      ['Conquista', 'O que já se conseguiu ou se pode conquistar.'],
      ['Obstáculos', 'O que trava o caminho.'],
      ['Investimento', 'Onde pôr tempo, esforço e recursos.']
    ],
    how: 'Leia a fila de cima da direita para a esquerda (Objetivo, depois Conquista); em baixo, os Obstáculos e, por fim, o Investimento.'
  },
  saude: {
    name: 'Saúde', short: '3 runas · bem-estar',
    intro: 'Três runas em linha, lidas da direita para a esquerda.',
    grid: ['c b a'],
    pos: [
      ['Saúde atual', 'O estado presente do corpo e da energia.'],
      ['Atenção', 'O que pede cuidado.'],
      ['Expectativa', 'O que se pode esperar.']
    ],
    how: 'Comece pela direita (a saúde atual) e avance para a esquerda. É uma leitura simbólica: não substitui o conselho de um médico.'
  },
  objetivo: {
    name: 'Objetivo temporal', short: '5 runas · cruz',
    intro: 'Uma cruz: lê-se de cima para baixo e, na fila do meio, da direita para a esquerda.',
    grid: ['. a .', 'd c b', '. e .'],
    pos: [
      ['A situação atual', 'Onde se está em relação ao objetivo.'],
      ['Positivo', 'O que ajuda e favorece.'],
      ['Desenvolvimento', 'Como a situação vai evoluir.'],
      ['Negativo', 'O que dificulta ou se deve evitar.'],
      ['Síntese geral', 'A resposta de conjunto.']
    ],
    how: 'Comece no topo (a situação atual), leia a fila do meio da direita para a esquerda (Positivo, Desenvolvimento, Negativo) e termine em baixo, na Síntese geral.'
  },
  roda: {
    name: 'Roda das oito runas', short: '8 runas · em círculo',
    intro: 'Oito runas em círculo, lidas no sentido dos ponteiros do relógio, a começar em cima.',
    grid: ['h a b', 'g . c', 'f e d'],
    pos: [
      ['1.º passo', 'O começo: o que abre o ciclo.'],
      ['2.º passo', 'O que cresce a partir daí.'],
      ['3.º passo', 'O que ganha força.'],
      ['4.º passo', 'O ponto de viragem.'],
      ['5.º passo', 'O fundo do ciclo: o que pede atenção.'],
      ['6.º passo', 'O que se transforma.'],
      ['7.º passo', 'O que se colhe.'],
      ['8.º passo', 'O que fecha o ciclo e prepara o seguinte.']
    ],
    how: 'O manual diz só que as leituras circulares seguem os ponteiros do relógio. Leia as oito runas como os passos de um ciclo, da 1.ª (em cima) à 8.ª, e veja que runas se respondem de lados opostos da roda.'
  },
  diario: {
    name: 'Conselho diário', short: '3 runas · para o dia',
    intro: 'Três runas em coluna, lidas de cima para baixo.',
    grid: ['a', 'b', 'c'],
    pos: [
      ['Energia favorável', 'A força com que pode contar hoje.'],
      ['Obstáculos', 'O que pode atrapalhar o dia.'],
      ['Como agir', 'O conselho para o dia.']
    ],
    how: 'Leia de cima para baixo: a energia do dia, o obstáculo e, por fim, como agir.'
  }
};
/* Atalhos antigos: drawRunes(1) e drawRunes(3) continuam a funcionar. */
const ALIAS = { 1: 'conselho', 3: 'nornas' };

/** Wyrd, a runa em branco (manual: «a Runa de Odin, adicionada posteriormente,
    representa o cosmos e o próprio Odin»). É uma criação moderna (anos 80),
    por isso só entra no saco se a pessoa a escolher. */
const WYRD = { symbol: '', name: 'Wyrd', blank: true,
  meaning: 'O destino: o que está escrito já está definido. Representa o cosmos e o próprio Odin; pede entrega ao que não se controla.' };
const wyrdOn = () => { try { return localStorage.getItem('druid_wyrd') === '1'; } catch { return false; } };
/** As runas que vão para o saco (24 + Wyrd, se estiver ligada). */
window.runePool = function () {
  const base = [...(window.RUNES_DATA || [])];
  return wyrdOn() ? [...base, WYRD] : base;
};
window.setWyrd = function (on) {
  try { localStorage.setItem('druid_wyrd', on ? '1' : '0'); } catch { /* nada */ }
  if (typeof showToast === 'function') showToast(on ? 'A Wyrd (runa em branco) entra nas tiragens.' : 'A Wyrd saiu das tiragens.');
};

/** Mensagem de cada runa, segundo o manual. */
const RUNE_MESSAGES = {
  Fehu: 'Aproveite o enriquecimento e viva o seu sucesso.',
  Uruz: 'Não tenha medo de enfrentar o novo: renove-se.',
  Thurisaz: 'Às vezes a melhor ação é parar. Não reagir também é agir.',
  Ansuz: 'Toda a aprendizagem vale a pena; é tempo de meditar.',
  Raidho: 'Saiba aproveitar as mudanças; liberte-se de desejos e ilusões.',
  Kenaz: 'Os caminhos estão abertos; revigore-se com as novas energias.',
  Gebo: 'União sem anulação: associe-se, mas em harmonia.',
  Wunjo: 'É preciso calma para alcançar a vitória; deixe a felicidade entrar.',
  Hagalaz: 'Precisamos de aprender a conviver com as perdas e os limites naturais da vida.',
  Nauthiz: 'Os atrasos podem ser providenciais. Aprenda com a adversidade.',
  Isa: 'É melhor deixar para um momento mais propício; é tempo de parar.',
  Jera: 'Bênçãos e boa sorte chovem sobre nós em grande festa.',
  Eihwaz: 'A reflexão deve ser o alicerce da ação; saiba aguardar o momento.',
  Perthro: 'As revelações serão agradáveis; é preciso ousar para encontrar.',
  Algiz: 'Ajoelhe-se e receba as bênçãos; controle as suas emoções.',
  Sowilo: 'A vitória é incondicional. Receba a força vital.',
  Tiwaz: 'Coragem para prosseguir a luta; cultive a paciência.',
  Berkano: 'Os sonhos serão realizados; olhe para o seu interior.',
  Ehwaz: 'O cavalo de Odin atravessa qualquer obstáculo: é tempo de mudar.',
  Mannaz: 'O ser humano é um ser social: mantenha a modéstia.',
  Laguz: 'Como a água, a intuição é fonte de vida: liberte a criatividade.',
  Ingwaz: 'É tempo de viver, criar e aproveitar a vida; dedique-lhe mais do seu tempo.',
  Dagaz: 'A escuridão está a terminar. Mantenha os olhos abertos para não perder uma oportunidade.',
  Othala: 'É preciso envelhecer com sabedoria; faça sem fazer.',
  Wyrd: 'Aceite o que não pode mudar e confie no caminho.'
};

const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Devolve a tiragem pedida (chave ou número antigo), com a chave incluída. */
window.runeSpread = function (k) {
  const key = RUNE_SPREADS[k] ? k : (ALIAS[k] || 'conselho');
  return { key, ...RUNE_SPREADS[key] };
};
window.RUNE_SPREADS = RUNE_SPREADS;
window.RUNE_MESSAGES = RUNE_MESSAGES;

/** Estilo de grelha CSS de uma disposição. */
window.runeSpreadGridStyle = function (s, col) {
  const cols = s.grid[0].split(' ').length;
  return `grid-template-columns:repeat(${cols},${col || 'minmax(0,1fr)'});grid-template-areas:${s.grid.map(r => `"${r}"`).join(' ')}`;
};

/** Mapa da tiragem: pedras pequenas numeradas na disposição do manual. */
window.runeSpreadMap = function (s, { numbers = true, cls = 'rs-map' } = {}) {
  const dots = s.pos.map((p, i) => {
    const area = String.fromCharCode(97 + i);
    return `<span class="rs-dot" style="grid-area:${area}"${numbers ? ` title="${escH(`${i + 1}.ª · ${p[0]}`)}"` : ''}>${numbers ? i + 1 : ''}</span>`;
  }).join('');
  return `<span class="${cls}" aria-hidden="true" style='${runeSpreadGridStyle(s, numbers ? '1.6rem' : '9px')}'>${dots}</span>`;
};

/** Botões de escolha da tiragem no Oráculo de Runas. */
function renderSpreadButtons() {
  const grid = document.getElementById('rune-spread-grid');
  if (!grid) return;
  const btns = Object.keys(RUNE_SPREADS).map(key => {
    const s = RUNE_SPREADS[key];
    return `<button type="button" onclick="runeSpreadClick('${key}')" class="spread-card" data-spread="${key}">
      ${runeSpreadMap({ ...s }, { numbers: false, cls: 'rs-mini' })}
      <span class="spread-name">${escH(s.name)}</span><span class="spread-meta">${escH(s.short)}</span></button>`;
  }).join('');
  grid.innerHTML = btns + `<button type="button" onclick="drawYesNo('runes')" class="spread-card" data-spread="simnao"><span class="spread-dia dia-yn" aria-hidden="true"><i></i></span><span class="spread-name">Sim ou Não</span><span class="spread-meta">1 runa · resposta direta</span></button>`;
}
/* ——— Escolher as runas à mão: as pedras ficam viradas para baixo e
       a pessoa toca nas que quer, uma por casa. ——— */
const pickOn = () => { try { return localStorage.getItem('druid_rune_pick') === '1'; } catch { return false; } };
window.setRunePick = function (on) { try { localStorage.setItem('druid_rune_pick', on ? '1' : '0'); } catch { /* nada */ } };
window.runeSpreadClick = function (key) {
  if (pickOn()) startPick(key); else drawRunes(key);
};
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function startPick(key) {
  const S = runeSpread(key);
  const el = document.getElementById('rune-card');
  if (!el) return;
  const bag = shuffle(runePool());
  const chosen = [];
  document.getElementById('rune-save-bar')?.classList.add('hidden');
  el.classList.remove('draw-area');
  el.innerHTML = `<div class="rp-pick">
      <p class="rs-title font-cinzel">${escH(S.name)}</p>
      <p class="rp-status" role="status" aria-live="polite"></p>
      <div class="rp-field" role="group" aria-label="Pedras viradas para baixo">${bag.map((r, i) =>
        `<button type="button" class="rp-stone" data-i="${i}" style="--tilt:${(i * 37 % 17) - 8}deg" aria-label="Pedra ${i + 1}, virada para baixo"></button>`).join('')}</div>
      <button type="button" class="rp-cancel btn-link" onclick="drawRunes('${key}')">Tirar ao acaso</button>
    </div>`;
  const status = el.querySelector('.rp-status');
  const say = () => { status.textContent = chosen.length < S.pos.length
    ? `Toque na pedra para a ${chosen.length + 1}.ª casa: ${S.pos[chosen.length][0]} (${chosen.length} de ${S.pos.length}).`
    : 'A revelar…'; };
  say();
  el.querySelector('.rp-field').addEventListener('click', e => {
    const b = e.target.closest('.rp-stone');
    if (!b || b.disabled || chosen.length >= S.pos.length) return;
    b.disabled = true;
    b.classList.add('is-chosen');
    b.dataset.n = chosen.length + 1;
    b.setAttribute('aria-label', `Pedra escolhida para a ${chosen.length + 1}.ª casa`);
    chosen.push(bag[+b.dataset.i]);
    say();
    if (chosen.length === S.pos.length) {
      setTimeout(() => { window.__runesChosen = chosen; drawRunes(key); }, 500);
    }
  });
  el.querySelector('.rp-stone')?.focus({ preventScroll: true });
}

/** Opções do oráculo: escolher à mão e incluir a Wyrd. */
function renderOptions() {
  const host = document.getElementById('rune-draw-actions');
  if (!host || document.getElementById('rune-options')) return;
  const box = document.createElement('div');
  box.id = 'rune-options';
  box.className = 'rune-options';
  box.innerHTML = `
    <label><input type="checkbox" ${pickOn() ? 'checked' : ''} onchange="setRunePick(this.checked)"> Escolher as runas à mão (pedras viradas para baixo)</label>
    <label><input type="checkbox" ${wyrdOn() ? 'checked' : ''} onchange="setWyrd(this.checked)"> Incluir a Wyrd, a runa em branco <span class="rune-opt-note">(criação moderna, anos 80)</span></label>`;
  host.appendChild(box);
}
function init() { renderSpreadButtons(); renderOptions(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})();
