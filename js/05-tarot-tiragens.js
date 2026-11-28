/* ============================================================
   TAROT v3: tiragens e pesquisa
   ============================================================ */
const TAROT_SPREADS = {
    1: { name: 'Oráculo de Odin', cols: 'grid-cols-1 max-w-xs mx-auto', pos: [['Oráculo de Odin', 'O conselho central para este momento.']] },
    3: { name: 'As Três Nornas', cols: 'grid-cols-1 md:grid-cols-3', pos: [['Urd (passado)', 'O que o trouxe até aqui.'], ['Verdandi (presente)', 'O que se desenrola agora.'], ['Skuld (futuro)', 'O que se está a formar.']] },
    5: { name: 'Cruz Elemental', cols: 'grid-cols-1 sm:grid-cols-2 spread-cross', pos: [['Centro (situação)', 'O tema que une todas as cartas.'], ['Norte (desafios)', 'O que é preciso enraizar.'], ['Leste (conselho)', 'A ideia a ouvir.'], ['Sul (força)', 'A energia ao seu dispor.'], ['Oeste (desfecho)', 'O que o tempo trará.']] },
    // Tiragens para leitores experientes (2026-11-28)
    celta: {
        name: 'Cruz Celta', cols: 'grid-cols-2 lg:grid-cols-4 spread-celtic',
        how: 'As cartas 1 e 2 são o centro: a situação e o que a atravessa. A cruz (3 a 6) dá a raiz, o passado recente, o objetivo consciente e o futuro próximo. O bastão (7 a 10) lê-se de baixo para cima: a sua atitude, o ambiente, esperanças e medos, e o desfecho provável.',
        pos: [['1 · Situação', 'O coração da questão.'], ['2 · O que atravessa', 'O desafio ou a força que cruza a situação.'], ['3 · Raiz', 'A base inconsciente, o que está por baixo.'], ['4 · Passado recente', 'O que está a sair de cena.'], ['5 · Coroa', 'O objetivo consciente, o melhor possível.'], ['6 · Futuro próximo', 'O que vem a seguir.'], ['7 · A sua atitude', 'Como se coloca perante a questão.'], ['8 · Ambiente', 'As pessoas e as circunstâncias à volta.'], ['9 · Esperanças e medos', 'O que deseja e o que teme, muitas vezes a mesma coisa.'], ['10 · Desfecho', 'A tendência se nada mudar.']]
    },
    ferradura: {
        name: 'Ferradura', cols: 'grid-cols-2 lg:grid-cols-4',
        how: 'Lê-se em arco, da esquerda para a direita, do passado ao desfecho. A carta do meio (4) é o obstáculo e muitas vezes a chave da leitura.',
        pos: [['1 · Passado', 'O que deu origem à situação.'], ['2 · Presente', 'Onde está agora.'], ['3 · Influências ocultas', 'O que ainda não vê.'], ['4 · Obstáculo', 'O nó a desatar.'], ['5 · Os outros', 'Como as outras pessoas veem ou pesam a questão.'], ['6 · Conselho', 'O que fazer.'], ['7 · Desfecho', 'Para onde tende, se seguir o conselho.']]
    },
    relacao: {
        name: 'Laço de Freyja', cols: 'grid-cols-2 lg:grid-cols-3',
        how: 'Leia 1 e 2 lado a lado, como espelhos; a 3 é o fio entre as duas pessoas. Pese a 4 contra a 5 e deixe a 6 dizer o que fazer com isso.',
        pos: [['1 · Você', 'Como está nesta relação.'], ['2 · A outra pessoa', 'Como ela está, tal como a leitura a mostra.'], ['3 · O laço', 'O que existe entre as duas pessoas agora.'], ['4 · O que une', 'A força em comum.'], ['5 · O que separa', 'O desafio ou a ferida.'], ['6 · Conselho', 'O passo que serve a relação.']]
    },
    roda: {
        name: 'Roda do Ano', cols: 'grid-cols-2 lg:grid-cols-4',
        how: 'Uma carta por festival, para o ano que começa no Samhain, o Ano Novo celta. Volte à carta de cada festival quando ele chegar.',
        pos: [['Samhain', 'O que deixar morrer; os antepassados.'], ['Yule', 'A luz que renasce; a esperança.'], ['Imbolc', 'O que começa a despertar.'], ['Ostara', 'Equilíbrio e sementeira.'], ['Beltane', 'Paixão, fertilidade e união.'], ['Litha', 'O auge: onde vai brilhar.'], ['Lughnasadh', 'A primeira colheita; o esforço que rende.'], ['Mabon', 'Gratidão, balanço e partilha.']]
    },
    encruzilhada: {
        name: 'Encruzilhada', cols: 'grid-cols-2 lg:grid-cols-3',
        how: 'Antes de tirar, decida qual é o caminho A e qual é o B. Compare 2 e 3 com 4 e 5; a 1 lembra o que procura de facto e a 6 traz o que ainda não pesou.',
        pos: [['1 · Situação', 'Onde está e o que procura.'], ['2 · Caminho A', 'O que a primeira opção traz.'], ['3 · Desfecho de A', 'Onde a primeira opção leva.'], ['4 · Caminho B', 'O que a segunda opção traz.'], ['5 · Desfecho de B', 'Onde a segunda opção leva.'], ['6 · O que falta saber', 'O fator que ainda não considerou.']]
    }
};
let lastTarotMeta = { question: '', spread: '', key: 1, sig: '' };
let tarotQuery = '';
let skipRecord = false;

