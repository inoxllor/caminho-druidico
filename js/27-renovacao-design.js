/* ============================================================
   Renovação do design (v14):
   • «Hoje» com cartão principal: gravura da árvore do mês, fase
     da Lua e próxima festa da Roda do Ano.
   • Roda das árvores: calendário circular das 13 luas arbóreas,
     com o mês atual, o dia de hoje e as Luas Cheias do ano.
   • Pesquisa global (letras, runas, ervas, festas, tríades,
     cartas e secções), com «/» ou Ctrl+K.
   • Virar carta nos oráculos (respeita prefers-reduced-motion).
   • Partilhar a ficha de uma árvore como imagem em pergaminho.
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ico = (i, cls = 'ic') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${i}"></use></svg>`;
const DATA = () => (typeof OGHAM_DATA !== 'undefined' ? OGHAM_DATA : []);
const bot = () => window.botanica || {};
const treeName = o => String(o.tree || '').replace(/\s*\(.*\)\s*$/, '');
const reduceMotion = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/* ——— As 13 luas arbóreas (as mesmas datas de getCelticTree) ——— */
const MONTHS = [
  ['Beith', 12, 24], ['Luis', 1, 21], ['Fearn', 2, 18], ['Saille', 3, 18], ['Nion', 4, 15], ['Huath', 5, 13], ['Duir', 6, 10],
  ['Tinne', 7, 8], ['Coll', 8, 5], ['Muin', 9, 2], ['Gort', 9, 30], ['Ngetal', 10, 28], ['Straif', 11, 25]
];
/** Início (24 Dez) do ciclo arbóreo que contém a data d. */
function cycleStart(d = new Date()) {
  const y = d.getFullYear();
  const s = new Date(y, 11, 24);
  return d >= s ? s : new Date(y - 1, 11, 24);
}
/** Meses do ciclo com datas reais de início e fim. */
function cycleMonths(d = new Date()) {
  const c0 = cycleStart(d), y0 = c0.getFullYear();
  const starts = MONTHS.map(([n, m, day], i) => [n, i === 0 ? c0 : new Date(y0 + 1, m - 1, day)]);
  const end = new Date(y0 + 1, 11, 24);
  return starts.map(([n, s], i) => {
    const e = i < starts.length - 1 ? starts[i + 1][1] : end;
    return { name: n, start: s, end: e, last: new Date(e.getFullYear(), e.getMonth(), e.getDate() - 1), data: DATA().find(o => o.name === n) };
  });
}
const fmtDay = d => `${d.getDate()} ${MESES[d.getMonth()]}`;
const monthRange = m => `${fmtDay(m.start)} – ${fmtDay(m.last)}`;
function currentMonth(d = new Date()) {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return cycleMonths(d).find(m => t >= m.start && t < m.end) || cycleMonths(d)[0];
}

/* ——— Gravura (ou desenho, se não houver) de uma árvore ——— */
function plateHTML(o, cls) {
  const b = bot(), key = 'tree-' + o.name;
  const svg = b.tree ? b.tree(o.name) : '';
  if (b.plateSrc && b.plates && b.plates[key]) {
    return `<img class="${cls}" src="${b.plateSrc(key)}" alt="Gravura botânica: ${escH(treeName(o))} (${escH(b.plates[key][0])})" loading="lazy" decoding="async" data-fallback="${escH(svg)}">`;
  }
  return `<span class="${cls} bot-fallback theme-glyph">${svg}</span>`;
}

/* ============================================================
   «Hoje»: cartão principal
   ============================================================ */
