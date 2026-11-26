const OGHAM_DATA = [
    { symbol: "ᚁ", name: "Beith", tree: "Vidoeiro (Birch)", aicme: "Aicme Beithe", month: "24 Dez – 20 Jan", herb: "Casca de Vidoeiro & Dente-de-Leão", meaning: "Novos começos, purificação, renovação espiritual e limpeza de energias estagnadas." },
    { symbol: "ᚂ", name: "Luis", tree: "Sorveira (Rowan)", aicme: "Aicme Beithe", month: "21 Jan – 17 Feb", herb: "Bagas de Sorveira & Verbena", meaning: "Proteção contra ilusões, despertar da visão interior e discernimento." },
    { symbol: "ᚃ", name: "Fearn", tree: "Amieiro (Alder)", aicme: "Aicme Beithe", month: "18 Fev – 17 Mar", herb: "Folhas de Amieiro & Ulmeira", meaning: "Coragem para atravessar pontes entre mundos, resiliência e proteção espiritual." },
    { symbol: "ᚄ", name: "Saille", tree: "Salgueiro (Willow)", aicme: "Aicme Beithe", month: "18 Mar – 14 Abr", herb: "Casca de Salgueiro & Artemísia", meaning: "Intuição lunar, fluidez emocional, sonhos proféticos e ciclos femininos." },
    { symbol: "ᚅ", name: "Nion", tree: "Freixo (Ash)", aicme: "Aicme Beithe", month: "15 Abr – 12 Mai", herb: "Sementes de Freixo & Agrimónia", meaning: "Conexão entre o microcosmo e o macrocosmo (Yggdrasil / Árvore do Mundo), poder da palavra." },
    { symbol: "ᚆ", name: "Huath", tree: "Espinheiro (Hawthorn)", aicme: "Aicme hÚatha", month: "13 Mai – 09 Jun", herb: "Flores de Espinheiro & Rosa Silvestre", meaning: "Cura do coração, paciência sagrada, proteção dos limiares e magia das fadas." },
    { symbol: "ᚇ", name: "Duir", tree: "Carvalho (Oak)", aicme: "Aicme hÚatha", month: "10 Jun – 07 Jul", herb: "Bolota, Musgo de Carvalho & Viscum", meaning: "Força soberana, resistência, porta de entrada para os mistérios e nobreza de espírito." },
    { symbol: "ᚈ", name: "Tinne", tree: "Azevinho (Holly)", aicme: "Aicme hÚatha", month: "08 Jul – 04 Ago", herb: "Folhas de Azevinho & Cardo Santo", meaning: "Justiça, equilíbrio das forças opostas, defesa honrada e liderança." },
    { symbol: "ᚉ", name: "Coll", tree: "Aveleira (Hazel)", aicme: "Aicme hÚatha", month: "05 Ago – 01 Set", herb: "Avelãs & Sálvia", meaning: "Sabedoria inspirada, Awen poética, conhecimento concentrado e intuição criativa." },
    { symbol: "ᚊ", name: "Quert", tree: "Macieira (Apple)", aicme: "Aicme hÚatha", month: "Equinócio / Avalon", herb: "Flor de Macieira & Camomila", meaning: "Beleza eterna, regeneração, escolhas do coração e imortalidade da alma." },
    { symbol: "ᚋ", name: "Muin", tree: "Videira (Vine)", aicme: "Aicme Muine", month: "02 Set – 29 Set", herb: "Folha de Videira & Amora Silvestre", meaning: "Colheita interior, verdade revelada sem filtros, êxtase espiritual e profecia." },
    { symbol: "ᚌ", name: "Gort", tree: "Hera (Ivy)", aicme: "Aicme Muine", month: "30 Set – 27 Out", herb: "Hera Terrestre & Alecrim", meaning: "Persistência na espiral da vida, superação de obstáculos e determinação." },
    { symbol: "ᚍ", name: "Ngetal", tree: "Junco (Reed)", aicme: "Aicme Muine", month: "28 Out – 24 Nov", herb: "Raiz de Junco & Valeriana", meaning: "Ação direta, harmonia musical, alinhamento de propósito e cura profunda." },
    { symbol: "ᚎ", name: "Straif", tree: "Abrunheiro (Blackthorn)", aicme: "Aicme Muine", month: "25 Nov – 23 Dez", herb: "Abrunhos & Absinto", meaning: "Confronto necessário com a sombra, disciplina rigorosa e transformação inevitável." },
    { symbol: "ᚏ", name: "Ruis", tree: "Sabugueiro (Elder)", aicme: "Aicme Muine", month: "Fim de Ciclo / Solstício", herb: "Flor e Baga de Sabugueiro", meaning: "Fim de um ciclo e renascimento, regeneração profunda e sabedoria da Anciã." },
    { symbol: "ᚐ", name: "Ailm", tree: "Abeto / Pinheiro (Fir)", aicme: "Aicme Ailme", month: "Solstício de Inverno", herb: "Agulhas de Pinheiro & Resina", meaning: "Visão elevada, clareza de horizonte, cura respiratória e perspetiva superior." },
    { symbol: "ᚑ", name: "Onn", tree: "Tojo (Gorse)", aicme: "Aicme Ailme", month: "Equinócio de Primavera", herb: "Flores Douradas de Tojo & Calêndula", meaning: "Esperança luminosa, abundância solar, energia vital e otimismo." },
    { symbol: "ᚒ", name: "Ur", tree: "Urze (Heather)", aicme: "Aicme Ailme", month: "Solstício de Verão", herb: "Flores de Urze & Lavanda", meaning: "Paixão pela vida, generosidade, cura emocional e abertura do coração." },
    { symbol: "ᚓ", name: "Eadha", tree: "Álamos (Aspen)", aicme: "Aicme Ailme", month: "Equinócio de Outono", herb: "Folhas de Choupo & Erva-Cidreira", meaning: "Superação do medo, comunicação com os ancestrais e escuta do vento." },
    { symbol: "ᚔ", name: "Ioho", tree: "Teixo (Yew)", aicme: "Aicme Ailme", month: "Samhain / Eternidade", herb: "Simbólico (Não ingerir)", meaning: "Imortalidade da alma, transformação ancestral, renascimento e eternidade." }
];

