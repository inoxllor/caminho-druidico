/* ============================================================
   Ilustrações botânicas: um desenho original (SVG feito em código,
   sem imagens externas) para cada uma das 20 árvores do Ogham e para
   cada erva do guia «Árvores & ervas». O traço usa a cor dos glifos
   do ambiente visual (currentColor), por isso acompanha todos os temas
   e funciona sem rede.
   window.botanica.tree(nome) / .herb(nome) devolvem o SVG em texto.
   ============================================================ */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const r1 = n => Math.round(n * 10) / 10;
const RAD = Math.PI / 180;

/* ——— Aleatório determinístico: o mesmo desenho em todos os aparelhos ——— */
function seeded(seed) {
  let a = 0;
  for (const ch of seed) a = (a * 31 + ch.charCodeAt(0)) | 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ——— Primitivas de desenho ——— */
function makeKit(seed) {
  const rnd = seeded(seed);
  const rr = (a, b) => a + (b - a) * rnd();

  /** Curva suave (Catmull-Rom) que passa pelos pontos. */
  function smooth(pts, closed = false) {
    const n = pts.length;
    if (n < 2) return '';
    const P = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
    }
    return closed ? d + 'Z' : d;
  }
  const poly = (pts, closed = true) => 'M' + pts.map(p => `${r1(p[0])} ${r1(p[1])}`).join('L') + (closed ? 'Z' : '');
  const path = (d, cls = '', extra = '') => `<path d="${d}"${cls ? ` class="${cls}"` : ''}${extra}/>`;
  const line = (pts, w) => path(smooth(pts), '', w ? ` stroke-width="${w}"` : '');
  const circle = (cx, cy, r, cls = '') => `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(r)}"${cls ? ` class="${cls}"` : ''}/>`;
  const ellipse = (cx, cy, rx, ry, rot, cls = '') => `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(rx)}" ry="${r1(ry)}" transform="rotate(${r1(rot)} ${r1(cx)} ${r1(cy)})"${cls ? ` class="${cls}"` : ''}/>`;

  const PROFILES = {
    ovate: t => Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 0.85),
    lance: t => Math.pow(Math.sin(Math.PI * t), 1.15),
    obovate: t => Math.pow(Math.sin(Math.PI * Math.pow(t, 1.6)), 0.8),
    round: t => Math.pow(Math.sin(Math.PI * Math.pow(t, 0.85)), 0.5),
    heart: t => Math.pow(Math.sin(Math.PI * (0.18 + 0.82 * Math.pow(t, 0.8))), 0.55) * Math.min(1, 0.35 + t * 6),
    diamond: t => t < 0.45 ? t / 0.45 : (1 - t) / 0.55
  };
  /**
   * Folha a partir da base (x, y), com comprimento, largura e ângulo (graus).
   * o.prof: perfil; o.teeth: dentes na margem; o.lobes/o.lobeDepth: lóbulos
   * arredondados; o.spiky: pontas de azevinho; o.stalk: pecíolo; o.veins.
   */
  function leaf(x, y, len, wid, ang, o = {}) {
    const dx = Math.cos(ang * RAD), dy = Math.sin(ang * RAD);
    const nx = -dy, ny = dx;
    let out = '';
    const stalk = o.stalk || 0;
    if (stalk) out += path(`M${r1(x)} ${r1(y)}L${r1(x + dx * stalk)} ${r1(y + dy * stalk)}`);
    const bx = x + dx * stalk, by = y + dy * stalk;
    const prof = PROFILES[o.prof || 'ovate'];
    const N = (o.teeth || o.spiky) ? 64 : 22;
    const side = s => {
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        let w = wid / 2 * prof(t);
        if (o.lobes) w *= (1 - (o.lobeDepth || 0.4)) + (o.lobeDepth || 0.4) * Math.pow(Math.abs(Math.sin(Math.PI * t * o.lobes)), 0.7);
        if (o.spiky) { const ph = (t * o.spiky) % 1; w *= 0.7 + 0.42 * Math.pow(ph, 3); }
        if (o.teeth) { const ph = (t * o.teeth + (s > 0 ? 0 : 0.5)) % 1; w *= 1 + 0.1 * (ph < 0.8 ? ph / 0.8 : (1 - ph) / 0.2) - 0.05; }
        pts.push([bx + dx * len * t + nx * w * s, by + dy * len * t + ny * w * s]);
      }
      return pts;
    };
    const left = side(1), right = side(-1).reverse();
    const all = left.concat(right.slice(1));
    const d = (o.teeth || o.spiky) ? poly(all) : smooth(all, true);
    out += path(d, o.cls ?? 'lf');
    if (o.vein !== false && len > 6) {
      out += path(`M${r1(bx)} ${r1(by)}L${r1(bx + dx * len * 0.88)} ${r1(by + dy * len * 0.88)}`, 'v');
      const vs = o.veins ?? (len > 14 ? 3 : 0);
      for (let i = 1; i <= vs; i++) {
        const t = i / (vs + 1) * 0.85, w = wid / 2 * prof(t) * 0.75;
        for (const s of [1, -1]) {
          const sx = bx + dx * len * t, sy = by + dy * len * t;
          out += path(`M${r1(sx)} ${r1(sy)}L${r1(sx + dx * len * 0.12 + nx * w * s)} ${r1(sy + dy * len * 0.12 + ny * w * s)}`, 'v');
        }
      }
    }
    return out;
  }

  /** Folha palmada (videira, hera, ...) com centro do pecíolo em (x, y). */
  function palm(x, y, R, ang, o = {}) {
    const lobes = o.lobes || 5, depth = o.depth ?? 0.35, spread = o.spread ?? 260;
    const pts = [];
    const N = 80;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const th = (ang - spread / 2 + spread * u) * RAD;
      const lob = Math.pow(Math.abs(Math.sin(Math.PI * u * lobes)), 0.6);
      let r = R * ((1 - depth) + depth * lob);
      if (o.teeth) r *= 1 + 0.06 * (((u * o.teeth) % 1) < 0.5 ? 1 : -1);
      r *= 0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, u * 1.08 + 0.0));
      pts.push([x + Math.cos(th) * r, y + Math.sin(th) * r]);
    }
    let out = path((o.teeth ? poly(pts) : smooth(pts, true)), o.cls ?? 'lf');
    for (let k = 0; k < lobes; k++) {
      const th = (ang - spread / 2 + spread * (k + 0.5) / lobes) * RAD;
      out += path(`M${r1(x)} ${r1(y)}L${r1(x + Math.cos(th) * R * 0.75)} ${r1(y + Math.sin(th) * R * 0.75)}`, 'v');
    }
    return out;
  }

  /** Folha composta (sorveira, freixo, sabugueiro). */
  function pinnate(x, y, len, ang, pairs, ll, lw, o = {}) {
    const dx = Math.cos(ang * RAD), dy = Math.sin(ang * RAD);
    let out = path(`M${r1(x)} ${r1(y)}L${r1(x + dx * len)} ${r1(y + dy * len)}`);
    for (let i = 0; i < pairs; i++) {
      const t = 0.18 + 0.82 * i / pairs;
      const px = x + dx * len * t, py = y + dy * len * t;
      for (const s of [1, -1]) out += leaf(px, py, ll, lw, ang + s * (o.spread || 58), { prof: o.prof || 'lance', teeth: o.teeth, veins: 0, vein: o.vein, cls: o.cls });
    }
    out += leaf(x + dx * len, y + dy * len, ll, lw, ang, { prof: o.prof || 'lance', teeth: o.teeth, veins: 0, vein: o.vein, cls: o.cls });
    return out;
  }

  function berries(cx, cy, n, r, R, o = {}) {
    let out = '';
    const pts = [];
    for (let i = 0; i < n * 8 && pts.length < n; i++) {
      const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * R;
      const p = [cx + Math.cos(a) * d, cy + Math.sin(a) * d * (o.squash || 1)];
      if (pts.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > r * 1.55)) pts.push(p);
    }
    if (o.stems) for (const p of pts) out += path(`M${r1(o.stems[0])} ${r1(o.stems[1])}Q${r1((o.stems[0] + p[0]) / 2)} ${r1(Math.min(o.stems[1], p[1]) - 2)} ${r1(p[0])} ${r1(p[1])}`, 'v');
    for (const p of pts) {
      out += circle(p[0], p[1], r, o.cls || 'fr');
      if (o.eye !== false) out += circle(p[0] - r * 0.35, p[1] - r * 0.35, r * 0.28, 'hl');
    }
    return out;
  }

  function flower(cx, cy, r, petals = 5, o = {}) {
    let out = '';
    const rot = o.rot ?? rr(0, 72);
    for (let i = 0; i < petals; i++) {
      const a = rot + i * 360 / petals;
      const px = cx + Math.cos((a - 90) * RAD) * r * 0.52, py = cy + Math.sin((a - 90) * RAD) * r * 0.52;
      out += ellipse(px, py, r * (o.pw || 0.36), r * 0.52, a, o.cls ?? 'fl');
    }
    out += circle(cx, cy, r * (o.c || 0.2), 'fc');
    return out;
  }

  function daisy(cx, cy, r, n = 16, o = {}) {
    let out = '';
    const layers = o.layers || 1;
    for (let L = 0; L < layers; L++) {
      const rot = rr(0, 360 / n);
      const rl = r * (1 - L * 0.22);
      for (let i = 0; i < n; i++) {
        const a = (rot + i * 360 / n) * RAD;
        const px = cx + Math.cos(a) * rl * 0.62, py = cy + Math.sin(a) * rl * 0.62 * (o.tilt || 1);
        out += ellipse(px, py, rl * 0.38, rl * (o.pw || 0.11), rot + i * 360 / n, o.cls ?? 'fl');
      }
    }
    out += circle(cx, cy, r * (o.c || 0.3), 'fc');
    return out;
  }

  /** Umbela: raios a partir da base (x, y) até um tecto achatado. */
  function umbel(x, y, w, h, n, o = {}) {
    let out = '';
    for (let i = 0; i < n; i++) {
      const u = n === 1 ? 0.5 : i / (n - 1);
      const tx = x - w / 2 + w * u, ty = y - h + Math.pow(Math.abs(u - 0.5) * 2, 2) * h * 0.35 + rr(-1, 1);
      out += path(`M${r1(x)} ${r1(y)}L${r1(tx)} ${r1(ty)}`, 'v');
      for (let k = 0; k < (o.florets || 4); k++) out += circle(tx + rr(-2.2, 2.2), ty + rr(-2, 1), o.fr || 1.1, o.cls || 'fl');
    }
    return out;
  }

  /** Espiga de flores ao longo de uma haste. kind: bell | dot | lip | bud */
  function spike(x, y, len, ang, n, size, kind = 'dot', o = {}) {
    const dx = Math.cos(ang * RAD), dy = Math.sin(ang * RAD);
    let out = o.noStem ? '' : path(`M${r1(x)} ${r1(y)}L${r1(x + dx * len)} ${r1(y + dy * len)}`);
    for (let i = 0; i < n; i++) {
      const t = (o.from ?? 0.35) + (1 - (o.from ?? 0.35)) * i / Math.max(1, n - 1);
      const s = i % 2 ? 1 : -1;
      const sz = size * (1 - t * (o.taper ?? 0.35));
      const px = x + dx * len * t - dy * sz * 0.7 * s, py = y + dy * len * t + dx * sz * 0.7 * s;
      if (kind === 'bell') out += path(`M${r1(px - sz * 0.6)} ${r1(py - sz * 0.5)}Q${r1(px)} ${r1(py - sz * 1.3)} ${r1(px + sz * 0.6)} ${r1(py - sz * 0.5)}L${r1(px + sz * 0.5)} ${r1(py + sz * 0.6)}L${r1(px - sz * 0.5)} ${r1(py + sz * 0.6)}Z`, o.cls || 'fl');
      else if (kind === 'lip') out += ellipse(px, py, sz * 0.75, sz * 0.45, ang + s * 50, o.cls || 'fl');
      else if (kind === 'bud') out += ellipse(px, py, sz * 0.5, sz * 0.8, ang + 90 + s * 25, o.cls || 'fd');
      else out += circle(px, py, sz * 0.55, o.cls || 'fd');
    }
    return out;
  }

  /** Copa em nuvem (contorno ondulado) centrada em (cx, cy). */
  function crown(cx, cy, rx, ry, bumps, o = {}) {
    const pts = [];
    const N = bumps * 6;
    const ph = rr(0, Math.PI);
    for (let i = 0; i < N; i++) {
      const th = i / N * Math.PI * 2;
      const lob = Math.pow(Math.abs(Math.sin(th * bumps / 2 + ph)), 0.5);
      const r = (1 - (o.depth ?? 0.1)) + (o.depth ?? 0.1) * lob + rr(-0.02, 0.02);
      const flat = (o.flatBottom && Math.sin(th) > 0) ? 1 - o.flatBottom * Math.sin(th) : 1;
      pts.push([cx + Math.cos(th) * rx * r, cy + Math.sin(th) * ry * r * flat]);
    }
    return path(smooth(pts, true), o.cls ?? 'cr');
  }

  /** Tronco afunilado de (x, yb) a (x + lean, yt). */
  function trunk(x, yb, yt, wb, wt, lean = 0, o = {}) {
    const m = (yb + yt) / 2;
    const left = [[x - wb / 2 - (o.flare || 2), yb], [x - wb / 2 + lean * 0.3, yb - 4], [x - (wb + wt) / 4 + lean * 0.55 + (o.wave || 0), m], [x - wt / 2 + lean, yt]];
    const right = [[x + wt / 2 + lean, yt], [x + (wb + wt) / 4 + lean * 0.55 + (o.wave || 0), m], [x + wb / 2 + lean * 0.3, yb - 4], [x + wb / 2 + (o.flare || 2), yb]];
    return path(smooth(left) + 'L' + smooth(right).slice(1) + 'Z', o.cls ?? 'tr');
  }

  /** Ramificação recursiva (arbustos, ramos nus). */
  function branches(x, y, len, ang, depth, o = {}) {
    let out = '';
    const ex = x + Math.cos(ang * RAD) * len, ey = y + Math.sin(ang * RAD) * len;
    const mx = (x + ex) / 2 + rr(-1.5, 1.5), my = (y + ey) / 2 + rr(-1.5, 1.5);
    out += path(smooth([[x, y], [mx, my], [ex, ey]]), '', ` stroke-width="${r1(Math.max(0.6, (o.w || 1.8) * depth / (o.depth0 || depth)))}"`);
    if (o.thorns && depth <= 2) {
      const tx = (x + ex) / 2, ty = (y + ey) / 2, ta = ang + (rnd() < 0.5 ? 50 : -50);
      out += path(`M${r1(tx)} ${r1(ty)}l${r1(Math.cos(ta * RAD) * 2.6)} ${r1(Math.sin(ta * RAD) * 2.6)}`, '', ' stroke-width="0.7"');
    }
    if (o.at) out += o.at(ex, ey, depth, ang);
    if (depth > 1) {
      const kids = o.kids || 2;
      for (let k = 0; k < kids; k++) {
        const spread = o.spread || 28;
        const a = ang + (kids === 1 ? 0 : -spread + 2 * spread * k / (kids - 1)) + rr(-10, 10);
        out += branches(ex, ey, len * rr(0.62, 0.8), a, depth - 1, { ...o, depth0: o.depth0 || depth });
      }
    }
    return out;
  }

  /** Textura de folhagem: pequenos arcos dentro da copa. */
  function foliage(cx, cy, rx, ry, n) {
    let out = '';
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 0.8;
      const x = cx + Math.cos(a) * rx * d, y = cy + Math.sin(a) * ry * d, w = rr(2.2, 3.6);
      out += path(`M${r1(x - w)} ${r1(y)}q${r1(w)} ${r1(w * 0.9)} ${r1(w * 2)} 0`, 'v');
    }
    return out;
  }

  const ground = (y = 92, x1 = 10, x2 = 90) => path(`M${x1} ${y}Q50 ${y - 2} ${x2} ${y}`, 'g');
  const water = (y = 88) => path(`M14 ${y}q4 -2 8 0t8 0t8 0`, 'g') + path(`M58 ${y + 3}q4 -2 8 0t8 0t8 0`, 'g');

  return { foliage, rnd, rr, smooth, poly, path, line, circle, ellipse, leaf, palm, pinnate, berries, flower, daisy, umbel, spike, crown, trunk, branches, ground, water };
}

