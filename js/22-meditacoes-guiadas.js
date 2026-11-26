/* ============================================================
   Meditações guiadas com áudio: texto passo a passo, narração
   pela voz do sistema (português), sino no início e no fim e
   paisagem sonora opcional. Tudo funciona sem rede.
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const esc = window.esc || (s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sem armazenamento */ } }
};

/** Letra Ogham do dia: igual para todo o dia, muda à meia-noite. */
function oghamOfDay(date = new Date()) {
  const data = typeof OGHAM_DATA !== 'undefined' ? OGHAM_DATA : [];
  if (!data.length) return null;
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 864e5);
  return data[day % data.length];
}

// Cada passo: texto narrado e segundos de silêncio depois dele.
const MEDITATIONS = [
  {
    id: 'nemeton', grade: 'todos', title: 'A clareira do Nemeton', theme: 'Santuário interior',
    desc: 'Visualização do bosque sagrado interior, o lugar de paz a que pode voltar sempre que precisar.',
    steps: [
      ['Sente-se confortavelmente, com as costas direitas e os pés bem assentes no chão. Feche os olhos devagar.', 12],
      ['Inspire pelo nariz, contando até quatro. Expire pela boca, contando até seis. Mais uma vez, com calma.', 20],
      ['Deixe que o corpo fique pesado e quente. Os ombros descem, o maxilar solta-se, a testa fica lisa.', 20],
      ['Imagine-se à entrada de um bosque antigo. É de manhã cedo e há uma névoa leve entre as árvores.', 20],
      ['Siga um carreiro estreito de terra macia. Ouça os seus passos, o canto dos pássaros, o vento nas copas.', 30],
      ['O carreiro abre-se numa clareira redonda, iluminada pelo sol. Este é o seu Nemeton, o seu santuário.', 25],
      ['Repare no que está à sua volta. Que árvores rodeiam a clareira? Há água por perto? Que cheiro tem o ar?', 45],
      ['No centro há uma pedra ou um tronco onde se pode sentar. Sente-se e descanse. Aqui está em segurança.', 45],
      ['Se quiser, faça uma pergunta ao bosque. Não procure a resposta. Deixe-a chegar como uma imagem, um som ou uma sensação.', 60],
      ['Agradeça ao lugar. Saiba que pode voltar aqui sempre que quiser.', 15],
      ['Regresse pelo mesmo carreiro, sem pressa, até à entrada do bosque.', 20],
      ['Sinta de novo o peso do corpo e o chão debaixo dos pés. Mexa os dedos das mãos e dos pés.', 12],
      ['Quando estiver pronto, abra os olhos. Que a paz do bosque fique consigo.', 6]
    ]
  },
  {
    id: 'arvore', grade: 'ovate', title: 'A árvore: enraizar e elevar', theme: 'Terra e céu',
    desc: 'Exercício de enraizamento: raízes na terra, tronco firme, ramos abertos à luz.',
    steps: [
      ['De pé ou sentado, com a coluna direita, feche os olhos e respire fundo três vezes.', 18],
      ['Leve a atenção às plantas dos pés. Sinta o contacto com o chão.', 15],
      ['Imagine que dos seus pés nascem raízes. Descem pela terra, entre pedras e água, cada vez mais fundo.', 30],
      ['As raízes chegam ao calor do centro da terra. Ao inspirar, essa força sobe devagar pelas raízes até ao seu corpo.', 35],
      ['A força da terra enche as pernas, a bacia e o ventre. Sinta-se estável, como um tronco de carvalho.', 30],
      ['Agora imagine ramos a crescer dos seus ombros e da cabeça, a abrir-se para o céu.', 25],
      ['As folhas recebem a luz do sol, ou das estrelas. Ao inspirar, essa luz desce pelos ramos até ao coração.', 35],
      ['No coração, a força da terra e a luz do céu encontram-se. Fique um momento a sentir este equilíbrio.', 45],
      ['Lembre-se: tal como a árvore, pode dobrar-se com o vento sem quebrar.', 20],
      ['Recolha devagar os ramos e as raízes, deixando apenas um fio de ligação à terra.', 15],
      ['Respire fundo, mexa o corpo e abra os olhos.', 6]
    ]
  },
  {
    id: 'quadrantes', grade: 'todos', title: 'Os quatro quadrantes', theme: 'Ar, Fogo, Água, Terra',
    desc: 'Volta ao círculo pelos quatro pontos cardeais e pelos seus elementos, como na abertura de um ritual.',
    steps: [
      ['Feche os olhos e imagine-se no centro de um círculo de pedras, num campo aberto.', 15],
      ['Respire fundo. Declare em silêncio: que haja paz no Leste, no Sul, no Oeste e no Norte. Que haja paz em todo o mundo.', 20],
      ['Volte-se para o Leste. É a madrugada e a primavera. Sinta o Ar: a brisa fresca, a clareza da mente, o início de tudo.', 40],
      ['Volte-se para o Sul. É o meio-dia e o verão. Sinta o Fogo: o calor do sol, a coragem, a vontade que move.', 40],
      ['Volte-se para o Oeste. É o entardecer e o outono. Sinta a Água: o mar, as emoções, a intuição que flui.', 40],
      ['Volte-se para o Norte. É a meia-noite e o inverno. Sinta a Terra: as pedras, o corpo, o silêncio que sustenta.', 40],
      ['Regresse ao centro. Os quatro elementos estão em equilíbrio dentro de si.', 30],
      ['Agradeça a cada direção, pela ordem inversa: Norte, Oeste, Sul e Leste.', 20],
      ['Deixe o círculo desvanecer-se. Respire fundo e abra os olhos.', 6]
    ]
  },
  {
    id: 'awen', grade: 'bardo', title: 'Respiração e canto do Awen', theme: 'Inspiração',
    desc: 'Respiração tranquila seguida do canto do Awen (A-U-E-N), a inspiração sagrada da tradição bárdica.',
    steps: [
      ['Sente-se com conforto e feche os olhos.', 10],
      ['Inspire em quatro tempos, segure em quatro, expire em quatro e segure em quatro. Repita este quadrado algumas vezes.', 45],
      ['Visualize três raios de luz a descer do céu sobre si, como o símbolo do Awen.', 20],
      ['Vamos entoar o Awen três vezes. Inspire fundo e, ao expirar, cante devagar: Aaa, Uuu, Éééénnn.', 15],
      ['Segunda vez. Inspire fundo e cante: Aaa, Uuu, Éééénnn.', 15],
      ['Terceira vez. Inspire fundo e cante: Aaa, Uuu, Éééénnn.', 15],
      ['Fique em silêncio e sinta a vibração que ficou no corpo e no espaço à sua volta.', 45],
      ['Se surgir uma imagem, uma palavra ou um verso, guarde-o. Pode escrevê-lo no Caderno Bárdico.', 25],
      ['Respire normalmente e abra os olhos quando estiver pronto.', 6]
    ]
  },
  {
    id: 'ogham-dia', grade: 'ovate', title: 'A letra Ogham do dia', theme: 'Ogham', dynamic: true,
    desc: 'Contemplação da árvore e da letra Ogham de hoje.',
    build() {
      const o = oghamOfDay();
      if (!o) return [];
      const lore = (window.OGHAM_LORE || {})[o.name];
      const tree = o.tree.split('(')[0].trim();
      return [
        ['Feche os olhos e respire fundo três vezes, devagar.', 15],
        [`A letra de hoje é ${o.name}, a árvore ${tree}.`, 10],
        [`Imagine uma vara de madeira de ${tree.toLowerCase()} nas suas mãos. Sinta o peso, a textura da casca, o cheiro da madeira.`, 30],
        [`Na vara está gravada a letra ${o.name}: pequenos traços ao longo da aresta. Percorra-os com os dedos.`, 25],
        [`${o.name} fala de: ${o.meaning}`, 20],
        lore ? [`Os antigos chamavam-lhe ${lore.kenningPt}. Deixe esta imagem trabalhar em si.`, 30] : null,
        ['Pergunte a si mesmo: onde é que esta energia me faz falta hoje? Onde é que já está presente?', 45],
        ['Agradeça à árvore. Pouse a vara e respire fundo.', 15],
        ['Abra os olhos e leve a letra consigo ao longo do dia.', 6]
      ].filter(Boolean);
    }
  },
  {
    id: 'bardo-voz', grade: 'bardo', title: 'O bardo e a fonte', theme: 'Palavra e som',
    desc: 'O Bardo aprende a escutar antes de falar: a fonte da inspiração, a voz e a memória das histórias.',
    steps: [
      ['Sente-se direito, com os pés no chão, e feche os olhos. Respire três vezes, devagar.', 15],
      ['Imagine-se junto a uma fonte no meio de um prado ao amanhecer. A água sai da terra, fresca e clara.', 25],
      ['Escute o som da água. Repare como nunca se repete e nunca pára. Esta é a voz da inspiração.', 35],
      ['Debruce-se e beba um gole. Sinta a frescura descer pela garganta e espalhar-se pelo peito.', 25],
      ['Deixe que surja uma palavra, uma imagem ou um verso. Não o escolha: receba-o.', 45],
      ['Repita essa palavra em silêncio, devagar, três vezes. Sinta onde ressoa no corpo.', 30],
      ['Lembre-se de uma história que ouviu em criança. Quem a contava? Que voz tinha?', 40],
      ['Agradeça à fonte e aos que vieram antes de si e guardaram as histórias.', 15],
      ['Respire fundo, mexa os dedos e abra os olhos. Se quiser, escreva a palavra no Caderno bárdico.', 8]
    ]
  },
  {
    id: 'ovate-antepassados', grade: 'ovate', title: 'O caminho dos antepassados', theme: 'Tempo e cura',
    desc: 'O Ovate trabalha com o tempo, a cura e os antepassados: uma visita serena às raízes que o sustentam.',
    steps: [
      ['Feche os olhos e respire fundo. Sinta o peso do corpo a assentar.', 15],
      ['Imagine-se ao entardecer num bosque de teixos. A luz é dourada e o ar cheira a terra húmida.', 25],
      ['No chão há um carreiro de pedras antigas. Cada pedra é uma geração antes de si.', 25],
      ['Caminhe devagar sobre as pedras. Sinta atrás de si a fila dos que vieram antes: pais, avós, bisavós.', 40],
      ['Não precisa de os ver. Sinta apenas o apoio deles nas suas costas, como raízes de uma árvore.', 40],
      ['Pergunte: que dom recebi de vós? Deixe a resposta chegar sem pressa.', 50],
      ['Pergunte também: que peso posso pousar agora? Imagine-o a cair na terra, que o transforma.', 45],
      ['Agradeça aos antepassados. Volte pelo carreiro até ao início do bosque.', 20],
      ['Sinta o corpo, respire fundo e abra os olhos.', 8]
    ]
  },
  {
    id: 'druida-silencio', grade: 'druida', title: 'O silêncio do carvalho', theme: 'Visão e silêncio',
    desc: 'O Druida procura a visão que nasce do silêncio: uma contemplação longa, com poucas palavras e muito espaço.',
    steps: [
      ['Feche os olhos. Respire naturalmente e deixe o corpo imóvel.', 15],
      ['Imagine-se sentado sob um carvalho muito antigo, numa colina, numa noite sem lua e cheia de estrelas.', 30],
      ['Encoste as costas ao tronco. Sinta a árvore a ligar a terra profunda ao céu aberto.', 40],
      ['Não faça nada. Deixe os pensamentos passar como nuvens diante das estrelas.', 90],
      ['Repare no espaço entre dois pensamentos. Fique nesse espaço.', 90],
      ['Se surgir uma imagem ou uma compreensão, receba-a sem a agarrar.', 60],
      ['Lembre-se do juramento de servir a terra e os seres. O que pede ele de si nesta estação?', 45],
      ['Agradeça ao carvalho, às estrelas e ao silêncio.', 15],
      ['Respire fundo, sinta o corpo e abra os olhos devagar.', 8]
    ]
  }
];
const GRADES = [['todas', 'Todas'], ['bardo', 'Bardo'], ['ovate', 'Ovate'], ['druida', 'Druida']];
const GRADE_LABEL = { todos: 'Todos os graus', bardo: 'Bardo', ovate: 'Ovate', druida: 'Druida' };

