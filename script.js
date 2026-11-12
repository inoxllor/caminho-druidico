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

const runeAlphabet = [
    { symbol: "ᚠ", name: "Fehu", element: "Fogo / Abundância", meaning: "Riqueza, prosperidade e novos ganhos." },
    { symbol: "ᚢ", name: "Uruz", element: "Terra / Força", meaning: "Força vital, saúde e coragem." },
    { symbol: "ᚦ", name: "Thurisaz", element: "Fogo / Proteção", meaning: "Defesa e quebra de barreiras." },
    { symbol: "ᚨ", name: "Ansuz", element: "Ar / Inspiração", meaning: "Comunicação sagrada e sabedoria." },
    { symbol: "ᚱ", name: "Raidho", element: "Ar / Jornada", meaning: "Viagem espiritual, ritmo e evolução." },
    { symbol: "ᚲ", name: "Kenaz", element: "Fogo / Iluminação", meaning: "Conhecimento, clareza e fogo criativo." }
];

const tarotDeck = [
    { 
        number: "0", name: "O Viajante dos Mundos (O Louco)", 
        pixelArt: "🌲🐦👤", 
        artDesc: "Bardo com manto verde e runas no rosto, corvo de Odin e cão selvagem à beira do abismo.", 
        meaning: "Início de jornada, inocência, salto de fé entre mundos e o desconhecido." 
    },
    { 
        number: "I", name: "O Druida & Alquimista (O Mago)", 
        pixelArt: "🪵✨🌿", 
        artDesc: "Druida idoso com bastão de carvalho, mesa de pedra com elementos sagrados.", 
        meaning: "Manifestação, poder da vontade, canalização da Awen e magia elemental." 
    },
    { 
        number: "II", name: "A Valquíria do Véu (A Sacerdotisa)", 
        pixelArt: "🐺❄️📜", 
        artDesc: "Figura em trono de basalto entre gelo e carvalho, pergaminho Ogham e lobo branco.", 
        meaning: "Intuição profunda, véu de Samhain, mistérios ocultos e sabedoria ancestral." 
    },
    { 
        number: "III", name: "A Grande Mãe da Terra (A Imperatriz)", 
        pixelArt: "👑🌾🦅", 
        artDesc: "Rainha coroada com flores e trigo, trono musgoso, falcão dourado e frutos.", 
        meaning: "Fertilidade, abundância da natureza, ciclos da Roda do Ano e amor incondicional." 
    },
    { 
        number: "IV", name: "O Pai de Todos (O Imperador)", 
        pixelArt: "👑🐺⚔️", 
        artDesc: "Patriarca severo com um só olho, trono com cabeças de lobos e cetro solar.", 
        meaning: "Estrutura, autoridade, ordem cósmica, liderança e proteção do clã." 
    },
    { 
        number: "X", name: "A Roda do Ano (A Roda da Fortuna)", 
        pixelArt: "🎡ᚠᚁ", 
        artDesc: "Grande roda de carroça celta pixelizada com os 8 festivais e runas brilhantes.", 
        meaning: "Destino, ciclos mutáveis da natureza, karma e inevitabilidade da mudança." 
    },
    { 
        number: "XIII", name: "A Travessia de Hel (A Morte)", 
        pixelArt: "🐎💀🌫️", 
        artDesc: "Cavaleiro esquelético em Sleipnir (cavalo de 8 patas) com cota de malha e nevoeiro.", 
        meaning: "Transformação radical, renascimento, fim de um ciclo e novas sementes." 
    },
    { 
        number: "XIX", name: "O Solstício de Verão (O Sol)", 
        pixelArt: "☀️🌻👶", 
        artDesc: "Sol radiante com espirais celtas e crianças a dançar junto ao carvalho sagrado.", 
        meaning: "Alegria pura, clareza, sucesso, vitalidade e energia de Litha." 
    }
];

const wheelFestivals = [
    { id: 1, name: "Yule", date: "21 Dezembro", theme: "Solstício de Inverno", ritual: "Celebração do regresso da luz solar e aconchego no lar." },
    { id: 2, name: "Imbolc", date: "1 Fevereiro", theme: "Purificação & Brigid", ritual: "Limpeza energética, acolhimento da primavera e acender velas de renovação." },
    { id: 3, name: "Ostara", date: "21 Março", theme: "Equinócio de Primavera", ritual: "Plantação de intenções na terra e celebração do equilíbrio." },
    { id: 4, name: "Beltane", date: "1 Maio", theme: "Fogo Sagrado & Vitalidade", ritual: "Passeio matinal na natureza, fitas de bênção e fogueiras sagradas." },
    { id: 5, name: "Litha", date: "21 Junho", theme: "Solstício de Verão", ritual: "Apogeu da luz, colheita de ervas medicinais e gratidão." },
    { id: 6, name: "Lughnasadh", date: "1 Agosto", theme: "Primeira Colheita", ritual: "Agradecimento pelos frutos iniciais e partilha do pão sagrado." },
    { id: 7, name: "Mabon", date: "21 Setembro", theme: "Equinócio de Outono", ritual: "Gratidão pela abundância e preparação para o recolhimento." },
    { id: 8, name: "Samhain", date: "31 Outubro", theme: "Ano Novo Druídico & Ancestrais", ritual: "Altar aos antepassados, fogueiras de proteção e libertação de ciclos." }
];