/* ============================================================
   As 20 árvores (vista da árvore inteira)
   ============================================================ */
const TREES = {
  Beith(K) { // Vidoeiro: tronco esguio e branco, ramos pendentes
    let s = K.ground();
    s += K.trunk(50, 92, 14, 6, 2, 2, { cls: 'k' });
    for (let y = 26; y < 88; y += K.rr(5, 8)) {
      const side = K.rnd() < 0.5 ? -1 : 1, x = 50 + (92 - y) * 0.02 + 2 * (y < 50 ? 0.4 : 0);
      s += K.path(`M${r1(x + side * 0.6)} ${r1(y)}l${r1(side * K.rr(1.4, 2.6))} ${r1(K.rr(-0.4, 0.4))}`, '', ' stroke-width="1.6"');
    }
    for (let i = 0; i < 10; i++) {
      const side = i % 2 ? 1 : -1, y0 = 20 + i * 5.5, reach = K.rr(14, 30), x0 = 51 + (92 - y0) * 0.02;
      const pts = [[x0, y0], [x0 + side * reach * 0.5, y0 - 6], [x0 + side * reach, y0 + 2], [x0 + side * reach * 1.08, y0 + K.rr(12, 22)]];
      s += K.line(pts, 0.8);
      for (let k = 0; k < 5; k++) {
        const t = 0.38 + k * 0.13, px = x0 + side * reach * Math.min(1.05, t * 1.15), py = y0 - 4 + (t - 0.3) * 30 * (t > 0.6 ? 1.2 : 0.5);
        s += K.leaf(px, py, 3, 2.4, 90 + K.rr(-25, 25), { prof: 'diamond', vein: false });
      }
    }
    return s;
  },
  Luis(K) { // Sorveira: copa redonda com cachos de bagas
    let s = K.ground();
    s += K.trunk(50, 92, 56, 7, 4, -1);
    s += K.line([[49, 62], [40, 52], [34, 44]], 1.4) + K.line([[51, 60], [60, 50], [66, 42]], 1.4);
    s += K.crown(50, 40, 32, 25, 9) + K.foliage(50, 40, 30, 22, 14);
    s += K.pinnate(30, 34, 14, -30, 4, 4.2, 1.8) + K.pinnate(62, 28, 13, -60, 4, 4, 1.7);
    for (const [x, y] of [[36, 46], [50, 50], [64, 45], [44, 30], [70, 34], [56, 24]]) s += K.berries(x, y, 6, 1.5, 4.2);
    return s;
  },
  Fearn(K) { // Amieiro: copa cónica, amentilhos e pinhinhas, junto à água
    let s = K.water(90);
    s += K.trunk(50, 89, 50, 6, 3, 0);
    s += K.crown(50, 44, 24, 32, 11, { depth: 0.12 }) + K.foliage(50, 44, 20, 28, 12);
    for (let i = 0; i < 4; i++) s += K.line([[50, 66 - i * 12], [50 + (i % 2 ? 10 : -10), 58 - i * 12]], 1);
    for (const [x, y] of [[36, 50], [60, 40], [46, 28], [64, 58], [40, 64]]) {
      s += K.path(`M${x} ${y}l0.6 7`, '', ' stroke-width="1.2"') + K.path(`M${x + 2} ${y}l0.6 6`, '', ' stroke-width="1.2"');
      s += K.ellipse(x + 5, y + 3, 1.3, 1.9, 0, 's');
    }
    return s;
  },
  Saille(K) { // Salgueiro-chorão: ramos em cortina
    let s = K.water(90);
    s += K.trunk(50, 89, 52, 11, 6, 1);
    s += K.line([[48, 56], [38, 42], [26, 34]], 2.2) + K.line([[53, 55], [63, 41], [76, 33]], 2.2) + K.line([[50, 54], [51, 36], [50, 24]], 2);
    s += K.path('M16 42C20 22 40 14 50 14C62 14 82 22 85 42', 't');
    for (let x = 16; x <= 85; x += 3) {
      const top = 42 - Math.sin((x - 16) / 69 * Math.PI) * 27;
      const bot = 66 + Math.sin((x - 16) / 69 * Math.PI) * 18 + K.rr(-3, 3);
      const sw = (x - 50) * 0.08;
      s += K.line([[x, top], [x + sw, (top + bot) / 2], [x + sw * 1.6, bot]], 0.7);
      for (let y = top + 6; y < bot - 2; y += 7) s += K.leaf(x + sw * ((y - top) / (bot - top)) * 1.6, y, 4.5, 1.2, 95 + (x < 50 ? 12 : -12), { prof: 'lance', vein: false });
    }
    return s;
  },
  Nion(K) { // Freixo: alto, ramos ascendentes, folhas compostas
    let s = K.ground();
    s += K.trunk(50, 92, 36, 7, 3, 0);
    s += K.line([[50, 60], [38, 44], [32, 26]], 1.4) + K.line([[50, 54], [62, 40], [68, 22]], 1.4) + K.line([[50, 40], [46, 24], [48, 12]], 1.2);
    s += K.crown(50, 36, 27, 30, 9, { depth: 0.08 }) + K.foliage(50, 36, 24, 26, 8);
    s += K.pinnate(34, 40, 16, -110, 4, 5, 1.8) + K.pinnate(64, 30, 15, -70, 4, 5, 1.8) + K.pinnate(48, 22, 12, -95, 3, 4.5, 1.6);
    s += K.berries(40, 52, 4, 0.9, 3, { eye: false });
    return s;
  },
  Huath(K) { // Espinheiro: árvore pequena e retorcida, em flor
    let s = K.ground();
    s += K.path(K.smooth([[40, 92], [43, 78], [51, 68], [45, 56], [49, 46]]), '', ' stroke-width="3.4"');
    s += K.path(K.smooth([[46, 92], [48, 78], [55, 68], [49, 56], [52, 46]]), '', ' stroke-width="2.4"');
    s += K.line([[47, 58], [34, 48], [24, 44]], 1.4) + K.line([[51, 66], [66, 54], [78, 50]], 1.4);
    s += K.crown(51, 40, 36, 19, 10, { flatBottom: 0.25 });
    s += K.foliage(51, 40, 32, 15, 10);
    for (let i = 0; i < 16; i++) {
      const a = K.rnd() * Math.PI * 2, d = Math.sqrt(K.rnd());
      s += K.flower(51 + Math.cos(a) * d * 30, 40 + Math.sin(a) * d * 14, 3, 5);
    }
    return s;
  },
  Duir(K) { // Carvalho: tronco robusto e copa larga
    let s = K.ground();
    s += K.trunk(50, 92, 56, 15, 9, 0, { flare: 4 });
    s += K.line([[46, 60], [34, 50], [20, 46]], 3) + K.line([[54, 60], [66, 48], [80, 44]], 3) + K.line([[50, 58], [48, 42], [52, 30]], 2.4);
    s += K.crown(50, 38, 42, 26, 11, { depth: 0.12, flatBottom: 0.2 }) + K.foliage(50, 36, 38, 20, 18);
    s += K.leaf(30, 34, 12, 6, -60, { prof: 'obovate', lobes: 3.5, lobeDepth: 0.45, veins: 0 });
    s += K.leaf(66, 30, 12, 6, -120, { prof: 'obovate', lobes: 3.5, lobeDepth: 0.45, veins: 0 });
    for (const [x, y] of [[30, 54], [44, 58], [62, 56], [74, 50]]) s += K.ellipse(x, y + 2, 1.5, 2.1, 0, 's') + K.path(`M${x - 1.8} ${y + 0.6}h3.6`, '', ' stroke-width="1.4"');
    return s;
  },
  Tinne(K) { // Azevinho: cónico e denso, folhas picantes e bagas
    let s = K.ground();
    s += K.trunk(50, 92, 80, 6, 4, 0);
    const pts = [];
    for (let i = 0; i <= 12; i++) { const y = 10 + i * 6, w = 4 + i * 2.6; pts.push([50 - w, y], [50 - w + 3.5, y + 3]); }
    const L = pts;
    const R = L.map(([x, y]) => [100 - x, y]).reverse();
    s += K.path(K.poly([[50, 6], ...L, [50, 84], ...R]), 't');
    for (const [x, y] of [[44, 26], [56, 38], [40, 50], [60, 58], [48, 66], [36, 72], [64, 74], [52, 46]]) s += K.berries(x, y, 3, 1.4, 2.6);
    s += K.leaf(42, 60, 9, 5, -150, { spiky: 4, veins: 0 }) + K.leaf(58, 30, 8, 4.4, -30, { spiky: 4, veins: 0 });
    return s;
  },
  Coll(K) { // Aveleira: vários troncos desde a base, amentilhos
    let s = K.ground();
    for (const [tx, ty] of [[28, 30], [38, 22], [50, 18], [62, 22], [72, 30]]) s += K.line([[50, 92], [(50 + tx) / 2 + K.rr(-2, 2), 62], [tx, ty]], 1.6);
    s += K.crown(50, 38, 36, 26, 10, { flatBottom: 0.15 }) + K.foliage(50, 36, 32, 20, 10);
    for (let i = 0; i < 12; i++) {
      const x = K.rr(22, 78), y = K.rr(28, 56);
      s += K.path(`M${r1(x)} ${r1(y)}q0.8 4 0 8`, '', ' stroke-width="1.6" stroke-dasharray="1.2 0.6"');
    }
    s += K.leaf(30, 24, 10, 8, -120, { prof: 'round', teeth: 9, veins: 2 }) + K.leaf(70, 26, 10, 8, -60, { prof: 'round', teeth: 9, veins: 2 });
    return s;
  },
  Quert(K) { // Macieira: copa redonda com maçãs
    let s = K.ground();
    s += K.trunk(50, 92, 62, 10, 6, 1);
    s += K.line([[48, 64], [36, 54], [28, 48]], 2) + K.line([[53, 63], [64, 54], [72, 48]], 2);
    s += K.crown(50, 42, 34, 26, 10) + K.foliage(50, 42, 30, 22, 10);
    for (const [x, y] of [[34, 44], [48, 52], [62, 46], [42, 32], [58, 30], [70, 38], [28, 36]]) {
      s += K.path(`M${x - 3} ${y}C${x - 3.4} ${y + 3.6} ${x + 3.4} ${y + 3.6} ${x + 3} ${y}C${x + 3} ${y - 3} ${x + 0.8} ${y - 3} ${x} ${y - 2}C${x - 0.8} ${y - 3} ${x - 3} ${y - 3} ${x - 3} ${y}Z`, 'f');
      s += K.path(`M${x} ${y - 2}l0.6 -1.8`, '', ' stroke-width="0.8"');
    }
    return s;
  },
  Muin(K) { // Videira: tronco torcido numa latada, folhas e cachos
    let s = K.ground();
    s += K.path('M20 92V20M80 92V20M14 20H86', '', ' stroke-width="2"');
    s += K.line([[48, 92], [52, 80], [46, 66], [53, 52], [47, 38], [52, 26], [50, 20]], 2.6);
    s += K.line([[50, 22], [36, 18], [22, 22]], 1.2) + K.line([[50, 22], [64, 18], [78, 22]], 1.2);
    for (const [x, y, a] of [[28, 26, 80], [42, 25, 100], [58, 25, 80], [72, 26, 100], [52, 44, 10], [46, 58, 170]]) s += K.palm(x, y + 6, 7, a, { lobes: 5, depth: 0.35, teeth: 14 });
    for (const x of [34, 64]) {
      for (let row = 0; row < 5; row++) for (let k = 0; k <= 4 - row; k++) s += K.circle(x - (4 - row) * 1.6 + k * 3.2, 36 + row * 3, 1.6, 'f');
      s += K.path(`M${x} 22V35`, '', ' stroke-width="0.8"');
    }
    s += K.path('M60 30c3 -2 5 1 3 3s-4 0 -2 -2', '', ' stroke-width="0.6"');
    return s;
  },
  Gort(K) { // Hera: sobe em espiral por um tronco
    let s = K.ground();
    s += K.trunk(50, 92, 12, 12, 8, 0, { cls: 'k' });
    s += K.line([[46, 30], [36, 20], [30, 12]], 1.6) + K.line([[54, 26], [64, 16], [70, 10]], 1.6);
    const pts = [];
    for (let y = 92; y >= 18; y -= 2) pts.push([50 + Math.sin(y / 6) * 6.5, y]);
    s += K.path(K.smooth(pts), '', ' stroke-width="1.1"');
    let i = 0;
    for (let y = 88; y >= 22; y -= 6.5) {
      const x = 50 + Math.sin(y / 6) * 6.5, side = i++ % 2 ? 1 : -1;
      s += K.palm(x + side * 5, y - 2, 5, side > 0 ? -20 : 200, { lobes: 3, depth: 0.45, spread: 220 });
    }
    return s;
  },
  Ngetal(K) { // Junco / caniço: touceira com penachos, junto à água
    let s = K.water(90);
    const tops = [];
    for (let i = 0; i < 11; i++) {
      const bx = 40 + i * 2, tx = 20 + i * 6 + K.rr(-2, 2), ty = K.rr(12, 30);
      s += K.line([[bx, 90], [(bx + tx) / 2, (90 + ty) / 2 + 6], [tx, ty]], 1);
      tops.push([tx, ty]);
      s += K.leaf((bx * 2 + tx) / 3, (180 + ty) / 3 + 10, 18, 2.6, i < 5 ? -150 + i * 6 : -30 - (10 - i) * 6, { prof: 'lance', vein: false });
    }
    for (const [x, y] of tops.filter((_, k) => k % 2 === 0)) {
      for (let k = 0; k < 7; k++) s += K.path(`M${r1(x)} ${r1(y)}q${r1(-3 + k)} -2 ${r1(-4 + k * 1.4)} ${r1(-7 + Math.abs(k - 3))}`, '', ' stroke-width="0.6"');
    }
    return s;
  },
  Straif(K) { // Abrunheiro: arbusto espinhoso, flor branca e abrunhos
    let s = K.ground();
    for (const a of [-140, -115, -90, -65, -40]) {
      s += K.branches(50, 92, 22, a, 4, { thorns: true, w: 2, spread: 30, at: (x, y, d) => d === 1 ? (K.rnd() < 0.55 ? K.flower(x, y, 3, 5) : K.berries(x, y, 1, 1.8, 0.1)) : '' });
    }
    return s;
  },
  Ruis(K) { // Sabugueiro: arbusto de vários caules com umbelas
    let s = K.ground();
    for (const [tx, ty] of [[24, 40], [36, 28], [50, 24], [64, 28], [76, 40]]) s += K.line([[50, 92], [(50 + tx) / 2, 64], [tx, ty]], 1.8);
    s += K.crown(50, 40, 36, 24, 9, { flatBottom: 0.2 });
    for (const [x, y] of [[30, 38], [44, 28], [60, 30], [72, 42], [52, 48], [36, 52]]) s += K.umbel(x, y + 6, 13, 7, 6, { florets: 3, fr: 1 });
    s += K.pinnate(22, 58, 12, -160, 2, 6, 2.6, { prof: 'ovate', teeth: 7 }) + K.pinnate(78, 58, 12, -20, 2, 6, 2.6, { prof: 'ovate', teeth: 7 });
    return s;
  },
  Ailm(K) { // Abeto / pinheiro: cónico em andares
    let s = K.ground();
    s += K.trunk(50, 92, 78, 6, 4, 0);
    for (let i = 0; i < 7; i++) {
      const y = 12 + i * 9.5, w = 7 + i * 5.2, h = 11;
      s += K.path(`M50 ${y}C${50 - w * 0.4} ${y + h * 0.5} ${50 - w * 0.8} ${y + h * 0.9} ${50 - w} ${y + h + 1}C${50 - w * 0.6} ${y + h - 1.5} ${50 - w * 0.3} ${y + h + 1} 50 ${y + h - 1}C${50 + w * 0.3} ${y + h + 1} ${50 + w * 0.6} ${y + h - 1.5} ${50 + w} ${y + h + 1}C${50 + w * 0.8} ${y + h * 0.9} ${50 + w * 0.4} ${y + h * 0.5} 50 ${y}Z`, 't');
    }
    s += K.path('M50 6V14', '', ' stroke-width="1.4"');
    s += K.ellipse(36, 50, 1.6, 3, 0, 's') + K.ellipse(64, 60, 1.6, 3, 0, 's');
    return s;
  },
  Onn(K) { // Tojo: moita baixa e espinhosa, flores douradas
    let s = K.ground();
    s += K.crown(50, 68, 42, 28, 13, { depth: 0.14, flatBottom: 0.75 });
    for (let i = 0; i < 70; i++) {
      const a = K.rr(Math.PI, Math.PI * 2), d = K.rr(0.3, 1);
      const x = 50 + Math.cos(a) * 38 * d, y = 88 + Math.sin(a) * 40 * d;
      const aa = a + K.rr(-0.4, 0.4);
      s += K.path(`M${r1(x)} ${r1(y)}l${r1(Math.cos(aa) * 3)} ${r1(Math.sin(aa) * 3)}`, '', ' stroke-width="0.7"');
    }
    for (let i = 0; i < 28; i++) {
      const a = K.rr(Math.PI * 1.05, Math.PI * 1.95), d = K.rr(0.35, 0.95);
      s += K.ellipse(50 + Math.cos(a) * 38 * d, 88 + Math.sin(a) * 40 * d, 1.7, 1.2, K.rr(0, 180), 's');
    }
    return s;
  },
  Ur(K) { // Urze: tufos baixos na charneca, espigas de campânulas
    let s = K.path('M6 92Q30 80 50 84T94 86', 'g');
    for (const [cx, base, h] of [[26, 86, 26], [52, 84, 36], [76, 86, 24]]) {
      for (let k = -2; k <= 2; k++) {
        const x = cx + k * 3.5, a = -90 + k * 11;
        s += K.spike(x, base, h * (1 - Math.abs(k) * 0.1), a, 7, 2, 'dot', { from: 0.4, cls: 'tt' });
      }
      s += K.crown(cx, base - 4, 12, 5, 6, { depth: 0.2 });
    }
    return s;
  },
  Eadha(K) { // Choupo-tremedor (álamo): troncos finos, folhas redondas a tremer
    let s = K.ground();
    for (const [x, top, w] of [[38, 20, 4], [56, 14, 5], [70, 30, 3.4]]) {
      s += K.trunk(x, 92, top, w, 1.6, 0, { cls: 'k', flare: 1 });
      for (let y = top + 14; y < 88; y += 9) s += K.path(`M${x - 1} ${y}l1 -1.2l1 1.2l-1 1.2Z`, 's');
      s += K.crown(x, top + 14, 10 + w, 20, 7, { depth: 0.12 });
      for (let k = 0; k < 9; k++) {
        const lx = x + K.rr(-10, 10), ly = top + K.rr(0, 30);
        s += K.leaf(lx, ly, 4.2, 4.6, K.rr(40, 140), { prof: 'round', stalk: 2, vein: false });
      }
    }
    return s;
  },
  Ioho(K) { // Teixo: copa larga e escura, tronco canelado, arilos vermelhos
    let s = K.ground();
    s += K.trunk(50, 92, 58, 18, 12, 0, { flare: 4 });
    for (const dx of [-5, -1.5, 2, 5.5]) s += K.path(`M${50 + dx} 90C${50 + dx * 1.2} 80 ${50 + dx * 0.8} 70 ${50 + dx * 0.9} 60`, 'v');
    s += K.crown(50, 54, 42, 12, 10, { cls: 'tt', flatBottom: 0.4 });
    s += K.crown(50, 40, 36, 13, 9, { cls: 'tt' });
    s += K.crown(50, 26, 26, 12, 7, { cls: 'tt' });
    for (const [x, y] of [[30, 50], [44, 40], [60, 44], [70, 54], [38, 28], [58, 24], [50, 56]]) s += K.circle(x, y, 2, 's') + K.circle(x, y - 0.4, 0.8, 'k');
    return s;
  }
};

