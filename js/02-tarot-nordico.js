/**
 * TAROT DA MITOLOGIA NÓRDICA 16-BIT (78 CARTAS COMPLETAS)
 */
const NORDIC_MAJOR_ARCANA = [
    { id: 'M00', num: '00', suit: 'major', name: 'Loki, O Andarilho', title: 'O LOUCO', realm: 'GINNUNGAGAP', rune: 'ᚲ', upright: 'Salto de fé no desconhecido, astúcia criativa, liberdade fora das regras e início inesperado.', reversed: 'Imprudência cega, engano, caos sem direção ou fuga às consequências.', art: 'loki' },
    { id: 'M01', num: 'I', suit: 'major', name: 'Odin, Senhor das Runas', title: 'O MAGO', realm: 'ASGARD • HLIÐSKJÁLF', rune: 'ᚨ', upright: 'Domínio da vontade, sabedoria rúnica, poder de manifestação e mestria sobre os meios disponíveis.', reversed: 'Manipulação, ilusão, talento desperdiçado ou arrogância intelectual.', art: 'odin' },
    { id: 'M02', num: 'II', suit: 'major', name: 'Frigga, Tecelã do Wyrd', title: 'A SACERDOTISA', realm: 'FENSALIR', rune: 'ᛈ', upright: 'Intuição profunda, conhecimento oculto do destino (Wyrd), silêncio sagrado e visão interior.', reversed: 'Segredos reprimidos, desconexão intuitiva ou hesitação em ouvir a voz interior.', art: 'frigga' },
    { id: 'M03', num: 'III', suit: 'major', name: 'Freyja, Senhora de Folkvangr', title: 'A IMPERATRIZ', realm: 'VANAHEIM', rune: 'ᛒ', upright: 'Abundância, fertilidade criativa, beleza sensual, magia Seiðr e nutrição da vida.', reversed: 'Dependência emocional, bloqueio criativo ou excesso de indulgência.', art: 'freyja' },
    { id: 'M04', num: 'IV', suit: 'major', name: 'Tyr, Guardião da Lei', title: 'O IMPERADOR', realm: 'THINGVELLIR', rune: 'ᛏ', upright: 'Autoridade justa, honra inabalável, estrutura, disciplina e sacrifício pelo bem maior.', reversed: 'Tirania, rigidez excessiva, abuso de poder ou falta de estrutura.', art: 'tyr' },
    { id: 'M05', num: 'V', suit: 'major', name: 'Mímir, Fonte da Sabedoria', title: 'O HIEROFANTE', realm: 'MÍMISBRUNNR', rune: 'ᛗ', upright: 'Tradição ancestral, ensinamento sagrado, conselho de um mentor e memória espiritual.', reversed: 'Dogmatismo cego, rebeldia contra tradições úteis ou conselhos falsos.', art: 'mimir' },
    { id: 'M06', num: 'VI', suit: 'major', name: 'Sif & Thor, Laço Sagrado', title: 'OS ENAMORADOS', realm: 'BILSKIRNIR', rune: 'ᚷ', upright: 'União harmónica, escolha consciente alinhada com o coração, parceria e reciprocidade.', reversed: 'Desarmonia, indecisão afetiva ou conflito entre dever e desejo.', art: 'lovers' },
    { id: 'M07', num: 'VII', suit: 'major', name: 'Carruagem de Tanngrisnir', title: 'O CARRO', realm: 'CÉUS DE MIDGARD', rune: 'ᚱ', upright: 'Vitória pela determinação, controlo de forças opostas, avanço imparável e conquista.', reversed: 'Falta de direção, agressividade descontrolada ou obstáculos na jornada.', art: 'chariot' },
    { id: 'M08', num: 'VIII', suit: 'major', name: 'Fenrir & O Laço Gleipnir', title: 'A FORÇA', realm: 'LYNGVI', rune: 'ᚢ', upright: 'Coragem serena, domínio dos instintos primários, paciência e força interior indomável.', reversed: 'Fraqueza interior, dúvida, fúria reprimida ou medo de perder o controlo.', art: 'fenrir' },
    { id: 'M09', num: 'IX', suit: 'major', name: 'Odin Peregrino (Vegtam)', title: 'O EREMITA', realm: 'CAMINHOS DE YGGDRASIL', rune: 'ᛁ', upright: 'Retiro espiritual, busca solitária pela verdade, lanterna interior e prudência.', reversed: 'Isolamento excessivo, solidão amarga ou recusa em aceitar ajuda.', art: 'hermit' },
    { id: 'M10', num: 'X', suit: 'major', name: 'As Três Nornas do Poço', title: 'A RODA DO DESTINO', realm: 'URÐARBRUNNR', rune: 'ᛃ', upright: 'Ponto de viragem no tecido do Wyrd, ciclos inevitáveis, boa fortuna e evolução.', reversed: 'Resistência à mudança, atrasos cíclicos ou sensação de impotência.', art: 'norns' },
    { id: 'M11', num: 'XI', suit: 'major', name: 'Forseti, Juiz de Glitnir', title: 'A JUSTIÇA', realm: 'GLITNIR', rune: 'ᛇ', upright: 'Equilíbrio, verdade cristalina, resolução justa de disputas e responsabilidade cármica.', reversed: 'Injustiça, parcialidade, negação da responsabilidade ou desequilíbrio.', art: 'forseti' },
    { id: 'M12', num: 'XII', suit: 'major', name: 'O Sacrifício em Yggdrasil', title: 'O PENDURADO', realm: 'ÁRVORE DO MUNDO', rune: 'ᚾ', upright: 'Pausa sagrada, entrega do ego para alcançar iluminação, nova perspetiva e sacrifício voluntário.', reversed: 'Estagnação estéril, vitimismo ou resistência a soltar o que já cumpriu o seu ciclo.', art: 'hanged' },
    { id: 'M13', num: 'XIII', suit: 'major', name: 'Hel, Senhora de Helheim', title: 'A MORTE', realm: 'HELHEIM', rune: 'ᚺ', upright: 'Transformação profunda, encerramento definitivo de um ciclo e renascimento inevitável.', reversed: 'Medo da mudança, apego ao passado ou estagnação dolorosa.', art: 'hel' },
    { id: 'M14', num: 'XIV', suit: 'major', name: 'Idunn & As Maçãs Douradas', title: 'A TEMPERANÇA', realm: 'POMAR DE ASGARD', rune: 'ᛚ', upright: 'Alquimia interior, moderação, cura regenerativa, harmonia entre opostos e paciência.', reversed: 'Desequilíbrio, excessos, impaciência ou falta de propósito.', art: 'idunn' },
    { id: 'M15', num: 'XV', suit: 'major', name: 'Surt, Senhor de Muspelheim', title: 'O DIABO', realm: 'MUSPELHEIM', rune: 'ᚦ', upright: 'Apego material, paixões ardentes, sombra interior que exige confronto e libertação.', reversed: 'Quebra de correntes, despertar da ilusão e recuperação da autonomia.', art: 'surt' },
    { id: 'M16', num: 'XVI', suit: 'major', name: 'Ragnarök, Queda de Bifrost', title: 'A TORRE', realm: 'VIGRÍÐR', rune: 'ᚹ', upright: 'Ruptura súbita de estruturas falsas, revelação chocante e limpeza necessária para o novo mundo.', reversed: 'Medo do colapso inevitável, adiamento de crises ou resistência à verdade.', art: 'tower' },
    { id: 'M17', num: 'XVII', suit: 'major', name: 'Aurvandil, Estrela da Manhã', title: 'A ESTRELA', realm: 'CÉU DE ÉLIVÁGAR', rune: 'ᛊ', upright: 'Esperança renovada, cura serena, inspiração celestial e confiança no caminho.', reversed: 'Desânimo passageiro, desconexão espiritual ou falta de fé.', art: 'star' },
    { id: 'M18', num: 'XVIII', suit: 'major', name: 'Máni & O Lobo Hati', title: 'A LUA', realm: 'NOITE DE JOTUNHEIM', rune: 'ᛜ', upright: 'Mistérios do subconsciente, sonhos proféticos, ilusões noturnas e navegação pelo desconhecido.', reversed: 'Clarificação de medos, dissipação de enganos e emergência da verdade.', art: 'moon' },
    { id: 'M19', num: 'XIX', suit: 'major', name: 'Sól & Baldr, Luz Radiante', title: 'O SOL', realm: 'BREIÐABLIK', rune: 'ᛞ', upright: 'Vitalidade plena, alegria pura, clareza, sucesso e bênção luminosa.', reversed: 'Nuvens passageiras sobre o otimismo ou excesso de vaidade.', art: 'sun' },
    { id: 'M20', num: 'XX', suit: 'major', name: 'Heimdall & A Trompa Gjallarhorn', title: 'O JULGAMENTO', realm: 'HIMINBJÖRG', rune: 'ᛉ', upright: 'Chamado espiritual irrecusável, despertar da consciência, absolvição e renascimento.', reversed: 'Autocrítica severa, dúvida ou recusa em atender ao chamado interior.', art: 'heimdall' },
    { id: 'M21', num: 'XXI', suit: 'major', name: 'Yggdrasil & Os Nove Mundos', title: 'O MUNDO', realm: 'COSMOS INTEGRADO', rune: 'ᛟ', upright: 'Plenitude, realização total de um grande ciclo, harmonia cósmica e mestria.', reversed: 'Ciclo quase concluído que pede um último passo de integração.', art: 'world' }
];

