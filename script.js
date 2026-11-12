if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker ativo:', reg.scope))
            .catch(err => console.log('Erro no Service Worker:', err));
    });
}

const oghamAlphabet = [
    { symbol: "ᚁ", name: "Beith", tree: "Bétula", family: "Beith (B)", herb: "Camomila / Bétula", meaning: "Novos começos, purificação, limpeza energética e renovação." },
    { symbol: "ᚂ", name: "Luis", tree: "Rowan (Frailha)", family: "Beith (B)", herb: "Zimbro / Rowan", meaning: "Proteção espiritual, visão expandida e intuição apurada." },
    { symbol: "ᚃ", name: "Nion", tree: "Freixo", family: "Beith (B)", herb: "Freixo", meaning: "Conexão cósmica, paz interior e união de opostos." },
    { symbol: "ᚄ", name: "Fearn", tree: "Amieiro", family: "Beith (B)", herb: "Amieiro", meaning: "Coragem na adversidade, resiliência e proteção das águas." },
    { symbol: "ᚅ", name: "Saille", tree: "Salgueiro", family: "Beith (B)", herb: "Salgueiro-branco", meaning: "Ritmo lunar, intuição profunda, sonhos e adaptabilidade." },
    { symbol: "ᚆ", name: "Uath", tree: "Espinheiro-alvar", family: "Uath (H)", herb: "Espinheiro", meaning: "Paciência, testes de resiliência e estabelecimento de limites." },
    { symbol: "ᚇ", name: "Dair", tree: "Carvalho", family: "Uath (H)", herb: "Carvalho (Casca)", meaning: "Força inabalável, nobreza, sabedoria ancestral e perseverança." },
    { symbol: "ᚈ", name: "Tinne", tree: "Azevinho", family: "Uath (H)", herb: "Azevinho", meaning: "Maturidade, clareza mental, liderança justa e defesa." },
    { symbol: "ᚉ", name: "Coll", tree: "Avelaneira", family: "Uath (H)", herb: "Aveleira", meaning: "Inspiração criativa (Awen), sabedoria poética e conhecimento." },
    { symbol: "ᚊ", name: "Ceirt", tree: "Macieira", family: "Uath (H)", herb: "Flor de Maçã", meaning: "Amor incondicional, cura, beleza e regeneração." },
    { symbol: "ᚋ", name: "Muin", tree: "Videira", family: "Muine (M)", herb: "Uva / Videira", meaning: "Profecia, alegria, colheita espiritual e transformação interior." },
    { symbol: "ᚌ", name: "Gort", tree: "Hera", family: "Muine (M)", herb: "Hera", meaning: "Determinação, persistência, busca interna e união." },
    { symbol: "ᚍ", name: "Ngetal", tree: "Urtiga", family: "Muine (M)", herb: "Urtiga", meaning: "Cura através do desafio, purificação do sangue e coragem." },
    { symbol: "ᚎ", name: "Straif", tree: "Abrunheiro", family: "Muine (M)", herb: "Abrunheiro", meaning: "Superação de crises, verdade implacável e destino." },
    { symbol: "ᚏ", name: "Ruis", tree: "Sabugueiro", family: "Muine (M)", herb: "Sabugueiro", meaning: "Ciclos de fim e recomeço, honra aos ancestrais e transmutação." },
    { symbol: "ᚐ", name: "Ailm", tree: "Pinheiro / Abeto", family: "Ailm (A)", herb: "Pinheiro", meaning: "Visão de longo alcance, clareza, elevação e esperança." },
    { symbol: "ᚑ", name: "Onn", tree: "Ulece / Torgas", family: "Ailm (A)", herb: "Torgas", meaning: "Combustão interna, paixão sustentada e superação de obstáculos." },
    { symbol: "ᚒ", name: "Ur", tree: "Urze", family: "Ailm (A)", herb: "Urze", meaning: "Cura compassiva, gratidão, conexão com a terra e suavidade." },
    { symbol: "ᚓ", name: "Ebad", tree: "Álamo / Tremor", family: "Ailm (A)", herb: "Álamo", meaning: "Superação do medo, audácia e comunicação com mundos subtis." },
    { symbol: "ᚔ", name: "Iodal", tree: "Teixo", family: "Ailm (A)", herb: "Teixo", meaning: "Imortalidade da alma, regeneração profunda e ligação ao tempo eterno." }
];

// CALENDÁRIO ARBÓREO CELTA (13 MESES LUNARES)
const celticTreeMonths = [
    { startM: 12, startD: 24, endM: 1, endD: 20, symbol: "ᚁ", name: "Beith (Bétula)", desc: "Mês da purificação, dos novos começos após o Solstício de Inverno e da renovação da luz." },
    { startM: 1, startD: 21, endM: 2, endD: 17, symbol: "ᚂ", name: "Luis (Rowan)", desc: "Mês da proteção espiritual, do despertar da visão interior e da energia de Imbolc." },
    { startM: 2, startD: 18, endM: 3, endD: 17, symbol: "ᚃ", name: "Nion (Freixo)", desc: "Mês da ligação entre o mundo interior e exterior, fluidez das águas e germinação." },
    { startM: 3, startD: 18, endM: 4, endD: 14, symbol: "ᚄ", name: "Fearn (Amieiro)", desc: "Mês da coragem no Equinócio de Ostara, força criativa e equilíbrio dos elementos." },
    { startM: 4, startD: 15, endM: 5, endD: 12, symbol: "ᚅ", name: "Saille (Salgueiro)", desc: "Mês da intuição lunar, dos sonhos profundos e do florescimento primaveril." },
    { startM: 5, startD: 13, endM: 6, endD: 9, symbol: "ᚆ", name: "Uath (Espinheiro)", desc: "Mês da limpeza do coração, proteção sagrada e preparação para o apogeu solar." },
    { startM: 6, startD: 10, endM: 7, endD: 7, symbol: "ᚇ", name: "Dair (Carvalho)", desc: "Mês do Rei do Bosque e do Solstício de Verão (Litha). Força, nobreza e plenitude." },
    { startM: 7, startD: 8, endM: 8, endD: 4, symbol: "ᚈ", name: "Tinne (Azevinho)", desc: "Mês do Rei do Inverno que inicia a sua ascensão. Liderança justa e discernimento." },
    { startM: 8, startD: 5, endM: 9, endD: 1, symbol: "ᚉ", name: "Coll (Avelaneira)", desc: "Mês da sabedoria poética, da colheita de Lughnasadh e da inspiração da Awen." },
    { startM: 9, startD: 2, endM: 9, endD: 29, symbol: "ᚋ", name: "Muin (Videira)", desc: "Mês da colheita outonal em Mabon, alegria, profecia e balanço espiritual." },
    { startM: 9, startD: 30, endM: 10, endD: 27, symbol: "ᚌ", name: "Gort (Hera)", desc: "Mês da persistência na espiral da vida, busca interior e resiliência." },
    { startM: 10, startD: 28, endM: 11, endD: 24, symbol: "ᚍ", name: "Ngetal (Junco / Urtiga)", desc: "Mês da travessia de Samhain, cura profunda e honra aos ancestrais." },
    { startM: 11, startD: 25, endM: 12, endD: 23, symbol: "ᚏ", name: "Ruis (Sabugueiro)", desc: "Mês do encerramento do ciclo anual, transmutação e regeneração silenciosa." }
];