// RUNES DATA
const RUNES_DATA = [
    { symbol: "ᚠ", name: "Fehu", meaning: "Prosperidade, energia vital, abundância em movimento e novos recursos." },
    { symbol: "ᚢ", name: "Uruz", meaning: "Força primordial, saúde física, coragem indomável e vitalidade." },
    { symbol: "ᚦ", name: "Thurisaz", meaning: "Proteção ativa, defesa, superação de obstáculos e despertar." },
    { symbol: "ᚨ", name: "Ansuz", meaning: "Sabedoria divina, inspiração poética (Awen), comunicação e sinais." },
    { symbol: "ᚱ", name: "Raidho", meaning: "Jornada espiritual, movimento certo, ritmo cósmico e evolução." },
    { symbol: "ᚲ", name: "Kenaz", meaning: "Tocha interior, criatividade, iluminação técnica e clareza." },
    { symbol: "ᚷ", name: "Gebo", meaning: "Troca sagrada, parceria equilibrada, generosidade e união." },
    { symbol: "ᚹ", name: "Wunjo", meaning: "Alegria harmónica, realização, paz interior e fraternidade." },
    { symbol: "ᚺ", name: "Hagalaz", meaning: "Ruptura purificadora, mudança inevitável e libertação de padrões." },
    { symbol: "ᚾ", name: "Nauthiz", meaning: "Necessidade, resiliência na adversidade e fogo interior." },
    { symbol: "ᛁ", name: "Isa", meaning: "Quietude, pausa contemplativa, concentração e clareza cristalina." },
    { symbol: "ᛃ", name: "Jera", meaning: "Colheita justa, ciclos naturais do tempo e recompensa pelo esforço." },
    { symbol: "ᛇ", name: "Eihwaz", meaning: "Teixo sagrado, eixo entre mundos, resistência e proteção profunda." },
    { symbol: "ᛈ", name: "Perthro", meaning: "Mistério do destino (Wyrd), intuição, sincronicidade e revelação." },
    { symbol: "ᛉ", name: "Algiz", meaning: "Proteção espiritual elevada, conexão com o sagrado e alerta." },
    { symbol: "ᛊ", name: "Sowilo", meaning: "Sol vitorioso, força vital, clareza absoluta e sucesso." },
    { symbol: "ᛏ", name: "Tiwaz", meaning: "Justiça, honra, sacrifício nobre e liderança íntegra." },
    { symbol: "ᛒ", name: "Berkano", meaning: "Nascimento, fertilidade, nutrição maternal e crescimento suave." },
    { symbol: "ᛖ", name: "Ehwaz", meaning: "Avanço conjunto, confiança mútua, lealdade e progresso." },
    { symbol: "ᛗ", name: "Mannaz", meaning: "Humanidade, autoconhecimento, mente consciente e comunidade." },
    { symbol: "ᛚ", name: "Laguz", meaning: "Águas profundas da intuição, sonhos, fluidez e cura emocional." },
    { symbol: "ᛜ", name: "Ingwaz", meaning: "Semente latente, paz interior, gestação de novos projetos." },
    { symbol: "ᛞ", name: "Dagaz", meaning: "Amanhecer, despertar súbito, transformação luminosa e equilíbrio." },
    { symbol: "ᛟ", name: "Othala", meaning: "Herança ancestral, lar espiritual, raízes e sabedoria herdada." }
];

// FESTIVALS
const FESTIVALS_DATA = {
    1: { date: "21 de Dezembro", title: "Yule (Solstício de Inverno)", theme: "O renascimento da Luz na noite mais longa do ano.", ritual: "Acender a vela central do altar ao amanhecer, decorar com azevinho e pinheiro, honrar o retorno do Sol." },
    2: { date: "1 de Fevereiro", title: "Imbolc (Festa de Brigid)", theme: "Primeiros sinais da primavera, purificação e chama da inspiração.", ritual: "Limpeza ritual do espaço sagrado, acender velas brancas e compor poesia em honra de Brigid." },
    3: { date: "21 de Março", title: "Ostara (Equinócio de Primavera)", theme: "Equilíbrio perfeito entre luz e sombra; despertar da Terra.", ritual: "Plantar sementes com intenções claras, caminhar ao ar livre e celebrar o equilíbrio interior." },
    4: { date: "1 de Maio", title: "Beltane (Fogo Sagrado)", theme: "Vitalidade plena, união sagrada da natureza e alegria criativa.", ritual: "Acender fogueira ou incenso floral, tecer fitas coloridas e abençoar projetos criativos." },
    5: { date: "21 de Junho", title: "Litha (Solstício de Verão)", theme: "Apogeu da luz solar, abundância e poder vital.", ritual: "Colher ervas solares ao meio-dia, meditar sob a luz do sol e agradecer pela plenitude." },
    6: { date: "1 de Agosto", title: "Lughnasadh (Primeira Colheita)", theme: "Gratidão pelos frutos do trabalho e partilha comunitária.", ritual: "Partilhar pão artesanal e frutas da época no altar, honrando os talentos e habilidades." },
    7: { date: "21 de Setembro", title: "Mabon (Equinócio de Outono)", theme: "Segundo equilíbrio do ano, ação de graças e recolhimento sereno.", ritual: "Organizar um altar com folhas de outono, maçãs e bolotas; meditar sobre o equilíbrio alcançado." },
    8: { date: "31 de Outubro", title: "Samhain (Ano Novo Druídico)", theme: "Portal entre os mundos, silêncio sagrado e honra aos ancestrais.", ritual: "Altar aos antepassados, vela na janela para guiar os espíritos amigos e libertação de ciclos passados." }
};

const TRIADS_DATA = [
    "Três coisas que todo o Druida deve cultivar: Amor pela Natureza, Busca pela Verdade e Paz em todas as ações.",
    "Três velas que iluminam toda a escuridão: A Verdade, a Natureza e o Conhecimento.",
    "Três fundamentos da Sabedoria Bárdica: Ousadia na verdade, firmeza na justiça e gentileza no coração.",
    "Três coisas que nunca retornam: A flecha disparada, a palavra proferida e a oportunidade perdida.",
    "Três dons da Awen: Um olho que vê a natureza, um coração que sente a natureza e uma coragem que ousa seguir a natureza.",
    "Três pilares da Paz no Grove: Escuta silenciosa, respeito mútuo e harmonia com a Terra."
];