const NORDIC_SUITS = [
    { key: 'wands', label: 'Lanças (Gungnir)', element: 'Fogo • Muspelheim', colorPrimary: '#f97316', colorSecondary: '#fef08a', bg: '#1c1008', theme: 'ação, vontade, coragem e fogo criativo' },
    { key: 'cups', label: 'Hidromel (Odrerir)', element: 'Água • Vanaheim', colorPrimary: '#38bdf8', colorSecondary: '#bae6fd', bg: '#081826', theme: 'emoções, intuição, poesia e laços do coração' },
    { key: 'swords', label: 'Espadas (Skofnung)', element: 'Ar • Niflheim', colorPrimary: '#94a3b8', colorSecondary: '#f8fafc', bg: '#0f172a', theme: 'mente, verdade cortante, estratégia e desafios' },
    { key: 'pentacles', label: 'Draupnir (Ouro)', element: 'Terra • Midgard', colorPrimary: '#eab308', colorSecondary: '#fef08a', bg: '#181408', theme: 'prosperidade, corpo, ofício e manifestação material' }
];

// Os sentidos abaixo são só um molde de reserva: os sentidos próprios de cada
// Arcano Menor e as correspondências estão em js/36-tarot-avancado.js.
const NORDIC_RANKS = [
    { rank: 1, num: 'ÁS', title: 'Ás', upright: 'Semente pura e dom primordial de {theme}.', reversed: 'Bloqueio inicial ou energia dispersa em {theme}.' },
    { rank: 2, num: 'II', title: 'Dois', upright: 'Equilíbrio dual, decisão e parceria em {theme}.', reversed: 'Indecisão, dualidade em conflito ou desequilíbrio.' },
    { rank: 3, num: 'III', title: 'Três', upright: 'Expansão, colaboração frutífera e crescimento em {theme}.', reversed: 'Atrasos na colaboração ou dispersão de esforços.' },
    { rank: 4, num: 'IV', title: 'Quatro', upright: 'Estabilidade, alicerce sólido e proteção em {theme}.', reversed: 'Estagnação, apego excessivo ou rigidez.' },
    { rank: 5, num: 'V', title: 'Cinco', upright: 'Prova de força, conflito transformador e superação em {theme}.', reversed: 'Resolução de tensões, trégua e aprendizagem após a crise.' },
    { rank: 6, num: 'VI', title: 'Seis', upright: 'Harmonia, vitória merecida e fluxo generoso em {theme}.', reversed: 'Nostalgia excessiva ou desequilíbrio entre dar e receber.' },
    { rank: 7, num: 'VII', title: 'Sete', upright: 'Perseverança, defesa da posição e discernimento em {theme}.', reversed: 'Exaustão defensiva ou necessidade de reavaliar a estratégia.' },
    { rank: 8, num: 'VIII', title: 'Oito', upright: 'Movimento rápido, mestria técnica e dedicação em {theme}.', reversed: 'Pressa precipitada, bloqueio de fluxo ou frustração.' },
    { rank: 9, num: 'IX', title: 'Nove', upright: 'Resiliência final, plenitude individual e sabedoria em {theme}.', reversed: 'Fadiga antes da meta ou isolamento defensivo.' },
    { rank: 10, num: 'X', title: 'Dez', upright: 'Culminação máxima do ciclo e legado duradouro em {theme}.', reversed: 'Sobrecarga de responsabilidades ou fim de um fardo.' },
    { rank: 11, num: 'SVEINN', title: 'Escudeiro', upright: 'Curiosidade jovem, mensagem importante e início de estudo em {theme}.', reversed: 'Imaturidade, notícias atrasadas ou falta de foco.' },
    { rank: 12, num: 'VALK', title: 'Valquíria', upright: 'Avanço destemido, missão ativa e paixão em {theme}.', reversed: 'Impulsividade temerária ou estagnação na jornada.' },
    { rank: 13, num: 'VÖLVA', title: 'Völva (Rainha)', upright: 'Mestria interior, intuição receptiva e soberania em {theme}.', reversed: 'Insegurança interior ou desequilíbrio emocional.' },
    { rank: 14, num: 'JARL', title: 'Jarl (Rei)', upright: 'Liderança sábia, autoridade madura e domínio pleno em {theme}.', reversed: 'Autoritarismo, rigidez ou perda de visão estratégica.' }
];