function renderTodayFeature() {
  const box = $('today-feature');
  if (!box) return;
  const now = new Date();
  const m = currentMonth(now), o = m.data;
  if (!o) return;
  const L = window.LunarCalc ? LunarCalc.state(now) : null;
  const fest = window.__druid && __druid.nextFestival ? __druid.nextFestival(now) : null;
  const moonArt = L && window.moonSVG ? moonSVG(L.frac, 44) : '';
  const sun = ($('top-sun-text') || {}).textContent || '';
  const daysLeft = Math.round((m.end - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);
  const fDate = fest ? fest.date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' }) : '';
  const fWhen = fest ? (fest.days === 0 ? 'Hoje!' : fest.days === 1 ? 'Amanhã' : `Daqui a ${fest.days} dias`) : '';
  const nextFull = L && L.nextFull ? L.nextFull.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' }) : '';
  box.innerHTML = `
    <article class="tf-card theme-card border">
      <button type="button" class="tf-art" onclick="openTreeMonth('${o.name}')" aria-label="Abrir a árvore do mês: ${escH(treeName(o))}">
        ${plateHTML(o, 'tf-plate')}
      </button>
      <div class="tf-main">
        <p class="eyebrow">Mês arbóreo · ${escH(monthRange(m))}</p>
        <h3 class="tf-title font-cinzel"><span class="tf-glyph" aria-hidden="true">${escH(o.symbol)}</span>${escH(o.name)} <span class="tf-tree">· ${escH(treeName(o))}</span></h3>
        <p class="tf-meaning">${escH(o.meaning)}</p>
        <p class="tf-left">${daysLeft <= 1 ? 'Último dia desta lua arbórea.' : `Faltam ${daysLeft} dias para a lua de ${escH(cycleMonths(now)[(cycleMonths(now).findIndex(x => x.name === m.name) + 1) % 13].name)}.`}</p>
        <div class="tf-stats">
          <button type="button" class="tf-stat" onclick="switchTab('astro')">
            <span class="tf-moon" aria-hidden="true">${moonArt}</span>
            <span class="tf-st"><span class="t-lb">Lua</span><span class="t-v">${escH(L ? L.name : '—')}</span><span class="t-sub">${L ? `${L.illumPct}% iluminada${nextFull ? ` · Cheia a ${escH(nextFull)}` : ''}` : ''}</span></span>
          </button>
          <button type="button" class="tf-stat" onclick="switchTab('wheel')">
            <span class="tf-ic" aria-hidden="true">${ico('wheel')}</span>
            <span class="tf-st"><span class="t-lb">Próxima festa</span><span class="t-v">${escH(fest ? fest.name : '—')}</span><span class="t-sub">${escH(fWhen)}${fDate ? ` · ${escH(fDate)}` : ''}</span></span>
          </button>
        </div>
        <div class="tf-foot">
          ${sun && sun !== '—' ? `<span class="tf-sun">${ico('sun')}<span><span class="sr-only">Sol: </span>${escH(sun)}</span></span>` : ''}
          <button type="button" class="btn-link" onclick="switchTab('treewheel')">Roda das árvores →</button>
        </div>
      </div>
    </article>`;
  const d = $('today-date');
  if (d) d.textContent = now.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' });
}

/* ============================================================
   Roda das árvores
   ============================================================ */
let twSelected = null;
const C = 200, R_OUT = 176, R_IN = 108, R_MOON = 190;
const polar = (r, a) => [C + r * Math.sin(a), C - r * Math.cos(a)];
function arcPath(a0, a1, r0, r1) {
  const [x0, y0] = polar(r1, a0), [x1, y1] = polar(r1, a1), [x2, y2] = polar(r0, a1), [x3, y3] = polar(r0, a0);
  const big = a1 - a0 > Math.PI ? 1 : 0;
  const f = n => n.toFixed(2);
  return `M${f(x0)} ${f(y0)}A${r1} ${r1} 0 ${big} 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${r0} ${r0} 0 ${big} 0 ${f(x3)} ${f(y3)}Z`;
}
function renderTreeWheel() {
  const host = $('tree-wheel');
  if (!host || !DATA().length) return;
  const now = new Date();
  const months = cycleMonths(now), cur = currentMonth(now);
  const c0 = months[0].start, total = months[12].end - c0;
  const ang = t => ((t - c0) / total) * 2 * Math.PI;
  if (!twSelected) twSelected = cur.name;
  const segs = months.map((m, i) => {
    const a0 = ang(m.start), a1 = ang(m.end), mid = (a0 + a1) / 2;
    const [gx, gy] = polar((R_OUT + R_IN) / 2 + 18, mid), [nx, ny] = polar((R_OUT + R_IN) / 2 - 14, mid);
    const isCur = m.name === cur.name, isSel = m.name === twSelected;
    const o = m.data || {};
    return `<g class="tw-seg${isCur ? ' is-current' : ''}${isSel ? ' is-selected' : ''}" data-tree="${m.name}" role="button" tabindex="0"
        aria-pressed="${isSel}" aria-label="${escH(`${m.name}, ${treeName(o)}, ${monthRange(m)}${isCur ? ' (mês atual)' : ''}`)}">
      <path d="${arcPath(a0 + .006, a1 - .006, R_IN, R_OUT)}"/>
      <text class="tw-glyph" x="${gx.toFixed(1)}" y="${gy.toFixed(1)}" text-anchor="middle" dominant-baseline="central">${escH(o.symbol || '')}</text>
      <text class="tw-name" x="${nx.toFixed(1)}" y="${ny.toFixed(1)}" text-anchor="middle" dominant-baseline="central">${escH(m.name)}</text>
    </g>`;
  }).join('');
  // Luas Cheias do ciclo
  let moons = '';
  if (window.LunarCalc && window.moonSVG) {
    LunarCalc.events(c0.getTime(), months[12].end.getTime()).filter(e => e.type === 2).forEach(e => {
      const [x, y] = polar(R_MOON, ang(e.t));
      const past = e.t < now.getTime();
      moons += `<g class="tw-full${past ? ' is-past' : ''}"><title>Lua Cheia · ${escH(e.date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' }))}</title>${moonSVG(0.5, 14).replace('<svg ', `<svg x="${(x - 7).toFixed(1)}" y="${(y - 7).toFixed(1)}" `)}</g>`;
    });
  }
  // Ponteiro de hoje e Lua de hoje ao centro
  const a = ang(now);
  const [px0, py0] = polar(R_IN - 6, a), [px1, py1] = polar(R_OUT + 4, a);
  const L = window.LunarCalc ? LunarCalc.state(now) : null;
  const centre = L && window.moonSVG ? moonSVG(L.frac, 64).replace('<svg ', `<svg x="${C - 32}" y="${C - 50}" `) : '';
  host.innerHTML = `
    <div class="tw-wheel">
      <svg viewBox="0 0 400 400" class="tw-svg" role="group" aria-label="Roda das árvores: 13 luas arbóreas">
        <circle cx="${C}" cy="${C}" r="${R_MOON}" class="tw-orbit"/>
        ${segs}
        <circle cx="${C}" cy="${C}" r="${R_IN - 8}" class="tw-hub"/>
        ${moons}
        <line class="tw-needle" x1="${px0.toFixed(1)}" y1="${py0.toFixed(1)}" x2="${px1.toFixed(1)}" y2="${py1.toFixed(1)}"/>
        <circle class="tw-needle-dot" cx="${px1.toFixed(1)}" cy="${py1.toFixed(1)}" r="4.5"/>
        ${centre}
        <text class="tw-c-phase" x="${C}" y="${C + 32}" text-anchor="middle">${escH(L ? L.name : '')}</text>
        <text class="tw-c-date" x="${C}" y="${C + 50}" text-anchor="middle">Hoje · ${escH(fmtDay(now))}</text>
      </svg>
      <ul class="tw-legend">
        <li><span class="tw-key tw-key-cur"></span>Mês atual</li>
        <li><span class="tw-key tw-key-needle"></span>Hoje</li>
        <li>${window.moonSVG ? moonSVG(0.5, 14) : ''}Luas Cheias</li>
      </ul>
    </div>
    <div id="tw-detail" class="tw-detail" aria-live="polite"></div>`;
  renderTreeDetail(twSelected);
}
function renderTreeDetail(name) {
  const box = $('tw-detail');
  const m = cycleMonths().find(x => x.name === name);
  if (!box || !m || !m.data) return;
  const o = m.data, b = bot();
  const p = b.plates && b.plates['tree-' + o.name];
  const lore = (window.OGHAM_LORE || {})[o.name];
  const isCur = currentMonth().name === name;
  box.innerHTML = `
    <article class="tw-card tw-flip">
      <div class="tw-plate-wrap">${plateHTML(o, 'tw-plate')}</div>
      <div class="tw-body">
        <p class="eyebrow">${isCur ? 'Lua arbórea atual' : 'Lua arbórea'} · ${escH(monthRange(m))}</p>
        <h3 class="font-cinzel tw-title"><span class="tf-glyph" aria-hidden="true">${escH(o.symbol)}</span>${escH(o.name)}</h3>
        <p class="tw-tree">${escH(treeName(o))}${p ? ` · <i>${escH(p[0])}</i>` : ''}</p>
        <p class="tw-meaning">${escH(o.meaning)}</p>
        ${lore ? `<p class="tw-extra"><span>Bríatharogam</span> «${escH(lore.kenningPt)}»</p>` : ''}
        <p class="tw-extra"><span>Ervas</span> ${escH(o.herb)}</p>
        <div class="tw-actions">
          <button type="button" class="btn-sec theme-title" onclick="openTreeInGuide('${o.name}')">Abrir no guia</button>
          <button type="button" class="btn-sec theme-accent" onclick="shareTreeCard('${o.name}')">${ico('share')}<span>Partilhar ficha</span></button>
        </div>
      </div>
    </article>`;
}
function selectTreeMonth(name) {
  twSelected = name;
  document.querySelectorAll('.tw-seg').forEach(g => {
    const on = g.dataset.tree === name;
    g.classList.toggle('is-selected', on);
    g.setAttribute('aria-pressed', on);
  });
  renderTreeDetail(name);
}
document.addEventListener('click', e => {
  const g = e.target.closest && e.target.closest('.tw-seg');
  if (!g) return;
  selectTreeMonth(g.dataset.tree);
  if (matchMedia('(max-width: 1023px)').matches) {
    const d = $('tw-detail');
    if (d) d.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  }
});

/** Abre a roda já com a árvore escolhida. */
window.openTreeMonth = function (name) {
  twSelected = name;
  switchTab('treewheel');
};
/** Mostra a ficha da letra no guia «Árvores & ervas». */
window.openTreeInGuide = function (name) {
  const s = $('herbal-search');
  if (s && s.value) { s.value = ''; if (typeof filterHerbal === 'function') filterHerbal(); }
  switchTab('herbal');
  requestAnimationFrame(() => {
    const card = document.querySelector(`#tree-list [data-tree="${name}"]`);
    if (card) flash(card);
  });
};
function flash(el) {
  el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'center' });
  el.classList.remove('is-found'); void el.offsetWidth; el.classList.add('is-found');
  setTimeout(() => el.classList.remove('is-found'), 2600);
}