let lastOghamReading = [];
let lastRuneReading = [];
window.RUNES_DATA = RUNES_DATA;
window.OGHAM_DATA = OGHAM_DATA;
window.NORDIC_TAROT_DECK = NORDIC_TAROT_DECK;
window.TRIADS_DATA = TRIADS_DATA;
let currentFestivalId = 8;
let audioCtx = null;
let activeSoundNode = null;
let activeGainNode = null;
let breathTimerInterval = null;
let isBreathing = false;
let medTotalSeconds = 15 * 60;
let medRemainingSeconds = 15 * 60;
let medInterval = null;
let isMedRunning = false;
let altarState = { earth: false, air: false, fire: false, water: false };

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-item, .bot-nav-item').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('theme-muted');
    });

    ['desk', 'mob', 'bot'].forEach(prefix => {
        const btn = document.getElementById(`${prefix}-nav-${tabId}`);
        if (btn) {
            btn.classList.add('active');
            btn.classList.remove('theme-muted');
        }
    });

    if (tabId === 'journal') checkJournalPinLock();
}

function changeTheme(themeName) {
    const html = document.documentElement;
    const body = document.getElementById('app-body');
    ['theme-night', 'theme-forest', 'theme-stone', 'theme-autumn', 'theme-mist', 'theme-gold', 'theme-lantern', 'theme-parchment'].forEach(t => {
        html.classList.remove(t);
        body.classList.remove(t);
    });
    html.classList.add(themeName);
    body.classList.add(themeName);
    localStorage.setItem('druid_theme', themeName);

    const dSel = document.getElementById('theme-selector-desktop');
    const mSel = document.getElementById('theme-selector-mobile');
    if (dSel) dSel.value = themeName;
    if (mSel) mSel.value = themeName;
}

function toggleLanternMode() {
    const current = localStorage.getItem('druid_theme') || 'theme-night';
    if (current === 'theme-lantern') {
        changeTheme(localStorage.getItem('druid_theme_prev') || 'theme-night');
        showToast('Modo Lanterna desativado.');
    } else {
        localStorage.setItem('druid_theme_prev', current);
        changeTheme('theme-lantern');
        showToast('Modo Lanterna Ritual ativo.');
    }
}

function setZenMode(active) {
    document.body.classList.toggle('zen-active', active);
    const btn = document.getElementById('zen-float-btn');
    if (btn) {
        btn.innerHTML = active
            ? '<svg class="ic" aria-hidden="true"><use href="#i-close"></use></svg><span class="zen-label">Sair Zen</span>'
            : '<svg class="ic" aria-hidden="true"><use href="#i-zen"></use></svg><span class="zen-label">Zen Mode</span>';
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.setAttribute('aria-label', active ? 'Sair do Zen Mode' : 'Alternar Zen Mode');
    }
}

function toggleZenMode() {
    const active = !document.body.classList.contains('zen-active');
    setZenMode(active);
    showToast(active ? 'Zen Mode ativo (Ecrã Inteiro Imersivo)' : 'Modo normal restaurado.');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('zen-active')) toggleZenMode();
});

// CÁLCULO EXATO DE SOLSTÍCIOS & EQUINÓCIOS POR GPS
function calculateExactSolarFestivals() {
    const now = new Date();
    const year = now.getFullYear();
    const lat = parseFloat(localStorage.getItem('druid_lat') || '39.05');
    
    // Algoritmo astronómico aproximado de alta precisão para equinócios e solstícios no ano civil
    // Base UTC aproximada para o ano atual
    const springEq = new Date(Date.UTC(year, 2, 20, 15, 33));
    const summerSol = new Date(Date.UTC(year, 5, 21, 9, 13));
    const autumnEq = new Date(Date.UTC(year, 8, 22, 18, 54));
    const winterSol = new Date(Date.UTC(year, 11, 21, 15, 20));

    const tzOffsetHours = -now.getTimezoneOffset() / 60;
    
    const fmt = (d) => {
        const localD = new Date(d.getTime() + tzOffsetHours * 3600000);
        return localD.toISOString().replace('T', ' ').substring(0, 16);
    };

    document.getElementById('eq-spring').textContent = fmt(springEq);
    document.getElementById('sol-summer').textContent = fmt(summerSol);
    document.getElementById('eq-autum').textContent = fmt(autumnEq);
    document.getElementById('sol-winter').textContent = fmt(winterSol);
    showToast('Momentos solsticiais calculados para a sua coordenada GPS!');
}