// Descrições detalhadas da arte pixel (Maiores + template para Menores)
const TAROT_ART_DESC = {
  loki: 'Loki de túnica verde-esmeralda e elmo dourado de dois chifres, olhos verdes e sorriso astuto, segurando uma pequena chama alaranjada à direita, contra o vazio escuro do Ginnungagap.',
  odin: 'Odin de chapéu azul de aba larga, barba branca e manto azul, com um olho em sombra e o outro brilhante; à direita ergue Gungnir, a lança dourada de ponta branca, e à esquerda voam dois corvos negros.',
  frigga: 'Frigga de cabelo dourado e vestes violeta, de pé, atravessada por dois fios do Wyrd — um azul e um dourado — que se cruzam em X à sua frente.',
  freyja: 'Freyja de cabelo dourado e vestido rosa-magenta, com o colar Brísingamen dourado ao peito, ladeada por dois gatos cinzentos.',
  tyr: 'Tyr de elmo cinzento com aro dourado e túnica vermelha, com uma espada branca erguida na vertical à frente do corpo, como eixo da lei.',
  mimir: 'A cabeça de Mímir, pálida e de olhos azuis, repousa sobre a fonte: uma bacia de água azul com rebordo claro.',
  lovers: 'Duas figuras lado a lado — Thor, de túnica vermelha, e Sif, de cabelo dourado e túnica azul — unidas por um pequeno coração vermelho entre ambas.',
  chariot: 'A carruagem de Thor, em madeira castanha, com o deus de vermelho ao centro; dois bodes cinzentos, Tanngrisnir e Tanngnjóstr, um de cada lado, e dois relâmpagos dourados no céu.',
  fenrir: 'A cabeça do lobo Fenrir, cinzenta, de orelhas erguidas, olhos vermelhos e presas brancas, atravessada por uma faixa dourada: o laço Gleipnir que o prende.',
  hermit: 'Odin Peregrino de capa cinzenta, sozinho na noite, apoiado num cajado de madeira à esquerda e erguendo uma lanterna dourada à direita.',
  norns: 'As três Nornas lado a lado — de azul, de verde e de violeta — sob um fio dourado horizontal, de onde descem dois fios que se unem em V aos pés da Norna central.',
  forseti: 'Forseti de túnica dourada, com um bastão branco da lei erguido ao centro e uma barra de balança cinzenta com dois pratos azuis, um de cada lado.',
  hanged: 'Figura suspensa de cabeça para baixo na Yggdrasil: copa verde em cima, tronco castanho, corpo de túnica azul. A inversão é calma, quase meditativa.',
  hel: 'Hel com o rosto dividido ao meio — metade clara de olho verde, metade sombria de olho azul — e o corpo também partido em cinzento e negro.',
  idunn: 'Idunn de cabelo dourado e vestido verde, segurando à frente um cesto castanho com duas maçãs, uma dourada e uma vermelha.',
  surt: 'Surt, o gigante de fogo, de pele vermelha, chifres alaranjados e olhos amarelos, empunhando à direita uma espada dourada e flamejante.',
  tower: 'Uma torre de pedra cinzenta atingida por um relâmpago amarelo em zigue-zague, com fogo alaranjado a irromper das paredes.',
  star: 'Uma estrela dourada de quatro pontas brilha no céu noturno sobre águas azuis e serenas.',
  moon: 'Lua crescente prateada no céu de Jotunheim; em baixo, duas rochas escuras e, entre elas, a pequena silhueta do lobo Hati.',
  sun: 'Um sol dourado radiante, com quatro raios, ergue-se sobre um prado verde.',
  heimdall: 'Heimdall de armadura branca e capuz claro, com uma faixa dourada ao centro, a soprar a trompa Gjallarhorn, curva e dourada, à direita.',
  world: 'A Yggdrasil — copa verde, tronco e raízes castanhos — dentro de um anel verde que simboliza os nove mundos, com um ponto dourado no centro do eixo.'
};