function selectFestival(id) {
    const f = wheelFestivals.find(item => item.id === id);
    if(!f) return;
    document.getElementById('fest-date-badge').innerText = f.date;
    document.getElementById('fest-name-title').innerText = `${f.name} (${f.theme})`;
    document.getElementById('fest-theme-desc').innerText = f.theme;
    document.getElementById('fest-ritual-desc').innerHTML = `<strong>Prática Ritual:</strong> ${f.ritual}`;
    showToast(`Festival selecionado: ${f.name}`);
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
    renderHerbal(oghamAlphabet);
    loadJournal();
    drawRandomTriad();
    selectFestival(8);
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
    document.getElementById('app-body').className = `${themeName} min-h-screen flex flex-col lg:flex-row pb-16 lg:pb-0`;
    localStorage.setItem('druid_app_theme', themeName);
    const deskSel = document.getElementById('theme-selector-desktop');
    const mobSel = document.getElementById('theme-selector-mobile');
    if (deskSel) deskSel.value = themeName;
    if (mobSel) mobSel.value = themeName;
    showToast("Ambiente visual atualizado.");
}

function loadSavedTheme() {
    const saved = localStorage.getItem('druid_app_theme') || 'theme-night';
    changeTheme(saved);
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    
    // Atualizar botões bottom nav mobile
    document.querySelectorAll('nav.fixed button').forEach(btn => {
        btn.classList.remove('text-[var(--text-accent)]');
        btn.classList.add('theme-muted');
    });

    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    const deskBtn = document.getElementById(`desk-nav-${tabId}`);
    const mobBtn = document.getElementById(`mob-nav-${tabId}`);
    if (deskBtn) deskBtn.classList.add('active');
    if (mobBtn) mobBtn.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function drawRandomTriad() {
    const randomIndex = Math.floor(Math.random() * druidicTriads.length);
    document.getElementById('triad-text').innerText = `"${druidicTriads[randomIndex]}"`;
}

function calculateAstronomy() {
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

    document.getElementById('moon-icon').innerText = icon;
    document.getElementById('moon-phase-name').innerText = phaseName;
    document.getElementById('moon-details').innerText = `Idade: ${age.toFixed(1)} dias • ${illumination}% Iluminada`;
    document.getElementById('solar-status').innerText = "Luz Natural Ativa";
    document.getElementById('solar-duration').innerText = "Dia Luz: aprox. 12h 30m";
    document.getElementById('sunrise-time').innerText = "Nascer: 07:15";
    document.getElementById('sunset-time').innerText = "Pôr: 18:45";

    document.getElementById('top-moon-icon').innerText = icon;
    document.getElementById('top-moon-text').innerText = `${phaseName} (${illumination}%)`;
}

function drawOghamCard(count) {
    const container = document.getElementById('ogham-card');
    const shuffled = [...oghamAlphabet].sort(() => 0.5 - Math.random()).slice(0, count);
    const labels = ["Raiz (Passado)", "Tronco (Presente)", "Copa (Futuro)"];
    container.innerHTML = `
        <div class="grid ${count === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-3'} gap-4 w-full">
            ${shuffled.map((card, i) => `
                <div class="theme-card border rounded-2xl p-6 flex flex-col items-center text-center space-y-2 shadow-lg hover:-translate-y-0.5">
                    ${count === 3 ? `<span class="text-[10px] uppercase tracking-widest theme-accent font-semibold">${labels[i]}</span>` : ''}
                    <span class="text-5xl theme-accent font-bold my-2">${card.symbol}</span>
                    <h3 class="font-cinzel text-base font-bold text-white">${card.name} (${card.tree})</h3>
                    <span class="text-[10px] theme-accent font-medium">Família: ${card.family}</span>
                    <p class="text-xs theme-muted leading-relaxed">${card.meaning}</p>
                </div>
            `).join('')}
        </div>
    `;
    showToast("Oráculo de Ogham consultado.");
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
    showToast("Oráculo de Runas consultado.");
}

function drawTarotCards(count) {
    const container = document.getElementById('tarot-display');
    const shuffled = [...tarotDeck].sort(() => 0.5 - Math.random()).slice(0, count);
    const labels = ["Passado", "Presente", "Futuro"];
    container.innerHTML = `
        <div class="grid ${count === 1 ? 'grid-cols-1 max-w-md mx-auto col-span-full' : 'grid-cols-1 md:grid-cols-3 col-span-full'} gap-4 w-full">
            ${shuffled.map((card, i) => `
                <div class="pixel-card rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-xl">
                    ${count === 3 ? `<span class="text-[10px] uppercase tracking-widest theme-accent font-semibold">${labels[i]}</span>` : ''}
                    <div class="text-xs text-amber-300 font-bold tracking-widest">ARCANO ${card.number}</div>
                    <div class="text-4xl py-3 bg-[var(--bg-inner)] w-full rounded-xl border border-[var(--border-color)]">${card.pixelArt}</div>
                    <h3 class="font-cinzel text-sm font-bold text-white">${card.name}</h3>
                    <p class="text-[11px] theme-accent italic">${card.artDesc}</p>
                    <p class="text-xs theme-muted leading-relaxed">${card.meaning}</p>
                </div>
            `).join('')}
        </div>
    `;
    showToast("Tiragem de Tarot Mítico efetuada.");
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
                document.getElementById('gps-info').innerHTML = `📍 Lat: ${position.coords.latitude.toFixed(4)}° | Lon: ${position.coords.longitude.toFixed(4)}°`;
                showToast("Localização geográfica obtida!");
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
    const title = document.getElementById('rit-title').value || "Título do Ritual";
    const intent = document.getElementById('rit-intent').value || "Definir intenção...";
    const elem = document.getElementById('rit-elem').value;
    const words = document.getElementById('rit-words').value || "Palavras de encerramento...";

    document.getElementById('ritual-preview').innerHTML = `
        <h4 class="font-cinzel text-base font-bold theme-title border-b border-[var(--border-color)] pb-2">${title}</h4>
        <p><strong class="theme-accent">Elemento Invocado:</strong> ${elem}</p>
        <p><strong class="theme-accent">Intenção:</strong> ${intent}</p>
        <div class="pt-2 border-t border-[var(--border-color)]">
            <strong class="theme-accent block mb-1">Encerramento:</strong>
            <p class="italic text-white/90">"${words}"</p>
        </div>
    `;
}

function registerAwenPractice() {
    const text = `\n[${new Date().toLocaleDateString()}] Prática Druídica: Invocação da Awen realizada. Foco em Fogo, Ar e Água.`;
    document.getElementById('journal-input').value += text;
    autoSaveJournal();
    showToast("Prática de Awen registada no Diário!");
}

function saveRitualTemplate() {
    const title = document.getElementById('rit-title').value;
    const intent = document.getElementById('rit-intent').value;
    const elem = document.getElementById('rit-elem').value;
    const words = document.getElementById('rit-words').value;

    if(!title) {
        showToast("Indique o título do ritual.");
        return;
    }

    const ritualText = `\n\n--- RITUAL: ${title.toUpperCase()} ---\nData: ${new Date().toLocaleDateString()}\nElemento: ${elem}\nIntenção: ${intent}\nEncerramento: ${words}\n------------------------------------------`;
    document.getElementById('journal-input').value += ritualText;
    autoSaveJournal();
    showToast("Ritual guardado no Diário!");
    switchTab('journal');
}

function autoSaveJournal() {
    const content = document.getElementById('journal-input').value;
    localStorage.setItem('druid_journal_content', content);
    document.getElementById('save-status').innerText = "Guardado às " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function loadJournal() {
    const saved = localStorage.getItem('druid_journal_content');
    if(saved) document.getElementById('journal-input').value = saved;
}

function clearJournal() {
    if(confirm("Tem certeza que deseja limpar todo o conteúdo do diário?")) {
        document.getElementById('journal-input').value = '';
        localStorage.removeItem('druid_journal_content');
        showToast("Diário limpo.");
    }
}

function exportJournalTXT() {
    const content = document.getElementById('journal-input').value;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diario-druidico-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    showToast("Diário exportado em TXT.");
}

function exportBackupJSON() {
    const data = {
        journal: document.getElementById('journal-input').value,
        theme: localStorage.getItem('druid_app_theme'),
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-caminho-druidico-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
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
            if(data.theme) changeTheme(data.theme);
            showToast("Backup importado!");
        } catch(err) {
            showToast("Erro ao ler ficheiro JSON.");
        }
    };
    reader.readAsText(file);
}

let audioCtx = null, noiseNode = null;
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

function stopAmbientSound() {
    if (noiseNode) { noiseNode.stop(); noiseNode.disconnect(); noiseNode = null; }
    if (audioCtx) { audioCtx.close(); audioCtx = null; }
}

let breathInterval = null, isBreathing = false;
function toggleBreathing() {
    const btn = document.getElementById('btn-breath-toggle');
    const action = document.getElementById('breath-action');
    const timer = document.getElementById('breath-timer');
    const circle = document.getElementById('breath-circle');

    if (isBreathing) {
        clearInterval(breathInterval);
        isBreathing = false;
        btn.innerText = "Iniciar Ciclo de Respiração";
        action.innerText = "Preparar";
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
            if(phase === 0) { action.innerText = "Inalar (Ar)"; count = 4; circle.style.transform = "scale(1.25)"; }
            else if(phase === 1) { action.innerText = "Segurar (Fogo)"; count = 4; circle.style.transform = "scale(1.25)"; }
            else if(phase === 2) { action.innerText = "Exalar (Água)"; count = 4; circle.style.transform = "scale(1)"; }
            timer.innerText = count;
        }
    }

    action.innerText = "Inalar (Ar)";
    circle.style.transform = "scale(1.25)";
    breathInterval = setInterval(runBreath, 1000);
    showToast("Exercício de respiração Awen iniciado.");
}