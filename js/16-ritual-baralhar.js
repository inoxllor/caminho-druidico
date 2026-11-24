/* ============================================================
   Ritual de baralhar — o baralho é baralhado (Fisher–Yates com
   gerador criptográfico), cortado e aberto em leque; a pessoa
   escolhe as cartas, que são as que de facto estão nessas posições.
   ============================================================ */
(() => {
  const $ = id => document.getElementById(id);
  const KEY = 'druid_tarot_ritual';
  const isOn = () => { try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; } };
  window.setTarotRitual = on => { try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch {} const c = $('tarot-ritual-on'); if (c) c.checked = !!on; };
  document.addEventListener('DOMContentLoaded', () => { const c = $('tarot-ritual-on'); if (c) c.checked = isOn(); });

  // Inteiro aleatório uniforme em [0, n) — crypto quando disponível
  function randInt(n) {
    if (window.crypto?.getRandomValues) {
      const lim = Math.floor(0x100000000 / n) * n, b = new Uint32Array(1);
      do { crypto.getRandomValues(b); } while (b[0] >= lim);
      return b[0] % n;
    }
    return Math.floor(Math.random() * n);
  }
  const rand01 = () => randInt(1e6) / 1e6;
  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) { const j = randInt(i + 1); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    // Cada carta fica invertida com probabilidade de 35% (igual ao sorteio direto)
    deck.forEach(d => { d.isReversed = rand01() < 0.35; });
    return deck;
  }
  const vibrate = ms => { if (navigator.vibrate) try { navigator.vibrate(ms); } catch {} };
  const back = () => `<div class="tarot-static tr-card"><div class="tarot-card-back">${TAROT_BACK_HTML}</div></div>`;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  let state = null;
  const _draw = drawTarotCard;

  drawTarotCard = function (n) {
    if (!isOn() || window.__tarotChosen) return _draw(n);
    if (typeof activeTarotMode !== 'undefined' && activeTarotMode !== 'draw') { skipRecord = true; switchTarotMode('draw'); skipRecord = false; }
    const spread = TAROT_SPREADS[n] || TAROT_SPREADS[1];
    const pool = getFilteredNordicDeck();
    if (pool.length < spread.pos.length) return _draw(n);
    state = {
      n, spread,
      deck: pool.map(card => ({ card, isReversed: rand01() < 0.35 })),
      shuffles: 0, picked: [],
      question: ($('tarot-question')?.value || '').trim()
    };
    $('tarot-save-bar')?.classList.add('hidden');
    renderShuffle();
    shuffleNow();
  };

  function header() {
    return `<h3>${esc(state.spread.name)}</h3>${state.question ? `<p class="text-sm theme-muted -mt-2">“${esc(state.question)}”</p>` : ''}`;
  }

  function renderShuffle() {
    const c = $('tarot-card-container');
    c.classList.remove('draw-area');
    c.innerHTML = `<div class="tr-stage" id="tr-stage">
      ${header()}
      <p class="tr-hint" id="tr-hint">Respire fundo e concentre-se na pergunta enquanto o baralho é baralhado.</p>
      <div class="tr-deck" id="tr-deck" aria-hidden="true">${back().repeat(5)}</div>
      <div class="tr-actions">
        <button type="button" class="tr-btn" id="tr-shuffle" onclick="tarotRitualShuffle()">Baralhar de novo</button>
        <button type="button" class="tr-btn primary" id="tr-cut" onclick="tarotRitualCut()" disabled>Cortar e abrir o leque</button>
      </div>
      <button type="button" class="tr-skip" onclick="tarotRitualSkip()">Saltar o ritual e tirar ao acaso</button>
    </div>`;
  }

  function shuffleNow() {
    if (!state) return;
    shuffleDeck(state.deck);
    state.shuffles++;
    const deck = $('tr-deck'), btns = [$('tr-shuffle'), $('tr-cut')];
    btns.forEach(b => b && (b.disabled = true));
    vibrate([10, 40, 10, 40, 10]);
    const done = () => {
      deck?.classList.remove('is-shuffling');
      btns.forEach(b => b && (b.disabled = false));
      const h = $('tr-hint');
      if (h) h.innerHTML = `Baralhado <strong>${state.shuffles}×</strong>. Baralhe de novo quantas vezes sentir, depois corte o baralho.`;
    };
    if (!deck || reduced()) return done();
    deck.classList.remove('is-shuffling'); void deck.offsetWidth; deck.classList.add('is-shuffling');
    setTimeout(done, 1400);
  }
  window.tarotRitualShuffle = shuffleNow;

  window.tarotRitualSkip = function () {
    if (!state) return;
    const st = state; state = null;
    shuffleDeck(st.deck);
    window.__tarotChosen = st.deck.slice(0, st.spread.pos.length);
    _draw(st.n);
  };

  window.tarotRitualCut = function () {
    if (!state) return;
    // Corte: a parte de baixo passa para cima
    const cut = 1 + randInt(state.deck.length - 1);
    state.deck = state.deck.slice(cut).concat(state.deck.slice(0, cut));
    vibrate(15);
    renderFan();
  };

  function fanSize() { return innerWidth < 480 ? 13 : innerWidth < 900 ? 17 : 22; }

  function renderFan() {
    const c = $('tarot-card-container');
    const k = Math.min(fanSize(), state.deck.length);
    state.fan = state.deck.slice(0, k);
    state.picked = [];
    c.innerHTML = `<div class="tr-stage">
      ${header()}
      <p class="tr-hint" id="tr-hint" aria-live="polite"></p>
      <div class="tr-progress" id="tr-progress">${state.spread.pos.map(p => `<span>${esc(p[0])}</span>`).join('')}</div>
      <div class="tr-fan" id="tr-fan" role="group" aria-label="Leque de cartas viradas para baixo">
        ${state.fan.map((_, i) => `<button type="button" class="tr-pick" data-i="${i}" aria-pressed="false" aria-label="Carta ${i + 1} de ${k}" onclick="tarotRitualPick(${i})"><span class="tr-badge"></span>${back()}</button>`).join('')}
      </div>
      <div class="tr-actions">
        <button type="button" class="tr-btn" onclick="tarotRitualRestart()">Voltar a baralhar</button>
      </div>
    </div>`;
    layoutFan();
    updateFanUI();
  }

  function layoutFan() {
    const fan = $('tr-fan');
    if (!fan || !state?.fan) return;
    const W = fan.clientWidth, k = state.fan.length;
    const cw = Math.round(Math.max(56, Math.min(96, W / 5.2)));
    const ch = Math.round(cw * 8.2 / 5);
    const spreadDeg = innerWidth < 480 ? 40 : 54;
    // Cantos de cada carta após rodar em torno do pivô (50%, 120%) — para o leque caber inteiro
    const px = cw / 2, py = ch * 1.2;
    const cornerX = deg => {
      const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      const xs = [[0, 0], [cw, 0], [0, ch], [cw, ch]].map(([x, y]) => px + (x - px) * c - (y - py) * s);
      return [Math.min(...xs), Math.max(...xs)];
    };
    const [lMin] = cornerX(-spreadDeg / 2), [, rMax] = cornerX(spreadDeg / 2);
    const usable = Math.max(cw, W - 12 - (rMax - lMin));
    fan.style.height = (ch + 80) + 'px';
    fan.querySelectorAll('.tr-pick').forEach((b, i) => {
      const t = k === 1 ? 0 : i / (k - 1) - 0.5;
      const x = W / 2 + t * usable;
      b.style.setProperty('--cw', cw + 'px');
      b.style.setProperty('--rot', (t * spreadDeg).toFixed(2) + 'deg');
      b.style.setProperty('--dx', (W / 2 - x).toFixed(1) + 'px');
      b.style.setProperty('--i', i);
      b.style.left = (x - cw / 2).toFixed(1) + 'px';
      b.style.top = (36 + t * t * 70).toFixed(1) + 'px';
      b.style.width = cw + 'px'; b.style.height = ch + 'px';
      b.style.zIndex = b.classList.contains('is-picked') ? 50 : i + 1;
    });
  }
  let rT; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(layoutFan, 120); });

  function updateFanUI() {
    const need = state.spread.pos.length, got = state.picked.length;
    document.querySelectorAll('#tr-fan .tr-pick').forEach(b => {
      const idx = state.picked.indexOf(+b.dataset.i);
      b.classList.toggle('is-picked', idx >= 0);
      b.setAttribute('aria-pressed', idx >= 0);
      b.querySelector('.tr-badge').textContent = idx >= 0 ? idx + 1 : '';
      b.style.zIndex = idx >= 0 ? 50 : +b.dataset.i + 1;
    });
    document.querySelectorAll('#tr-progress span').forEach((s, i) => s.classList.toggle('is-on', i < got));
    const h = $('tr-hint');
    if (h) h.innerHTML = got < need
      ? `Escolha ${need === 1 ? 'uma carta' : need + ' cartas'} do leque, guiando-se pela intuição. ${need > 1 ? `Próxima: <strong>${esc(state.spread.pos[got][0])}</strong>.` : ''}`
      : 'As cartas foram escolhidas…';
  }

  window.tarotRitualPick = function (i) {
    if (!state || state.locked) return;
    const at = state.picked.indexOf(i);
    if (at >= 0) state.picked.splice(at, 1);           // tocar de novo desfaz a escolha
    else if (state.picked.length < state.spread.pos.length) { state.picked.push(i); vibrate(12); }
    updateFanUI();
    if (state.picked.length === state.spread.pos.length) {
      state.locked = true;
      $('tr-fan')?.classList.add('is-done');
      const st = state;
      setTimeout(() => {
        if (state !== st) return;
        state = null;
        window.__tarotChosen = st.picked.map(idx => st.fan[idx]);
        _draw(st.n);
        document.getElementById('tarot-card-container')?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
      }, reduced() ? 150 : 900);
    }
  };

  window.tarotRitualRestart = function () {
    if (!state) return;
    state.picked = []; state.locked = false; state.shuffles = 0;
    renderShuffle(); shuffleNow();
  };

  // Ao mudar para o Grimório e voltar, um ritual a meio é descartado
  const _stm = switchTarotMode;
  switchTarotMode = function (m) { if (m !== 'draw') state = null; _stm(m); };
})();