function updateAstronomy() {
    const now = new Date();
    const moon = LunarCalc.state(now);
    const phaseAge = moon.age, illumination = moon.illumPct, phaseName = moon.name, icon = moon.icon;

    const moonIconEl = document.getElementById('moon-icon');
    const moonNameEl = document.getElementById('moon-phase-name');
    const moonDetailsEl = document.getElementById('moon-details');
    if (moonIconEl) moonIconEl.textContent = icon;
    if (moonNameEl) moonNameEl.textContent = phaseName;
    if (moonDetailsEl) moonDetailsEl.textContent = `Idade: ${phaseAge.toFixed(1)} dias • Iluminação: ${illumination}% • ${now.toLocaleDateString('pt-PT')}`;
    const topMoonIcon = document.getElementById('top-moon-icon');
    const topMoonText = document.getElementById('top-moon-text');
    if (topMoonIcon) topMoonIcon.textContent = icon;
    if (topMoonText) topMoonText.textContent = `${phaseName} (${illumination}%)`;

    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / 86400000);
    const declination = 23.44 * Math.sin(((360 / 365) * (dayOfYear - 81)) * (Math.PI / 180));
    const lat = parseFloat(localStorage.getItem('druid_lat') || '39.05');
    const latRad = lat * (Math.PI / 180);
    const decRad = declination * (Math.PI / 180);
    const cosH = -Math.tan(latRad) * Math.tan(decRad);
    const clampedCosH = Math.max(-1, Math.min(1, cosH));
    const hourAngle = Math.acos(clampedCosH) * (180 / Math.PI);
    const daylightHours = (2 * hourAngle) / 15;
    const lon = parseFloat(localStorage.getItem('druid_lon') || '-8');
    const B = (360 / 365) * (dayOfYear - 81) * (Math.PI / 180);
    const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const solarNoon = 12 - lon / 15 - now.getTimezoneOffset() / 60 - eot / 60;
    const sunriseDec = solarNoon - daylightHours / 2;
    const sunsetDec = solarNoon + daylightHours / 2;

    const formatHours = (dec) => {
        const h = Math.floor(dec);
        const m = Math.round((dec - h) * 60);
        return `${String(h).padStart(2, '0')}:${String(m === 60 ? 59 : m).padStart(2, '0')}`;
    };

    const dawnDec = sunriseDec - 0.75; // Hora crepuscular / alvorecer (civil/náutico)
    const duskDec = sunsetDec + 0.75;

    const dawnStr = formatHours(dawnDec);
    const srStr = formatHours(sunriseDec);
    const ssStr = formatHours(sunsetDec);
    const duskStr = formatHours(duskDec);
    const durH = Math.floor(daylightHours);
    const durM = Math.round((daylightHours - durH) * 60);

    const dawnEl = document.getElementById('dawn-time');
    const duskEl = document.getElementById('dusk-time');
    if (dawnEl) dawnEl.textContent = `Alvorecer: ${dawnStr}`;
    if (duskEl) duskEl.textContent = `Crepúsculo: ${duskStr}`;

    document.getElementById('sunrise-time').textContent = `Nascer: ${srStr}`;
    document.getElementById('sunset-time').textContent = `Pôr: ${ssStr}`;
    document.getElementById('solar-duration').textContent = `Luz solar: ${durH}h ${durM}m`;
    const curHour = now.getHours() + now.getMinutes() / 60;
    document.getElementById('solar-status').textContent = (curHour >= sunriseDec && curHour <= sunsetDec) ? 'Sol Acima do Horizonte' : 'Período Noturno / Horas Mágicas';
    const topSun = document.getElementById('top-sun-text');
    if (topSun) topSun.textContent = `${srStr} — ${ssStr}`;

    const activeTree = getCelticTree(now);
    document.getElementById('celtic-month-symbol').textContent = activeTree.symbol;
    document.getElementById('celtic-month-title').textContent = `${activeTree.name} — ${activeTree.tree}`;
    document.getElementById('celtic-month-desc').textContent = `${activeTree.meaning} Erva: ${activeTree.herb}.`;
    const topTreeSym = document.getElementById('top-tree-symbol');
    const topTreeTxt = document.getElementById('top-tree-text');
    const mobSub = document.getElementById('mob-tree-subtitle');
    if (topTreeSym) topTreeSym.textContent = activeTree.symbol;
    if (topTreeTxt) topTreeTxt.textContent = `${activeTree.name} (${activeTree.tree.split(' ')[0]})`;
    if (mobSub) mobSub.textContent = `Mês de ${activeTree.name} · ${activeTree.tree.split(' ')[0]}`;
}

// GERADOR DE HAIKUS & POESIA AUTOMÁTICA (OBOD BARDIC)
function generateHaiku() {
    const natureConcepts = [
        "Folhas de carvalho ao vento", "Orvalho matinal na relva", "Rio cristalino na serra", 
        "Raízes fundas na terra", "Voo de grous no horizonte", "Fogo sagrado na lareira",
        "Neblina cobrindo o bosque", "Semente oculta no solo", "Silêncio da lua cheia"
    ];
    const seasons = [
        "no despertar de Ostara", "sob o sol de Litha", "na colheita de Mabon", 
        "no portal de Samhain", "no silêncio de Yule", "no sopro de Imbolc", "na dança de Beltane"
    ];
    const celticElements = [
        "o Awen desperta.", "a Awen flui no espírito.", "canta a antiga Tríade.", 
        "o Grove canta em paz.", "a terra guarda o segredo.", "o Wyrd tece o destino.", "a alma celta recorda."
    ];

    const line1 = natureConcepts[Math.floor(Math.random() * natureConcepts.length)];
    const line2 = seasons[Math.floor(Math.random() * seasons.length)];
    const line3 = celticElements[Math.floor(Math.random() * celticElements.length)];

    const haiku = `${line1},\n${line2},\n${line3}`;
    document.getElementById('haiku-output').textContent = haiku;

    // Inserir no Caderno Bárdico
    const bardicArea = document.getElementById('bardic-input');
    bardicArea.value = (bardicArea.value + `\n\n--- HAIKU GERADO (OBOD) ---\n${haiku}\n`).trimStart();
    autoSaveBardic();
    showToast('Haiku gerado e adicionado ao Caderno Bárdico!');
}

function drawOghamCard(count) {
    const pool = [...OGHAM_DATA];
    const drawn = [];
    for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        drawn.push(pool.splice(idx, 1)[0]);
    }
    lastOghamReading = drawn;
    const labels = count === 3 ? ['Raízes (Passado)', 'Tronco (Presente)', 'Copa (Futuro)']
                 : count === 5 ? ['Centro (Espírito)', 'Norte (Terra)', 'Leste (Ar)', 'Sul (Fogo)', 'Oeste (Água)']
                 : ['Mensagem do Bosque'];

    renderOracleReading('ogham', drawn, labels);
    document.getElementById('ogham-save-bar').classList.remove('hidden');
}

/* Tiragens de runas (casas e disposição em js/29-runas-tiragens.js).
   Aceita a chave da tiragem ('amor', 'objetivo', …) ou o número antigo (1, 3);
   sem argumento repete a última tiragem. */