/* ============================================================
   As ervas (e as partes das árvores usadas como remédio)
   ============================================================ */
const HERBS = {
  'casca de vidoeiro'(K) {
    let s = K.path('M22 30C40 24 62 26 78 32L74 70C58 64 40 64 26 70Z', 'k');
    s += K.path('M78 32C86 38 86 48 80 52C76 48 74 40 78 32Z', 't');
    for (let i = 0; i < 9; i++) { const y = K.rr(34, 64), x = K.rr(28, 70); s += K.path(`M${r1(x)} ${r1(y)}h${r1(K.rr(4, 9))}`, '', ' stroke-width="1.6"'); }
    return s;
  },
  'dente-de-leão'(K) {
    let s = '';
    for (const a of [-170, -140, -40, -10]) s += K.leaf(50, 86, 26, 7, a, { prof: 'lance', spiky: 5, veins: 0 });
    s += K.line([[46, 86], [40, 60], [34, 34]], 1.2) + K.line([[54, 86], [60, 58], [64, 46]], 1.2);
    for (let i = 0; i < 18; i++) { const a = i * 20 * RAD; s += K.path(`M34 34l${r1(Math.cos(a) * 11)} ${r1(Math.sin(a) * 11)}`, 'v') + K.circle(34 + Math.cos(a) * 11, 34 + Math.sin(a) * 11, 1, 's'); }
    s += K.daisy(64, 42, 8, 22, { layers: 2, c: 0.22 });
    return s;
  },
  'bagas de sorveira'(K) {
    return K.pinnate(18, 80, 40, -42, 5, 9, 3.4, { teeth: 7 }) + K.line([[60, 20], [62, 36]], 1) + K.berries(64, 50, 12, 3.4, 15, { stems: [62, 36] });
  },
  'verbena'(K) {
    let s = K.line([[50, 92], [50, 50], [50, 14]], 1.2);
    s += K.line([[50, 62], [34, 40], [28, 20]], 1) + K.line([[50, 56], [66, 36], [72, 18]], 1);
    for (const [x, y, a] of [[50, 14, -90], [28, 20, -110], [72, 18, -70]]) s += K.spike(x, y + 14, 14, a, 6, 3, 'dot', { from: 0.1, noStem: true });
    s += K.leaf(50, 78, 16, 7, -160, { prof: 'lance', lobes: 3, lobeDepth: 0.5, veins: 0 }) + K.leaf(50, 76, 16, 7, -20, { prof: 'lance', lobes: 3, lobeDepth: 0.5, veins: 0 });
    return s;
  },
  'folhas de amieiro'(K) {
    return K.leaf(46, 88, 52, 40, -80, { prof: 'obovate', teeth: 14, veins: 5, stalk: 6 }) + K.line([[70, 30], [78, 20]], 1) + K.ellipse(80, 16, 3.4, 5, 20, 't') + K.path('M78 13l4 6M77 17l5 -1', 'v');
  },
  'ulmeira'(K) {
    let s = K.line([[50, 94], [50, 50], [48, 28]], 1.4);
    for (const [x, y, a] of [[48, 30, -130], [48, 30, -50], [49, 38, -150], [49, 38, -30]]) s += K.line([[x, y], [x + Math.cos(a * RAD) * 14, y + Math.sin(a * RAD) * 12]], 0.8);
    for (let i = 0; i < 70; i++) { const a = K.rnd() * Math.PI, d = Math.sqrt(K.rnd()); s += K.circle(48 + Math.cos(a) * d * 24, 24 - Math.sin(a) * d * 16 + 4, 1.1, K.rnd() < 0.6 ? 'k' : 's'); }
    s += K.pinnate(50, 76, 20, -160, 2, 8, 3.4, { prof: 'ovate', teeth: 7 }) + K.pinnate(50, 68, 18, -20, 2, 8, 3.4, { prof: 'ovate', teeth: 7 });
    return s;
  },
  'casca de salgueiro'(K) {
    let s = K.path('M26 20C34 16 52 16 60 22L58 84C48 80 36 80 28 84Z', 'k');
    for (const x of [32, 38, 44, 50, 55]) s += K.path(`M${x} 24C${x + 2} 40 ${x - 2} 60 ${x + 1} 80`, 'v');
    s += K.leaf(64, 74, 30, 6, -70, { prof: 'lance', teeth: 20 }) + K.leaf(66, 76, 24, 5, -40, { prof: 'lance' });
    return s;
  },
  'artemísia'(K) {
    let s = K.line([[50, 94], [50, 50], [50, 12]], 1.2);
    for (const [y, a] of [[80, -160], [72, -20], [62, -150], [54, -30], [44, -140], [36, -40]]) s += K.pinnate(50, y, 15 - (80 - y) * 0.12, a, 2, 6, 1.6, { spread: 50, vein: false });
    s += K.spike(50, 34, 22, -90, 8, 2.6, 'dot', { from: 0.1, noStem: true, cls: 't' });
    return s;
  },
  'sementes de freixo'(K) {
    let s = K.line([[50, 10], [50, 24]], 1.2);
    for (let i = 0; i < 6; i++) {
      const a = 38 + i * 21 + K.rr(-3, 3);
      const ex = 50 + Math.cos(a * RAD) * 14, ey = 24 + Math.sin(a * RAD) * 14;
      s += K.path(`M50 24L${r1(ex)} ${r1(ey)}`, 'v');
      s += K.leaf(ex, ey, 30, 6.5, a + K.rr(-6, 6), { prof: 'obovate', veins: 0 });
      s += K.ellipse(ex + Math.cos(a * RAD) * 4, ey + Math.sin(a * RAD) * 4, 1.5, 3.4, a + 90, 's');
    }
    return s;
  },
  'agrimónia'(K) {
    let s = K.spike(50, 94, 80, -90, 14, 5.4, 'dot', { from: 0.35, cls: 's' });
    for (let i = 0; i < 14; i++) { const t = 0.35 + 0.65 * i / 13, y = 94 - 80 * t, sz = 5.4 * (1 - t * 0.35), x = 50 + (i % 2 ? 1 : -1) * sz * 0.7; s += K.flower(x, y, sz * 1.3, 5, { cls: 'k', c: 0.3 }); }
    s += K.pinnate(50, 84, 22, -165, 3, 7, 3.2, { prof: 'ovate', teeth: 7 }) + K.pinnate(50, 80, 22, -15, 3, 7, 3.2, { prof: 'ovate', teeth: 7 });
    return s;
  },
  'flores de espinheiro'(K) {
    let s = K.line([[14, 84], [40, 62], [72, 40], [86, 24]], 1.6);
    s += K.path('M40 62l-2 -6M60 48l3 5', '', ' stroke-width="0.9"');
    s += K.leaf(30, 70, 18, 14, 120, { prof: 'obovate', lobes: 2.5, lobeDepth: 0.5, veins: 0, stalk: 3 });
    s += K.leaf(64, 44, 16, 13, 70, { prof: 'obovate', lobes: 2.5, lobeDepth: 0.5, veins: 0, stalk: 3 });
    for (const [x, y] of [[44, 34], [54, 26], [36, 44], [62, 32], [48, 46], [72, 22]]) s += K.flower(x, y, 8, 5) + K.path(`M${x} ${y}l1 4`, 'v');
    return s;
  },
  'rosa silvestre'(K) {
    let s = K.line([[16, 92], [40, 72], [48, 50]], 1.6) + K.path('M30 82l-3 -3M42 66l3 -2', '', ' stroke-width="0.9"');
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * RAD, px = 52 + Math.cos(a) * 13, py = 36 + Math.sin(a) * 13;
      s += `<path class="k" transform="rotate(${i * 72} 52 36)" d="M52 36C44 30 42 18 48 15C50 14 51 16 52 18C53 16 54 14 56 15C62 18 60 30 52 36Z"/>`;
      void px; void py;
    }
    s += K.circle(52, 36, 5, 't');
    for (let i = 0; i < 12; i++) { const a = i * 30 * RAD; s += K.circle(52 + Math.cos(a) * 4.2, 36 + Math.sin(a) * 4.2, 0.8, 's'); }
    s += K.pinnate(36, 74, 20, 170, 2, 7, 4, { prof: 'ovate', teeth: 8 });
    s += K.ellipse(80, 72, 4, 6, -20, 's') + K.path('M78 66l3 -6M78 66l-3 -3M78 66l5 -2', '', ' stroke-width="0.8"') + K.line([[48, 58], [70, 64], [78, 66]], 1);
    return s;
  },
  'bolota'(K) {
    let s = K.leaf(20, 86, 46, 24, -55, { prof: 'obovate', lobes: 4.5, lobeDepth: 0.42, veins: 4, stalk: 4 });
    for (const [x, y, a] of [[64, 56, -10], [76, 66, 15]]) {
      s += `<g transform="rotate(${a} ${x} ${y})">${K.ellipse(x, y + 8, 7, 10, 0, 't')}<path class="tt" d="M${x - 9} ${y + 2}C${x - 9} ${y - 7} ${x + 9} ${y - 7} ${x + 9} ${y + 2}Z"/>`;
      for (let k = -2; k <= 2; k++) s += K.path(`M${x + k * 3.4} ${y + 1}l1 -2`, 'v');
      s += K.path(`M${x} ${y - 5}v-6`, '', ' stroke-width="1.2"') + '</g>';
    }
    return s;
  },
  'musgo de carvalho'(K) {
    let s = K.line([[6, 96], [50, 90], [94, 96]], 2.4);
    for (const a of [-150, -120, -90, -60, -30]) s += K.branches(50, 92, 20, a, 4, { kids: 2, spread: 26, w: 2.6, at: (x, y, d) => d === 1 ? K.circle(x, y, 1.1, 's') : '' });
    return s;
  },
  'viscum'(K) {
    let s = '';
    const fork = (x, y, ang, d) => {
      if (!d) return;
      const ex = x + Math.cos(ang * RAD) * 14, ey = y + Math.sin(ang * RAD) * 14;
      s += K.line([[x, y], [ex, ey]], 1.4);
      if (d === 1) { s += K.leaf(ex, ey, 20, 7, ang - 28, { prof: 'obovate', vein: false }) + K.leaf(ex, ey, 20, 7, ang + 28, { prof: 'obovate', vein: false }) + K.circle(ex, ey - 1, 2.8, 'k') + K.circle(ex, ey - 1, 0.6, 's'); return; return; }
      fork(ex, ey, ang - 34, d - 1); fork(ex, ey, ang + 34, d - 1);
    };
    fork(50, 94, -90, 3);
    return s;
  },
  'folhas de azevinho'(K) {
    return K.line([[50, 94], [50, 50]], 1.4) + K.leaf(50, 56, 34, 18, -140, { spiky: 4.5, veins: 0, stalk: 2 }) + K.leaf(50, 52, 34, 18, -40, { spiky: 4.5, veins: 0, stalk: 2 }) + K.leaf(50, 66, 26, 14, -95, { spiky: 3.5, veins: 0 }) + K.berries(50, 58, 5, 3.4, 7);
  },
  'cardo santo'(K) {
    let s = K.line([[50, 94], [50, 46]], 1.4);
    s += K.leaf(50, 80, 30, 12, -165, { prof: 'lance', spiky: 6, veins: 0 }) + K.leaf(50, 72, 30, 12, -15, { prof: 'lance', spiky: 6, veins: 0 });
    s += K.path('M36 46C36 30 64 30 64 46C62 54 38 54 36 46Z', 't');
    for (let i = 0; i < 9; i++) { const a = (200 + i * 17) * RAD; s += K.path(`M${r1(50 + Math.cos(a) * 12)} ${r1(44 - Math.sin(a) * -8)}l${r1(Math.cos(a) * 9)} ${r1(Math.sin(a) * 7)}`, '', ' stroke-width="0.8"'); }
    for (let i = 0; i < 9; i++) s += K.path(`M${42 + i * 2} 36q${r1((i - 4) * 0.6)} -8 ${r1((i - 4) * 1.4)} -14`, '', ' stroke-width="1"');
    return s;
  },
  'avelãs'(K) {
    let s = K.leaf(18, 84, 36, 30, -60, { prof: 'round', teeth: 16, veins: 4, stalk: 4 });
    s += K.line([[46, 20], [60, 34]], 1.2);
    for (const [x, y] of [[58, 52], [72, 46]]) {
      s += K.circle(x, y + 4, 8, 'tt') + K.circle(x - 2.2, y + 2, 1.8, 'k');
      s += K.path(`M${x - 9} ${y}C${x - 6} ${y - 8} ${x - 4} ${y - 4} ${x - 2} ${y - 10}C${x} ${y - 4} ${x + 3} ${y - 9} ${x + 4} ${y - 4}C${x + 6} ${y - 8} ${x + 8} ${y - 3} ${x + 9} ${y}C${x + 4} ${y - 3} ${x - 4} ${y - 3} ${x - 9} ${y}Z`, 't');
    }
    return s;
  },
  'sálvia'(K) {
    let s = K.line([[50, 94], [50, 14]], 1.2);
    for (const [y, l] of [[84, 24], [70, 22], [56, 18]]) for (const a of [-155, -25]) s += K.leaf(50, y, l, 10, a, { prof: 'ovate', teeth: 14, veins: 3, stalk: 3 });
    s += K.spike(50, 46, 32, -90, 8, 5, 'lip', { from: 0.25, noStem: true, cls: 't' });
    return s;
  },
  'flor de macieira'(K) {
    let s = K.line([[14, 90], [44, 62], [56, 50]], 1.8);
    s += K.leaf(40, 66, 26, 14, 150, { prof: 'ovate', teeth: 14 }) + K.leaf(46, 60, 24, 13, -70, { prof: 'ovate', teeth: 12 });
    for (const [x, y, r] of [[60, 38, 13], [78, 54, 10], [40, 30, 9]]) s += K.flower(x, y, r, 5, { pw: 0.42 }) + K.line([[56, 50], [x, y]], 0.8);
    for (const [x, y] of [[70, 24], [84, 38]]) s += K.ellipse(x, y, 3, 4.4, 30, 't');
    return s;
  },
  'camomila'(K) {
    let s = '';
    for (const [x, y, r, bx] of [[34, 34, 11, 46], [66, 26, 12, 52], [56, 56, 9, 50]]) {
      s += K.line([[bx, 94], [(bx + x) / 2, (94 + y) / 2], [x, y + r * 0.4]], 1);
      s += K.daisy(x, y, r, 14, { c: 0.32 });
    }
    for (const [x, y, a] of [[48, 80, -150], [52, 74, -30], [50, 66, -150]]) s += K.pinnate(x, y, 12, a, 3, 5, 1, { vein: false, spread: 50 });
    return s;
  },
  'folha de videira'(K) {
    return K.line([[50, 94], [50, 68]], 1.4) + K.palm(50, 66, 30, -90, { lobes: 5, depth: 0.32, teeth: 30, spread: 290 }) + K.path('M54 80c10 -2 16 6 12 10s-8 -2 -4 -4', '', ' stroke-width="0.9"');
  },
  'amora silvestre'(K) {
    let s = K.line([[10, 70], [40, 52], [76, 40]], 1.8);
    for (const [x, y, a] of [[22, 63, -60], [34, 55, 60], [54, 47, -60], [66, 43, 60]]) s += K.path(`M${x} ${y}l${r1(Math.cos(a * RAD) * 3)} ${r1(Math.sin(a * RAD) * 3)}`, '', ' stroke-width="0.9"');
    for (const a of [-140, -90, -40]) s += K.leaf(30, 58, 18, 10, a, { prof: 'ovate', teeth: 12, veins: 2, stalk: 2 });
    s += K.line([[60, 44], [62, 58]], 1) + K.line([[70, 42], [78, 62]], 1);
    for (const [cx, cy, n, cls] of [[62, 66, 11, 's'], [78, 70, 9, 'tt']]) {
      for (let i = 0; i < n; i++) { const a = K.rnd() * Math.PI * 2, d = Math.sqrt(K.rnd()) * 4.4; s += K.circle(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 1.3, 2.1, cls); }
    }
    return s;
  },
  'hera terrestre'(K) {
    let s = K.line([[6, 86], [30, 80], [56, 84], [94, 78]], 1.2);
    for (const [x, y] of [[22, 82], [70, 82]]) {
      s += K.leaf(x, y, 10, 12, -125, { prof: 'heart', teeth: 9, vein: false, stalk: 9 }) + K.leaf(x, y, 10, 12, -55, { prof: 'heart', teeth: 9, vein: false, stalk: 9 });
    }
    s += K.line([[46, 82], [46, 54], [48, 22]], 1.1);
    for (const [y, sz] of [[70, 11], [50, 9], [32, 7]]) {
      s += K.leaf(46.5, y, sz, sz * 1.15, -160, { prof: 'heart', teeth: 8, vein: false, stalk: 5 }) + K.leaf(46.5, y, sz, sz * 1.15, -20, { prof: 'heart', teeth: 8, vein: false, stalk: 5 });
    }
    for (const [y, sd] of [[60, -1], [60, 1], [42, -1], [42, 1]]) s += K.path(`M${46.5 + sd * 2} ${y}l${sd * 6} -2l${sd * 1} 3.4Z`, 'tt');
    return s;
  },
  'alecrim'(K) {
    let s = '';
    for (const [bx, tx, ty] of [[46, 32, 10], [52, 58, 6], [56, 76, 18]]) {
      s += K.line([[bx, 94], [tx, ty]], 1.2);
      const n = 11;
      for (let i = 2; i < n; i++) {
        const t = i / n, x = bx + (tx - bx) * t, y = 94 + (ty - 94) * t, ang = Math.atan2(ty - 94, tx - bx) / RAD;
        for (const sd of [1, -1]) s += K.leaf(x, y, 11 - t * 4, 1.5, ang + sd * 62, { prof: 'lance', vein: false });
      }
    }
    for (const [x, y] of [[40, 30], [62, 26], [70, 40]]) s += K.ellipse(x, y, 2.6, 1.6, 30, 'k');
    return s;
  },
  'raiz de junco'(K) {
    let s = K.path('M8 44H92', 'g') + K.path('M8 48q4 -2 8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0t8 0', 'g');
    s += K.path('M10 66C24 60 36 70 50 64S76 60 90 66', '', ' stroke-width="4.2"');
    for (let x = 16; x < 88; x += 12) s += K.path(`M${x} 66v-3`, 'k', ' stroke-width="1.6"');
    for (const x of [26, 50, 74]) {
      s += K.line([[x, 64], [x - 1, 30], [x - 3, 10]], 1.1) + K.line([[x + 2, 64], [x + 4, 34], [x + 8, 18]], 1);
      for (let k = 0; k < 5; k++) s += K.line([[x - 6 + k * 3, 68], [x - 8 + k * 4, 78], [x - 10 + k * 5, 88]], 0.6);
    }
    return s;
  },
  'valeriana'(K) {
    let s = K.line([[50, 94], [50, 36]], 1.3);
    s += K.line([[50, 40], [36, 28]], 1) + K.line([[50, 40], [64, 28]], 1);
    s += K.umbel(36, 28, 20, 12, 6, { florets: 4, fr: 1.4 }) + K.umbel(64, 28, 20, 12, 6, { florets: 4, fr: 1.4 }) + K.umbel(50, 36, 18, 16, 5, { florets: 4, fr: 1.4 });
    s += K.pinnate(50, 80, 26, -160, 4, 8, 2.6) + K.pinnate(50, 72, 26, -20, 4, 8, 2.6);
    return s;
  },
  'abrunhos'(K) {
    let s = K.line([[8, 30], [40, 40], [92, 36]], 1.8);
    for (const [x, y, a] of [[24, 35, -70], [50, 40, 70], [70, 37, -80], [84, 36, 60]]) s += K.path(`M${x} ${y}l${r1(Math.cos(a * RAD) * 8)} ${r1(Math.sin(a * RAD) * 8)}`, '', ' stroke-width="1.1"');
    s += K.leaf(30, 38, 18, 9, 120, { prof: 'obovate', teeth: 12 }) + K.leaf(62, 38, 16, 8, 60, { prof: 'obovate', teeth: 10 });
    for (const [x, y] of [[40, 58], [52, 62], [76, 58]]) s += K.line([[x - 1, 40], [x, y - 7]], 0.9) + K.circle(x, y, 7.4, 's') + K.ellipse(x - 2.6, y - 2.8, 2.2, 1.5, -30, 'k');
    return s;
  },
  'absinto'(K) {
    let s = K.line([[50, 94], [50, 10]], 1.2);
    for (const [y, a, l] of [[82, -160, 20], [74, -20, 20], [64, -155, 17], [56, -25, 16]]) s += K.pinnate(50, y, l, a, 2, 7, 2.6, { prof: 'obovate', spread: 45, cls: 'k', vein: false });
    for (const [y, a] of [[44, -140], [36, -40], [28, -130], [20, -50]]) {
      const ex = 50 + Math.cos(a * RAD) * 14, ey = y + Math.sin(a * RAD) * 10;
      s += K.line([[50, y], [ex, ey]], 0.8);
      for (let k = 0; k < 4; k++) s += K.circle(50 + (ex - 50) * (0.4 + k * 0.2), y + (ey - y) * (0.4 + k * 0.2) + 2, 1.5, 's');
    }
    return s;
  },
  'flor e baga de sabugueiro'(K) {
    let s = K.line([[10, 94], [36, 60], [40, 40]], 1.4) + K.line([[36, 60], [70, 56], [74, 44]], 1.2);
    s += K.umbel(40, 40, 34, 22, 8, { florets: 5, fr: 1.7 });
    s += K.line([[74, 44], [66, 64]], 0.8) + K.line([[74, 44], [84, 66]], 0.8) + K.line([[74, 44], [76, 70]], 0.8);
    s += K.berries(75, 72, 16, 2, 11, { eye: false });
    s += K.leaf(28, 76, 18, 8, 150, { prof: 'ovate', teeth: 12 });
    return s;
  },
  'agulhas de pinheiro'(K) {
    let s = K.line([[10, 86], [46, 54], [86, 18]], 2);
    for (let i = 0; i < 26; i++) {
      const t = 0.1 + i * 0.034, x = 10 + 76 * t, y = 86 - 68 * t;
      s += K.path(`M${r1(x)} ${r1(y)}l${r1(K.rr(2, 8))} ${r1(-K.rr(12, 18))}`, '', ' stroke-width="0.7"') + K.path(`M${r1(x)} ${r1(y)}l${r1(-K.rr(6, 14))} ${r1(-K.rr(6, 14))}`, '', ' stroke-width="0.7"');
    }
    s += K.ellipse(56, 72, 8, 13, -30, 't');
    for (let k = 0; k < 5; k++) s += K.path(`M${50 + k * 1.2} ${62 + k * 4}q6 -1 12 -4`, 'v');
    return s;
  },
  'resina'(K) {
    let s = K.path('M14 8H62V94H14Z', 'k');
    for (const x of [20, 30, 40, 52]) s += K.path(`M${x} 10C${x + 3} 30 ${x - 2} 60 ${x + 1} 92`, 'v');
    s += K.path('M50 30C50 30 46 40 48 46C48 52 54 54 56 48C58 42 50 30 50 30Z', 's');
    s += K.path('M70 46C70 46 62 62 64 70C66 80 78 80 80 70C82 62 70 46 70 46Z', 's') + K.ellipse(67, 66, 1.6, 3, 20, 'k');
    return s;
  },
  'flores douradas de tojo'(K) {
    let s = K.line([[14, 88], [50, 52], [84, 18]], 1.8);
    for (let i = 0; i < 16; i++) {
      const t = 0.08 + i * 0.058, x = 14 + 70 * t, y = 88 - 70 * t, sd = i % 2 ? 1 : -1;
      s += K.path(`M${r1(x)} ${r1(y)}l${r1(sd * 9)} ${r1(-4 + sd * 4)}`, '', ' stroke-width="1"');
    }
    for (const [x, y] of [[30, 64], [44, 50], [58, 40], [70, 28], [38, 72], [64, 52]]) {
      s += K.ellipse(x, y - 4, 4, 5.4, 0, 's') + K.ellipse(x - 3, y + 1, 3, 2.4, -30, 't') + K.ellipse(x + 3, y + 1, 3, 2.4, 30, 't');
    }
    return s;
  },
  'calêndula'(K) {
    let s = K.line([[50, 94], [50, 46]], 1.4);
    s += K.leaf(50, 84, 28, 8, -160, { prof: 'obovate' }) + K.leaf(50, 74, 26, 8, -20, { prof: 'obovate' });
    s += K.daisy(50, 34, 26, 20, { layers: 2, pw: 0.12, c: 0.24 });
    return s;
  },
  'flores de urze'(K) {
    let s = '';
    for (const [x, a] of [[40, -100], [52, -88], [64, -76]]) s += K.spike(x, 94, 78, a, 11, 4.2, 'bell', { from: 0.4, taper: 0.2 });
    for (let i = 0; i < 10; i++) s += K.path(`M${r1(38 + i * 2.8)} ${r1(88 - (i % 3) * 8)}l${i % 2 ? 2 : -2} -2`, '', ' stroke-width="0.8"');
    return s;
  },
  'lavanda'(K) {
    let s = '';
    for (const [x, a] of [[38, -104], [50, -90], [62, -76]]) {
      s += K.line([[x + (a + 90) * -0.1, 94], [x, 50], [x + Math.cos(a * RAD) * 44, 94 + Math.sin(a * RAD) * 84]], 1);
      s += K.spike(x + Math.cos(a * RAD) * 24, 94 + Math.sin(a * RAD) * 52, 32, a, 10, 4.6, 'bud', { from: 0.05, noStem: true, taper: 0.4 });
    }
    s += K.leaf(46, 88, 22, 3.4, -150, { prof: 'lance', vein: false }) + K.leaf(54, 88, 22, 3.4, -30, { prof: 'lance', vein: false });
    return s;
  },
  'folhas de choupo'(K) {
    return K.leaf(30, 94, 36, 38, -72, { prof: 'round', teeth: 14, veins: 3, stalk: 22 }) + K.leaf(80, 92, 20, 22, -100, { prof: 'round', teeth: 10, veins: 2, stalk: 14 });
  },
  'erva-cidreira'(K) {
    let s = K.line([[50, 94], [50, 14]], 1.2);
    for (const [y, l] of [[84, 22], [64, 20], [44, 16], [28, 11]]) for (const a of [-150, -30]) s += K.leaf(50, y, l, l * 0.8, a, { prof: 'heart', teeth: 10, veins: 2, stalk: 4 });
    for (const y of [56, 36]) s += K.ellipse(46, y, 1.8, 1.2, 0, 'k') + K.ellipse(54, y, 1.8, 1.2, 0, 'k');
    return s;
  },
  'teixo'(K) { // «Simbólico (não ingerir)»
    let s = K.line([[8, 64], [92, 40]], 1.6);
    for (let i = 0; i < 16; i++) {
      const t = 0.06 + i * 0.058, x = 8 + 84 * t, y = 64 - 24 * t;
      s += K.leaf(x, y, 13, 3, -70 - 20 * t, { prof: 'lance', vein: false }) + K.leaf(x, y, 13, 3, 110 - 20 * t, { prof: 'lance', vein: false });
    }
    s += K.circle(46, 74, 7, 's') + K.circle(46, 74, 2.6, 'k') + K.line([[46, 54], [46, 67]], 0.9);
    s += K.path('M70 64l10 18h-20Z', '', ' stroke-width="1.4"') + K.path('M70 70v6M70 79v0.5', '', ' stroke-width="1.6"');
    return s;
  }
};