const stepsOf = m => (m.dynamic ? m.build() : m.steps);
const totalSecs = m => stepsOf(m).reduce((t, [txt, s]) => t + s + Math.ceil(txt.split(/\s+/).length / 2.2), 0);
const fmt = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

/* ——— Voz ——— */
const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
let voice = null;
function pickVoice() {
  if (!synth) return null;
  const vs = synth.getVoices();
  // Voz no idioma da app (pt-PT ou en-GB)
  const [lg, rg] = (window.APP_LANG || 'pt-PT').split('-');
  voice = vs.find(v => new RegExp(`^${lg}[-_]${rg}`, 'i').test(v.lang)) || vs.find(v => new RegExp(`^${lg}`, 'i').test(v.lang)) || null;
  updateVoiceNote();
  return voice;
}
if (synth) { pickVoice(); synth.addEventListener?.('voiceschanged', pickVoice); }

function speak(text) {
  return new Promise(resolve => {
    if (!synth || !state.voiceOn) return resolve();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voice ? voice.lang : (window.APP_LANG || 'pt-PT');
    if (voice) u.voice = voice;
    u.rate = state.rate; u.pitch = 0.95;
    let done = false;
    const end = () => { if (!done) { done = true; resolve(); } };
    u.onend = end; u.onerror = end;
    // Segurança: alguns navegadores não disparam «onend»
    setTimeout(end, 1000 + text.length * 120 / state.rate);
    synth.speak(u);
  });
}