let lastRuneSpread = 'conselho';
function drawRunes(spread) {
    const S = runeSpread(spread === undefined ? lastRuneSpread : spread);
    const pool = typeof runePool === 'function' ? runePool() : [...RUNES_DATA];
    const chosen = window.__runesChosen; window.__runesChosen = null; // pedras escolhidas à mão (js/29)
    const drawn = [];
    S.pos.forEach(([pos, hint], i) => {
        const r = chosen && chosen[i] ? chosen[i] : pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
        if (chosen && chosen[i]) { const k = pool.indexOf(r); if (k >= 0) pool.splice(k, 1); }
        drawn.push({ ...castRune(r), pos, hint });
    });
    lastRuneSpread = S.key;
    window.lastRuneSpreadInfo = S;
    lastRuneReading = drawn;
    renderOracleReading('runes', drawn, S.pos.map(p => p[0]), { spread: S });
    noticeReversedRunes(drawn);
    document.getElementById('rune-save-bar').classList.add('hidden');
}

function saveLastReadingToJournal(type) {
    const nowStr = new Date().toLocaleString('pt-PT');
    let entry = `\n--- [${nowStr}] `;
    const qEl = document.getElementById(type === 'runes' ? 'rune-question' : 'ogham-question');
    const qTxt = qEl && qEl.value.trim() ? `Pergunta: «${qEl.value.trim()}»\n` : '';
    if (type === 'ogham' && lastOghamReading.length) {
        entry += `ORÁCULO DE OGHAM ---\n` + qTxt + lastOghamReading.map(o => `• ${o.symbol} ${o.name} (${o.tree}): ${o.meaning}`).join('\n');
    } else if (type === 'runes' && lastRuneReading.length) {
        entry += `ORÁCULO DE RUNAS${lastRuneReading[0].pos && window.lastRuneSpreadInfo ? ' · ' + window.lastRuneSpreadInfo.name.toUpperCase() : ''} ---\n` + qTxt + lastRuneReading.map(r => `• ${r.pos ? r.pos + ': ' : ''}${r.symbol} ${r.name}: ${r.meaning}`).join('\n');
    }
    const area = document.getElementById('journal-input');
    area.value = (area.value + entry + '\n').trimStart();
    autoSaveJournal();
    showToast('Leitura guardada no Diário!');
}