function describeTarotArt(card) {
  if (card.artDesc) return card.artDesc;
  if (card.art && TAROT_ART_DESC[card.art]) return TAROT_ART_DESC[card.art];
  if (card.suit === 'major') return 'Ilustração pixel art nórdica dos Arcanos Maiores, com figura central e símbolos rúnicos.';
  const SUIT = {
    wands: { one: 'lança flamejante', many: 'lanças flamejantes', f: true, color: 'laranja', scene: 'em cenário de Muspelheim, em laranjas e ocres de fogo criativo' },
    cups: { one: 'taça de hidromel', many: 'taças de hidromel', f: true, color: 'azul-celeste', scene: 'em tons de água e prata, evocando a emoção e a poesia de Vanaheim' },
    swords: { one: 'espada de lâmina clara', many: 'espadas de lâmina clara', f: true, color: 'cinzento-azulado', scene: 'sob o céu frio de Niflheim, em azuis e cinzas' },
    pentacles: { one: 'anel de ouro (Draupnir)', many: 'anéis de ouro (Draupnir)', f: false, color: 'dourado', scene: 'sobre a terra fértil de Midgard, em dourados e ocres' }
  }[card.suit];
  if (!SUIT) return 'Símbolo do naipe em estética pixel nórdica.';
  const r = Number(card.rank);
  if (r === 1) {
    const aceArt = card.suit === 'pentacles'
      ? 'Um único grande anel de ouro (Draupnir), atravessado por um eixo vertical,'
      : `${SUIT.f ? 'Uma única' : 'Um único'} ${SUIT.one} grande, ${SUIT.f ? 'isolada' : 'isolado'} ao centro,`;
    return `${aceArt} ${SUIT.scene}: a semente pura do elemento.`;
  }
  if (r >= 11) {
    const court = {
      11: ['Escudeiro', 'uma touca cinzenta', 'jovem mensageiro do elemento'],
      12: ['Valquíria', 'um elmo de duas asas brancas', 'avanço destemido ao serviço do elemento'],
      13: ['Völva', 'um diadema de prata', 'soberania que interioriza e nutre o elemento'],
      14: ['Jarl', 'uma coroa dourada', 'soberania que exterioriza e governa o elemento']
    }[r];
    const art = SUIT.f ? 'uma' : 'um';
    return `Figura de ${court[0] === 'Valquíria' || court[0] === 'Völva' ? 'uma' : 'um'} ${court[0]} com ${court[1]} e manto ${SUIT.color}, segurando à direita ${art} ${SUIT.one}, ${SUIT.scene}: ${court[2]}.`;
  }
  const NUM = { 2: SUIT.f ? 'Duas' : 'Dois', 3: 'Três', 4: 'Quatro', 5: 'Cinco', 6: 'Seis', 7: 'Sete', 8: 'Oito', 9: 'Nove', 10: 'Dez' }[r];
  const LAYOUT = {
    2: 'alinhad@s na vertical, um@ sobre @ outr@',
    3: 'alinhad@s numa coluna central',
    4: 'nos quatro cantos de um quadrado',
    5: 'nos quatro cantos, com a quinta ao centro',
    6: 'em duas colunas de três',
    7: 'em duas colunas de três, com a sétima ao centro, acima',
    8: 'em duas colunas de três, com duas ao centro',
    9: 'em duas colunas de quatro, com a nona ao centro',
    10: 'em duas colunas de quatro, com duas ao centro'
  }[r].replace('um@', SUIT.f ? 'uma' : 'um').replace(/@/g, SUIT.f ? 'a' : 'o').replace('a quinta', SUIT.f ? 'a quinta' : 'o quinto').replace('a sétima', SUIT.f ? 'a sétima' : 'o sétimo').replace('a nona', SUIT.f ? 'a nona' : 'o nono').replace(/com duas ao centro/, SUIT.f ? 'com duas ao centro' : 'com dois ao centro');
  // Só a imagem: o sentido de cada número está na ficha (js/36)
  return `${NUM} ${SUIT.many} ${LAYOUT}, ${SUIT.scene}.`;
}

const NORDIC_TAROT_DECK = (() => {
    const deck = [...NORDIC_MAJOR_ARCANA];
    NORDIC_SUITS.forEach(suit => {
        NORDIC_RANKS.forEach(r => {
            deck.push({
                id: `${suit.key}_${r.rank}`,
                num: r.num,
                rank: r.rank,
                suit: suit.key,
                suitObj: suit,
                name: `${r.title} de ${suit.label.split(' ')[0]}`,
                title: `${r.title.toUpperCase()} • ${suit.label.split(' ')[0].toUpperCase()}`,
                realm: suit.element.toUpperCase(),
                upright: r.upright.replace('{theme}', suit.theme),
                reversed: r.reversed.replace('{theme}', suit.theme)
            });
        });
    });
    deck.forEach(c => { c.artDesc = describeTarotArt(c); });
    return deck;
})();