const runeAlphabet = [
    { symbol: "ᚠ", name: "Fehu", element: "Fogo / Abundância", meaning: "Riqueza, prosperidade e novos ganhos." },
    { symbol: "ᚢ", name: "Uruz", element: "Terra / Força", meaning: "Força vital, saúde e coragem." },
    { symbol: "ᚦ", name: "Thurisaz", element: "Fogo / Proteção", meaning: "Defesa e quebra de barreiras." },
    { symbol: "ᚨ", name: "Ansuz", element: "Ar / Inspiração", meaning: "Comunicação sagrada e sabedoria." },
    { symbol: "ᚱ", name: "Raidho", element: "Ar / Jornada", meaning: "Viagem espiritual, ritmo e evolução." },
    { symbol: "ᚲ", name: "Kenaz", element: "Fogo / Iluminação", meaning: "Conhecimento, clareza e fogo criativo." },
    { symbol: "ᚷ", name: "Gebo", element: "Ar / Troca", meaning: "Generosidade, parcerias e equilíbrio sagrado." },
    { symbol: "ᚹ", name: "Wunjo", element: "Terra / Alegria", meaning: "Harmonia no clã, felicidade e realização." }
];

// TAROT MÍTICO COM SPRITES PIXEL ART NATIVOS EM SVG (16x16)
const tarotCards = [
    {
        num: "0", name: "O VIAJANTE", realm: "TÍR NA NÓG",
        svg: `<svg viewBox="0 0 16 16" class="w-28 h-28 pixel-svg"><rect x="3" y="3" width="10" height="10" fill="#0f172a"/><rect x="6" y="4" width="4" height="3" fill="#34d399"/><rect x="5" y="7" width="6" height="5" fill="#10b981"/><rect x="11" y="2" width="1" height="12" fill="#d97706"/><rect x="3" y="4" width="2" height="2" fill="#f8fafc"/></svg>`,
        desc: "Bardo dando o salto de fé entre mundos. Corvos de Odin e cão guardião."
    },
    {
        num: "I", name: "O DRUIDA", realm: "BOSQUE SAGRADO",
        svg: `<svg viewBox="0 0 16 16" class="w-28 h-28 pixel-svg"><rect x="7" y="2" width="2" height="12" fill="#92400e"/><rect x="4" y="4" width="8" height="4" fill="#16a34a"/><rect x="5" y="3" width="6" height="2" fill="#22c55e"/><rect x="7" y="1" width="2" height="1" fill="#eab308"/><rect x="4" y="13" width="8" height="1" fill="#4ade80"/></svg>`,
        desc: "Maestria elemental, canalização da Awen e vara de carvalho rúnico."
    },
    {
        num: "II", name: "A VALQUÍRIA", realm: "VÉU DE SAMHAIN",
        svg: `<svg viewBox="0 0 16 16" class="w-28 h-28 pixel-svg"><rect x="3" y="5" width="3" height="4" fill="#e2e8f0"/><rect x="10" y="5" width="3" height="4" fill="#e2e8f0"/><rect x="6" y="4" width="4" height="8" fill="#6366f1"/><rect x="7" y="2" width="2" height="2" fill="#fef08a"/><rect x="7" y="12" width="2" height="2" fill="#818cf8"/></svg>`,
        desc: "Mistérios ocultos e leitura de inscrições Ogham ancestrais."
    },
    {
        num: "III", name: "A GRANDE MÃE", realm: "TERRA FÉRTIL",
        svg: `<svg viewBox="0 0 16 16" class="w-28 h-28 pixel-svg"><rect x="5" y="3" width="6" height="2" fill="#eab308"/><rect x="6" y="2" width="1" height="1" fill="#fef08a"/><rect x="9" y="2" width="1" height="1" fill="#fef08a"/><rect x="4" y="6" width="8" height="7" fill="#059669"/><rect x="7" y="8" width="2" height="3" fill="#f59e0b"/></svg>`,
        desc: "Abundância agrícola e harmonia com a Roda do Ano."
    },
    {
        num: "IV", name: "O PAI DE TODOS", realm: "ASGARD",
        svg: `<svg viewBox="0 0 16 16" class="w-28 h-28 pixel-svg"><rect x="4" y="3" width="8" height="10" fill="#334155"/><rect x="6" y="5" width="1" height="1" fill="#38bdf8"/><rect x="9" y="5" width="1" height="1" fill="#0f172a"/><rect x="5" y="8" width="6" height="4" fill="#cbd5e1"/><rect x="12" y="2" width="1" height="12" fill="#eab308"/></svg>`,
        desc: "Liderança de clã, ordem cósmica e sabedoria inabalável."
    },
    {
        num: "X", name: "A RODA DO ANO", realm: "CICLOS DA TERRA",
        svg: `<svg viewBox="0 0 16 16" class="w-28 h-28 pixel-svg"><rect x="5" y="2" width="6" height="1" fill="#eab308"/><rect x="5" y="13" width="6" height="1" fill="#eab308"/><rect x="2" y="5" width="1" height="6" fill="#eab308"/><rect x="13" y="5" width="1" height="6" fill="#eab308"/><rect x="7" y="3" width="2" height="10" fill="#818cf8"/><rect x="3" y="7" width="10" height="2" fill="#818cf8"/></svg>`,
        desc: "Os 8 festivais sagrados e o destino em constante rotação."
    },
    {
        num: "XIII", name: "TRAVESSIA DE HEL", realm: "MUNDO SUBTERRÂNEO",
        svg: `<svg viewBox="0 0 16 16" class="w-28 h-28 pixel-svg"><rect x="5" y="3" width="6" height="5" fill="#e2e8f0"/><rect x="6" y="5" width="1" height="1" fill="#090d16"/><rect x="9" y="5" width="1" height="1" fill="#090d16"/><rect x="6" y="8" width="4" height="2" fill="#94a3b8"/><rect x="3" y="11" width="10" height="2" fill="#475569"/></svg>`,
        desc: "Transformação radical, fim de ciclo e renascimento de novas sementes."
    },
    {
        num: "XIX", name: "O SOL DE LITHA", realm: "SOLSTÍCIO DE VERÃO",
        svg: `<svg viewBox="0 0 16 16" class="w-28 h-28 pixel-svg"><rect x="5" y="5" width="6" height="6" fill="#facc15"/><rect x="7" y="2" width="2" height="2" fill="#f97316"/><rect x="7" y="12" width="2" height="2" fill="#f97316"/><rect x="2" y="7" width="2" height="2" fill="#f97316"/><rect x="12" y="7" width="2" height="2" fill="#f97316"/><rect x="6" y="6" width="4" height="4" fill="#fef08a"/></svg>`,
        desc: "Alegria pura, vitalidade e apogeu solar nos prados sagrados."
    }
];

