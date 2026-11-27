/* v4: melhorias (astronomia exata, painel Hoje, acessibilidade, ecrã sempre ligado) */
(() => {
const $ = id => document.getElementById(id), P = Math.PI / 180;
const MEEUS = [[485,324.96,1934.136],[203,337.23,32964.467],[199,342.08,20.186],[182,27.85,445267.112],[156,73.14,45036.886],[136,171.52,22518.443],[77,222.54,65928.934],[74,296.72,3034.906],[70,243.58,9037.513],[58,119.81,33718.147],[52,297.17,150.678],[50,21.02,2281.226],[45,247.54,29929.562],[44,325.15,31555.956],[29,60.93,4443.417],[18,155.12,67555.328],[17,288.79,4562.452],[16,198.04,62894.029],[14,199.76,31436.921],[12,95.39,14577.848],[12,287.11,31931.756],[12,320.81,34777.259],[9,227.73,1222.114],[8,15.45,16859.074]];
const BASE = [[2451623.80984,365242.37404,.05169,-.00411,-.00057],[2451716.56767,365241.62603,.00325,.00888,-.0003],[2451810.21715,365242.01767,-.11575,.00337,.00078],[2451900.05952,365242.74049,-.06223,-.00823,.00032]];
// k: 0 equinócio Março, 1 solstício Junho, 2 equinócio Setembro, 3 solstício Dezembro (Meeus, cap. 27)
function solarEvent(y, k) {
  const Y = (y - 2000) / 1000, b = BASE[k], J0 = b[0] + b[1]*Y + b[2]*Y*Y + b[3]*Y**3 + b[4]*Y**4;
  const T = (J0 - 2451545) / 36525, W = (35999.373*T - 2.47) * P, dl = 1 + .0334*Math.cos(W) + .0007*Math.cos(2*W);
  let S = 0; for (const [A,B,C] of MEEUS) S += A * Math.cos((B + C*T) * P);
  return new Date((J0 + 1e-5*S/dl - 2440587.5) * 864e5 - 69e3); // TT→UT (ΔT≈69 s)
}
function nextFestival(now = new Date()) {
  const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()), l = [];
  for (const y of [now.getFullYear(), now.getFullYear() + 1])
    l.push(['Imbolc', new Date(y,1,1)], ['Ostara', solarEvent(y,0)], ['Beltane', new Date(y,4,1)], ['Litha', solarEvent(y,1)],
           ['Lughnasadh', new Date(y,7,1)], ['Mabon', solarEvent(y,2)], ['Samhain', new Date(y,9,31)], ['Yule', solarEvent(y,3)]);
  const f = l.filter(e => e[1] >= t0).sort((a,b) => a[1] - b[1])[0];
  return { name: f[0], date: f[1], days: Math.round((new Date(f[1].getFullYear(), f[1].getMonth(), f[1].getDate()) - t0) / 864e5) };
}
window.__druid = { solarEvent, nextFestival };
calculateExactSolarFestivals = function () {
  const y = new Date().getFullYear(), f = d => d.toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' });
  [['eq-spring',0],['sol-summer',1],['eq-autum',2],['sol-winter',3]].forEach(([id,k]) => { const e = $(id); if (e) e.textContent = f(solarEvent(y,k)); });
};

// Sequência de prática
const day = (d = new Date()) => d.toLocaleDateString('sv'), yday = () => day(new Date(Date.now() - 864e5));
const getS = () => { try { return JSON.parse(localStorage.getItem('druid_streak') || '{}'); } catch { return {}; } };
const streak = () => { const s = getS(); return s.last === day() || s.last === yday() ? s.n || 0 : 0; };
function bump() { const s = getS(); if (s.last !== day()) try { localStorage.setItem('druid_streak', JSON.stringify({ last: day(), n: s.last === yday() ? (s.n || 0) + 1 : 1 })); } catch {} renderToday(); }
['registerAwenPractice', 'saveAltarToJournal', 'saveRitualTemplate'].forEach(n => { const o = window[n]; window[n] = function (...a) { const r = o.apply(this, a); bump(); return r; }; });

function renderToday() {
  const p = $('today-panel'); if (!p || !$('moon-icon')) return;
  const n = nextFestival(), s = streak(), e = window.esc || (x => x), ico = i => `<svg class="ic" aria-hidden="true"><use href="#i-${i}"></use></svg>`;
  const c = (i, l, v, tab) => `<button type="button" class="today-chip" onclick="switchTab('${tab}')"><span class="tc-i" aria-hidden="true">${i}</span><span class="tc-t"><span class="t-lb">${l}</span><span class="t-v">${v}</span></span></button>`;
  p.innerHTML = c(window.moonDaySVG ? moonDaySVG(new Date(), 26) : e($('moon-icon').textContent), 'Lua', e($('moon-phase-name').textContent), 'astro') +
    c(ico('sun'), 'Sol', e($('top-sun-text').textContent), 'astro') +
    c(`<span class="tc-glyph">${e($('celtic-month-symbol').textContent)}</span>`, 'Mês arbóreo', e($('celtic-month-title').textContent.split(' — ')[0]), 'herbal') +
    c(ico('wheel'), 'Próxima festa', `${n.name} · ${n.days === 0 ? 'hoje' : 'em ' + n.days + ' d'}`, 'wheel');
  const d = $('today-date'); if (d) d.textContent = new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });
}