/* ——— Fichas do guia: marcar cada árvore e juntar «Partilhar» ——— */
function decorateGuide() {
  const list = $('tree-list');
  if (!list) return;
  list.querySelectorAll(':scope > div').forEach(card => {
    const h = card.querySelector('h3');
    const name = h && h.textContent.split('•')[0].trim();
    if (!name || card.dataset.tree) return;
    card.dataset.tree = name;
    if (!DATA().some(o => o.name === name)) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn-link tree-share';
    b.innerHTML = `${ico('share')}<span>Partilhar ficha</span>`;
    b.setAttribute('aria-label', `Partilhar a ficha de ${name} como imagem`);
    b.addEventListener('click', () => shareTreeCard(name));
    card.appendChild(b);
  });
}

/* ============================================================
   Partilhar a ficha de uma árvore como imagem (pergaminho)
   ============================================================ */
const OGHAM_GROUPS = ['right', 'left', 'across', 'notch'];
/** Desenha a letra Ogham com traços (não depende de fontes). */
function drawOgham(ctx, idx, x, yTop, h, color) {
  const g = OGHAM_GROUPS[Math.floor(idx / 5)] || 'notch', n = (idx % 5) + 1;
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = 'round';
  ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(x, yTop); ctx.lineTo(x, yTop + h); ctx.stroke();
  const step = 24, y0 = yTop + h / 2 - ((n - 1) * step) / 2;
  ctx.lineWidth = 6;
  for (let i = 0; i < n; i++) {
    const y = y0 + i * step;
    ctx.beginPath();
    if (g === 'right') { ctx.moveTo(x, y); ctx.lineTo(x + 44, y); }
    else if (g === 'left') { ctx.moveTo(x - 44, y); ctx.lineTo(x, y); }
    else if (g === 'across') { ctx.moveTo(x - 36, y + 14); ctx.lineTo(x + 36, y - 14); }
    else { ctx.moveTo(x - 14, y); ctx.lineTo(x + 14, y); }
    ctx.stroke();
  }
  ctx.restore();
}
function wrap(ctx, text, maxW) {
  const words = String(text).split(/\s+/), lines = [];
  let line = '';
  words.forEach(w => {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  });
  if (line) lines.push(line);
  return lines;
}
function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    if (/^https?:/.test(src) && !src.startsWith(location.origin)) img.crossOrigin = 'anonymous';
    img.onload = () => res(img); img.onerror = rej; img.src = src;
  });
}
async function treeArt(o) {
  const b = bot(), key = 'tree-' + o.name;
  if (b.plateSrc && b.plates && b.plates[key]) {
    try { return { img: await loadImage(b.plateSrc(key)), plate: true }; } catch { /* usa o desenho */ }
  }
  const svg = (b.tree ? b.tree(o.name) : '').replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" style="color:#4a2e14" ');
  if (!svg) return null;
  try { return { img: await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)), plate: false }; } catch { return null; }
}

