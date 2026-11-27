/* ============================================================
   Frequências dos chakras (Paisagem Sonora, em Meditação & som):
   - duas afinações para os 7 chakras: Solfeggio (396 a 963 Hz) e a
     Oitava cósmica de Hans Cousto (tons planetários, 126 a 221 Hz);
   - cada chakra com nome, nome em sânscrito, cor e frequência;
   - tom gerado com Web Audio (seno + 2.º harmónico suave, a
     «respirar» devagar), com entrada e saída suaves, sem cliques;
   - «Percorrer os 7 chakras»: da raiz à coroa, 1 a 3 min cada;
   - volume próprio (guardado neste aparelho);
   - iOS: o áudio só arranca com um toque e o interruptor de
     silêncio cala o Web Audio; pede-se a sessão «playback»
     (navigator.audioSession) ou, em iOS antigos, toca-se um <audio>
     silencioso em ciclo enquanto a frequência soa;
   - aviso: não substitui cuidados médicos.
   Usa audioCtx/initAudio/stopAmbientSound de js/03, por isso
   «Silenciar Áudio» e os outros sons param também a frequência.
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const EN = () => window.APP_LANG === 'en-GB';
const L = (pt, en) => (EN() ? en : pt);
const toast = m => { if (typeof showToast === 'function') showToast(m); };
const VOL_KEY = 'druid_chakra_vol', SET_KEY = 'druid_chakra_set';
const get = (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
const put = (k, v) => { try { localStorage.setItem(k, v); } catch { /* sem armazenamento */ } };

/* Os 7 chakras, da raiz à coroa */
const CHAKRAS = [
  { id: 'raiz',    skt: 'Muladhara',    pt: 'Raiz',          en: 'Root',         color: '#c62f3a', ptT: 'Segurança e enraizamento',  enT: 'Safety and grounding' },
  { id: 'sacro',   skt: 'Svadhisthana', pt: 'Sacro',         en: 'Sacral',       color: '#e8782a', ptT: 'Criatividade e emoções',    enT: 'Creativity and emotions' },
  { id: 'plexo',   skt: 'Manipura',     pt: 'Plexo Solar',   en: 'Solar Plexus', color: '#e9b824', ptT: 'Vontade e confiança',       enT: 'Will and confidence' },
  { id: 'coracao', skt: 'Anahata',      pt: 'Coração',       en: 'Heart',        color: '#3f9b4f', ptT: 'Amor e compaixão',          enT: 'Love and compassion' },
  { id: 'garganta',skt: 'Vishuddha',    pt: 'Garganta',      en: 'Throat',       color: '#2e86c9', ptT: 'Expressão e verdade',       enT: 'Expression and truth' },
  { id: 'terceiro',skt: 'Ajna',         pt: 'Terceiro Olho', en: 'Third Eye',    color: '#4a3fa3', ptT: 'Intuição e visão',          enT: 'Intuition and insight' },
  { id: 'coroa',   skt: 'Sahasrara',    pt: 'Coroa',         en: 'Crown',        color: '#9257d6', ptT: 'Ligação ao todo',           enT: 'Connection to the whole' }
];

/* Duas afinações: frequência por chakra (mesma ordem) */
const SETS = {
  solfeggio: {
    pt: 'Solfeggio', en: 'Solfeggio',
    ptD: 'As sete frequências Solfeggio, da raiz (396 Hz) à coroa (963 Hz).',
    enD: 'The seven Solfeggio frequencies, from root (396 Hz) to crown (963 Hz).',
    hz: [396, 417, 528, 639, 741, 852, 963]
  },
  cosmica: {
    pt: 'Oitava cósmica', en: 'Cosmic octave',
    ptD: 'Tons planetários de Hans Cousto: Dia da Terra, Lua, Sol, Ano da Terra (o «Om»), Mercúrio, Vénus e Ano platónico. São graves: use auscultadores.',
    enD: 'Hans Cousto’s planetary tones: Earth day, Moon, Sun, Earth year (the “Om”), Mercury, Venus and Platonic year. They are low: use headphones.',
    hz: [194.18, 210.42, 126.22, 136.10, 141.27, 221.23, 172.06]
  }
};