// Tema: cor da barra do browser no telemóvel
const _ct = changeTheme;
changeTheme = function (t) { _ct(t); const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = getComputedStyle(document.body).getPropertyValue('--bg-header').trim() || '#0c1220'; };

// Sons: o segundo toque pára; ecrã sempre ligado em meditação/Zen
let amb = null, wl = null;
const _ta = toggleAmbientSound, _tv = toggleVocalDrone;
toggleAmbientSound = function (t) { if (amb === t) { stopAmbientSound(); amb = null; showToast('Som parado'); return; } amb = t; _ta(t); };
toggleVocalDrone = function (f, l) { const k = 'd' + f; if (amb === k) { stopAmbientSound(); amb = null; showToast('Drone parado'); return; } amb = k; _tv(f, l); };
async function wake() {
  const on = isMedRunning || document.body.classList.contains('zen-active');
  try { if (on && !wl && 'wakeLock' in navigator) { wl = await navigator.wakeLock.request('screen'); wl.addEventListener('release', () => wl = null); } else if (!on && wl) { await wl.release(); wl = null; } } catch {}
}
const _mt = toggleMeditationTimer, _sz = setZenMode;
toggleMeditationTimer = function () { _mt(); wake(); };
setZenMode = function (a) { _sz(a); wake(); };
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') wake(); });

// Runas: o botão de guardar nunca aparecia
const _dr = drawRunes;
drawRunes = function (c) { _dr(c); $('rune-save-bar').classList.remove('hidden'); };

// Pré-visualização do ritual: texto do utilizador escapado
updateRitualPreview = function () {
  const v = i => esc($(i).value), h = $('rit-title').value ? v('rit-title') : 'Cerimónia Sagrada do Grove';
  $('ritual-preview').innerHTML = `<h3 class="font-cinzel text-base font-bold theme-accent border-b border-[var(--border-color)] pb-2">${h}</h3>` +
    `<p><strong class="theme-title">1. Paz nos Quadrantes:</strong><br><span class="theme-muted">${v('rit-peace')}</span></p>` +
    `<p><strong class="theme-title">2. Intenção & Elemento (${v('rit-elem')}):</strong><br><span class="theme-muted">${$('rit-intent').value ? v('rit-intent') : 'Harmonia e conexão com a Terra'}</span></p>` +
    `<p><strong class="theme-title">3. Partilha da Taça:</strong><br><span class="theme-muted">${$('rit-blessing').value ? v('rit-blessing') : 'Partilhamos a água da fonte e o pão da terra.'}</span></p>` +
    `<p><strong class="theme-title">4. Encerramento:</strong><br><span class="theme-muted">${v('rit-words')}</span></p>`;
};

// Tarot: renderização preguiçosa + cartas acessíveis por teclado
const _st = switchTab;
switchTab = function (id) { _st(id); if (id === 'tarot') { const c = $('tarot-card-container'); if (c && !c.children.length) switchTarotMode(activeTarotMode); } };
// Enter/Espaço ativam qualquer elemento com role="button" (cartas, nós da Roda)
document.addEventListener('keydown', e => { const w = e.target.matches && e.target.matches('[role="button"]:not(button)') ? e.target : null; if (w && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); w.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
new MutationObserver(() => document.querySelectorAll('.tarot-flip-wrapper:not([tabindex])').forEach(w => { w.tabIndex = 0; w.setAttribute('role', 'button'); w.setAttribute('aria-label', 'Virar carta'); }))
  .observe($('tarot-card-container'), { childList: true, subtree: true });

window.addEventListener('DOMContentLoaded', () => {
  activeTarotMode = 'draw'; activeRuneMode = 'draw';
  renderRuneGallery(); calculateExactSolarFestivals(); changeTheme(window.__theme || 'theme-night'); renderToday();
  setInterval(() => { updateAstronomy(); renderToday(); }, 6e4);
});
})();