/* ——— Fundo sonoro ——— */
function startBackground() {
  const bg = state.bg;
  try {
    if (bg === 'rain' || bg === 'wind') toggleAmbientSound(bg);
    else if (bg === 'drone') toggleVocalDrone(136.1, 'Om / Terra (136.1 Hz)');
  } catch (e) { /* áudio indisponível */ }
}
function stopBackground() { try { if (state.bg !== 'none') stopAmbientSound(); } catch (e) { /* nada */ } }
function bell() { try { playSacredBell(); } catch (e) { /* áudio indisponível */ } }

/* ——— Estado e motor ——— */
const state = {
  current: null, steps: [], index: 0, running: false, run: 0, elapsed: 0, total: 0,
  voiceOn: store.get('druid_med_voice', true), rate: store.get('druid_med_rate', 0.9), bg: store.get('druid_med_bg', 'none'),
  wakeLock: null
};
const sleep = (ms, run) => new Promise(res => {
  const t0 = Date.now();
  const tick = () => {
    if (run !== state.run) return res(false);
    if (Date.now() - t0 >= ms) return res(true);
    setTimeout(tick, Math.min(250, ms));
  };
  tick();
});

async function playFrom(index) {
  const run = ++state.run;
  state.running = true; renderControls();
  try { state.wakeLock = await navigator.wakeLock?.request('screen'); } catch (e) { state.wakeLock = null; }
  for (let i = index; i < state.steps.length; i++) {
    if (run !== state.run) return;
    state.index = i;
    const [text, secs] = state.steps[i];
    showStep(text, i);
    await speak(text);
    if (run !== state.run) return;
    // window.__medSpeed só é usado pelos testes automáticos para acelerar as pausas
    if (!(await sleep(secs * 1000 * (window.__medSpeed || 1), run))) return;
  }
  if (run !== state.run) return;
  finish(true);
}

