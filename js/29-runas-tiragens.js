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
  Othala: 'É preciso envelhecer com sabedoria; faça sem fazer.'
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
    return `<button type="button" onclick="drawRunes('${key}')" class="spread-card" data-spread="${key}">
      ${runeSpreadMap({ ...s }, { numbers: false, cls: 'rs-mini' })}
      <span class="spread-name">${escH(s.name)}</span><span class="spread-meta">${escH(s.short)}</span></button>`;
  }).join('');
  grid.innerHTML = btns + `<button type="button" onclick="drawYesNo('runes')" class="spread-card" data-spread="simnao"><span class="spread-dia dia-yn" aria-hidden="true"><i></i></span><span class="spread-name">Sim ou Não</span><span class="spread-meta">1 runa · resposta direta</span></button>`;
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderSpreadButtons);
else renderSpreadButtons();
})();