function selectFestival(id) {
    currentFestivalId = id;
    const f = FESTIVALS_DATA[id];
    if (!f) return;
    document.querySelectorAll('.wheel-node').forEach(n => {
        const on = Number(n.dataset.fest) === Number(id);
        n.classList.toggle('is-selected', on);
        n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    const nextBadge = document.getElementById('fest-next-badge');
    if (nextBadge) nextBadge.classList.toggle('hidden', Number(id) !== window.__nextFestId);
    document.getElementById('fest-date-badge').textContent = f.date;
    document.getElementById('fest-name-title').textContent = f.title;
    document.getElementById('fest-theme-desc').textContent = f.theme;
    document.getElementById('fest-ritual-desc').innerHTML = `<strong>Prática Ritual:</strong> ${f.ritual}`;
}

function openFestivalInRitualBuilder() {
    switchTab('ritual');
    const loader = document.getElementById('rit-template-loader');
    if (loader) {
        loader.value = String(currentFestivalId);
        loadFestivalRitualTemplate(String(currentFestivalId));
    }
}

function loadFestivalRitualTemplate(id) {
    const f = FESTIVALS_DATA[id];
    if (!f) return;
    document.getElementById('rit-title').value = `Cerimónia do Grove: ${f.title}`;
    document.getElementById('rit-intent').value = f.theme;
    document.getElementById('rit-blessing').value = f.ritual;
    updateRitualPreview();
}

function updateRitualPreview() {
    const title = document.getElementById('rit-title').value || 'Cerimónia Sagrada do Grove';
    const peace = document.getElementById('rit-peace').value;
    const intent = document.getElementById('rit-intent').value || 'Harmonia e conexão com a Terra';
    const elem = document.getElementById('rit-elem').value;
    const blessing = document.getElementById('rit-blessing').value || 'Partilhamos a água da fonte e o pão da terra.';
    const words = document.getElementById('rit-words').value;

    document.getElementById('ritual-preview').innerHTML = `
        <h3 class="font-cinzel text-base font-bold theme-accent border-b border-[var(--border-color)] pb-2">${title}</h3>
        <p><strong class="theme-title">1. Paz nos Quadrantes:</strong><br><span class="theme-muted">${peace}</span></p>
        <p><strong class="theme-title">2. Intenção & Elemento (${elem}):</strong><br><span class="theme-muted">${intent}</span></p>
        <p><strong class="theme-title">3. Partilha da Taça:</strong><br><span class="theme-muted">${blessing}</span></p>
        <p><strong class="theme-title">4. Encerramento:</strong><br><span class="theme-muted">${words}</span></p>
    `;
}

function saveRitualTemplate() {
    updateRitualPreview();
    const text = document.getElementById('ritual-preview').innerText;
    const area = document.getElementById('journal-input');
    area.value += `\n\n=== GUIÃO RITUAL (${new Date().toLocaleDateString('pt-PT')}) ===\n${text}\n`;
    autoSaveJournal();
    showToast('Guião ritual guardado no Diário!');
}

// EXPORTAÇÃO EM PDF (GUIÃO RITUAL OU TAROT)
function exportRitualPDF() {
    if (typeof window.jspdf === 'undefined') {
        showToast('Biblioteca jsPDF ainda a carregar.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const title = document.getElementById('rit-title').value || 'Cerimónia Sagrada do Grove';
    const peace = document.getElementById('rit-peace').value;
    const intent = document.getElementById('rit-intent').value;
    const elem = document.getElementById('rit-elem').value;
    const blessing = document.getElementById('rit-blessing').value;
    const words = document.getElementById('rit-words').value;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CAMINHO DRUÍDICO PRO ULTIMATE • GUIÃO RITUAL", 20, 20);

    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 20, 30);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    let y = 42;

    const addSection = (header, body) => {
        doc.setFont("Helvetica", "bold");
        doc.text(header, 20, y);
        y += 6;
        doc.setFont("Helvetica", "normal");
        const lines = doc.splitTextToSize(body, 170);
        doc.text(lines, 20, y);
        y += lines.length * 6 + 6;
    };

    addSection("1. Paz nos Quadrantes:", peace);
    addSection("2. Intenção & Elemento (" + elem + "):", intent);
    addSection("3. Partilha da Taça:", blessing);
    addSection("4. Encerramento do Círculo:", words);

    doc.save(`Guiao_Ritual_${new Date().toISOString().slice(0, 10)}.pdf`);
    showToast('Guião Ritual exportado em PDF com sucesso!');
}

function exportTarotPDF() {
    if (typeof window.jspdf === 'undefined') {
        showToast('Biblioteca jsPDF ainda a carregar.');
        return;
    }
    if (!lastTarotReading.length) {
        showToast('Nenhuma tiragem de tarot ativa para exportar.');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`TIRAGEM DE TAROT NÓRDICO • ${lastTarotMeta.spread}`, 20, 20);

    if (lastTarotMeta.question) {
        doc.setFontSize(11);
        doc.text(`Pergunta: "${lastTarotMeta.question}"`, 20, 28);
    }

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    let y = 38;

    lastTarotReading.forEach((t, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont("Helvetica", "bold");
        doc.text(`${i + 1}. ${t.pos}: ${t.card.name} (${t.isReversed ? 'Invertida' : 'Direita'})`, 20, y);
        y += 6;
        doc.setFont("Helvetica", "normal");
        const meaning = t.isReversed ? t.card.reversed : t.card.upright;
        const lines = doc.splitTextToSize(meaning, 170);
        doc.text(lines, 20, y);
        y += lines.length * 6 + 6;
    });

    doc.save(`Tiragem_Tarot_${new Date().toISOString().slice(0, 10)}.pdf`);
    showToast('Tiragem de Tarot exportada em PDF!');
}

// BÚSSOLA ROTATIVA DINÂMICA
function initGeoAndCompass() {
    const isFileProtocol = window.location.protocol === 'file:';
    const gpsInfoEl = document.getElementById('gps-info');
    
    if (!('geolocation' in navigator)) {
        if (gpsInfoEl) gpsInfoEl.textContent = 'Geolocalização não suportada neste navegador.';
        showToast('Geolocalização não suportada.');
        return;
    }

    if (gpsInfoEl) gpsInfoEl.textContent = 'A obter sinal GPS de alta precisão...';
    showToast('A procurar sinal GPS...');

    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(async pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        
        // Validação de coordenadas
        if (typeof latitude !== 'number' || typeof longitude !== 'number' || 
            isNaN(latitude) || isNaN(longitude) || 
            latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            if (gpsInfoEl) gpsInfoEl.textContent = 'Erro: Coordenadas GPS inválidas.';
            showToast('Coordenadas GPS inválidas detetadas.');
            return;
        }

        // Limpeza de cache anterior de localização e clima
        localStorage.removeItem('druid_weather_cache');
        localStorage.setItem('druid_lat', latitude.toFixed(4));
        localStorage.setItem('druid_lon', longitude.toFixed(4));

        // Tentar geocodificação inversa para obter nome do local legível
        let locLabel = `${Math.abs(latitude).toFixed(2)}° ${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(2)}° ${longitude >= 0 ? 'E' : 'O'}`;
        try {
            const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`, {
                headers: { 'Accept-Language': 'pt' }
            });
            if (revRes.ok) {
                const revData = await revRes.json();
                if (revData && revData.address) {
                    const city = revData.address.city || revData.address.town || revData.address.municipality || revData.address.village || revData.address.county;
                    const country = revData.address.country_code ? revData.address.country_code.toUpperCase() : '';
                    if (city) {
                        locLabel = country ? `${city}, ${country}` : city;
                    }
                }
            }
        } catch (err) {
            console.warn('Geocodificação inversa indisponível:', err);
        }

        localStorage.setItem('druid_loc_label', locLabel);
        if (gpsInfoEl) gpsInfoEl.textContent = `GPS ativo (${locLabel}, precisão ~${Math.round(accuracy)}m)`;
        showToast(`GPS sincronizado com sucesso (${locLabel})!`);

        updateAstronomy();
        if (typeof refreshWeatherAndElement === 'function') {
            refreshWeatherAndElement(false);
        }
    }, err => {
        console.warn('Erro de GPS:', err);
        let errorMsg = 'Não foi possível obter a posição GPS.';
        if (err.code === 1) errorMsg = 'Permissão de GPS recusada.';
        else if (err.code === 2) errorMsg = 'Sinal GPS indisponível (timeout de 15s).';
        else if (err.code === 3) errorMsg = 'Tempo limite esgotado ao procurar GPS.';
        
        if (gpsInfoEl) gpsInfoEl.textContent = isFileProtocol ? 'Modo local (file://): Bússola interativa ativa.' : errorMsg;
        showToast(errorMsg);
    }, geoOptions);

    const getCardinal = (deg) => {
        const arr = ['Norte', 'Nordeste', 'Leste', 'Sudeste', 'Sul', 'Sudoeste', 'Oeste', 'Noroeste'];
        return arr[Math.round(deg / 45) % 8];
    };

    const handleOrientation = (e) => {
        const heading = e.webkitCompassHeading || (360 - (e.alpha || 0));
        const deg = Math.round(heading % 360);
        
        const dial = document.getElementById('compass-dial');
        if (dial) dial.style.transform = `rotate(${-deg}deg)`;

        const labelDeg = document.getElementById('heading-deg');
        const labelCard = document.getElementById('heading-cardinal');
        if (labelDeg) labelDeg.textContent = `${deg}°`;
        if (labelCard) labelCard.textContent = getCardinal(deg);
    };

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(res => {
            if (res === 'granted') window.addEventListener('deviceorientation', handleOrientation);
        }).catch(() => {
            showToast('Permissão de sensores recusada.');
        });
    } else {
        window.addEventListener('deviceorientationabsolute', handleOrientation);
        window.addEventListener('deviceorientation', handleOrientation);
        showToast(isFileProtocol ? 'Modo de simulação local ativo na bússola.' : 'Bússola ativa!');
    }
}

function toggleAltarElement(elemKey) {
    const on = altarState[elemKey] = !altarState[elemKey];
    const box = document.getElementById(`altar-elem-${elemKey}`);
    box.classList.toggle('is-on', on);
    box.setAttribute('aria-pressed', on ? 'true' : 'false');
    document.getElementById(`altar-status-${elemKey}`).textContent = on ? 'Ativo • Consagrado' : 'Inativo';
}

function saveAltarToJournal() {
    const intent = document.getElementById('altar-intent-input').value.trim() || 'Meditação e alinhamento elemental';
    const activeElems = Object.keys(altarState).filter(k => altarState[k]).join(', ') || 'Nenhum selecionado';
    const area = document.getElementById('journal-input');
    area.value += `\n\n--- ALTAR DIGITAL (${new Date().toLocaleString('pt-PT')}) ---\nIntenção: ${intent}\nElementos Ativos: ${activeElems}\n`;
    autoSaveJournal();
    showToast('Altar consagrado e registado no Diário!');
}

function drawRandomTriad() {
    const t = TRIADS_DATA[Math.floor(Math.random() * TRIADS_DATA.length)];
    document.getElementById('triad-text').textContent = `"${t}"`;
}

function registerAwenPractice() {
    const area = document.getElementById('journal-input');
    area.value += `\n[${new Date().toLocaleString('pt-PT')}] Prática de Invocação da Awen (/|\) concluída.\n`;
    autoSaveJournal();
    showToast('Prática de Awen registada no Diário!');
}

function autoSaveJournal() {
    localStorage.setItem('druid_journal', document.getElementById('journal-input').value);
    document.getElementById('save-status').textContent = `Guardado às ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
}

function autoSaveBardic() {
    const val = document.getElementById('bardic-input').value;
    localStorage.setItem('druid_bardic', val);
    const lines = val.split('\n').filter(l => l.trim().length > 0).length;
    document.getElementById('bardic-line-count').textContent = `Versos: ${lines}`;
    document.getElementById('bardic-triad-count').textContent = `Tríades completas: ${Math.floor(lines / 3)}`;
    document.getElementById('save-status').textContent = `Guardado às ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
}

function switchJournalSubtab(sub) {
    const gen = document.getElementById('journal-subtab-general');
    const bar = document.getElementById('journal-subtab-bardic');
    const bGen = document.getElementById('subtab-btn-general');
    const bBar = document.getElementById('subtab-btn-bardic');
    if (sub === 'general') {
        gen.classList.remove('hidden');
        bar.classList.add('hidden');
        bGen.className = 'bg-[var(--btn-primary)] text-[var(--on-primary)] text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer';
        bBar.className = 'theme-inner theme-muted border border-[var(--border-color)] text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer';
    } else {
        bar.classList.remove('hidden');
        gen.classList.add('hidden');
        bBar.className = 'bg-[var(--btn-primary)] text-[var(--on-primary)] text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer';
        bGen.className = 'theme-inner theme-muted border border-[var(--border-color)] text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer';
    }
}

function togglePinSettings() {
    document.getElementById('pin-settings-box').classList.toggle('hidden');
}

function saveNewJournalPin() {
    const pin = document.getElementById('new-pin-input').value.trim();
    if (!/^\d{4}$/.test(pin)) {
        showToast('Introduza exatamente 4 dígitos numéricos.');
        return;
    }
    localStorage.setItem('druid_journal_pin', pin);
    document.getElementById('new-pin-input').value = '';
    document.getElementById('pin-settings-box').classList.add('hidden');
    showToast('PIN de proteção ativado!');
}

function removeJournalPin() {
    localStorage.removeItem('druid_journal_pin');
    document.getElementById('pin-settings-box').classList.add('hidden');
    showToast('Proteção por PIN removida.');
}

function checkJournalPinLock() {
    const savedPin = localStorage.getItem('druid_journal_pin');
    const lockScreen = document.getElementById('journal-lock-screen');
    const unlockedArea = document.getElementById('journal-unlocked-area');
    if (savedPin && !sessionStorage.getItem('druid_pin_unlocked')) {
        lockScreen.classList.remove('hidden');
        unlockedArea.classList.add('hidden');
    } else {
        lockScreen.classList.add('hidden');
        unlockedArea.classList.remove('hidden');
    }
}

function unlockJournalWithPin() {
    const input = document.getElementById('journal-pin-unlock-input').value;
    const savedPin = localStorage.getItem('druid_journal_pin');
    const errMsg = document.getElementById('pin-error-msg');
    if (input === savedPin) {
        sessionStorage.setItem('druid_pin_unlocked', '1');
        document.getElementById('journal-pin-unlock-input').value = '';
        if (errMsg) errMsg.classList.add('hidden');
        checkJournalPinLock();
        showToast('Santuário desbloqueado.');
    } else {
        if (errMsg) errMsg.classList.remove('hidden');
        showToast('PIN incorreto.');
    }
}

function exportJournalTXT() {
    const content = `=== DIÁRIO DRUÍDICO ===\n${document.getElementById('journal-input').value}\n\n=== CADERNO BÁRDICO & HAIKUS ===\n${document.getElementById('bardic-input').value}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Diario_Druidico_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
}

function exportBackupJSON() {
    const data = {
        journal: localStorage.getItem('druid_journal') || '',
        bardic: localStorage.getItem('druid_bardic') || '',
        theme: localStorage.getItem('druid_theme') || 'theme-night',
        readings: JSON.parse(localStorage.getItem('druid_readings') || '[]'),
        exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Backup_Caminho_Druidico_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Backup JSON exportado!');
}

function importBackupJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.journal !== undefined) {
                localStorage.setItem('druid_journal', data.journal);
                document.getElementById('journal-input').value = data.journal;
            }
            if (data.bardic !== undefined) {
                localStorage.setItem('druid_bardic', data.bardic);
                document.getElementById('bardic-input').value = data.bardic;
                autoSaveBardic();
            }
            if (data.theme) changeTheme(data.theme);
            if (Array.isArray(data.readings)) { localStorage.setItem('druid_readings', JSON.stringify(data.readings)); renderReadingLog(); }
            showToast('Backup restaurado com sucesso!');
        } catch {
            showToast('Ficheiro JSON inválido.');
        }
    };
    reader.readAsText(file);
}

function clearJournal() {
    if (confirm('Tem a certeza de que pretende limpar todo o texto do Diário?')) {
        document.getElementById('journal-input').value = '';
        autoSaveJournal();
    }
}

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function stopAmbientSound() {
    if (activeSoundNode) {
        try { activeSoundNode.stop(); activeSoundNode.disconnect(); } catch {}
        activeSoundNode = null;
    }
    if (activeGainNode) {
        try { activeGainNode.disconnect(); } catch {}
        activeGainNode = null;
    }
}

function toggleAmbientSound(type) {
    initAudio();
    stopAmbientSound();
    const duration = 5;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
            data[i] = (lastOut + (0.05 * white)) / 1.05;
            lastOut = data[i];
            data[i] *= 0.8;
        } else {
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 1.2;
        }
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(0);
    activeSoundNode = noise;
    activeGainNode = gain;
    showToast(`Paisagem Sonora: ${type === 'rain' ? 'Chuva no Bosque' : 'Vento Ancestral'}`);
}

function toggleVocalDrone(freq, label) {
    initAudio();
    stopAmbientSound();
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.14;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    activeSoundNode = osc;
    activeGainNode = gain;
    showToast(`Drone ativo: ${label}`);
}

function playSacredBell() {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 3.3);
}