function showStep(text, i) {
  const el = $('gm-step');
  if (el) { el.textContent = text; el.classList.remove('gm-fade'); void el.offsetWidth; el.classList.add('gm-fade'); }
  const bar = $('gm-progress-bar');
  if (bar) bar.style.width = `${Math.round(100 * i / Math.max(1, state.steps.length))}%`;
  const lbl = $('gm-progress-label');
  if (lbl) lbl.textContent = `Passo ${i + 1} de ${state.steps.length}`;
}

function start(id) {
  stop(false);
  const m = MEDITATIONS.find(x => x.id === id) || state.current || MEDITATIONS[0];
  state.current = m;
  state.steps = stepsOf(m);
  state.index = 0;
  selectCard(m.id);
  bell(); startBackground();
  playFrom(0);
}

function pause() {
  if (!state.running) return;
  state.run++; state.running = false;
  synth?.cancel();
  releaseWake();
  renderControls();
  const lbl = $('gm-progress-label');
  if (lbl) lbl.textContent = `Em pausa · passo ${state.index + 1} de ${state.steps.length}`;
}
function resume() { if (!state.running && state.current && state.steps.length) playFrom(state.index); }

function stop(resetText = true) {
  const wasActive = state.running || state.index > 0;
  state.run++; state.running = false; state.index = 0;
  synth?.cancel();
  if (wasActive) stopBackground();
  releaseWake();
  renderControls();
  if (resetText) {
    const el = $('gm-step'); if (el) el.textContent = 'Escolha uma meditação e carregue em Iniciar.';
    const bar = $('gm-progress-bar'); if (bar) bar.style.width = '0%';
    const lbl = $('gm-progress-label'); if (lbl) lbl.textContent = '';
  }
}