function renderNordic16BitSVG(card) {
    if (card.suit === 'major') {
        const majorSprites = {
            loki: `<rect width="32" height="32" fill="#090d16"/><rect x="9" y="3" width="2" height="6" fill="#facc15"/><rect x="21" y="3" width="2" height="6" fill="#facc15"/><rect x="11" y="7" width="10" height="3" fill="#eab308"/><rect x="11" y="10" width="10" height="7" fill="#fed7aa"/><rect x="13" y="12" width="2" height="2" fill="#10b981"/><rect x="17" y="12" width="2" height="2" fill="#10b981"/><rect x="8" y="17" width="16" height="12" fill="#065f46"/><rect x="12" y="17" width="8" height="12" fill="#10b981"/><rect x="24" y="10" width="4" height="5" fill="#f97316"/><rect x="25" y="8" width="2" height="3" fill="#fef08a"/>`,
            odin: `<rect width="32" height="32" fill="#0b1120"/><rect x="9" y="5" width="14" height="3" fill="#3b82f6"/><rect x="11" y="8" width="10" height="7" fill="#fed7aa"/><rect x="13" y="10" width="2" height="2" fill="#0f172a"/><rect x="17" y="10" width="2" height="2" fill="#38bdf8"/><rect x="10" y="15" width="12" height="6" fill="#e2e8f0"/><rect x="8" y="18" width="16" height="12" fill="#1d4ed8"/><rect x="25" y="3" width="2" height="27" fill="#eab308"/><rect x="24" y="2" width="4" height="4" fill="#f8fafc"/><rect x="4" y="6" width="3" height="2" fill="#020617"/><rect x="4" y="11" width="3" height="2" fill="#020617"/>`,
            frigga: `<rect width="32" height="32" fill="#130d24"/><rect x="12" y="5" width="8" height="3" fill="#fde047"/><rect x="11" y="8" width="10" height="7" fill="#fed7aa"/><rect x="9" y="15" width="14" height="14" fill="#6d28d9"/><rect x="13" y="15" width="6" height="14" fill="#c4b5fd"/><line x1="4" y1="6" x2="28" y2="26" stroke="#eab308" stroke-width="1"/><line x1="28" y1="6" x2="4" y2="26" stroke="#38bdf8" stroke-width="1"/>`,
            freyja: `<rect width="32" height="32" fill="#1f0d1b"/><rect x="10" y="6" width="12" height="10" fill="#facc15"/><rect x="12" y="8" width="8" height="6" fill="#fed7aa"/><rect x="11" y="15" width="10" height="2" fill="#eab308"/><rect x="9" y="17" width="14" height="12" fill="#db2777"/><rect x="4" y="21" width="4" height="7" fill="#94a3b8"/><rect x="24" y="21" width="4" height="7" fill="#94a3b8"/>`,
            tyr: `<rect width="32" height="32" fill="#1c0a0a"/><rect x="11" y="6" width="10" height="4" fill="#94a3b8"/><rect x="12" y="10" width="8" height="5" fill="#fed7aa"/><rect x="9" y="15" width="14" height="13" fill="#b91c1c"/><rect x="15" y="4" width="2" height="22" fill="#f8fafc"/><rect x="12" y="9" width="8" height="2" fill="#eab308"/>`,
            mimir: `<rect width="32" height="32" fill="#071921"/><rect x="6" y="20" width="20" height="9" fill="#0284c7"/><rect x="9" y="18" width="14" height="3" fill="#7dd3fc"/><rect x="12" y="7" width="8" height="7" fill="#cbd5e1"/><rect x="11" y="13" width="10" height="5" fill="#f8fafc"/><rect x="14" y="9" width="1" height="2" fill="#38bdf8"/><rect x="17" y="9" width="1" height="2" fill="#38bdf8"/>`,
            lovers: `<rect width="32" height="32" fill="#1a120b"/><rect x="6" y="9" width="7" height="7" fill="#fed7aa"/><rect x="5" y="16" width="9" height="12" fill="#dc2626"/><rect x="19" y="9" width="7" height="7" fill="#fed7aa"/><rect x="19" y="6" width="7" height="3" fill="#facc15"/><rect x="18" y="16" width="9" height="12" fill="#2563eb"/><rect x="14" y="12" width="4" height="4" fill="#f43f5e"/>`,
            chariot: `<rect width="32" height="32" fill="#0c1426"/><rect x="4" y="16" width="6" height="8" fill="#cbd5e1"/><rect x="22" y="16" width="6" height="8" fill="#cbd5e1"/><rect x="10" y="14" width="12" height="10" fill="#b45309"/><rect x="13" y="8" width="6" height="6" fill="#dc2626"/><rect x="5" y="5" width="2" height="6" fill="#fef08a"/><rect x="25" y="7" width="2" height="6" fill="#fef08a"/>`,
            fenrir: `<rect width="32" height="32" fill="#111827"/><rect x="7" y="11" width="18" height="12" fill="#374151"/><rect x="8" y="7" width="3" height="4" fill="#4b5563"/><rect x="21" y="7" width="3" height="4" fill="#4b5563"/><rect x="10" y="13" width="3" height="2" fill="#ef4444"/><rect x="19" y="13" width="3" height="2" fill="#ef4444"/><rect x="11" y="19" width="10" height="3" fill="#f8fafc"/><rect x="5" y="17" width="22" height="2" fill="#facc15"/>`,
            hermit: `<rect width="32" height="32" fill="#060913"/><rect x="11" y="6" width="10" height="22" fill="#334155"/><rect x="13" y="9" width="6" height="5" fill="#fed7aa"/><rect x="6" y="4" width="2" height="24" fill="#92400e"/><rect x="23" y="13" width="4" height="5" fill="#fef08a"/><rect x="22" y="12" width="6" height="7" fill="none" stroke="#f59e0b" stroke-width="1"/>`,
            norns: `<rect width="32" height="32" fill="#0f172a"/><rect x="4" y="11" width="6" height="15" fill="#0ea5e9"/><rect x="13" y="9" width="6" height="17" fill="#10b981"/><rect x="22" y="11" width="6" height="15" fill="#8b5cf6"/><line x1="4" y1="8" x2="28" y2="8" stroke="#facc15" stroke-width="2"/><line x1="7" y1="8" x2="16" y2="27" stroke="#eab308" stroke-width="1"/><line x1="25" y1="8" x2="16" y2="27" stroke="#eab308" stroke-width="1"/>`,
            forseti: `<rect width="32" height="32" fill="#1e1b18"/><rect x="12" y="6" width="8" height="6" fill="#fed7aa"/><rect x="10" y="12" width="12" height="16" fill="#eab308"/><rect x="15" y="4" width="2" height="24" fill="#f8fafc"/><rect x="6" y="12" width="20" height="2" fill="#cbd5e1"/><rect x="5" y="14" width="4" height="3" fill="#38bdf8"/><rect x="23" y="14" width="4" height="3" fill="#38bdf8"/>`,
            hanged: `<rect width="32" height="32" fill="#071510"/><rect x="14" y="2" width="4" height="28" fill="#78350f"/><rect x="6" y="4" width="20" height="4" fill="#15803d"/><rect x="13" y="8" width="6" height="12" fill="#2563eb"/><rect x="13" y="20" width="6" height="5" fill="#fed7aa"/><rect x="12" y="23" width="8" height="2" fill="#facc15"/>`,
            hel: `<rect width="32" height="32" fill="#090d16"/><rect x="11" y="7" width="5" height="8" fill="#fed7aa"/><rect x="16" y="7" width="5" height="8" fill="#1e293b"/><rect x="17" y="9" width="2" height="2" fill="#38bdf8"/><rect x="13" y="9" width="2" height="2" fill="#10b981"/><rect x="9" y="15" width="7" height="14" fill="#334155"/><rect x="16" y="15" width="7" height="14" fill="#020617"/>`,
            idunn: `<rect width="32" height="32" fill="#0a1f12"/><rect x="11" y="7" width="10" height="7" fill="#fed7aa"/><rect x="10" y="6" width="12" height="3" fill="#facc15"/><rect x="9" y="14" width="14" height="15" fill="#16a34a"/><rect x="13" y="17" width="6" height="4" fill="#92400e"/><rect x="14" y="15" width="2" height="2" fill="#facc15"/><rect x="17" y="15" width="2" height="2" fill="#ef4444"/>`,
            surt: `<rect width="32" height="32" fill="#260707"/><rect x="10" y="6" width="12" height="8" fill="#dc2626"/><rect x="8" y="4" width="3" height="4" fill="#f97316"/><rect x="21" y="4" width="3" height="4" fill="#f97316"/><rect x="12" y="9" width="3" height="2" fill="#fef08a"/><rect x="17" y="9" width="3" height="2" fill="#fef08a"/><rect x="8" y="14" width="16" height="14" fill="#7f1d1d"/><rect x="25" y="3" width="3" height="25" fill="#facc15"/>`,
            tower: `<rect width="32" height="32" fill="#0f0c1d"/><rect x="10" y="10" width="12" height="19" fill="#475569"/><rect x="11" y="6" width="10" height="4" fill="#64748b"/><polyline points="4,2 14,10 10,12 22,22" fill="none" stroke="#fef08a" stroke-width="2"/><rect x="13" y="13" width="6" height="5" fill="#f97316"/>`,
            star: `<rect width="32" height="32" fill="#070d1f"/><rect x="15" y="4" width="2" height="10" fill="#fef08a"/><rect x="11" y="8" width="10" height="2" fill="#fef08a"/><rect x="13" y="6" width="6" height="6" fill="#fde047"/><rect x="4" y="23" width="24" height="7" fill="#0284c7"/><rect x="8" y="25" width="16" height="2" fill="#7dd3fc"/>`,
            moon: `<rect width="32" height="32" fill="#060913"/><circle cx="16" cy="11" r="6" fill="#e2e8f0"/><circle cx="19" cy="10" r="5" fill="#060913"/><rect x="6" y="21" width="7" height="7" fill="#334155"/><rect x="19" y="21" width="7" height="7" fill="#475569"/><rect x="14" y="24" width="4" height="6" fill="#1e293b"/>`,
            sun: `<rect width="32" height="32" fill="#1e1505"/><circle cx="16" cy="13" r="6" fill="#facc15"/><rect x="15" y="3" width="2" height="3" fill="#fef08a"/><rect x="15" y="20" width="2" height="3" fill="#fef08a"/><rect x="6" y="12" width="3" height="2" fill="#fef08a"/><rect x="23" y="12" width="3" height="2" fill="#fef08a"/><rect x="8" y="24" width="16" height="5" fill="#15803d"/>`,
            heimdall: `<rect width="32" height="32" fill="#111827"/><rect x="11" y="6" width="10" height="8" fill="#f8fafc"/><rect x="13" y="8" width="6" height="5" fill="#fed7aa"/><rect x="9" y="14" width="14" height="14" fill="#e2e8f0"/><rect x="15" y="14" width="2" height="14" fill="#eab308"/><path d="M21,11 Q28,11 27,20 L24,20 Q24,14 21,14 Z" fill="#facc15"/>`,
            world: `<rect width="32" height="32" fill="#06140e"/><circle cx="16" cy="16" r="12" fill="none" stroke="#22c55e" stroke-width="2"/><rect x="14" y="8" width="4" height="16" fill="#78350f"/><rect x="9" y="6" width="14" height="6" fill="#16a34a"/><rect x="10" y="23" width="12" height="3" fill="#92400e"/><circle cx="16" cy="16" r="2" fill="#facc15"/>`
        };
        const desc = describeTarotArt(card);
        return `<svg viewBox="0 0 32 32" shape-rendering="crispEdges" class="pixel-svg" role="img" aria-label="${String(desc).replace(/"/g, '&quot;')}"><title>${String(card.name || '').replace(/</g, '')}</title>${majorSprites[card.art] || majorSprites.world}</svg>`;
    }

    const s = card.suitObj;
    const r = card.rank;
    let glyph = '';

    // Símbolo centrado em (0,0), desenhado num grupo com escala para nunca se sobrepor
    const itemShape = () => {
        if (s.key === 'wands') return `<rect x="-1" y="-3" width="2" height="7" fill="${s.colorPrimary}"/><rect x="-2" y="-4" width="4" height="2" fill="${s.colorSecondary}"/>`;
        if (s.key === 'cups') return `<rect x="-2" y="-3" width="4" height="3" fill="${s.colorPrimary}"/><rect x="-1" y="0" width="2" height="2" fill="${s.colorSecondary}"/><rect x="-2" y="2" width="4" height="1" fill="${s.colorPrimary}"/>`;
        if (s.key === 'swords') return `<rect x="-1" y="-4" width="2" height="6" fill="${s.colorSecondary}"/><rect x="-2" y="2" width="4" height="1" fill="#eab308"/><rect x="-1" y="3" width="2" height="2" fill="#92400e"/>`;
        return `<rect x="-2" y="-2" width="4" height="4" fill="none" stroke="${s.colorPrimary}" stroke-width="1.2"/><rect x="-1" y="-1" width="2" height="2" fill="${s.colorSecondary}"/>`;
    };
    const drawItem = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">${itemShape()}</g>`;
    // Disposição de cartas de jogar: colunas x = 10 / 16 / 22
    const PIPS = {
        2: [[16, 9], [16, 23]],
        3: [[16, 7], [16, 16], [16, 25]],
        4: [[10, 9], [22, 9], [10, 23], [22, 23]],
        5: [[10, 8], [22, 8], [10, 24], [22, 24], [16, 16]],
        6: [[10, 7], [22, 7], [10, 16], [22, 16], [10, 25], [22, 25]],
        7: [[10, 7], [22, 7], [10, 16], [22, 16], [10, 25], [22, 25], [16, 11.5]],
        8: [[10, 7], [22, 7], [10, 16], [22, 16], [10, 25], [22, 25], [16, 11.5], [16, 20.5]],
        9: [[10, 6], [22, 6], [10, 12.7], [22, 12.7], [10, 19.3], [22, 19.3], [10, 26], [22, 26], [16, 16]],
        10: [[10, 6], [22, 6], [10, 12.7], [22, 12.7], [10, 19.3], [22, 19.3], [10, 26], [22, 26], [16, 9.3], [16, 22.7]]
    };
    const PIP_SCALE = { 2: 1, 3: 0.82, 4: 1, 5: 1, 6: 0.85, 7: 0.82, 8: 0.82, 9: 0.66, 10: 0.66 };

    if (r === 1) {
        if (s.key === 'wands') glyph = `<rect x="15" y="4" width="2" height="24" fill="#b45309"/><polygon points="16,2 12,9 20,9" fill="${s.colorSecondary}"/><rect x="11" y="11" width="10" height="2" fill="${s.colorPrimary}"/>`;
        if (s.key === 'cups') glyph = `<rect x="10" y="7" width="12" height="8" fill="${s.colorPrimary}"/><rect x="12" y="6" width="8" height="2" fill="#fef08a"/><rect x="14" y="15" width="4" height="7" fill="${s.colorSecondary}"/><rect x="11" y="22" width="10" height="3" fill="${s.colorPrimary}"/>`;
        if (s.key === 'swords') glyph = `<rect x="15" y="3" width="2" height="19" fill="${s.colorSecondary}"/><rect x="10" y="21" width="12" height="2" fill="#eab308"/><rect x="15" y="23" width="2" height="5" fill="#78350f"/><circle cx="16" cy="28" r="2" fill="#eab308"/>`;
        if (s.key === 'pentacles') glyph = `<circle cx="16" cy="16" r="9" fill="none" stroke="${s.colorPrimary}" stroke-width="3"/><circle cx="16" cy="16" r="5" fill="none" stroke="${s.colorSecondary}" stroke-width="1"/><rect x="15" y="5" width="2" height="22" fill="${s.colorSecondary}"/>`;
    } else if (r >= 11) {
        const crown = r === 14 ? `<rect x="11" y="4" width="10" height="3" fill="#facc15"/>` :
                      r === 13 ? `<rect x="12" y="5" width="8" height="2" fill="#e2e8f0"/>` :
                      r === 12 ? `<rect x="9" y="4" width="3" height="4" fill="#f8fafc"/><rect x="20" y="4" width="3" height="4" fill="#f8fafc"/>` :
                                 `<rect x="12" y="6" width="8" height="2" fill="#94a3b8"/>`;
        glyph = `
            ${crown}
            <rect x="12" y="7" width="8" height="6" fill="#fed7aa"/>
            <rect x="9" y="13" width="14" height="14" fill="${s.colorPrimary}"/>
            <rect x="13" y="13" width="6" height="14" fill="#1e293b"/>
            ${drawItem(25, 18)}
        `;
    } else {
        (PIPS[r] || []).forEach(([x, y]) => { glyph += drawItem(x, y, PIP_SCALE[r]); });
    }

    return `
        <svg viewBox="0 0 32 32" shape-rendering="crispEdges" class="pixel-svg">
            <rect width="32" height="32" fill="${s.bg}"/>
            ${glyph}
        </svg>
    `;
}