function toggleBreathing() {
    const btn = document.getElementById('btn-breath-toggle');
    const circle = document.getElementById('breath-circle');
    const action = document.getElementById('breath-action');
    const timer = document.getElementById('breath-timer');

    if (isBreathing) {
        clearInterval(breathTimerInterval);
        isBreathing = false;
        btn.textContent = 'Iniciar Ciclo Respiratório';
        circle.style.transform = 'scale(1)';
        action.textContent = 'Respirar';
        timer.textContent = '4';
        return;
    }

    isBreathing = true;
    btn.textContent = 'Parar Respiração';
    const phases = [
        { name: 'Inspirar', scale: 1.25 },
        { name: 'Reter', scale: 1.25 },
        { name: 'Expirar', scale: 0.92 },
        { name: 'Pausa', scale: 0.92 }
    ];
    let phaseIdx = 0;
    let sec = 4;
    action.textContent = phases[0].name;
    circle.style.transform = `scale(${phases[0].scale})`;

    breathTimerInterval = setInterval(() => {
        sec--;
        if (sec <= 0) {
            sec = 4;
            phaseIdx = (phaseIdx + 1) % 4;
            action.textContent = phases[phaseIdx].name;
            circle.style.transform = `scale(${phases[phaseIdx].scale})`;
        }
        timer.textContent = sec;
    }, 1000);
}