function finish() {
  state.running = false; state.index = 0; state.run++;
  bell(); stopBackground(); releaseWake();
  const bar = $('gm-progress-bar'); if (bar) bar.style.width = '100%';
  const lbl = $('gm-progress-label'); if (lbl) lbl.textContent = 'Concluída';
  const log = store.get('druid_med_log', []);
  log.push({ id: state.current.id, at: new Date().toISOString() });
  store.set('druid_med_log', log.slice(-200));
  renderControls();
  renderCount();
  if (typeof showToast === 'function') showToast(`Meditação concluída: ${state.current.title}`);
}

function releaseWake() { try { state.wakeLock?.release(); } catch (e) { /* nada */ } state.wakeLock = null; }

/* ——— Interface ——— */
function selectCard(id) {
  document.querySelectorAll('#gm-list .gm-item').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === id)));
  const m = MEDITATIONS.find(x => x.id === id);
  if (!m) return;
  state.current = m;
  const d = $('gm-desc');
  if (d) d.textContent = m.desc + (m.id === 'ogham-dia' && oghamOfDay() ? ` Hoje: ${oghamOfDay().symbol} ${oghamOfDay().name}.` : '');
  store.set('druid_med_last', id);
}

function renderControls() {
  const play = $('gm-play'), stopB = $('gm-stop');
  if (!play) return;
  const paused = !state.running && state.index > 0;
  play.textContent = state.running ? 'Pausar' : paused ? 'Continuar' : 'Iniciar';
  play.setAttribute('aria-label', play.textContent + ' meditação');
  stopB.disabled = !state.running && !paused;
}

function updateVoiceNote() {
  const n = $('gm-voice-note');
  if (!n) return;
  if (!synth) n.textContent = 'Este navegador não tem voz sintetizada: siga o texto no ecrã.';
  else if (!voice) n.textContent = 'Não foi encontrada uma voz em português neste dispositivo: a narração pode soar estrangeira. Pode desligá-la e seguir o texto.';
  else n.textContent = `Voz: ${voice.name}`;
}

function renderCount() {
  const el = $('gm-count');
  if (!el) return;
  const n = store.get('druid_med_log', []).length;
  el.textContent = n ? `Meditações concluídas: ${n}` : '';
}

