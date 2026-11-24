/* ============================================================
   TAROT v3: tiragens e pesquisa
   ============================================================ */
const TAROT_SPREADS = {
    1: { name: 'Oráculo de Odin', cols: 'grid-cols-1 max-w-xs mx-auto', pos: [['Oráculo de Odin', 'O conselho central para este momento.']] },
    3: { name: 'As Três Nornas', cols: 'grid-cols-1 md:grid-cols-3', pos: [['Urd (passado)', 'O que o trouxe até aqui.'], ['Verdandi (presente)', 'O que se desenrola agora.'], ['Skuld (futuro)', 'O que se está a formar.']] },
    5: { name: 'Cruz Elemental', cols: 'grid-cols-1 sm:grid-cols-2 spread-cross', pos: [['Centro (situação)', 'O tema que une todas as cartas.'], ['Norte (desafios)', 'O que é preciso enraizar.'], ['Leste (conselho)', 'A ideia a ouvir.'], ['Sul (força)', 'A energia ao seu dispor.'], ['Oeste (desfecho)', 'O que o tempo trará.']] }
};
let lastTarotMeta = { question: '', spread: '' };
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
    const spread = TAROT_SPREADS[count] || TAROT_SPREADS[1];
    const pool = [...getFilteredNordicDeck()];
    const drawn = [];
    const chosen = window.__tarotChosen; window.__tarotChosen = null; // cartas escolhidas no ritual de baralhar
    if (chosen && chosen.length) {
        chosen.slice(0, spread.pos.length).forEach((c, i) => drawn.push({ card: c.card, isReversed: c.isReversed, pos: spread.pos[i][0] }));
    } else {
        for (let i = 0; i < spread.pos.length && pool.length; i++) {
            const card = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
            drawn.push({ card, isReversed: Math.random() < 0.35, pos: spread.pos[i][0] });
        }
    }
    lastTarotReading = drawn;
    lastTarotMeta = { question: (document.getElementById('tarot-question')?.value || '').trim(), spread: spread.name };

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
            ${lastTarotMeta.question ? `<p class="text-sm theme-muted mt-1">“${esc(lastTarotMeta.question)}”</p>` : ''}</div>
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
