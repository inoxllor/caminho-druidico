/* ============================================================
   Origem do saber e glossário (feedback dos utilizadores, 2026-11-26):
   cada secção diz o que é antigo, o que é medieval e o que é moderno,
   com as fontes; um glossário explica as palavras do caminho.
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const TAGS = { antigo: 'Antigo', medieval: 'Medieval', moderno: 'Moderno', misto: 'Antigo e moderno' };

/* Por secção: [etiqueta, resumo, [fontes]] */
const ORIGINS = {
  runes: ['misto', 'As 24 runas do Futhark antigo são antigas: aparecem em inscrições de cerca de 150 a 800 d.C. Os significados de adivinhação e as tiragens com casas são modernos (século XX). As tiragens seguem o manual «Runas» do Bosque do Cervo.',
    ['Poemas rúnicos: anglo-saxónico (séc. VIII–X), norueguês (séc. XIII) e islandês (séc. XV)', 'Hávamál, est. 138–139, na Edda Poética (Codex Regius, séc. XIII)', 'Henry Barbosa, «Runas», Bosque do Cervo (2021)', 'A Wyrd (runa em branco) foi criada por Ralph Blum em 1982']],
  runelore: ['misto', 'Os nomes, os sons e os três aettir vêm das inscrições e dos poemas rúnicos medievais. Os significados direito e invertido são uma leitura moderna para adivinhação.',
    ['Poemas rúnicos anglo-saxónico, norueguês e islandês', 'Inscrições do Futhark antigo (c. 150–800 d.C.)']],
  oracle: ['misto', 'O Ogham é antigo: há pedras gravadas na Irlanda e na Grã-Bretanha dos séculos IV a VI. As listas de palavras (Bríatharogam) são medievais. O uso do Ogham como oráculo é moderno.',
    ['Pedras com inscrições Ogham (séc. IV–VI)', 'Auraicept na nÉces e In Lebor Ogaim (manuscritos irlandeses medievais)']],
  herbal: ['misto', 'As letras Ogham são antigas, mas a ligação de cada letra a uma árvore só está completa nos textos medievais. As ervas de cada letra são uma escolha moderna. Os usos de fitoterapia são tradicionais e servem só para informação.',
    ['Auraicept na nÉces (medieval)', 'Gravuras de O. W. Thomé, «Flora von Deutschland» (1885), domínio público', 'Em caso de intoxicação: CIAV 800 250 250']],
  treewheel: ['moderno', 'O calendário de 13 meses arbóreos foi proposto por Robert Graves em «The White Goddess» (1948). Não há prova de que os antigos celtas o usassem; é hoje uma tradição moderna, muito usada no druidismo.',
    ['Robert Graves, «The White Goddess» (1948)']],
  wheel: ['misto', 'Samhain, Imbolc, Beltane e Lughnasadh são festas irlandesas antigas. A Roda com oito festas, juntando solstícios e equinócios, foi montada em meados do século XX por Ross Nichols e Gerald Gardner. Os nomes Ostara, Litha e Mabon são de 1974.',
    ['Textos irlandeses medievais sobre as quatro festas', 'Ross Nichols e Gerald Gardner (anos 1950)', 'Aidan Kelly (1974), nomes Ostara, Litha e Mabon']],
  tarot: ['moderno', 'O tarot nasceu em Itália no século XV. Este Tarot nórdico é uma criação desta app, inspirada nos mitos da Edda Poética e da Edda em Prosa (séc. XIII).',
    ['Edda Poética (Codex Regius, séc. XIII)', 'Edda em Prosa, de Snorri Sturluson (séc. XIII)']],
  triads: ['misto', 'As Tríades galesas (Trioedd Ynys Prydein) são medievais. Muitas tríades ditas «druídicas» foram escritas por Iolo Morganwg (1747–1826); são bonitas, mas não são antigas.',
    ['Trioedd Ynys Prydein (manuscritos galeses, séc. XIII)', 'Iolo Morganwg (Edward Williams), finais do séc. XVIII e início do XIX']],
  obod: ['moderno', 'A Ordem dos Bardos, Ovates e Druidas (OBOD) foi fundada em 1964 por Ross Nichols. Os três graus são da ordem moderna. Esta app não tem ligação oficial à OBOD.',
    ['Ross Nichols, fundação da OBOD (1964)', 'druidry.org']],
  ritual: ['moderno', 'As liturgias seguem a prática druídica moderna (séculos XVIII a XXI). Sabemos pouco sobre os rituais dos druidas antigos: quase só o que escreveram autores gregos e romanos.',
    ['Júlio César, «De Bello Gallico», livro VI', 'Plínio, o Velho, «História Natural», XVI']],
  altar: ['moderno', 'O altar e os seus elementos seguem a prática druídica e pagã moderna.', []],
  grounding: ['moderno', 'As meditações guiadas são práticas modernas, inspiradas no druidismo contemporâneo.', []],
  compass: ['moderno', 'A associação dos quatro pontos cardeais aos elementos é moderna (tradição esotérica dos séculos XIX e XX).', []]
};