let setKey = SETS[get(SET_KEY)] ? get(SET_KEY) : 'solfeggio';
let vol = Math.min(1, Math.max(0, parseFloat(get(VOL_KEY, '0.6')) || 0.6));
let current = null;      // { idx, out } da frequência a soar
let seq = null;          // { idx, mins, timer } do percurso
let internal = false;    // paragem pedida por este módulo (para trocar de tom)
let wakeLock = null;

const hz = i => SETS[setKey].hz[i];
const fmt = f => (Number.isInteger(f) ? String(f) : f.toFixed(2).replace(/0$/, '')) + ' Hz';
const name = c => L(c.pt, c.en);
const level = () => 0.22 * vol ** 1.5;   // curva de volume suave; nunca alto

/* ——— iOS: desbloquear o áudio e ignorar o interruptor de silêncio ——— */
const IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let silentEl = null, primed = false;
function silentWavUrl() {
  // 0,5 s de silêncio, 8 kHz, 8 bits, mono
  const n = 4000, b = new Uint8Array(44 + n), v = new DataView(b.buffer);
  const s = (o, t) => [...t].forEach((c, i) => b[o + i] = c.charCodeAt(0));
  s(0, 'RIFF'); v.setUint32(4, 36 + n, true); s(8, 'WAVEfmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
  s(36, 'data'); v.setUint32(40, n, true); b.fill(128, 44);
  return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
}
function unlock() {
  try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch { /* sem API */ }
  if (typeof initAudio === 'function') initAudio();
  if (!audioCtx) return false;
  if (audioCtx.state !== 'running') audioCtx.resume().catch(() => {});
  if (!primed) {   // iOS antigo: um som vazio dentro do toque liberta o contexto
    try { const s = audioCtx.createBufferSource(); s.buffer = audioCtx.createBuffer(1, 1, 22050); s.connect(audioCtx.destination); s.start(0); } catch { /* nada */ }
    primed = true;
  }
  if (IOS && !navigator.audioSession) {
    try {
      if (!silentEl) { silentEl = new Audio(silentWavUrl()); silentEl.loop = true; silentEl.setAttribute('playsinline', ''); silentEl.preload = 'auto'; }
      silentEl.play().catch(() => {});
    } catch { /* nada */ }
  }
  return true;
}
function releaseSilent() { try { silentEl && silentEl.pause(); } catch { /* nada */ } }
// Se o iOS suspender o som (chamada, ecrã bloqueado), o próximo toque retoma
['touchend', 'click'].forEach(ev => document.addEventListener(ev, () => {
  if (current && audioCtx && audioCtx.state !== 'running') audioCtx.resume().catch(() => {});
}, { passive: true }));

/* ——— Tom ——— */
function startTone(idx) {
  if (!unlock()) return;
  internal = true;
  try { stopAmbientSound(); } finally { internal = false; }
  try { window.resetAmbientToggle && window.resetAmbientToggle(); } catch { /* nada */ }
  const ctx = audioCtx, t = ctx.currentTime, f = hz(idx);
  const out = ctx.createGain();
  out.gain.setValueAtTime(0, t);
  out.gain.linearRampToValueAtTime(level(), t + 1.5);
  out.connect(ctx.destination);
  // «Respiração» lenta: o volume oscila ±12 % a cada ~12 s
  const breath = ctx.createGain(); breath.gain.value = 0.88; breath.connect(out);
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
  const depth = ctx.createGain(); depth.gain.value = 0.12; lfo.connect(depth); depth.connect(breath.gain);
  const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = f; o1.connect(breath);
  // 2.º harmónico discreto: ajuda os tons graves a ouvir-se no altifalante do telemóvel
  const h = ctx.createGain(); h.gain.value = f < 300 ? 0.18 : 0.08; h.connect(breath);
  const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2; o2.connect(h);
  [o1, o2, lfo].forEach(o => o.start(t));
  const oscs = [o1, o2, lfo];
  activeSoundNode = {
    stop() {
      const n = ctx.currentTime;
      try { out.gain.cancelScheduledValues(n); out.gain.setValueAtTime(out.gain.value, n); out.gain.linearRampToValueAtTime(0, n + 0.4); } catch { /* nada */ }
      oscs.forEach(o => { try { o.stop(n + 0.45); } catch { /* nada */ } });
    },
    disconnect() { setTimeout(() => { try { out.disconnect(); } catch { /* nada */ } }, 600); }
  };
  activeGainNode = null;   // a saída é desligada acima, depois do fade
  current = { idx, out };
  paint();
  const c = CHAKRAS[idx];
  toast(L(`Frequência: ${c.pt} · ${fmt(f)}`, `Frequency: ${c.en} · ${fmt(f)}`));
}

/* ——— Percorrer os 7 chakras ——— */
async function keepAwake(on) {
  try {
    if (on && !wakeLock && 'wakeLock' in navigator) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release', () => { wakeLock = null; }); }
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* nada */ }
}
function seqStep() {
  if (!seq) return;
  if (seq.idx >= CHAKRAS.length) { stopAmbientSound(); toast(L('Percurso dos chakras concluído', 'Chakra journey complete')); return; }
  startTone(seq.idx);
  seq.timer = setTimeout(() => { if (seq) { seq.idx++; seqStep(); } }, seq.mins * 60000);
  paint();
}
function startSeq() {
  const mins = +($('ck-mins')?.value || 1);
  if (!unlock()) return;
  endSeq();
  seq = { idx: 0, mins, timer: null };
  keepAwake(true);
  seqStep();
}
function endSeq() {
  if (seq) clearTimeout(seq.timer);
  seq = null;
  keepAwake(false);
}

/* «Silenciar Áudio», a chuva, o vento, os drones e as meditações passam
   todos por stopAmbientSound: aí se limpa o estado das frequências. */
const baseStop = stopAmbientSound;
stopAmbientSound = function () {
  baseStop();
  if (internal) return;
  const was = current || seq;
  current = null; endSeq(); releaseSilent();
  if (was) paint();
};

/* ——— Interface ——— */
function paint() {
  const box = $('chakra-freqs'); if (!box) return;
  box.querySelectorAll('.ck-item').forEach((b, i) => {
    const on = !!current && current.idx === i;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.querySelector('.ck-hz').textContent = fmt(hz(i));
  });
  box.querySelectorAll('.ck-set').forEach(b => b.setAttribute('aria-pressed', b.dataset.set === setKey ? 'true' : 'false'));
  const d = $('ck-set-desc'); if (d) d.textContent = L(SETS[setKey].ptD, SETS[setKey].enD);
  const sb = $('ck-seq'); if (sb) sb.textContent = seq ? L('Parar o percurso', 'Stop the journey') : L('Percorrer os 7 chakras', 'Journey through the 7 chakras');
  const st = $('ck-status');
  if (st) {
    if (seq && current) { const c = CHAKRAS[current.idx]; st.textContent = L(`Chakra ${current.idx + 1} de 7 · ${c.pt} · ${fmt(hz(current.idx))}`, `Chakra ${current.idx + 1} of 7 · ${c.en} · ${fmt(hz(current.idx))}`); }
    else if (current) { const c = CHAKRAS[current.idx]; st.textContent = L(`A soar: ${c.pt} · ${fmt(hz(current.idx))}`, `Playing: ${c.en} · ${fmt(hz(current.idx))}`); }
    else st.textContent = '';
  }
}

function render() {
  const host = $('tab-grounding');
  if (!host || $('chakra-freqs')) return;
  const stopBtn = host.querySelector('button[onclick="stopAmbientSound()"]');
  const anchor = stopBtn ? stopBtn.parentElement : null;
  if (!anchor) return;
  const box = document.createElement('div');
  box.id = 'chakra-freqs';
  box.className = 'space-y-3 ck-box';
  box.innerHTML = `
    <span class="text-[11px] uppercase tracking-widest theme-accent font-semibold block">${L('Frequências dos Chakras', 'Chakra Frequencies')}</span>
    <div class="ck-sets" role="group" aria-label="${L('Afinação', 'Tuning')}">
      ${Object.entries(SETS).map(([k, s]) => `<button type="button" class="gm-grade ck-set" data-set="${k}" aria-pressed="false">${L(s.pt, s.en)}</button>`).join('')}
    </div>
    <p id="ck-set-desc" class="text-xs theme-muted"></p>
    <div class="ck-grid" role="group" aria-label="${L('Os sete chakras', 'The seven chakras')}">
      ${CHAKRAS.map((c, i) => `
        <button type="button" class="ck-item theme-inner border rounded-xl" data-i="${i}" aria-pressed="false" style="--ck:${c.color}">
          <span class="ck-dot" aria-hidden="true"></span>
          <span class="ck-txt">
            <b class="theme-title">${name(c)}</b>
            <span class="ck-skt theme-muted">${c.skt} · ${L(c.ptT, c.enT)}</span>
          </span>
          <span class="ck-hz theme-accent"></span>
        </button>`).join('')}
    </div>
    <div class="ck-controls">
      <label class="ck-vol text-xs theme-muted">${L('Volume', 'Volume')}
        <input id="ck-vol" type="range" min="0" max="1" step="0.05" value="${vol}" aria-label="${L('Volume das frequências', 'Frequency volume')}">
      </label>
      <label class="text-xs theme-muted">${L('Tempo por chakra', 'Time per chakra')}
        <select id="ck-mins" class="ck-select theme-inner border rounded-lg">
          <option value="1">1 min</option><option value="2">2 min</option><option value="3">3 min</option>
        </select>
      </label>
      <button type="button" id="ck-seq" class="ck-seq-btn border rounded-lg"></button>
    </div>
    <p id="ck-status" class="text-xs theme-accent" role="status" aria-live="polite"></p>
    <p class="ck-note text-[11px] theme-muted">${L(
      'Prática de relaxamento e meditação; não substitui cuidados médicos ou psicológicos. Use volume baixo e pare se sentir desconforto.',
      'A relaxation and meditation practice; it does not replace medical or psychological care. Keep the volume low and stop if you feel any discomfort.')}</p>`;
  anchor.parentElement.insertBefore(box, anchor);

  box.addEventListener('click', e => {
    const item = e.target.closest('.ck-item');
    if (item) {
      const i = +item.dataset.i;
      if (current && current.idx === i) { stopAmbientSound(); toast(L('Frequência parada', 'Frequency stopped')); }
      else { endSeq(); startTone(i); }
      return;
    }
    const s = e.target.closest('.ck-set');
    if (s) {
      setKey = s.dataset.set; put(SET_KEY, setKey);
      if (current) startTone(current.idx);   // o percurso continua no mesmo tempo
      paint();
      return;
    }
    if (e.target.closest('#ck-seq')) { if (seq) stopAmbientSound(); else startSeq(); }
  });
  $('ck-vol').addEventListener('input', e => {
    vol = +e.target.value; put(VOL_KEY, String(vol));
    if (current && audioCtx) { const n = audioCtx.currentTime; current.out.gain.cancelScheduledValues(n); current.out.gain.setTargetAtTime(level(), n, 0.08); }
  });
  paint();
}

window.ChakraSound = { CHAKRAS, SETS, play: i => { endSeq(); startTone(i); }, stop: () => stopAmbientSound(), state: () => ({ set: setKey, playing: current ? current.idx : null, journey: !!seq }) };

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