async function buildTreeImage(name) {
  const o = DATA().find(x => x.name === name);
  if (!o) throw new Error('árvore desconhecida');
  const idx = DATA().indexOf(o);
  const m = cycleMonths().find(x => x.name === name);
  const W = 1080, H = 1350, cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  try { if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 800))]); } catch { /* nada */ }
  const SERIF = "'Cinzel', 'Times New Roman', Georgia, serif", SANS = "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif";
  const INK = '#3b2412', INK2 = '#6b4a2a', RED = '#7a2e12';

  // Pergaminho: fundo, manchas e vinheta
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#f6e9c8'); bg.addColorStop(.55, '#efdcae'); bg.addColorStop(1, '#e2c58e');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  let seed = idx * 7919 + 13;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 60; i++) {
    const x = rnd() * W, y = rnd() * H, r = 30 + rnd() * 160;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(150,100,40,${(.03 + rnd() * .05).toFixed(3)})`); g.addColorStop(1, 'rgba(150,100,40,0)');
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .75);
  vg.addColorStop(0, 'rgba(90,50,10,0)'); vg.addColorStop(1, 'rgba(90,50,10,.28)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  // Moldura dupla
  ctx.strokeStyle = INK2; ctx.lineWidth = 4; ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 1.5; ctx.strokeRect(54, 54, W - 108, H - 108);
  [[54, 54], [W - 54, 54], [54, H - 54], [W - 54, H - 54]].forEach(([x, y]) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillStyle = INK2; ctx.fillRect(-7, -7, 14, 14); ctx.restore();
  });

  // Cabeçalho
  ctx.textAlign = 'center'; ctx.fillStyle = INK2;
  ctx.font = `600 26px ${SANS}`;
  ctx.fillText(('Calendário arbóreo celta' + (m ? ` · ${monthRange(m)}` : '')).toUpperCase(), W / 2, 118);

  // Letra Ogham e nome
  drawOgham(ctx, idx, 150, 150, 200, RED);
  ctx.fillStyle = INK; ctx.font = `700 92px ${SERIF}`;
  ctx.fillText(o.name, W / 2, 238);
  ctx.font = `italic 500 40px Georgia, 'Times New Roman', serif`; ctx.fillStyle = INK2;
  const p = bot().plates && bot().plates['tree-' + o.name];
  ctx.fillText(treeName(o) + (p ? ` · ${p[0]}` : ''), W / 2, 296);
  ctx.strokeStyle = INK2; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W / 2 - 180, 330); ctx.lineTo(W / 2 + 180, 330); ctx.stroke();
  ctx.fillStyle = INK2; ctx.beginPath(); ctx.arc(W / 2, 330, 5, 0, 7); ctx.fill();

  // Gravura
  const art = await treeArt(o);
  const box = { x: 250, y: 360, w: 580, h: 560 };
  if (art) {
    const r = Math.min(box.w / art.img.width, box.h / art.img.height);
    const w = art.img.width * r, h = art.img.height * r, x = box.x + (box.w - w) / 2, y = box.y + (box.h - h) / 2;
    ctx.save();
    ctx.shadowColor = 'rgba(60,30,5,.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#f3e2b8'; ctx.fillRect(x - 10, y - 10, w + 20, h + 20);
    ctx.restore();
    if (art.plate) ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(art.img, x, y, w, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = INK2; ctx.lineWidth = 2; ctx.strokeRect(x - 10, y - 10, w + 20, h + 20);
  }

  // Significado e ervas
  let y = 990;
  ctx.fillStyle = INK; ctx.font = `500 34px ${SANS}`;
  wrap(ctx, o.meaning, W - 240).slice(0, 3).forEach(l => { ctx.fillText(l, W / 2, y); y += 46; });
  y += 8;
  ctx.font = `700 22px ${SANS}`; ctx.fillStyle = RED;
  ctx.fillText('ERVAS', W / 2, y); y += 36;
  ctx.font = `italic 500 30px Georgia, 'Times New Roman', serif`; ctx.fillStyle = INK2;
  wrap(ctx, o.herb, W - 240).slice(0, 2).forEach(l => { ctx.fillText(l, W / 2, y); y += 40; });

  // Rodapé
  ctx.font = `600 22px ${SANS}`; ctx.fillStyle = INK2;
  ctx.fillText('Caminho Druídico · inoxllor.github.io/caminho-druidico', W / 2, H - 82);
  return cv;
}

window.shareTreeCard = async function (name) {
  const toast = typeof showToast === 'function' ? showToast : () => {};
  let blob;
  try {
    const cv = await buildTreeImage(name);
    blob = await new Promise((res, rej) => cv.toBlob(b => (b ? res(b) : rej(new Error('vazio'))), 'image/png'));
  } catch (e) {
    console.warn(e);
    toast('Não foi possível criar a imagem da ficha.');
    return;
  }
  const fileName = `ficha-${name.toLowerCase()}.png`;
  const o = DATA().find(x => x.name === name) || {};
  try {
    const file = new File([blob], fileName, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: `${name} · ${treeName(o)}`, text: `${name} (${treeName(o)}): ${o.meaning || ''}` });
      return;
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = fileName;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1e4);
  toast('Imagem da ficha descarregada.');
};
window.__treeCardImage = buildTreeImage;

/* ============================================================
   Virar carta nos oráculos
   ============================================================ */
function wrapReading(fn) {
  const base = window[fn];
  if (typeof base !== 'function') return;
  window[fn] = function (...args) {
    const r = base.apply(this, args);
    flipIn();
    return r;
  };
}
function flipIn() {
  if (reduceMotion()) return;
  ['ogham-card', 'rune-card'].forEach(id => {
    const el = $(id);
    if (!el) return;
    el.querySelectorAll('.oc-card:not(.oc-flipped)').forEach((c, i) => {
      c.classList.add('oc-flip', 'oc-flipped');
      c.style.setProperty('--i', i);
      c.addEventListener('animationend', ev => { if (ev.target === c) c.classList.remove('oc-flip'); }, { once: false });
    });
  });
}

/* ============================================================
   Pesquisa global
   ============================================================ */
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
let INDEX = null;
const KIND = {
  section: ['Secções', 'compass'], ogham: ['Letras Ogham e árvores', 'ogham'], rune: ['Runas', 'runes'], herb: ['Ervas', 'herbal'],
  fest: ['Festas da Roda do Ano', 'wheel'], triad: ['Tríades', 'triads'], tarot: ['Tarot nórdico', 'tarot']
};
function buildIndex() {
  const out = [];
  // Em inglês (js/00-idioma.js), o índice tem o texto nas duas línguas e mostra-se em inglês
  const tr = window.APP_LANG === 'en-GB' && window.t ? window.t : null;
  const add = (kind, title, sub, text, go, glyph = '') => {
    const parts = (Array.isArray(text) ? text : [text]).filter(Boolean);
    let all = `${title} ${sub} ${parts.join(' ')}`;
    if (tr) { all += ` ${tr(title)} ${tr(sub)} ${parts.map(tr).join(' ')}`; title = tr(title); sub = tr(sub); }
    out.push({ kind, title, sub, glyph, go, n: norm(title), t: norm(all) });
  };
  // Secções
  const P = (window.DruidRealms || {}).PORTALS || {};
  add('section', 'Hoje', 'Ecrã inicial', 'dia lua festa oraculo', () => switchTab('today'));
  Object.entries(P).forEach(([r, p]) => {
    add('section', p.label, 'Portal', p.intro, () => switchTab('portal-' + r));
    p.items.forEach(([tab, , name, desc]) => add('section', name, p.label, desc, () => switchTab(tab)));
  });
  [['orgs', 'Organizações', 'Comunidade'], ['grove', 'Grove local', 'Comunidade'], ['about', 'Sobre & apoio', 'Comunidade']]
    .forEach(([t, n, s]) => add('section', n, s, '', () => switchTab(t)));
  // Ogham
  DATA().forEach(o => {
    const lore = (window.OGHAM_LORE || {})[o.name] || {};
    add('ogham', `${o.name} · ${treeName(o)}`, `${o.aicme || ''}${o.month ? ' · ' + o.month : ''}`, [o.tree, o.meaning, o.herb, lore.kenningPt, lore.word],
      () => openTreeInGuide(o.name), o.symbol);
  });
  // Runas
  (typeof RUNES_EXTENDED !== 'undefined' ? RUNES_EXTENDED : []).forEach(r => {
    add('rune', r.name, r.aett ? `Aett de ${r.aett}` : 'Runa', [r.meaning, r.reversed], () => {
      switchTab('runelore');
      requestAnimationFrame(() => {
        const card = [...document.querySelectorAll('#tab-runelore .rl-card')].find(c => (c.querySelector('h3,h4,.rl-name') || c).textContent.trim().startsWith(r.name) || c.querySelector('.rl-stone')?.textContent === r.symbol);
        if (card) flash(card);
      });
    }, r.symbol);
  });
  // Ervas
  const uses = bot().uses || {};
  Object.entries(uses).forEach(([herb, u]) => {
    const o = DATA().find(x => norm(x.herb).includes(norm(herb)));
    const label = herb.charAt(0).toUpperCase() + herb.slice(1);
    add('herb', label, o ? `Erva de ${o.name} · ${treeName(o)}` : 'Erva', u || [], () => {
      if (!o) return switchTab('herbal');
      openTreeInGuide(o.name);
    });
  });
  // Festas
  if (typeof FESTIVALS_DATA !== 'undefined') Object.entries(FESTIVALS_DATA).forEach(([id, f]) => {
    add('fest', f.title, f.date, [f.theme, f.ritual], () => { switchTab('wheel'); if (typeof selectFestival === 'function') selectFestival(+id); });
  });
  // Tríades
  (window.TRIADS_DATA || []).forEach(t => {
    const [head] = String(t).split(':');
    add('triad', head.length < 90 ? head : head.slice(0, 87) + '…', 'Tríade', t, () => {
      switchTab('triads');
      const el = $('triad-text');
      if (el) { el.textContent = `"${t}"`; flash(el.closest('#triad-container') || el); }
    });
  });
  // Tarot
  (typeof NORDIC_TAROT_DECK !== 'undefined' ? NORDIC_TAROT_DECK : []).forEach(c => {
    add('tarot', c.name, c.title || 'Carta', [c.upright, c.reversed, c.keywords], () => {
      switchTab('tarot');
      if (typeof openTarotDetail === 'function') openTarotDetail(c.id);
    });
  });
  return out;
}
function search(q) {
  const nq = norm(q).trim();
  if (!nq) return [];
  const terms = nq.split(/\s+/);
  INDEX = INDEX || buildIndex();
  return INDEX.map(it => {
    if (!terms.every(t => it.t.includes(t))) return null;
    let score = 0;
    if (it.n === nq) score += 100;
    if (it.n.startsWith(nq)) score += 50;
    if (it.n.includes(nq)) score += 20;
    terms.forEach(t => { if (it.n.includes(t)) score += 5; });
    return { it, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 60).map(x => x.it);
}
function highlight(text, q) {
  const terms = norm(q).trim().split(/\s+/).filter(t => t.length > 1);
  const src = String(text), n = norm(src);
  if (!terms.length) return escH(src);
  const marks = new Array(src.length).fill(false);
  terms.forEach(t => { let i = n.indexOf(t); while (i >= 0) { for (let k = i; k < i + t.length; k++) marks[k] = true; i = n.indexOf(t, i + t.length); } });
  let out = '', open = false;
  [...src].forEach((ch, i) => {
    if (marks[i] && !open) { out += '<mark>'; open = true; }
    if (!marks[i] && open) { out += '</mark>'; open = false; }
    out += escH(ch);
  });
  return out + (open ? '</mark>' : '');
}
let results = [], active = -1;
function renderResults() {
  const q = $('search-input').value;
  const list = $('search-results'), status = $('search-status');
  results = search(q);
  active = results.length ? 0 : -1;
  if (!q.trim()) {
    status.textContent = '';
    list.innerHTML = `<div class="sd-hints"><p>Experimente:</p>${['Carvalho', 'Fehu', 'Valeriana', 'Samhain', 'Verdade', 'Odin'].map(s => `<button type="button" class="sd-chip" data-q="${s}">${s}</button>`).join('')}</div>`;
    return;
  }
  status.textContent = results.length ? `${results.length} resultado${results.length === 1 ? '' : 's'}` : 'Nada encontrado. Tente outra palavra.';
  let html = '', last = '';
  results.forEach((r, i) => {
    if (r.kind !== last) { html += `<p class="sd-group">${escH(KIND[r.kind][0])}</p>`; last = r.kind; }
    html += `<button type="button" class="sd-item${i === active ? ' is-active' : ''}" data-i="${i}" id="sd-item-${i}">
      <span class="sd-ic" aria-hidden="true">${r.glyph ? `<span class="sd-glyph">${escH(r.glyph)}</span>` : ico(KIND[r.kind][1])}</span>
      <span class="sd-txt"><span class="sd-title">${highlight(r.title, q)}</span><span class="sd-sub">${escH(r.sub)}</span></span>
    </button>`;
  });
  list.innerHTML = html;
}
function setActive(i) {
  if (!results.length) return;
  active = (i + results.length) % results.length;
  document.querySelectorAll('.sd-item').forEach(b => b.classList.toggle('is-active', +b.dataset.i === active));
  const el = $('sd-item-' + active);
  if (el) { el.scrollIntoView({ block: 'nearest' }); $('search-input').setAttribute('aria-activedescendant', el.id); }
}
function go(i) {
  const r = results[i];
  if (!r) return;
  closeSearch();
  setTimeout(() => r.go(), 30);
}
window.openSearch = function () {
  const d = $('search-dialog');
  if (!d) return;
  if (typeof closeMore === 'function') closeMore();
  if (!d.open) d.showModal();
  const inp = $('search-input');
  inp.select();
  renderResults();
};
window.closeSearch = function () { const d = $('search-dialog'); if (d && d.open) d.close(); };
function initSearch() {
  const inp = $('search-input'), list = $('search-results');
  if (!inp || !list) return;
  let t = 0;
  inp.addEventListener('input', () => { clearTimeout(t); t = setTimeout(renderResults, 80); });
  inp.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(active < 0 ? 0 : active); }
  });
  list.addEventListener('click', e => {
    const chip = e.target.closest('.sd-chip');
    if (chip) { inp.value = chip.dataset.q; renderResults(); inp.focus(); return; }
    const b = e.target.closest('.sd-item');
    if (b) go(+b.dataset.i);
  });
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openSearch(); }
    else if (e.key === '/' && !typing && !document.querySelector('dialog[open]')) { e.preventDefault(); openSearch(); }
  });
  const d = $('search-dialog');
  d.addEventListener('click', e => { if (e.target === d) d.close(); });
}

/* ============================================================
   Ligações e arranque
   ============================================================ */
const prevSwitch = window.switchTab;
window.switchTab = function (id) {
  const r = prevSwitch.apply(this, arguments);
  if (id === 'treewheel') renderTreeWheel();
  if (id === 'today') renderTodayFeature();
  return r;
};
// Ativar com teclado os meses da roda (Enter/Espaço já disparam click em role=button).

function init() {
  renderTodayFeature();
  renderTreeWheel();
  decorateGuide();
  const list = $('tree-list');
  if (list && 'MutationObserver' in window) new MutationObserver(decorateGuide).observe(list, { childList: true });
  wrapReading('renderOracleReading');
  initSearch();
  // O Sol chega depois do cálculo da astronomia; refrescar quando mudar.
  const sun = $('top-sun-text');
  if (sun && 'MutationObserver' in window) new MutationObserver(renderTodayFeature).observe(sun, { childList: true, characterData: true, subtree: true });
  setInterval(renderTodayFeature, 10 * 60 * 1000);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