/* ——— Nomes das ervas tal como aparecem no texto ——— */
const norm = s => String(s).toLowerCase().normalize('NFC').trim();
const HERB_ALIAS = {
  'simbólico (não ingerir)': 'teixo',
  'flores de urze': 'flores de urze',
  'avelãs': 'avelãs'
};
function herbKey(name) {
  const n = norm(name);
  const k = HERB_ALIAS[n] || n;
  return HERBS[k] ? k : null;
}
/** Divide «Avelãs & Sálvia» ou «Bolota, Musgo de Carvalho & Viscum». */
function splitHerbs(text) {
  return String(text || '').split(/\s*(?:&|,)\s*/).map(s => s.trim()).filter(Boolean);
}

/* ——— Indicações tradicionais de fitoterapia (curtas e prudentes) ——— */
const USES = {
  'casca de vidoeiro': ['Folhas e casca em infusão como diurético e depurativo; tradicional para dores nas articulações.', 'Evitar se tiver alergia à aspirina.'],
  'dente-de-leão': ['Folhas diuréticas; raiz amarga que ajuda a digestão e o fígado.', 'Evitar com cálculos biliares ou alergia a margaridas.'],
  'bagas de sorveira': ['Bagas ricas em vitamina C, em geleia ou xarope para a garganta; adstringentes.', 'Só cozinhadas: cruas irritam o estômago.'],
  'verbena': ['Infusão calmante para a tensão nervosa e uma digestão lenta.', 'Evitar na gravidez.'],
  'folhas de amieiro': ['Uso externo: folhas frescas em cataplasma para inflamações e pés cansados; casca em gargarejo.', null],
  'ulmeira': ['Acidez do estômago, febre e dores ligeiras (contém salicilatos naturais).', 'Evitar com alergia à aspirina e em crianças.'],
  'casca de salgueiro': ['Dores, febre e inflamação: a salicina da casca deu origem à aspirina.', 'Mesmos cuidados da aspirina; não tomar com anticoagulantes.'],
  'artemísia': ['Amarga e digestiva; tradicional para regular o ciclo menstrual; usada em defumações e para os sonhos.', 'Proibida na gravidez.'],
  'sementes de freixo': ['Folhas e frutos tradicionais como diurético, para a gota e o reumatismo.', null],
  'agrimónia': ['Adstringente: gargarejo para a garganta e infusão para diarreia ligeira.', null],
  'flores de espinheiro': ['Tónico do coração e da circulação; acalma palpitações de nervos.', 'Se toma medicação para o coração, só com o médico.'],
  'rosa silvestre': ['Os frutos (escaramujos) são riquíssimos em vitamina C, para as defesas; pétalas em água de rosas.', 'Retirar os pelos das sementes, que irritam.'],
  'bolota': ['Casca de carvalho e bolotas são adstringentes: gargarejos, banhos e pequenas feridas. As bolotas comem-se depois de demolhadas.', 'Cruas são amargas e indigestas.'],
  'musgo de carvalho': ['Líquen aromático usado em incenso e perfumaria; tradicionalmente expectorante.', 'Pode causar alergia de contacto; uso sobretudo aromático.'],
  'viscum': ['Na tradição, para a tensão arterial e a circulação; hoje só em preparados médicos.', 'Bagas e folhas tóxicas: não usar em casa.'],
  'folhas de azevinho': ['Antigamente em infusão para febres; hoje sobretudo planta simbólica do Inverno.', 'Bagas tóxicas.'],
  'cardo santo': ['Amargo que abre o apetite e ajuda a digestão.', 'Evitar na gravidez e com alergia a margaridas.'],
  'avelãs': ['Alimento nutritivo (gorduras boas, vitamina E); folhas adstringentes para varizes.', 'Atenção a alergia a frutos secos.'],
  'sálvia': ['Gargarejo para garganta e gengivas; reduz os suores (por exemplo na menopausa).', 'Não em doses altas, na gravidez ou com epilepsia.'],
  'flor de macieira': ['Flores em infusão suave e calmante; a maçã ajuda a digestão.', null],
  'camomila': ['Calmante: digestão, cólicas e sono; compressas para olhos irritados.', 'Evitar com alergia a margaridas.'],
  'folha de videira': ['Folhas vermelhas do outono para pernas cansadas e a circulação venosa; folhas novas comestíveis.', null],
  'amora silvestre': ['Folhas adstringentes para gargarejos e diarreia ligeira; frutos ricos em antioxidantes.', null],
  'hera terrestre': ['Expectorante: catarros, tosse e sinusite.', 'Evitar na gravidez.'],
  'alecrim': ['Estimula a circulação, a memória e a digestão; óleo em fricção para músculos cansados.', 'Evitar doses altas na gravidez, com tensão alta ou epilepsia.'],
  'raiz de junco': ['Uso sobretudo simbólico; na medicina popular, o rizoma do caniço foi usado como diurético e para febres.', null],
  'valeriana': ['Raiz calmante: ansiedade, nervos e para adormecer.', 'Dá sonolência: não juntar a álcool, sedativos ou condução.'],
  'abrunhos': ['Frutos adstringentes, melhores depois da geada, em licor ou compota; flores laxantes suaves.', 'Não triturar os caroços (tóxicos).'],
  'absinto': ['Amargo muito forte para a digestão, em doses pequenas.', 'Tóxico em excesso; proibido na gravidez. Só com orientação.'],
  'flor e baga de sabugueiro': ['Flores em infusão para constipações e febre (fazem suar); bagas cozidas em xarope para as defesas.', 'Bagas cruas, folhas e caules são tóxicos: só bagas maduras e cozinhadas.'],
  'agulhas de pinheiro': ['Infusão rica em vitamina C para constipações e tosse; inalações.', 'Confirmar a árvore: o teixo é parecido e mortal. Evitar na gravidez.'],
  'resina': ['Uso externo em pomadas para pequenas feridas; queimada como incenso.', 'Não ingerir.'],
  'flores douradas de tojo': ['Flores comestíveis com cheiro a coco; tradicionais em infusão; floral de Bach para o desânimo.', 'Sementes tóxicas.'],
  'calêndula': ['Pomada ou óleo para pele, feridas e queimaduras ligeiras; infusão digestiva.', 'Evitar com alergia a margaridas.'],
  'flores de urze': ['Infusão diurética e anti-séptica das vias urinárias; calmante suave.', null],
  'lavanda': ['Calmante para o sono e a ansiedade; óleo para pequenas queimaduras e picadas.', null],
  'folhas de choupo': ['Os botões de choupo deram o unguento populeão, para dores e inflamações; casca com salicina.', 'Evitar com alergia à aspirina.'],
  'erva-cidreira': ['Calmante: ansiedade, sono e digestão nervosa; uso externo no herpes labial.', 'Cuidado com problemas de tiroide.'],
  'teixo': ['Muito tóxico: todas as partes, incluindo a semente dentro do arilo vermelho. Planta só simbólica.', 'Nunca ingerir.']
};