let activeTarotFilter = 'all';
let activeTarotMode = 'draw';
let lastTarotReading = [];

function setTarotFilter(filter) {
    activeTarotFilter = filter;
    ['all', 'major', 'wands', 'cups', 'swords', 'pentacles'].forEach(f => {
        const btn = document.getElementById(`filter-btn-${f}`);
        if (!btn) return;
        if (f === filter) {
            btn.className = 'bg-[var(--btn-primary)] text-[var(--on-primary)] text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer';
        } else {
            btn.className = 'theme-inner theme-muted border border-[var(--border-color)] text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer';
        }
    });
    if (activeTarotMode === 'gallery') renderTarotGallery();
}

function switchTarotMode(mode) {
    activeTarotMode = mode;
    const drawBtn = document.getElementById('tarot-mode-draw');
    const galBtn = document.getElementById('tarot-mode-gallery');
    const actionsBar = document.getElementById('tarot-draw-actions');

    if (mode === 'draw') {
        drawBtn.className = 'bg-[var(--btn-primary)] text-[var(--on-primary)] font-bold text-sm px-4 py-2 rounded-lg transition cursor-pointer';
        galBtn.className = 'theme-inner theme-title border border-[var(--border-color)] font-semibold text-sm px-4 py-2 rounded-lg transition cursor-pointer';
        if (actionsBar) actionsBar.classList.remove('hidden');
        restoreTarotDraw();
    } else {
        galBtn.className = 'bg-[var(--btn-primary)] text-[var(--on-primary)] font-bold text-sm px-4 py-2 rounded-lg transition cursor-pointer';
        drawBtn.className = 'theme-inner theme-title border border-[var(--border-color)] font-semibold text-sm px-4 py-2 rounded-lg transition cursor-pointer';
        if (actionsBar) actionsBar.classList.add('hidden');
        renderTarotGallery();
    }
}