/* Glossário: [termo, explicação] */
const GLOSSARY = [
  ['Aett (plural aettir)', 'Cada uma das três famílias de oito runas do Futhark antigo, com o nome de Freyr, Heimdall e Tyr.'],
  ['Aicme (plural aicmí)', 'Cada uma das quatro famílias de cinco letras do Ogham, mais as letras extra (forfeda).'],
  ['Awen', 'Palavra galesa para a inspiração poética e espiritual. Escreve-se /|\\ e é cantada no início de muitos rituais druídicos.'],
  ['Bardo, Ovate, Druida', 'Os três graus do druidismo moderno: o bardo cuida da palavra e da arte, o ovate da natureza e da adivinhação, o druida da sabedoria e do ensino.'],
  ['Bríatharogam', 'Listas medievais de pequenas frases poéticas (kennings) para cada letra Ogham.'],
  ['Futhark', 'O alfabeto rúnico, com o nome das suas seis primeiras letras: F, U, Th, A, R, K. O Futhark antigo tem 24 runas; o Futhark novo (era viking) tem 16.'],
  ['Grove', 'Um grupo de pessoas que se reúne para praticar druidismo, muitas vezes ao ar livre.'],
  ['Kenning', 'Imagem poética que substitui um nome, como «caminho das baleias» para o mar.'],
  ['Nornas', 'As três fiandeiras do destino na mitologia nórdica: Urd (o que foi), Verdandi (o que está a ser) e Skuld (o que será).'],
  ['Ogham', 'Alfabeto irlandês antigo, feito de traços ao longo de uma linha. Cada letra tem o nome de uma árvore ou planta.'],
  ['Roda do Ano', 'As oito festas do ano no paganismo moderno: Samhain, Yule, Imbolc, Ostara, Beltane, Litha, Lughnasadh e Mabon.'],
  ['Samhain, Imbolc, Beltane, Lughnasadh', 'As quatro festas irlandesas antigas: o fim do verão (1 de novembro), o início da primavera (1 de fevereiro), o início do verão (1 de maio) e a colheita (1 de agosto).'],
  ['Tríade', 'Ensinamento em três partes, uma forma muito usada na literatura galesa.'],
  ['Tujona', 'Substância de algumas plantas (absinto, artemísia, sálvia) que em excesso é tóxica para o sistema nervoso.'],
  ['Wyrd', 'Palavra antiga para o destino. Nas tiragens modernas é também a runa em branco.']
];

function originBox(id) {
  const o = ORIGINS[id];
  if (!o) return null;
  const [tag, text, src] = o;
  const box = document.createElement('details');
  box.className = 'origin-box';
  box.dataset.origin = id;
  box.innerHTML = `<summary><span class="origin-tag origin-${tag}">${TAGS[tag]}</span> De onde vem isto?</summary>
    <p>${esc(text)}</p>
    ${src.length ? `<p class="origin-src-h">Fontes</p><ul>${src.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
    <button type="button" class="btn-link" onclick="openGlossary()">Abrir o glossário</button>`;
  return box;
}
function addOrigins() {
  Object.keys(ORIGINS).forEach(id => {
    const sec = $('tab-' + id);
    if (!sec || sec.querySelector('.origin-box')) return;
    const box = originBox(id);
    // Logo depois do cabeçalho do primeiro cartão da secção
    const head = sec.querySelector('h2');
    const anchor = head && (head.closest('header, .text-center, div') || head);
    if (anchor && anchor !== sec) anchor.after(box); else sec.prepend(box);
  });
}

/* ——— Glossário ——— */
function glossaryDialog() {
  let d = $('glossary-dialog');
  if (d) return d;
  d = document.createElement('dialog');
  d.id = 'glossary-dialog';
  d.className = 'modal settings-dialog glossary-dialog';
  d.setAttribute('aria-labelledby', 'glossary-title');
  d.innerHTML = `<div class="sd-head"><h2 id="glossary-title" class="font-cinzel text-lg font-bold theme-title">Glossário</h2>
      <button type="button" class="sd-close" aria-label="Fechar" data-close><svg class="ic" aria-hidden="true"><use href="#i-close"></use></svg></button></div>
    <input type="search" id="glossary-q" placeholder="Procurar palavra…" aria-label="Procurar no glossário" class="w-full theme-inner border rounded-lg px-3 py-2 text-sm mb-3">
    <dl class="glossary-list">${GLOSSARY.map(([t, x]) => `<div data-g="${esc((t + ' ' + x).toLowerCase())}"><dt>${esc(t)}</dt><dd>${esc(x)}</dd></div>`).join('')}</dl>`;
  document.body.appendChild(d);
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  d.querySelector('#glossary-q').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    d.querySelectorAll('.glossary-list > div').forEach(r => { r.hidden = q.length > 1 && !r.dataset.g.includes(q); });
  });
  return d;
}
window.openGlossary = function () {
  const d = glossaryDialog();
  if (!d.open) { try { d.showModal(); } catch { d.setAttribute('open', ''); } }
};
window.GLOSSARY = GLOSSARY;
window.ORIGINS = ORIGINS;

function init() { addOrigins(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 200));
else setTimeout(init, 200);
})();