const wheelFestivals = [
    { id: 1, name: "Yule", date: "21 Dezembro", theme: "Solstício de Inverno", elem: "Terra (Norte - Ancestrais & Raízes)", ritual: "Celebração do renascimento da luz solar, vela de Yule e aconchego no lar.", blessing: "Que a luz renascida ilumine os nossos passos durante o inverno." },
    { id: 2, name: "Imbolc", date: "1 Fevereiro", theme: "Purificação & Brigid", elem: "Ar (Leste - Inspiração & Awen)", ritual: "Purificação com água da fonte, cruz de Brigid e despertar da inspiração.", blessing: "Que a chama sagrada de Brigid aqueça a nossa criatividade e lar." },
    { id: 3, name: "Ostara", date: "21 Março", theme: "Equinócio de Primavera", elem: "Ar (Leste - Inspiração & Awen)", ritual: "Equilíbrio entre dia e noite, plantação de sementes e intenções na terra.", blessing: "Que as sementes plantadas hoje floresçam em harmonia e equilíbrio." },
    { id: 4, name: "Beltane", date: "1 Maio", theme: "Fogo Sagrado & Vitalidade", elem: "Fogo (Sul - Transformação & Luz)", ritual: "Caminhada ao amanhecer no bosque, fitas na árvore sagrada e fogueira.", blessing: "Que o fogo da vida e da alegria abençoe toda a criação." },
    { id: 5, name: "Litha", date: "21 Junho", theme: "Solstício de Verão", elem: "Fogo (Sul - Transformação & Luz)", ritual: "Apogeu da força solar, colheita de ervas ao meio-dia e gratidão pela luz.", blessing: "Honramos o Sol no seu trono mais alto e agradecemos a abundância." },
    { id: 6, name: "Lughnasadh", date: "1 Agosto", theme: "Primeira Colheita", elem: "Terra (Norte - Ancestrais & Raízes)", ritual: "Partilha do pão sagrado feito com os primeiros grãos e celebração dos talentos.", blessing: "Partilhamos o pão da terra com gratidão pelo trabalho e sustento." },
    { id: 7, name: "Mabon", date: "21 Setembro", theme: "Equinócio de Outono", elem: "Água (Oeste - Cura & Memória)", ritual: "Agradecimento pela colheita completa, equilíbrio e preparação para o recolhimento.", blessing: "Agradecemos os frutos recolhidos e acolhemos a serenidade do outono." },
    { id: 8, name: "Samhain", date: "31 Outubro", theme: "Ano Novo Druídico & Ancestrais", elem: "Água (Oeste - Cura & Memória)", ritual: "Altar aos antepassados, vela na janela para os que partiram e silêncio sagrado.", blessing: "Honramos os nossos ancestrais e entramos em paz no novo ciclo." }
];

let selectedFestivalId = 8;
let lastReadings = { ogham: "", tarot: "", runes: "" };

function selectFestival(id) {
    selectedFestivalId = id;
    const f = wheelFestivals.find(item => item.id === id);
    if(!f) return;
    document.getElementById('fest-date-badge').innerText = f.date;
    document.getElementById('fest-name-title').innerText = `${f.name} (${f.theme})`;
    document.getElementById('fest-theme-desc').innerText = f.theme;
    document.getElementById('fest-ritual-desc').innerHTML = `<strong>Prática Ritual:</strong> ${f.ritual}`;
    showToast(`Festival selecionado: ${f.name}`);
}

function openFestivalInRitualBuilder() {
    switchTab('ritual');
    loadFestivalRitualTemplate(selectedFestivalId);
}

function loadFestivalRitualTemplate(id) {
    if (!id) return;
    const f = wheelFestivals.find(item => item.id == id);
    if (!f) return;
    document.getElementById('rit-title').value = `Cerimónia do Grove — ${f.name} (${f.date})`;
    document.getElementById('rit-intent').value = `${f.theme}: ${f.ritual}`;
    document.getElementById('rit-elem').value = f.elem;
    document.getElementById('rit-blessing').value = f.blessing;
    updateRitualPreview();
    showToast(`Modelo litúrgico de ${f.name} carregado!`);
}

const druidicTriads = [
    "Três coisas que geram a luz da mente: a busca da verdade, o amor à beleza e a coragem de enfrentar o desconhecido.",
    "Três velas que iluminam toda a escuridão: Verdade, Natureza e Conhecimento.",
    "Três deveres de um Druida: honrar os deuses, fazer o bem aos homens e não temer nenhuma fatalidade.",
    "Três fontes de poesia e inspiração (Awen): ver claramente o que é, amar o que vale a pena e criar harmonia.",
    "Três grandezas da alma: generosidade para com os necessitados, perseverança na aflição e perdão para com os ofensores."
];