function getFilteredNordicDeck() {
    if (activeTarotFilter === 'all') return NORDIC_TAROT_DECK;
    return NORDIC_TAROT_DECK.filter(c => c.suit === activeTarotFilter);
}


// ——— Cartas de tarot: modelo partilhado (face, verso) ———
const TAROT_SUIT_RUNE = { wands: 'ᚲ', cups: 'ᛚ', swords: 'ᛏ', pentacles: 'ᚠ' };
function tarotSuitClass(card) {
    return ['wands', 'cups', 'swords', 'pentacles'].includes(card.suit) ? 'suit-' + card.suit : 'suit-major';
}
function tarotEsc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function tarotArtBg(card) {
    const m = renderNordic16BitSVG(card).match(/<rect width="32" height="32" fill="(#[0-9a-fA-F]{3,8})"/);
    return m ? m[1] : '#0a0c14';
}
function tarotFaceInner(card, isReversed = false) {
    const isMajor = tarotSuitClass(card) === 'suit-major';
    const rune = card.rune || TAROT_SUIT_RUNE[card.suit] || 'ᛟ';
    const suitLabel = isMajor ? 'Arcano Maior' : (card.suitObj ? card.suitObj.label.split(' ')[0] : '');
    const realm = isMajor ? (card.realm || '') : (card.suitObj ? card.suitObj.element : card.realm || '');
    return `<div class="tc-top"><span class="tc-num">${tarotEsc(card.num || '')}</span><span class="tc-suit">${tarotEsc(suitLabel)}</span><span class="tc-rune" aria-hidden="true">${rune}</span></div>
        <div class="card-art-box ${isReversed ? 'is-reversed' : ''}" style="background:${tarotArtBg(card)}">${renderNordic16BitSVG(card).replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ')}</div>
        <div class="tc-plate"><span class="tc-name">${tarotEsc(card.name || '')}</span><span class="tc-realm">${tarotEsc(realm)}</span></div>`;
}
const TAROT_BACK_HTML = `<div class="tarot-back-pattern" aria-hidden="true"></div>
    <span class="tc-back-hint">Toque para revelar</span>
    <svg class="tc-back-emblem" viewBox="0 0 120 120" aria-hidden="true" fill="none" stroke="#d6b25e" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="60" cy="60" r="56" stroke-width="1.5"/>
        <circle cx="60" cy="60" r="50" stroke-width="0.8" stroke-dasharray="1.5 3.2"/>
        <circle cx="60" cy="60" r="44" stroke-width="1.2" fill="#141522"/>
        <path d="M60 92 V44" stroke-width="3"/>
        <path d="M60 58 C50 52 42 50 34 40 M60 58 C70 52 78 50 86 40 M60 50 C54 44 50 38 48 30 M60 50 C66 44 70 38 72 30 M60 66 C52 62 44 62 36 56 M60 66 C68 62 76 62 84 56" stroke-width="2"/>
        <path d="M60 92 C54 96 46 98 38 96 M60 92 C66 96 74 98 82 96 M60 90 C58 96 56 100 52 104 M60 90 C62 96 64 100 68 104" stroke-width="1.8"/>
        <g fill="#f3dc9a" stroke="none"><circle cx="34" cy="40" r="2.4"/><circle cx="86" cy="40" r="2.4"/><circle cx="48" cy="30" r="2.4"/><circle cx="72" cy="30" r="2.4"/><circle cx="36" cy="56" r="2.4"/><circle cx="84" cy="56" r="2.4"/><circle cx="60" cy="24" r="3"/></g>
        <path d="M60 4 l3 5 -3 5 -3 -5z M60 106 l3 5 -3 5 -3 -5z M4 60 l5 -3 5 3 -5 3z M106 60 l5 -3 5 3 -5 3z" fill="#d6b25e" stroke="none"/>
    </svg>
    <span class="tc-back-label">YGGDRASIL</span>`;