const STYLE = 'fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"';
const cache = new Map();
function render(kind, key, label) {
  const id = kind + ':' + key;
  if (!cache.has(id)) {
    const fn = kind === 'tree' ? TREES[key] : HERBS[key];
    if (!fn) return '';
    cache.set(id, fn(makeKit(id)));
  }
  return `<svg class="bot-svg" viewBox="0 0 100 100" role="img" aria-label="${esc(label)}" focusable="false"><g ${STYLE}>${cache.get(id)}</g></svg>`;
}

const DATA = () => (typeof OGHAM_DATA !== 'undefined' ? OGHAM_DATA : (window.OGHAM_DATA || []));
const treeLabel = o => 'Desenho: ' + o.tree.replace(/\s*\(.*\)\s*$/, '');

window.botanica = {
  tree: name => { const o = DATA().find(x => x.name === name); return o ? render('tree', name, treeLabel(o)) : ''; },
  herb: name => { const k = herbKey(name); return k ? render('herb', k, 'Desenho: ' + name) : ''; },
  trees: Object.keys(TREES),
  herbs: Object.keys(HERBS),
  splitHerbs
};

/* ——— Gravuras botânicas antigas (domínio público, Wikimedia Commons) ———
   Mostram a planta real ao lado de cada letra. Ficheiros em img/plantas/. */
