/* ============================================================
   LunarCalc — fases da Lua reais (Meeus, Astronomical Algorithms
   cap. 47–49). Calculado sempre a partir da data/hora atual do
   dispositivo, com precisão de minutos para Nova/Quartos/Cheia.
   ============================================================ */
(function () {
  const RAD = Math.PI / 180, DAY = 864e5;
  const sin = d => Math.sin(d * RAD), cos = d => Math.cos(d * RAD);
  const NAMES = ['Lua Nova','Lua Crescente','Quarto Crescente','Gibosa Crescente','Lua Cheia','Gibosa Minguante','Quarto Minguante','Lua Minguante'];
  const ICONS = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
  const jdToMs = jd => (jd - 2440587.5) * DAY;
  const msToJd = ms => ms / DAY + 2440587.5;

  // Instante real (UTC, ms) da fase k (k inteiro = Nova, +.25 QC, +.5 Cheia, +.75 QM)
  function phaseTime(k) {
    const T = k / 1236.85, T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;
    const E = 1 - 0.002516 * T - 0.0000074 * T2, E2 = E * E;
    const M = 2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3;
    const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4;
    const F = 160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4;
    const O = 124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3;
    const q = Math.round((k - Math.floor(k)) * 4) % 4;
    let c;
    if (q === 0 || q === 2) {
      const n = q === 0;
      c = (n ? -0.4072 : -0.40614) * sin(Mp) + (n ? 0.17241 : 0.17302) * E * sin(M) + (n ? 0.01608 : 0.01614) * sin(2 * Mp)
        + (n ? 0.01039 : 0.01043) * sin(2 * F) + (n ? 0.00739 : 0.00734) * E * sin(Mp - M) - (n ? 0.00514 : 0.00515) * E * sin(Mp + M)
        + (n ? 0.00208 : 0.00209) * E2 * sin(2 * M) - 0.00111 * sin(Mp - 2 * F) - 0.00057 * sin(Mp + 2 * F)
        + 0.00056 * E * sin(2 * Mp + M) - 0.00042 * sin(3 * Mp) + 0.00042 * E * sin(M + 2 * F) + 0.00038 * E * sin(M - 2 * F)
        - 0.00024 * E * sin(2 * Mp - M) - 0.00017 * sin(O) - 0.00007 * sin(Mp + 2 * M) + 0.00004 * sin(2 * Mp - 2 * F)
        + 0.00004 * sin(3 * M) + 0.00003 * sin(Mp + M - 2 * F) + 0.00003 * sin(2 * Mp + 2 * F) - 0.00003 * sin(Mp + M + 2 * F)
        + 0.00003 * sin(Mp - M + 2 * F) - 0.00002 * sin(Mp - M - 2 * F) - 0.00002 * sin(3 * Mp + M) + 0.00002 * sin(4 * Mp);
    } else {
      c = -0.62801 * sin(Mp) + 0.17172 * E * sin(M) - 0.01183 * E * sin(Mp + M) + 0.00862 * sin(2 * Mp) + 0.00804 * sin(2 * F)
        + 0.00454 * E * sin(Mp - M) + 0.00204 * E2 * sin(2 * M) - 0.0018 * sin(Mp - 2 * F) - 0.0007 * sin(Mp + 2 * F)
        - 0.0004 * sin(3 * Mp) - 0.00034 * E * sin(2 * Mp - M) + 0.00032 * E * sin(M + 2 * F) + 0.00032 * E * sin(M - 2 * F)
        - 0.00028 * E2 * sin(Mp + 2 * M) + 0.00027 * E * sin(2 * Mp + M) - 0.00017 * sin(O) - 0.00005 * sin(Mp - M - 2 * F)
        + 0.00004 * sin(2 * Mp + 2 * F) - 0.00004 * sin(Mp + M + 2 * F) + 0.00004 * sin(Mp - 2 * M) + 0.00003 * sin(Mp + M - 2 * F)
        + 0.00003 * sin(3 * M) + 0.00002 * sin(2 * Mp - 2 * F) + 0.00002 * sin(Mp - M + 2 * F) - 0.00002 * sin(3 * Mp + M);
      const W = 0.00306 - 0.00038 * E * cos(M) + 0.00026 * cos(Mp) - 0.00002 * cos(Mp - M) + 0.00002 * cos(Mp + M) + 0.00002 * cos(2 * F);
      c += q === 1 ? W : -W;
    }
    const A = [[299.77, 0.107408, 325], [251.88, 0.016321, 165], [251.83, 26.651886, 164], [349.42, 36.412478, 126],
      [84.66, 18.206239, 110], [141.74, 53.303771, 62], [207.14, 2.453732, 60], [154.84, 7.30686, 56], [34.52, 27.261239, 47],
      [207.19, 0.121824, 42], [291.34, 1.844379, 40], [161.72, 24.198154, 37], [239.56, 25.513099, 35], [331.55, 3.592518, 23]];
    let add = 0;
    A.forEach(([a, b, w], i) => { add += w * 1e-6 * sin(a + b * k - (i === 0 ? 0.009173 * T2 : 0)); });
    jde += c + add;
    return jdToMs(jde) - 69e3; // TT → UTC (ΔT ≈ 69 s)
  }

  // Eventos principais (type 0 Nova, 1 QC, 2 Cheia, 3 QM) entre dois instantes
  function events(fromMs, toMs) {
    const yr = 2000 + (fromMs - Date.UTC(2000, 0, 1)) / (365.25 * DAY);
    let k = Math.floor((yr - 2000) * 12.3685) - 1;
    const out = [];
    for (; ; k++) {
      for (let q = 0; q < 4; q++) {
        const t = phaseTime(k + q / 4);
        if (t >= toMs) return out;
        if (t >= fromMs) out.push({ t, type: q, date: new Date(t) });
      }
    }
  }

  // Elongação/iluminação instantâneas (Meeus cap. 48, baixa precisão ~0,5°)
  function geometry(ms) {
    const T = (msToJd(ms) - 2451545) / 36525;
    const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
    const M = 357.5291092 + 35999.0502909 * T;
    const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
    const i = 180 - D - 6.289 * sin(Mp) + 2.1 * sin(M) - 1.274 * sin(2 * D - Mp) - 0.658 * sin(2 * D) - 0.214 * sin(2 * Mp) - 0.11 * sin(D);
    const frac = ((((180 - i) % 360) + 360) % 360) / 360; // 0 Nova, .25 QC, .5 Cheia, .75 QM
    return { frac, illum: (1 + cos(i)) / 2 };
  }

  // Fase de um dia civil local: se contém Nova/Quarto/Cheia → essa fase; senão a fase intermédia
  function dayPhase(y, m, d) {
    const start = new Date(y, m, d).getTime(), end = new Date(y, m, d + 1).getTime();
    const ev = events(start, end)[0] || null;
    if (ev) return { idx: ev.type * 2, event: ev };
    const { frac } = geometry((start + end) / 2);
    return { idx: Math.floor(frac * 4) * 2 + 1, event: null };
  }

  function state(date = new Date()) {
    const ms = date.getTime();
    const g = geometry(ms);
    const around = events(ms - 32 * DAY, ms + 32 * DAY);
    const prevNew = around.filter(e => e.type === 0 && e.t <= ms).pop();
    const nextNew = around.find(e => e.type === 0 && e.t > ms);
    const nextFull = around.find(e => e.type === 2 && e.t > ms);
    const { idx, event } = dayPhase(date.getFullYear(), date.getMonth(), date.getDate());
    return {
      idx, event, name: NAMES[idx], icon: ICONS[idx],
      frac: g.frac, illum: g.illum, illumPct: Math.round(g.illum * 100),
      age: prevNew ? (ms - prevNew.t) / DAY : g.frac * 29.530588,
      prevNew: prevNew && prevNew.date, nextNew: nextNew && nextNew.date, nextFull: nextFull && nextFull.date,
      upcoming: around.filter(e => e.t > ms)
    };
  }

  // Fração do ciclo que representa um dia civil (a mesma em todo o site):
  // nos dias de Nova/Quarto/Cheia a fase exata; nos outros, a Lua ao meio-dia.
  const EVENT_FRAC = [0, 0.25, 0.5, 0.75];
  function dayFrac(date = new Date()) {
    const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
    const p = dayPhase(y, m, d);
    return p.event ? EVENT_FRAC[p.event.type] : geometry(new Date(y, m, d, 12).getTime()).frac;
  }

  window.LunarCalc = { NAMES, ICONS, phaseTime, events, geometry, dayPhase, dayFrac, state };

  /**
   * Desenha a Lua em SVG para a fração do ciclo (0 = Nova, .5 = Cheia):
   * igual em todos os aparelhos, ao contrário dos emoji 🌑…🌘.
   * É o único desenho da Lua usado no site.
   */
  window.moonSVG = function (frac, size = 22) {
    const f = ((frac % 1) + 1) % 1, r = 10, c = 12;
    const k = Math.cos(2 * Math.PI * f), rx = (Math.abs(k) * r).toFixed(2);
    let lit = '';
    if (f > 0.03 && f < 0.97) {
      if (Math.abs(f - 0.5) < 0.03) lit = `<circle cx="${c}" cy="${c}" r="${r}" class="moon-lit"/>`;
      else {
        const waxing = f < 0.5;
        const edge = waxing ? 1 : 0;
        const term = waxing ? (k > 0 ? 0 : 1) : (k > 0 ? 1 : 0);
        lit = `<path class="moon-lit" d="M${c} ${c - r}A${r} ${r} 0 0 ${edge} ${c} ${c + r}A${rx} ${r} 0 0 ${term} ${c} ${c - r}Z"/>`;
      }
    }
    return `<svg class="moon-svg" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><circle cx="${c}" cy="${c}" r="${r}" class="moon-dark"/>${lit}<circle cx="${c}" cy="${c}" r="${r}" class="moon-rim"/></svg>`;
  };
  // Lua de hoje (ou de outra data) com o mesmo desenho e cálculo do mapa lunar
  window.moonDaySVG = (date = new Date(), size = 22) => window.moonSVG(dayFrac(date), size);
})();