getFilteredNordicDeck = function () {
    const base = activeTarotFilter === 'all' ? NORDIC_TAROT_DECK : NORDIC_TAROT_DECK.filter(c => c.suit === activeTarotFilter);
    const q = tarotQuery.trim().toLowerCase();
    return q.length < 2 ? base : base.filter(c => `${c.name} ${c.title} ${c.realm} ${c.upright}`.toLowerCase().includes(q));
};
function setTarotQuery(v) { tarotQuery = v; if (activeTarotMode === 'gallery') renderTarotGallery(); }
const _switchTarotMode = switchTarotMode;
switchTarotMode = function (m) {
    _switchTarotMode(m);
    document.getElementById('tarot-search-wrap').classList.toggle('hidden', m !== 'gallery');
};

drawTarotCard = function (count) {
    if (activeTarotMode !== 'draw') { skipRecord = true; switchTarotMode('draw'); skipRecord = false; }
    const key = TAROT_SPREADS[count] ? count : 1;
    const spread = TAROT_SPREADS[key];
    const sig = window.tarotSigCard ? window.tarotSigCard() : null;
    const pool = [...getFilteredNordicDeck()];
    const drawn = [];
    const chosen = window.__tarotChosen; window.__tarotChosen = null; // cartas escolhidas no ritual de baralhar
    if (chosen && chosen.length) {
        chosen.slice(0, spread.pos.length).forEach((c, i) => drawn.push({ card: c.card, isReversed: c.isReversed, pos: spread.pos[i][0], hint: spread.pos[i][1] }));
    } else {
        for (let i = 0; i < spread.pos.length && pool.length; i++) {
            const card = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
            drawn.push({ card, isReversed: Math.random() < (window.tarotRevChance ? tarotRevChance() : 0.35), pos: spread.pos[i][0], hint: spread.pos[i][1] });
        }
    }
    lastTarotReading = drawn;
    lastTarotMeta = { question: (document.getElementById('tarot-question')?.value || '').trim(), spread: spread.name, key, sig: sig ? sig.id : '' };

    const slots = drawn.map((it, i) => {
        let html = buildPixelCardHTML(it.card, it.isReversed, '')
            .replace('tarot-flip-wrapper is-flipped cursor-pointer', 'tarot-flip-wrapper cursor-pointer')
            .replace(`onclick="this.classList.toggle('is-flipped')"`, `onclick="flipTarot(this)" role="button" tabindex="0" aria-label="Revelar carta ${i + 1}"`)
            .replace('class="tarot-meaning ', 'class="tarot-meaning hidden ');
        return `<div data-tarot-slot class="flex flex-col items-center gap-2">
            <div class="text-center max-w-[230px]"><span class="text-sm font-semibold theme-accent">${spread.pos[i][0]}</span>
            <p class="text-xs theme-muted leading-snug">${spread.pos[i][1]}</p></div>${html}</div>`;
    }).join('');

    document.getElementById('tarot-card-container').innerHTML = `
        <div class="w-full space-y-5">
            <div class="text-center"><h3 class="font-cinzel text-base font-bold theme-title">${spread.name}</h3>
            ${lastTarotMeta.question ? `<p class="text-sm theme-muted mt-1">“${esc(lastTarotMeta.question)}”</p>` : ''}
            ${spread.how ? `<p class="text-xs theme-muted mt-2 max-w-2xl mx-auto leading-relaxed">${spread.how}</p>` : ''}</div>
            ${sig ? `<div class="tarot-sig flex flex-col items-center gap-2"><div class="text-center max-w-[230px]"><span class="text-sm font-semibold theme-accent">Significador</span>
            <p class="text-xs theme-muted leading-snug">A carta que escolheu para representar a pessoa ou a questão. Fica fora do baralho.</p></div>${buildPixelCardHTML(sig, false, '')}</div>` : ''}
            <div id="tarot-reveal-bar" class="flex items-center justify-center gap-3 text-sm theme-muted">
                <span id="tarot-reveal-count"></span>
                <button type="button" onclick="revealAllTarot()" class="theme-accent font-semibold underline cursor-pointer">Revelar todas</button>
            </div>
            <div class="grid ${spread.cols} gap-5 w-full items-start justify-center">${slots}</div>
        </div>`;
    document.getElementById('tarot-save-bar').classList.remove('hidden');
    updateTarotReveal();
    if (!skipRecord) recordReading('tarot');
};

function flipTarot(el) {
    el.classList.toggle('is-flipped');
    const m = el.closest('[data-tarot-slot]')?.querySelector('.tarot-meaning');
    if (m) m.classList.toggle('hidden', !el.classList.contains('is-flipped'));
    updateTarotReveal();
}
function revealAllTarot() {
    document.querySelectorAll('#tarot-card-container [data-tarot-slot] .tarot-flip-wrapper').forEach(w => { if (!w.classList.contains('is-flipped')) flipTarot(w); });
}
function updateTarotReveal() {
    const w = [...document.querySelectorAll('#tarot-card-container [data-tarot-slot] .tarot-flip-wrapper')];
    if (!w.length) return;
    const done = w.filter(x => x.classList.contains('is-flipped')).length;
    document.getElementById('tarot-reveal-count').textContent = done === w.length ? 'Todas reveladas' : `${done} de ${w.length} reveladas. Toque numa carta para a virar.`;
    document.getElementById('tarot-reveal-bar').querySelector('button').classList.toggle('hidden', done === w.length);
}