const T = 'Thomé, Flora von Deutschland (1885)', KO = 'Köhler, Medizinal-Pflanzen (1887)',
  ST = 'Sturm, Deutschlands Flora (1796–1855)', LI = 'Lindman, Bilder ur Nordens Flora (1917–1926)';
const PLATES = {
  'tree-Beith':  ['Betula pendula', T, 'Illustration Betula pendula0.jpg'],
  'tree-Luis':   ['Sorbus aucuparia', T, 'Illustration Sorbus aucuparia0.jpg'],
  'tree-Fearn':  ['Alnus glutinosa', T, 'Illustration Alnus glutinosa0.jpg'],
  'tree-Saille': ['Salix alba', T, 'Illustration Salix alba0.jpg'],
  'tree-Nion':   ['Fraxinus excelsior', T, 'Illustration Fraxinus excelsior0.jpg'],
  'tree-Huath':  ['Crataegus monogyna', ST, 'Crataegus monogyna Sturm 08004.jpg'],
  'tree-Duir':   ['Quercus robur', T, 'Illustration Quercus robur0 clean.jpg'],
  'tree-Tinne':  ['Ilex aquifolium', T, 'Illustration Ilex aquifolium0.jpg'],
  'tree-Coll':   ['Corylus avellana', T, 'Illustration Corylus avellana0 clean.jpg'],
  'tree-Quert':  ['Malus domestica', KO, 'Malus domestica - Köhler–s Medizinal-Pflanzen-108.jpg'],
  'tree-Muin':   ['Vitis vinifera', T, 'Illustration Vitis vinifera0.jpg'],
  'tree-Gort':   ['Hedera helix', T, 'Illustration Hedera helix0.jpg'],
  'tree-Ngetal': ['Phragmites australis', T, 'Illustration Phragmites australis0 - clean.jpg'],
  'tree-Straif': ['Prunus spinosa', T, 'Illustration Prunus spinosa0.jpg'],
  'tree-Ruis':   ['Sambucus nigra', T, 'Illustration Sambucus nigra0.jpg'],
  'tree-Ailm':   ['Abies alba', T, 'Illustration Abies alba0 clean.jpg'],
  'tree-Onn':    ['Ulex europaeus', T, 'Illustration Ulex europaeus0.jpg'],
  'tree-Ur':     ['Calluna vulgaris', T, 'Illustration Calluna vulgaris0.jpg'],
  'tree-Eadha':  ['Populus tremula', T, 'Illustration Populus tremula0.jpg'],
  'tree-Ioho':   ['Taxus baccata', T, 'Illustration Taxus baccata0.jpg'],
  'herb-dente-de-leao':   ['Taraxacum officinale', T, 'Illustration Taraxacum officinale0 clean.jpg'],
  'herb-verbena':         ['Verbena officinalis', T, 'Illustration Verbena officinalis clean.JPG'],
  'herb-ulmeira':         ['Filipendula ulmaria', T, 'Illustration Filipendula ulmaria0 clean.jpg'],
  'herb-artemisia':       ['Artemisia vulgaris', KO, 'Artemisia vulgaris - Köhler–s Medizinal-Pflanzen-016.jpg'],
  'herb-agrimonia':       ['Agrimonia eupatoria', ST, 'Agrimonia eupatoria Sturm08057.jpg'],
  'herb-rosa-silvestre':  ['Rosa canina', T, 'Illustration Rosa canina0.jpg'],
  'herb-viscum':          ['Viscum album', T, 'Illustration Viscum album0 clean.jpg'],
  'herb-cardo-santo':     ['Cnicus benedictus', T, 'Illustration Cnicus benedictus0.jpg'],
  'herb-salvia':          ['Salvia officinalis', KO, 'Salvia officinalis - Köhler–s Medizinal-Pflanzen-126.jpg'],
  'herb-camomila':        ['Matricaria chamomilla', T, 'Illustration Matricaria chamomilla0.jpg'],
  'herb-amora-silvestre': ['Rubus nemorosus', LI, '307 Rubus nemorosus.jpg'],
  'herb-hera-terrestre':  ['Glechoma hederacea', T, 'Illustration Glechoma hederacea0.jpg'],
  'herb-alecrim':         ['Rosmarinus officinalis', T, 'Illustration Rosmarinus officinalis0.jpg'],
  'herb-valeriana':       ['Valeriana officinalis', T, 'Illustration Valeriana officinalis0.jpg'],
  'herb-absinto':         ['Artemisia absinthium', T, 'Illustration Artemisia absinthium0 clean.jpg'],
  'herb-calendula':       ['Calendula officinalis', T, 'Illustration Calendula officinalis0.jpg'],
  'herb-lavanda':         ['Lavandula angustifolia', T, 'Illustration Lavandula angustifolia0.jpg'],
  'herb-erva-cidreira':   ['Melissa officinalis', T, 'Illustration Melissa officinalis0.jpg'],
  'herb-pinheiro':        ['Pinus sylvestris', T, 'Illustration Pinus sylvestris0.jpg']
};
/** Gravura de cada erva: a própria, ou a da árvore de onde vem a parte usada. */
const HERB_PLATE = {
  'casca de vidoeiro': 'tree-Beith', 'dente-de-leão': 'herb-dente-de-leao', 'bagas de sorveira': 'tree-Luis',
  'verbena': 'herb-verbena', 'folhas de amieiro': 'tree-Fearn', 'ulmeira': 'herb-ulmeira',
  'casca de salgueiro': 'tree-Saille', 'artemísia': 'herb-artemisia', 'sementes de freixo': 'tree-Nion',
  'agrimónia': 'herb-agrimonia', 'flores de espinheiro': 'tree-Huath', 'rosa silvestre': 'herb-rosa-silvestre',
  'bolota': 'tree-Duir', 'viscum': 'herb-viscum', 'folhas de azevinho': 'tree-Tinne',
  'cardo santo': 'herb-cardo-santo', 'avelãs': 'tree-Coll', 'sálvia': 'herb-salvia',
  'flor de macieira': 'tree-Quert', 'camomila': 'herb-camomila', 'folha de videira': 'tree-Muin',
  'amora silvestre': 'herb-amora-silvestre', 'hera terrestre': 'herb-hera-terrestre', 'alecrim': 'herb-alecrim',
  'raiz de junco': 'tree-Ngetal', 'valeriana': 'herb-valeriana', 'abrunhos': 'tree-Straif',
  'absinto': 'herb-absinto', 'flor e baga de sabugueiro': 'tree-Ruis', 'agulhas de pinheiro': 'herb-pinheiro',
  'resina': 'herb-pinheiro', 'flores douradas de tojo': 'tree-Onn', 'calêndula': 'herb-calendula',
  'flores de urze': 'tree-Ur', 'lavanda': 'herb-lavanda', 'folhas de choupo': 'tree-Eadha',
  'erva-cidreira': 'herb-erva-cidreira', 'teixo': 'tree-Ioho'
};
// O HTML único aberto a partir de um ficheiro vai buscar as gravuras ao site publicado.
const PLATE_BASE = location.protocol === 'file:' ? 'https://inoxllor.github.io/caminho-druidico/' : '';
const plateSrc = key => `${PLATE_BASE}img/plantas/${key}.webp`;
const commonsUrl = file => 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(file.replace(/ /g, '_'));