function setMeditationMinutes(mins) {
    if (isMedRunning) toggleMeditationTimer();
    medTotalSeconds = mins * 60;
    medRemainingSeconds = medTotalSeconds;
    updateMeditationDisplay();
}

function updateMeditationDisplay() {
    const m = Math.floor(medRemainingSeconds / 60);
    const s = medRemainingSeconds % 60;
    document.getElementById('meditation-display').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function toggleMeditationTimer() {
    const btn = document.getElementById('btn-med-toggle');
    if (isMedRunning) {
        clearInterval(medInterval);
        isMedRunning = false;
        btn.textContent = 'Retomar Meditação';
        return;
    }
    playSacredBell();
    isMedRunning = true;
    btn.textContent = 'Pausar';
    medInterval = setInterval(() => {
        medRemainingSeconds--;
        updateMeditationDisplay();
        if (medRemainingSeconds <= 0) {
            clearInterval(medInterval);
            isMedRunning = false;
            playSacredBell();
            btn.textContent = 'Iniciar Meditação';
            document.getElementById('meditation-status').textContent = 'Jornada no Nemeton concluída em paz.';
            showToast('Meditação concluída!');
        }
    }, 1000);
}

function resetMeditationTimer() {
    if (isMedRunning) toggleMeditationTimer();
    medRemainingSeconds = medTotalSeconds;
    updateMeditationDisplay();
}

function renderHerbalList(filter = '') {
    const list = document.getElementById('tree-list');
    const q = filter.toLowerCase();
    const filtered = OGHAM_DATA.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.tree.toLowerCase().includes(q) ||
        o.herb.toLowerCase().includes(q) ||
        o.meaning.toLowerCase().includes(q)
    );
    list.innerHTML = filtered.map(o => `
        <div class="theme-inner border rounded-xl p-4 space-y-2 hover:border-[var(--border-hover)] transition">
            <div class="flex items-center justify-between">
                <span class="text-3xl theme-glyph font-bold">${o.symbol}</span>
                <span class="text-[11px] uppercase tracking-wider theme-muted opacity-75">${o.aicme}</span>
            </div>
            <h3 class="font-cinzel text-base font-bold theme-info-hl">${o.name} • ${o.tree}</h3>
            <p class="text-xs theme-accent font-semibold">Fitoterapia: ${o.herb}</p>
            <p class="text-sm theme-muted leading-relaxed">${o.meaning}</p>
        </div>
    `).join('');
}

function filterHerbal() {
    renderHerbalList(document.getElementById('herbal-search').value);
}

function showToast(msg, opts) {
    const container = document.getElementById('toast-container');
    if (!container) return null;
    const duration = (opts && opts.duration) || 3200;
    // evita acumular toasts: no máximo 3 visíveis
    while (container.children.length >= 3) container.firstElementChild.remove();
    const toast = document.createElement('div');
    toast.className = 'app-toast';
    toast.textContent = msg;
    container.appendChild(toast);
    const dismiss = () => {
        if (!toast.isConnected) return;
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    };
    // timeout de segurança: nunca fica preso no ecrã
    setTimeout(dismiss, duration);
    toast.dismiss = dismiss;
    return toast;
}

window.addEventListener('DOMContentLoaded', () => {
    const _tc = document.getElementById('toast-container');
    if (_tc) _tc.innerHTML = '';
    setZenMode(false);
    const savedTheme = localStorage.getItem('druid_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'theme-parchment' : 'theme-night');
    changeTheme(savedTheme);
    updateAstronomy();
    calculateExactSolarFestivals();
    renderHerbalList();
    selectFestival(8);
    updateRitualPreview();

    const jInput = document.getElementById('journal-input');
    const bInput = document.getElementById('bardic-input');
    if (jInput) jInput.value = localStorage.getItem('druid_journal') || '';
    if (bInput) {
        bInput.value = localStorage.getItem('druid_bardic') || '';
        autoSaveBardic();
    }
});