function buildPixelCardHTML(card, isReversed = false, positionLabel = '') {
    const orientationBadge = isReversed
        ? `<span class="tarot-badge rev">Invertida</span>`
        : `<span class="tarot-badge ok">Direita</span>`;
    const meaning = isReversed ? card.reversed : card.upright;

    return `
        <div class="flex flex-col items-center w-full max-w-[230px] mx-auto space-y-2.5">
            ${positionLabel ? `<span class="text-[11px] uppercase tracking-widest theme-accent font-bold">${positionLabel}</span>` : ''}
            <div class="tarot-flip-wrapper is-flipped cursor-pointer" onclick="this.classList.toggle('is-flipped')" title="Toque para virar" aria-label="${tarotEsc(card.name)}">
                <div class="tarot-flip-inner">
                    <div class="tarot-card-back">${TAROT_BACK_HTML}</div>
                    <div class="tarot-card-front ${tarotSuitClass(card)}">${tarotFaceInner(card, isReversed)}</div>
                </div>
            </div>
            <div class="tarot-meaning space-y-1.5">
                <div class="flex items-center justify-center gap-1.5 flex-wrap">
                    <strong class="tm-name">${tarotEsc(card.name)}</strong>
                    ${orientationBadge}
                </div>
                <p class="text-[11px] theme-muted leading-relaxed italic">${describeTarotArt(card)}</p>
                <p class="text-xs theme-title leading-relaxed">${meaning || ''}</p>
                ${window.tarotCardExtra ? window.tarotCardExtra(card) : ''}
            </div>
        </div>`;
}

function drawTarotCard(count) {
    if (activeTarotMode !== 'draw') switchTarotMode('draw');
    const pool = [...getFilteredNordicDeck()];
    const drawn = [];

    for (let i = 0; i < count && pool.length > 0; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const card = pool.splice(idx, 1)[0];
        const isReversed = Math.random() < 0.35;
        drawn.push({ card, isReversed });
    }

    lastTarotReading = drawn;
    const labels = count === 3
        ? ['Urd (Passado)', 'Verdandi (Presente)', 'Skuld (Futuro)']
        : count === 5
        ? ['Centro (Situação)', 'Norte (Desafios)', 'Leste (Conselho)', 'Sul (Força)', 'Oeste (Desfecho)']
        : ['Oráculo de Odin'];

    const gridCols = count === 1 ? 'grid-cols-1' : count === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5';
    const container = document.getElementById('tarot-card-container');
    container.innerHTML = `
        <div class="grid ${gridCols} gap-5 w-full items-start justify-center">
            ${drawn.map((item, i) => buildPixelCardHTML(item.card, item.isReversed, labels[i] || '')).join('')}
        </div>
    `;

    const saveBar = document.getElementById('tarot-save-bar');
    if (saveBar) saveBar.classList.remove('hidden');
}

function tarotFaceHTML(card) {
    return `<div class="tarot-static"><div class="tarot-card-front ${tarotSuitClass(card)}">${tarotFaceInner(card)}</div></div>`;
}

// Grimório: 2 colunas no telemóvel; tocar numa carta abre o detalhe (direita + invertida)
function renderTarotGallery() {
    const pool = getFilteredNordicDeck();
    const container = document.getElementById('tarot-card-container');
    container.innerHTML = `
        <div class="w-full space-y-4">
            <p class="text-sm theme-muted" aria-live="polite">${pool.length ? `${pool.length} de 78 cartas. Toque numa carta para ver os sentidos direito e invertido.` : 'Nenhuma carta corresponde à pesquisa.'}</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                ${pool.map(card => `<button type="button" class="tarot-tile" onclick="openTarotDetail('${card.id}')" aria-label="${tarotEsc(card.name)}">${tarotFaceHTML(card)}<span class="tarot-tile-name">${card.name}</span></button>`).join('')}
            </div>
        </div>
    `;
}

// OGHAM DATA