function plateImg(key, alt, fallbackSvg, cls) {
  return `<img class="${cls}" src="${plateSrc(key)}" alt="${esc(alt)}" loading="lazy" decoding="async" data-plate="${key}" data-fallback="${esc(fallbackSvg)}">`;
}

/* ——— Ampliar a gravura ao tocar ——— */
let zoom = null;
function openZoom(key, title) {
  const p = PLATES[key];
  if (!p) return;
  if (!zoom) {
    zoom = document.createElement('dialog');
    zoom.className = 'bot-zoom';
    zoom.addEventListener('click', e => { if (e.target === zoom || e.target.closest('[data-close]')) zoom.close(); });
    document.body.appendChild(zoom);
  }
  zoom.innerHTML = `<figure><img src="${plateSrc(key)}" alt="${esc(title)}">
    <figcaption><b>${esc(title)}</b> · <i>${esc(p[0])}</i><br><span>Gravura de ${esc(p[1])}, domínio público · <a href="${commonsUrl(p[2])}" target="_blank" rel="noopener">Wikimedia Commons</a></span></figcaption>
    <button type="button" data-close class="theme-card border text-sm font-semibold py-2 px-4 rounded-lg cursor-pointer">Fechar</button></figure>`;
  if (typeof zoom.showModal === 'function') zoom.showModal(); else zoom.setAttribute('open', '');
}