window.addEventListener('DOMContentLoaded', () => {
    loadSavedTheme();
    calculateAstronomy();
    calculateCelticTreeMonth();
    renderHerbal(oghamAlphabet);
    initJournalSecurityAndLoad();
    drawRandomTriad();
    selectFestival(8);
    updateRitualPreview();
});

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = "theme-card border px-4 py-3 rounded-2xl shadow-2xl text-xs theme-title flex items-center gap-2.5 pointer-events-auto transition-all transform translate-y-2 opacity-0";
    toast.innerHTML = `<svg class="awen-svg !w-4 !h-4 inline" viewBox="0 0 100 100"><line x1="25" y1="85" x2="40" y2="20" /><line x1="50" y1="85" x2="50" y2="35" /><line x1="75" y1="85" x2="60" y2="20" /><circle cx="50" cy="15" r="5" fill="var(--text-accent)" stroke="none" /></svg> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => { toast.classList.remove('translate-y-2', 'opacity-0'); }, 10);
    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function changeTheme(themeName) {
    document.getElementById('app-body').className = `${themeName} min-h-screen flex flex-col lg:flex-row pb-20 lg:pb-0`;
    localStorage.setItem('druid_app_theme', themeName);
    const deskSel = document.getElementById('theme-selector-desktop');
    const mobSel = document.getElementById('theme-selector-mobile');
    if (deskSel) deskSel.value = themeName;
    if (mobSel) mobSel.value = themeName;
    showToast("Ambiente visual atualizado.");
}

function toggleLanternMode() {
    const current = localStorage.getItem('druid_app_theme') || 'theme-night';
    if (current === 'theme-lantern') {
        const prev = localStorage.getItem('druid_prev_theme') || 'theme-night';
        changeTheme(prev);
        showToast("Modo Lanterna desativado.");
    } else {
        localStorage.setItem('druid_prev_theme', current);
        changeTheme('theme-lantern');
        showToast("🏮 Modo Lanterna Ritual ativo (visão noturna).");
    }
}

function loadSavedTheme() {
    const saved = localStorage.getItem('druid_app_theme') || 'theme-night';
    changeTheme(saved);
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.bot-nav-item').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('theme-muted');
    });
    
    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.remove('hidden');

    const deskBtn = document.getElementById(`desk-nav-${tabId}`);
    const mobBtn = document.getElementById(`mob-nav-${tabId}`);
    const botBtn = document.getElementById(`bot-nav-${tabId}`);
    if (deskBtn) deskBtn.classList.add('active');
    if (mobBtn) mobBtn.classList.add('active');
    if (botBtn) {
        botBtn.classList.add('active');
        botBtn.classList.remove('theme-muted');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function drawRandomTriad() {
    const randomIndex = Math.floor(Math.random() * druidicTriads.length);
    document.getElementById('triad-text').innerText = `"${druidicTriads[randomIndex]}"`;
}

// CÁLCULO DO MÊS ARBÓREO CELTA (BETH-LUIS-NION)
function calculateCelticTreeMonth() {
    const now = new Date();
    const m = now.getMonth() + 1;
    const d = now.getDate();

    let currentTree = celticTreeMonths[0];
    for (const item of celticTreeMonths) {
        if (item.startM === 12 && item.endM === 1) {
            if ((m === 12 && d >= item.startD) || (m === 1 && d <= item.endD)) {
                currentTree = item;
                break;
            }
        } else {
            if ((m === item.startM && d >= item.startD) || (m === item.endM && d <= item.endD)) {
                currentTree = item;
                break;
            }
        }
    }

    const topSym = document.getElementById('top-tree-symbol');
    const topTxt = document.getElementById('top-tree-text');
    const mobSub = document.getElementById('mob-tree-subtitle');
    const astroSym = document.getElementById('celtic-month-symbol');
    const astroTitle = document.getElementById('celtic-month-title');
    const astroDesc = document.getElementById('celtic-month-desc');

    if (topSym) topSym.innerText = currentTree.symbol;
    if (topTxt) topTxt.innerText = currentTree.name;
    if (mobSub) mobSub.innerText = `${currentTree.symbol} Mês de ${currentTree.name}`;
    if (astroSym) astroSym.innerText = currentTree.symbol;
    if (astroTitle) astroTitle.innerText = `Mês Regente: ${currentTree.name}`;
    if (astroDesc) astroDesc.innerText = currentTree.desc;
}

// CÁLCULO LUNAR & SOLAR (COM SUPORTE A COORDENADAS GPS REAIS)
function calculateAstronomy(lat = 38.95, lon = -8.99) {
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate();
    let c = 0, e = 0, jd = 0;
    if (month < 3) {
        let y = year - 1, m = month + 12;
        c = Math.floor(y / 100); e = 2 - c + Math.floor(c / 4);
        jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + e - 1524;
    } else {
        c = Math.floor(year / 100); e = 2 - c + Math.floor(c / 4);
        jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + e - 1524;
    }
    const daysSinceNew = (jd - 2451549.5) % 29.53058770576;
    const age = daysSinceNew < 0 ? daysSinceNew + 29.53058770576 : daysSinceNew;
    const illumination = Math.round((1 - Math.cos((age / 29.53058770576) * 2 * Math.PI)) / 2 * 100);
    
    let phaseName = "Lua Nova", icon = "🌑";
    if (age > 1.84 && age <= 5.5) { phaseName = "Lua Crescente"; icon = "🌒"; }
    else if (age > 5.5 && age <= 9.2) { phaseName = "Quarto Crescente"; icon = "🌓"; }
    else if (age > 9.2 && age <= 12.9) { phaseName = "Gibosa Crescente"; icon = "🌔"; }
    else if (age > 12.9 && age <= 16.6) { phaseName = "Lua Cheia"; icon = "🌕"; }
    else if (age > 16.6 && age <= 20.3) { phaseName = "Gibosa Minguante"; icon = "🌖"; }
    else if (age > 20.3 && age <= 24.0) { phaseName = "Quarto Minguante"; icon = "🌗"; }
    else if (age > 24.0 && age < 27.7) { phaseName = "Lua Minguante"; icon = "🌘"; }

    // Cálculo trigonométrico aproximado do Nascer e Pôr do Sol para a latitude/longitude
    const startOfYear = new Date(year, 0, 0);
    const dayOfYear = Math.floor((now - startOfYear) / 86400000);
    const rad = Math.PI / 180;
    const declination = 23.44 * Math.sin(rad * (360 / 365) * (dayOfYear - 81));
    const cosH = -Math.tan(rad * lat) * Math.tan(rad * declination);
    const clampedCosH = Math.max(-1, Math.min(1, cosH));
    const hourAngle = (Math.acos(clampedCosH) / rad) / 15;
    const tzOffset = -now.getTimezoneOffset() / 60;
    const solarNoon = 12 - (lon / 15) + tzOffset;
    const sunriseDec = solarNoon - hourAngle;
    const sunsetDec = solarNoon + hourAngle;
    const dayLengthDec = hourAngle * 2;

    const formatHours = (dec) => {
        const hrs = Math.floor((dec + 24) % 24);
        const mins = Math.round((dec - Math.floor(dec)) * 60) % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    const sunriseStr = formatHours(sunriseDec);
    const sunsetStr = formatHours(sunsetDec);
    const durH = Math.floor(dayLengthDec);
    const durM = Math.round((dayLengthDec - durH) * 60);

    document.getElementById('moon-icon').innerText = icon;
    document.getElementById('moon-phase-name').innerText = phaseName;
    document.getElementById('moon-details').innerText = `Idade: ${age.toFixed(1)} dias • ${illumination}% Iluminada`;
    document.getElementById('solar-status').innerText = `Lat ${lat.toFixed(1)}° • Luz Ativa`;
    document.getElementById('solar-duration').innerText = `Dia Luz: ${durH}h ${durM}m`;
    document.getElementById('sunrise-time').innerText = `Nascer: ${sunriseStr}`;
    document.getElementById('sunset-time').innerText = `Pôr: ${sunsetStr}`;

    document.getElementById('top-moon-icon').innerText = icon;
    document.getElementById('top-moon-text').innerText = `${phaseName} (${illumination}%)`;
    document.getElementById('top-sun-text').innerText = `${sunriseStr} — ${sunsetStr}`;
}

function drawOghamCard(count) {
    const container = document.getElementById('ogham-card');
    const shuffled = [...oghamAlphabet].sort(() => 0.5 - Math.random()).slice(0, count);
    const labels3 = ["Raiz (Passado)", "Tronco (Presente)", "Copa (Futuro)"];
    const labels5 = ["Norte (Terra)", "Leste (Ar)", "Sul (Fogo)", "Oeste (Água)", "Centro (Espírito / Awen)"];
    
    const gridClass = count === 1 ? 'grid-cols-1 max-w-md mx-auto' : (count === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5');

    container.innerHTML = `
        <div class="grid ${gridClass} gap-4 w-full">
            ${shuffled.map((card, i) => `
                <div class="theme-card border rounded-2xl p-5 flex flex-col items-center text-center space-y-2 shadow-lg hover:-translate-y-0.5">
                    ${count === 3 ? `<span class="text-[10px] uppercase tracking-widest theme-accent font-semibold">${labels3[i]}</span>` : ''}
                    ${count === 5 ? `<span class="text-[10px] uppercase tracking-widest theme-accent font-semibold">${labels5[i]}</span>` : ''}
                    <span class="text-5xl theme-accent font-bold my-2">${card.symbol}</span>
                    <h3 class="font-cinzel text-sm font-bold text-white">${card.name} (${card.tree})</h3>
                    <span class="text-[10px] theme-accent font-medium">${card.family}</span>
                    <p class="text-[11px] theme-muted leading-relaxed">${card.meaning}</p>
                </div>
            `).join('')}
        </div>
    `;

    lastReadings.ogham = shuffled.map((c, i) => {
        const pos = count === 3 ? `[${labels3[i]}] ` : (count === 5 ? `[${labels5[i]}] ` : '');
        return `${pos}${c.symbol} ${c.name} (${c.tree}): ${c.meaning}`;
    }).join('\n');

    document.getElementById('ogham-save-bar').classList.remove('hidden');
    showToast(`Oráculo de Ogham consultado (${count} Few).`);
}

function drawTarotCard(count) {
    const container = document.getElementById('tarot-card-container');
    const shuffled = [...tarotCards].sort(() => 0.5 - Math.random()).slice(0, count);
    const labels = ["Passado", "Presente", "Destino"];
    container.innerHTML = `
        <div class="flex flex-wrap justify-center gap-6 w-full items-start">
            ${shuffled.map((c, i) => `
                <div class="flex flex-col items-center space-y-3">
                    ${count === 3 ? `<span class="text-[10px] uppercase tracking-widest theme-accent font-semibold">${labels[i]}</span>` : ''}
                    <div class="tarot-flip-wrapper" id="tarot-flip-${i}" onclick="this.classList.toggle('is-flipped')">
                        <div class="tarot-flip-inner">
                            <div class="tarot-card-back pixel-card-vertical">
                                <div class="card-header-pixel">AWEN • ARCANO</div>
                                <div class="card-art-box flex items-center justify-center">
                                    <svg viewBox="0 0 16 16" class="w-24 h-24 pixel-svg">
                                        <rect x="7" y="1" width="2" height="2" fill="#eab308"/>
                                        <rect x="5" y="4" width="1" height="10" fill="#818cf8"/>
                                        <rect x="7" y="5" width="2" height="9" fill="#eab308"/>
                                        <rect x="10" y="4" width="1" height="10" fill="#818cf8"/>
                                    </svg>
                                </div>
                                <div class="card-footer-pixel">A REVELAR...</div>
                            </div>
                            <div class="tarot-card-front pixel-card-vertical">
                                <div class="card-header-pixel">${c.num} • ${c.name}</div>
                                <div class="card-art-box flex items-center justify-center">
                                    ${c.svg}
                                </div>
                                <div class="card-footer-pixel">${c.realm}</div>
                            </div>
                        </div>
                    </div>
                    <p class="text-[11px] theme-muted max-w-[210px] text-center leading-relaxed">${c.desc}</p>
                </div>
            `).join('')}
        </div>
    `;

    // Revelar cartas automaticamente em cascata suave
    shuffled.forEach((_, i) => {
        setTimeout(() => {
            const el = document.getElementById(`tarot-flip-${i}`);
            if (el) el.classList.add('is-flipped');
        }, 250 + i * 250);
    });

    lastReadings.tarot = shuffled.map((c, i) => {
        const pos = count === 3 ? `[${labels[i]}] ` : '';
        return `${pos}${c.num} - ${c.name} (${c.realm}): ${c.desc}`;
    }).join('\n');

    document.getElementById('tarot-save-bar').classList.remove('hidden');
    showToast("Tiragem de Tarot Mítico efetuada.");
}

function drawRunes(count) {
    const container = document.getElementById('rune-card');
    const shuffled = [...runeAlphabet].sort(() => 0.5 - Math.random()).slice(0, count);
    const labels = ["Passado", "Presente", "Futuro"];
    container.innerHTML = `
        <div class="grid ${count === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-3'} gap-4 w-full">
            ${shuffled.map((rune, i) => `
                <div class="theme-card border rounded-2xl p-6 flex flex-col items-center text-center space-y-2 shadow-lg hover:-translate-y-0.5">
                    ${count === 3 ? `<span class="text-[10px] uppercase tracking-widest theme-accent font-semibold">${labels[i]}</span>` : ''}
                    <span class="text-5xl text-amber-300 font-bold my-2">${rune.symbol}</span>
                    <h3 class="font-cinzel text-base font-bold text-white">${rune.name}</h3>
                    <span class="text-[11px] theme-accent">${rune.element}</span>
                    <p class="text-xs theme-muted leading-relaxed">${rune.meaning}</p>
                </div>
            `).join('')}
        </div>
    `;

    lastReadings.runes = shuffled.map((r, i) => {
        const pos = count === 3 ? `[${labels[i]}] ` : '';
        return `${pos}${r.symbol} ${r.name} (${r.element}): ${r.meaning}`;
    }).join('\n');

    document.getElementById('rune-save-bar').classList.remove('hidden');
    showToast("Oráculo de Runas consultado.");
}

function saveLastReadingToJournal(type) {
    const content = lastReadings[type];
    if (!content) return;
    const titles = { ogham: "LEITURA DE OGHAM", tarot: "LEITURA DE TAROT MÍTICO", runes: "LEITURA RÚNICA" };
    const moon = document.getElementById('top-moon-text')?.innerText || "";
    const entry = `\n\n--- ${titles[type]} (${new Date().toLocaleDateString()} • ${moon}) ---\n${content}\n------------------------------------------`;
    
    const jInput = document.getElementById('journal-input');
    jInput.value += entry;
    autoSaveJournal();
    showToast("Leitura guardada no Diário!");
}

function renderHerbal(items) {
    const list = document.getElementById('tree-list');
    list.innerHTML = items.map(o => `
        <div class="theme-inner border rounded-2xl p-5 flex items-start gap-4 hover:border-[var(--border-hover)] transition">
            <span class="text-4xl theme-accent font-bold">${o.symbol}</span>
            <div class="space-y-1">
                <h4 class="font-cinzel text-base font-bold text-white">${o.name} <span class="text-xs theme-accent font-normal">(${o.tree})</span></h4>
                <span class="inline-block text-[10px] theme-accent bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border-color)]">Aicmí: ${o.family}</span>
                <p class="text-xs text-white/90 pt-1"><strong>Erva/Fitoterapia:</strong> ${o.herb}</p>
                <p class="text-[11px] theme-muted leading-relaxed">${o.meaning}</p>
            </div>
        </div>
    `).join('');
}

function filterHerbal() {
    const q = document.getElementById('herbal-search').value.toLowerCase();
    const filtered = oghamAlphabet.filter(o => 
        o.name.toLowerCase().includes(q) || 
        o.tree.toLowerCase().includes(q) || 
        o.herb.toLowerCase().includes(q) ||
        o.family.toLowerCase().includes(q) ||
        o.meaning.toLowerCase().includes(q)
    );
    renderHerbal(filtered);
}

function initGeoAndCompass() {
    if (navigator.geolocation) {
        showToast("A obter coordenadas GPS...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                document.getElementById('gps-info').innerHTML = `📍 Lat: ${lat.toFixed(4)}° | Lon: ${lon.toFixed(4)}° (Sol atualizado)`;
                calculateAstronomy(lat, lon);
                showToast("GPS e ciclo solar local atualizados!");
            },
            () => {
                document.getElementById('gps-info').innerHTML = `📍 GPS indisponível neste dispositivo`;
                showToast("Não foi possível obter localização GPS.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(res => {
                if (res === 'granted') startCompassListener();
            }).catch(console.error);
        } else {
            startCompassListener();
        }
    }
}

function startCompassListener() {
    window.addEventListener('deviceorientation', (event) => {
        let heading = event.webkitCompassHeading !== undefined ? event.webkitCompassHeading : (event.alpha !== null ? 360 - event.alpha : null);
        if (heading !== null) {
            document.getElementById('compass-needle').style.transform = `rotate(${-heading}deg)`;
            document.getElementById('heading-deg').innerText = `${Math.round(heading)}°`;
        }
    }, true);
    showToast("Sensores de orientação ativados.");
}

function updateRitualPreview() {
    const title = document.getElementById('rit-title').value || "Cerimónia do Grove";
    const peace = document.getElementById('rit-peace').value || "Que haja paz nos quatro quadrantes.";
    const intent = document.getElementById('rit-intent').value || "Definir intenção do rito...";
    const elem = document.getElementById('rit-elem').value;
    const blessing = document.getElementById('rit-blessing').value || "Partilha da taça e bênção da terra.";
    const words = document.getElementById('rit-words').value || "O círculo está aberto, mas nunca quebrado.";

    document.getElementById('ritual-preview').innerHTML = `
        <h4 class="font-cinzel text-base font-bold theme-title border-b border-[var(--border-color)] pb-2">${title}</h4>
        <p><strong class="theme-accent">I. Paz nos Quadrantes:</strong><br><span class="italic text-white/90">"${peace}"</span></p>
        <p><strong class="theme-accent">II. Elemento & Intenção:</strong><br>${elem} — ${intent}</p>
        <p><strong class="theme-accent">III. Partilha & Bênção:</strong><br>${blessing}</p>
        <div class="pt-2 border-t border-[var(--border-color)]">
            <strong class="theme-accent block mb-1">IV. Encerramento:</strong>
            <p class="italic text-white/90">"${words}"</p>
        </div>
    `;
}

function registerAwenPractice() {
    const text = `\n[${new Date().toLocaleDateString()}] Prática Druídica: Invocação da Awen realizada (AH-OO-WEN). Foco em Fogo, Ar e Água.`;
    document.getElementById('journal-input').value += text;
    autoSaveJournal();
    showToast("Prática de Awen registada no Diário!");
}

function saveRitualTemplate() {
    const title = document.getElementById('rit-title').value;
    const peace = document.getElementById('rit-peace').value;
    const intent = document.getElementById('rit-intent').value;
    const elem = document.getElementById('rit-elem').value;
    const blessing = document.getElementById('rit-blessing').value;
    const words = document.getElementById('rit-words').value;

    if(!title) {
        showToast("Indique o título da cerimónia.");
        return;
    }

    const ritualText = `\n\n=== LITURGIA DO GROVE: ${title.toUpperCase()} ===\nData: ${new Date().toLocaleDateString()}\n1. Paz nos Quadrantes: ${peace}\n2. Elemento: ${elem}\n3. Intenção: ${intent}\n4. Bênção: ${blessing}\n5. Encerramento: ${words}\n==========================================`;
    document.getElementById('journal-input').value += ritualText;
    autoSaveJournal();
    showToast("Guião litúrgico guardado no Diário!");
    switchTab('journal');
}

// SEGURANÇA POR PIN & CADERNO BÁRDICO
function initJournalSecurityAndLoad() {
    const saved = localStorage.getItem('druid_journal_content');
    if (saved) document.getElementById('journal-input').value = saved;

    const savedBardic = localStorage.getItem('druid_bardic_content');
    if (savedBardic) {
        document.getElementById('bardic-input').value = savedBardic;
        updateBardicCounters();
    }

    const pin = localStorage.getItem('druid_journal_pin');
    if (pin && pin.length === 4) {
        document.getElementById('journal-lock-screen').classList.remove('hidden');
        document.getElementById('journal-unlocked-area').classList.add('hidden');
    }
}

function unlockJournalWithPin() {
    const entered = document.getElementById('journal-pin-unlock-input').value;
    const savedPin = localStorage.getItem('druid_journal_pin');
    if (entered === savedPin) {
        document.getElementById('journal-lock-screen').classList.add('hidden');
        document.getElementById('journal-unlocked-area').classList.remove('hidden');
        document.getElementById('journal-pin-unlock-input').value = '';
        showToast("Diário desbloqueado.");
    } else {
        showToast("PIN incorreto.");
    }
}

function togglePinSettings() {
    document.getElementById('pin-settings-box').classList.toggle('hidden');
}

function saveNewJournalPin() {
    const val = document.getElementById('new-pin-input').value.trim();
    if (!/^\d{4}$/.test(val)) {
        showToast("Introduza exatamente 4 números.");
        return;
    }
    localStorage.setItem('druid_journal_pin', val);
    document.getElementById('new-pin-input').value = '';
    document.getElementById('pin-settings-box').classList.add('hidden');
    showToast("PIN de privacidade ativado!");
}

function removeJournalPin() {
    localStorage.removeItem('druid_journal_pin');
    document.getElementById('pin-settings-box').classList.add('hidden');
    showToast("Proteção por PIN removida.");
}

function switchJournalSubtab(sub) {
    const genArea = document.getElementById('journal-subtab-general');
    const barArea = document.getElementById('journal-subtab-bardic');
    const btnGen = document.getElementById('subtab-btn-general');
    const btnBar = document.getElementById('subtab-btn-bardic');

    if (sub === 'general') {
        genArea.classList.remove('hidden');
        barArea.classList.add('hidden');
        btnGen.className = "bg-[var(--btn-primary)] text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer";
        btnBar.className = "theme-inner theme-muted border border-[var(--border-color)] text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer";
    } else {
        genArea.classList.add('hidden');
        barArea.classList.remove('hidden');
        btnBar.className = "bg-[var(--btn-primary)] text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer";
        btnGen.className = "theme-inner theme-muted border border-[var(--border-color)] text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer";
    }
}

function autoSaveJournal() {
    const content = document.getElementById('journal-input').value;
    localStorage.setItem('druid_journal_content', content);
    document.getElementById('save-status').innerText = "Guardado às " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function autoSaveBardic() {
    const content = document.getElementById('bardic-input').value;
    localStorage.setItem('druid_bardic_content', content);
    updateBardicCounters();
    document.getElementById('save-status').innerText = "Guardado às " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function updateBardicCounters() {
    const text = document.getElementById('bardic-input').value;
    const lines = text.split('\n').filter(l => l.trim().length > 0).length;
    const triads = Math.floor(lines / 3);
    document.getElementById('bardic-line-count').innerText = `Versos: ${lines}`;
    document.getElementById('bardic-triad-count').innerText = `Tríades completas: ${triads}`;
}

function clearJournal() {
    if(confirm("Tem certeza que deseja limpar o conteúdo do diário?")) {
        document.getElementById('journal-input').value = '';
        localStorage.removeItem('druid_journal_content');
        showToast("Diário limpo.");
    }
}

function exportJournalTXT() {
    const jContent = document.getElementById('journal-input').value;
    const bContent = document.getElementById('bardic-input').value;
    const full = `=== DIÁRIO DRUÍDICO ===\n${jContent}\n\n=== CADERNO POÉTICO BÁRDICO ===\n${bContent}`;
    const blob = new Blob([full], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diario-druidico-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    showToast("Diário e Poesia exportados em TXT.");
}

function exportBackupJSON() {
    const data = {
        journal: document.getElementById('journal-input').value,
        bardic: document.getElementById('bardic-input').value,
        theme: localStorage.getItem('druid_app_theme'),
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const aElem = document.createElement('a');
    aElem.href = url;
    aElem.download = `backup-caminho-druidico-${new Date().toISOString().slice(0,10)}.json`;
    aElem.click();
    showToast("Backup JSON criado.");
}

function importBackupJSON(event) {
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if(data.journal) {
                document.getElementById('journal-input').value = data.journal;
                autoSaveJournal();
            }
            if(data.bardic) {
                document.getElementById('bardic-input').value = data.bardic;
                autoSaveBardic();
            }
            if(data.theme) changeTheme(data.theme);
            showToast("Backup importado!");
        } catch(err) {
            showToast("Erro ao ler ficheiro JSON.");
        }
    };
    reader.readAsText(file);
}

// ÁUDIO: SONS NATURAIS, DRONE VOCAL AWEN & TAÇA SAGRADA
let audioCtx = null, noiseNode = null, droneOsc = null, droneOsc2 = null;

function toggleAmbientSound(type) {
    stopAmbientSound();
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'rain' ? 600 : 350;

        noiseNode.connect(filter);
        filter.connect(audioCtx.destination);
        noiseNode.start(0);
        showToast(`Reproduzindo som de ${type === 'rain' ? 'Chuva' : 'Vento'}.`);
    } catch(e) {
        showToast("Áudio bloqueado pelo navegador.");
    }
}

function toggleVocalDrone(freq, label) {
    stopAmbientSound();
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 1.5);

        droneOsc = audioCtx.createOscillator();
        droneOsc.type = 'sine';
        droneOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        droneOsc2 = audioCtx.createOscillator();
        droneOsc2.type = 'triangle';
        droneOsc2.frequency.setValueAtTime(freq * 1.5, audioCtx.currentTime); // Quinta justa harmónica

        const subGain = audioCtx.createGain();
        subGain.gain.value = 0.25;

        droneOsc.connect(gain);
        droneOsc2.connect(subGain);
        subGain.connect(gain);
        gain.connect(audioCtx.destination);

        droneOsc.start();
        droneOsc2.start();
        showToast(`Drone vocal ativo: ${label}`);
    } catch(e) {
        showToast("Áudio bloqueado pelo navegador.");
    }
}

function stopAmbientSound() {
    if (noiseNode) { try { noiseNode.stop(); noiseNode.disconnect(); } catch(e){} noiseNode = null; }
    if (droneOsc) { try { droneOsc.stop(); droneOsc.disconnect(); } catch(e){} droneOsc = null; }
    if (droneOsc2) { try { droneOsc2.stop(); droneOsc2.disconnect(); } catch(e){} droneOsc2 = null; }
    if (audioCtx) { try { audioCtx.close(); } catch(e){} audioCtx = null; }
}

function playSacredBell() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;
        const freqs = [528, 1056, 1584];
        freqs.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);
            gain.gain.setValueAtTime(0.18 / (idx + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 3.6);
        });
    } catch(e) {}
}

// RESPIRAÇÃO GUIADA
let breathInterval = null, isBreathing = false;
function toggleBreathing() {
    const btn = document.getElementById('btn-breath-toggle');
    const action = document.getElementById('breath-action');
    const timer = document.getElementById('breath-timer');
    const circle = document.getElementById('breath-circle');

    if (isBreathing) {
        clearInterval(breathInterval);
        isBreathing = false;
        btn.innerText = "Iniciar Ciclo Respiratório";
        action.innerText = "Respirar";
        timer.innerText = "4";
        circle.style.transform = "scale(1)";
        return;
    }

    isBreathing = true;
    btn.innerText = "Parar Exercício";
    let phase = 0;
    let count = 4;

    function runBreath() {
        if(count > 0) {
            timer.innerText = count;
            count--;
        } else {
            phase = (phase + 1) % 3;
            if(phase === 0) { action.innerText = "Inalar (Ar)"; count = 4; circle.style.transform = "scale(1.2)"; }
            else if(phase === 1) { action.innerText = "Segurar (Fogo)"; count = 4; circle.style.transform = "scale(1.2)"; }
            else if(phase === 2) { action.innerText = "Exalar (Água)"; count = 4; circle.style.transform = "scale(1)"; }
            timer.innerText = count;
        }
    }

    action.innerText = "Inalar (Ar)";
    circle.style.transform = "scale(1.2)";
    breathInterval = setInterval(runBreath, 1000);
    showToast("Exercício de respiração Awen iniciado.");
}

// TEMPORIZADOR DE MEDITAÇÃO DO NEMETON INTERIOR
let medTotalSeconds = 15 * 60;
let medRemainingSeconds = 15 * 60;
let medInterval = null;
let isMedRunning = false;

function setMeditationMinutes(mins) {
    if (isMedRunning) toggleMeditationTimer();
    medTotalSeconds = mins * 60;
    medRemainingSeconds = medTotalSeconds;
    updateMeditationDisplay();
    showToast(`Temporizador definido para ${mins} minutos.`);
}

function updateMeditationDisplay() {
    const m = Math.floor(medRemainingSeconds / 60);
    const s = medRemainingSeconds % 60;
    document.getElementById('meditation-display').innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function toggleMeditationTimer() {
    const btn = document.getElementById('btn-med-toggle');
    const status = document.getElementById('meditation-status');

    if (isMedRunning) {
        clearInterval(medInterval);
        isMedRunning = false;
        btn.innerText = "🔔 Retomar Meditação";
        status.innerText = "Meditação em pausa.";
        return;
    }

    isMedRunning = true;
    btn.innerText = "⏸️ Pausar";
    status.innerText = "Em silêncio no Nemeton interior...";
    playSacredBell();

    medInterval = setInterval(() => {
        if (medRemainingSeconds > 0) {
            medRemainingSeconds--;
            updateMeditationDisplay();
        } else {
            clearInterval(medInterval);
            isMedRunning = false;
            btn.innerText = "🔔 Iniciar Meditação";
            status.innerText = "Jornada concluída. Bem-vindo de volta.";
            playSacredBell();
            showToast("Meditação no Nemeton concluída!");
        }
    }, 1000);
}

function resetMeditationTimer() {
    if (isMedRunning) {
        clearInterval(medInterval);
        isMedRunning = false;
    }
    medRemainingSeconds = medTotalSeconds;
    updateMeditationDisplay();
    document.getElementById('btn-med-toggle').innerText = "🔔 Iniciar Meditação";
    document.getElementById('meditation-status').innerText = "Feche os olhos e visualize a clareira sagrada do seu Nemeton...";
}

// GERADOR DIRETO DE PACOTE .ZIP NO NAVEGADOR PARA GITHUB
async function downloadProjectZip() {
    if (typeof JSZip === 'undefined') {
        showToast("A aguardar biblioteca ZIP...");
        return;
    }
    showToast("A empacotar ficheiros do projeto em .ZIP...");
    try {
        const zip = new JSZip();
        const filesToFetch = ['index.html', 'style.css', 'script.js', 'manifest.json', 'sw.js', 'README.md'];
        for (const file of filesToFetch) {
            try {
                const res = await fetch(`./${file}`);
                if (res.ok) {
                    const text = await res.text();
                    zip.file(file, text);
                }
            } catch (e) {}
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `caminho-druidico-pro-ultimate-${new Date().toISOString().slice(0, 10)}.zip`;
        a.click();
        showToast("Ficheiro .ZIP descarregado com sucesso!");
    } catch (err) {
        showToast("Erro ao gerar ZIP.");
    }
}