function renderPanel() {
  const host = $('tab-grounding');
  if (!host || $('guided-meditations')) return;
  const panel = document.createElement('div');
  panel.id = 'guided-meditations';
  panel.className = 'theme-card border rounded-2xl p-6 lg:p-8 space-y-5';
  panel.innerHTML = `
    <div>
      <div class="eyebrow">Meditações guiadas</div>
      <h2 class="font-cinzel text-xl lg:text-2xl font-bold theme-title mt-1">Caminhos para o silêncio</h2>
      <p class="text-sm theme-muted mt-1">Escolha uma meditação. O texto aparece passo a passo e pode ser lido em voz alta pelo dispositivo, com um sino no início e no fim.</p>
    </div>
    <div class="gm-grades" role="group" aria-label="Filtrar por grau da OBOD">
      ${GRADES.map(([g, l]) => `<button type="button" class="gm-grade" data-grade="${g}" aria-pressed="false">${l}</button>`).join('')}
    </div>
    <div id="gm-list" class="gm-list" role="group" aria-label="Meditações">
      ${MEDITATIONS.map(m => `
        <button type="button" class="gm-item theme-inner border rounded-xl p-3 text-left cursor-pointer" data-id="${m.id}" data-grade="${m.grade || 'todos'}" aria-pressed="false">
          <span class="gm-grade-tag">${esc(GRADE_LABEL[m.grade || 'todos'])}</span>
          <span class="text-[11px] uppercase tracking-widest theme-accent font-semibold block">${esc(m.theme)}</span>
          <b class="font-cinzel theme-title block">${esc(m.title)}</b>
          <span class="text-xs theme-muted">cerca de ${Math.max(1, Math.round(totalSecs(m) / 60))} min</span>
        </button>`).join('')}
    </div>
    <p id="gm-desc" class="text-sm theme-muted"></p>
    <div class="theme-inner border rounded-xl p-5 space-y-4">
      <p id="gm-step" class="gm-step theme-title" aria-live="polite">Escolha uma meditação e carregue em Iniciar.</p>
      <div class="gm-progress" aria-hidden="true"><div id="gm-progress-bar" class="gm-progress-bar"></div></div>
      <p id="gm-progress-label" class="text-xs theme-muted text-center"></p>
      <div class="flex flex-wrap justify-center gap-2">
        <button type="button" id="gm-play" class="bg-[var(--btn-primary)] text-[var(--on-primary)] font-bold py-2.5 px-6 rounded-lg cursor-pointer">Iniciar</button>
        <button type="button" id="gm-stop" class="theme-card border font-semibold py-2.5 px-4 rounded-lg text-sm cursor-pointer" disabled>Parar</button>
      </div>
    </div>
    <div class="gm-settings text-sm">
      <label class="study-check"><input type="checkbox" id="gm-voice"> Narração em voz alta</label>
      <label>Velocidade da voz
        <select id="gm-rate" class="theme-inner border rounded-lg px-2 py-1 text-sm">
          <option value="0.8">Lenta</option><option value="0.9">Calma</option><option value="1">Normal</option>
        </select></label>
      <label>Fundo sonoro
        <select id="gm-bg" class="theme-inner border rounded-lg px-2 py-1 text-sm">
          <option value="none">Silêncio</option><option value="rain">Chuva suave</option><option value="wind">Vento no bosque</option><option value="drone">Drone da Terra</option>
        </select></label>
    </div>
    <p id="gm-voice-note" class="text-xs theme-muted"></p>
    <p id="gm-count" class="text-xs theme-muted"></p>`;
  host.appendChild(panel);

  panel.querySelectorAll('.gm-item').forEach(b => b.addEventListener('click', () => {
    if (state.running || state.index > 0) stop();
    selectCard(b.dataset.id);
  }));
  $('gm-play').addEventListener('click', () => {
    if (state.running) pause();
    else if (state.index > 0) resume();
    else start(state.current ? state.current.id : MEDITATIONS[0].id);
  });
  $('gm-stop').addEventListener('click', () => stop());
  const setGrade = g => {
    store.set('druid_med_grade', g);
    panel.querySelectorAll('.gm-grade').forEach(b => b.setAttribute('aria-pressed', b.dataset.grade === g));
    panel.querySelectorAll('.gm-item').forEach(b => { b.hidden = !(g === 'todas' || b.dataset.grade === g || b.dataset.grade === 'todos'); });
  };
  panel.querySelectorAll('.gm-grade').forEach(b => b.addEventListener('click', () => setGrade(b.dataset.grade)));
  setGrade(store.get('druid_med_grade', 'todas'));
  const v = $('gm-voice'), r = $('gm-rate'), bg = $('gm-bg');
  v.checked = state.voiceOn; r.value = String(state.rate); bg.value = state.bg;
  v.addEventListener('change', () => { state.voiceOn = v.checked; store.set('druid_med_voice', v.checked); if (!v.checked) synth?.cancel(); });
  r.addEventListener('change', () => { state.rate = Number(r.value); store.set('druid_med_rate', state.rate); });
  bg.addEventListener('change', () => {
    const was = state.running || state.index > 0;
    if (was) stopBackground();
    state.bg = bg.value; store.set('druid_med_bg', state.bg);
    if (was) startBackground();
  });
  selectCard(store.get('druid_med_last', MEDITATIONS[0].id));
  updateVoiceNote(); renderCount(); renderControls();
}

// Parar ao sair do separador
const prevSwitch = window.switchTab;
if (typeof prevSwitch === 'function') {
  window.switchTab = function (id) {
    if (id !== 'grounding' && (state.running || state.index > 0)) stop();
    return prevSwitch.apply(this, arguments);
  };
}

window.GuidedMeditations = { list: MEDITATIONS, start, pause, resume, stop, oghamOfDay, state };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderPanel); else renderPanel();
})();