/* ——— Liga as gravuras e a fitoterapia ao guia «Árvores & ervas» ——— */
function decorate() {
  const list = $('tree-list');
  if (!list) return;
  const data = DATA();
  list.querySelectorAll(':scope > div').forEach(card => {
    if (card.querySelector('.bot-plate')) return;
    const h = card.querySelector('h3');
    const name = h && h.textContent.split('•')[0].trim();
    const o = data.find(x => x.name === name);
    if (!o || !TREES[o.name]) return;
    const tree = o.tree.replace(/\s*\(.*\)\s*$/, '');
    const pk = 'tree-' + o.name, p = PLATES[pk];
    const fig = document.createElement('figure');
    fig.className = 'bot-plate';
    fig.innerHTML = `<button type="button" class="bot-plate-btn" data-zoom="${pk}" data-title="${esc(tree)}" aria-label="Ampliar a gravura: ${esc(tree)}">${plateImg(pk, `Gravura botânica: ${tree} (${p[0]})`, render('tree', o.name, treeLabel(o)), 'bot-plate-img')}</button>
      <figcaption><b>${esc(tree)}</b> · <i>${esc(p[0])}</i><span>Gravura de ${esc(p[1].split(',')[0])}, domínio público</span></figcaption>`;
    const head = card.firstElementChild;
    card.insertBefore(fig, head ? head.nextSibling : card.firstChild);

    const herbs = splitHerbs(o.herb).filter(herbKey);
    if (herbs.length) {
      const box = document.createElement('div');
      box.className = 'bot-uses';
      box.innerHTML = herbs.map(n => {
        const k = herbKey(n), use = USES[k] || [], hp = HERB_PLATE[k];
        const label = k === 'teixo' ? 'Teixo (todas as partes)' : n;
        const svg = render('herb', k, 'Desenho: ' + label);
        const art = hp
          ? `<button type="button" class="bot-use-art" data-zoom="${hp}" data-title="${esc(label)}" aria-label="Ampliar a gravura: ${esc(label)}">${plateImg(hp, `Gravura: ${label}`, svg, 'bot-use-img')}</button>`
          : `<span class="bot-use-art bot-use-svg theme-glyph">${svg}</span>`;
        const latin = hp ? `<i class="bot-latin">${esc(PLATES[hp][0])}</i>` : '';
        return `<div class="bot-use" data-herb="${k}">${art}<div class="bot-use-txt"><b class="theme-title">${esc(label)}</b> ${latin}
          ${use[0] ? `<p>${esc(use[0])}</p>` : ''}${use[1] ? `<p class="bot-warn" role="note">⚠ ${esc(use[1])}</p>` : ''}</div></div>`;
      }).join('');
      const fito = [...card.querySelectorAll('p')].find(q => /Fitoterapia/.test(q.textContent));
      (fito || h).after(box);
    }
  });
  if (!$('bot-disclaimer')) {
    const note = document.createElement('p');
    note.id = 'bot-disclaimer';
    note.className = 'text-xs theme-muted';
    note.textContent = 'Fitoterapia: usos tradicionais, só para informação. Não substituem o conselho de um médico ou farmacêutico, sobretudo na gravidez, em crianças ou com medicação. Gravuras botânicas antigas em domínio público (Wikimedia Commons); toque numa gravura para a ampliar.';
    list.before(note);
  }
}

document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-zoom]');
  if (b) openZoom(b.dataset.zoom, b.dataset.title);
});
// Sem rede e sem cópia guardada: mostra o desenho em vez da gravura.
document.addEventListener('error', e => {
  const img = e.target;
  if (!(img instanceof HTMLImageElement) || !img.dataset.fallback) return;
  const span = document.createElement('span');
  span.className = 'bot-fallback theme-glyph';
  span.innerHTML = img.dataset.fallback;
  img.replaceWith(span);
}, true);

window.botanica.plates = PLATES;
window.botanica.uses = USES;
window.botanica.plateSrc = plateSrc;
window.botanica.herbKey = herbKey;
window.botanica.herbPlate = HERB_PLATE;

const base = window.renderHerbalList;
if (typeof base === 'function') {
  window.renderHerbalList = function (...args) {
    base.apply(this, args);
    decorate();
  };
}

/* ——— Desenho da árvore do mês no painel «Hoje» ——— */
function decorateMonth() {
  const sym = $('celtic-month-symbol');
  if (!sym || typeof getCelticTree !== 'function') return;
  const o = getCelticTree(new Date());
  if (!o || !TREES[o.name]) return;
  let fig = $('celtic-month-art');
  if (fig && fig.dataset.tree === o.name) return;
  if (!fig) {
    fig = document.createElement('div');
    fig.id = 'celtic-month-art';
    fig.className = 'bot-month theme-glyph';
    sym.after(fig);
  }
  fig.dataset.tree = o.name;
  fig.innerHTML = render('tree', o.name, treeLabel(o));
}

function init() {
  decorate();
  decorateMonth();
  const list = $('tree-list');
  if (list && 'MutationObserver' in window) new MutationObserver(decorate).observe(list, { childList: true });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
setInterval(decorateMonth, 60 * 60 * 1000);
})();
