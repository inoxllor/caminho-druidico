/* ============================================================
   Idioma (feedback dos utilizadores, 2026-11-26): versão en-GB.
   O código e os textos continuam em português; em inglês, este
   ficheiro traduz o que aparece no ecrã com o dicionário de
   i18n/en-GB.js (carregado no <head> só quando o idioma é en-GB):
   - texto e atributos (aria-label, title, placeholder, alt), mesmo
     quando outros scripts os mudam depois (MutationObserver);
   - frases com números e datas, por padrões;
   - datas e números formatados com 'pt-PT' passam a 'en-GB';
   - alert/confirm/prompt, texto desenhado em canvas e voz.
   O idioma escolhe-se em «Ambiente & ajustes» ou com ?lang=en / ?lang=pt.
   ============================================================ */
(() => {
const LANG = window.__lang === 'en-GB' ? 'en-GB' : 'pt-PT';
window.APP_LANG = LANG;
window.setLanguage = function (l) {
  try { localStorage.setItem('druid_lang', l === 'en-GB' ? 'en-GB' : 'pt-PT'); } catch { /* sem armazenamento */ }
  // Tira o ?lang= do endereço, senão voltaria a mandar no idioma
  location.replace(location.pathname + location.hash);
};
const done = () => document.documentElement.classList.remove('i18n-wait');
const sel = document.getElementById('lang-selector');
if (sel) sel.value = LANG;
if (LANG !== 'en-GB' || !window.I18N_EN) { window.t = s => s; done(); return; }

const D = window.I18N_EN;
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const low = s => s.charAt(0).toLowerCase() + s.slice(1);

/* ——— Padrões: frases com números, datas e nomes ——— */
const MONTHS = { janeiro: 'January', fevereiro: 'February', 'março': 'March', abril: 'April', maio: 'May', junho: 'June', julho: 'July', agosto: 'August', setembro: 'September', outubro: 'October', novembro: 'November', dezembro: 'December' };
const MON = { Jan: 'Jan', Fev: 'Feb', Mar: 'Mar', Abr: 'Apr', Mai: 'May', Jun: 'Jun', Jul: 'Jul', Ago: 'Aug', Set: 'Sep', Out: 'Oct', Nov: 'Nov', Dez: 'Dec' };
const MON_RE = Object.keys(MON).join('|');
const MONTH_RE = Object.keys(MONTHS).join('|');
const month = m => MONTHS[m.toLowerCase()] || m;
const ord = n => { n = +n; const s = (n % 100 >= 11 && n % 100 <= 13) ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'); return n + s; };
const pl = (n, one, many) => `${n} ${+n === 1 ? one : many}`;

const PATTERNS = [
  [/^"(.+)"$/, m => { const r = tx(m[1]); return r == null ? null : `"${r}"`; }],
  [/^(.+) — ([^—]+?) \| Inv: (.+)$/, m => `${T(m[1])} — ${T(m[2])} | Rev: ${T(m[3])}`],
  [/^(.+?\.) Erva: (.+)\.$/, m => `${T(m[1])} Herb: ${T(m[2])}.`],
  [/^(\d+) runas? saíram? invertidas?\.$/, m => `${pl(m[1], 'rune', 'runes')} came out reversed.`],
  [/^(\d+) tiragens este mês$/, m => `${pl(m[1], 'spread', 'spreads')} this month`],
  [/^(\d+): (\d+) leituras?$/, m => `${m[1]}: ${pl(m[2], 'reading', 'readings')}`],
  [/^(\d+) leituras?$/, m => pl(m[1], 'reading', 'readings')],
  [/^([\d.]+) dias?$/, m => pl(m[1], 'day', 'days')],
  [/^(\d+) palavras?$/, m => pl(m[1], 'word', 'words')],
  [/^(\d+) cartas?$/, m => pl(m[1], 'card', 'cards')],
  [/^(\d+) runas?$/, m => pl(m[1], 'rune', 'runes')],
  [/^cerca de (\d+) min$/, m => `about ${m[1]} min`],
  [/^Daqui a (\d+) dias?$/, m => `In ${pl(m[1], 'day', 'days')}`],
  [/^em (\d+) dias?$/, m => `in ${pl(m[1], 'day', 'days')}`],
  [/^em (\d+)d$/, m => `in ${m[1]}d`],
  [/^(\d+) de (\d+)$/, m => `${m[1]} of ${m[2]}`],
  [/^(\d+)% iluminada$/, m => `${m[1]}% illuminated`],
  [/^(\d+)% decorrido$/, m => `${m[1]}% elapsed`],
  [/^Cheia a (.+)$/, m => `Full on ${m[1]}`],
  [new RegExp(`^(\\d{1,2}) de (${MONTH_RE})(?: de (\\d{4}))?$`, 'i'), m => `${m[1]} ${month(m[2])}${m[3] ? ' ' + m[3] : ''}`],
  [new RegExp(`^(${MONTH_RE}) de (\\d{4})$`, 'i'), m => `${month(m[1])} ${m[2]}`],
  [new RegExp(`^(\\d{1,2}) (${MON_RE})$`), m => `${m[1]} ${MON[m[2]]}`],
  [new RegExp(`^(\\d{1,2}) (${MON_RE}) – (\\d{1,2}) (${MON_RE})(.*)$`), m => `${m[1]} ${MON[m[2]]} – ${m[3]} ${MON[m[4]]}${m[5].trim() ? ' ' + T(m[5].trim()) : ''}`],
  [new RegExp(`^(${MONTH_RE})$`, 'i'), m => month(m[1])],
  [/^Em época em (\S+)$/, m => `In season in ${month(m[1])}`],
  [/^Faltam (\d+) dias? para a lua de (\S+)\.$/, m => `${pl(m[1], 'day', 'days')} until the moon of ${m[2]}.`],
  [/^Mês de (\S+)$/, m => `Month of ${m[1]}`],
  [/^A mostrar (\d+) de (\d+) (\S+)$/, m => `Showing ${m[1]} of ${m[2]} ${T(m[3])}`],
  [/^Este mês: (\d+) tiragens registadas · (\d+) sonhos no caderno · sequência atual (\d+) dia\(s\)\.$/,
    m => `This month: ${pl(m[1], 'spread', 'spreads')} recorded · ${pl(m[2], 'dream', 'dreams')} in the notebook · current streak ${pl(m[3], 'day', 'days')}.`],
  [/^(.+?) às (\d{1,2}:\d\d)(.*)$/, m => { const pre = tx(m[1] + ' às'); return `${pre || T(m[1]) + ' at'} ${m[2]}${m[3]}`; }],
  [/^Erva de (\S+)$/, m => `Herb of ${m[1]}`],
  [/^(\d+) resultados?$/, m => pl(m[1], 'result', 'results')],
  [/^Pedra (\d+), virada para baixo$/, m => `Stone ${m[1]}, face down`],
  [/^Pedra escolhida para a (\d+)\.ª casa$/, m => `Stone chosen for position ${m[1]}`],
  [/^Toque na pedra para a (\d+)\.ª casa: (.+) \((\d+) de (\d+)\)\.$/, m => `Tap a stone for position ${m[1]}: ${T(m[2])} (${m[3]} of ${m[4]}).`],
  [/^(\d+)\.[ªº]$/, m => ord(m[1])],
  [/^(\d+)\.[ªº] (.+)$/, m => `${ord(m[1])} ${T(m[2])}`],
  [/^(.+) \(invertida\)$/, m => `${T(m[1])} (reversed)`],
  [/^(.+), invertida$/, m => `${T(m[1])}, reversed`],
  [/^Juntar (.+) à minha lista de ervas$/, m => `Add ${low(T(m[1]))} to my herb list`],
  [/^Partilhar a ficha de (.+) como imagem$/, m => `Share the details card of ${m[1]} as an image`],
  [/^(\S+ \S+) (.+?) Som «(.+?)» (Aett de \S+) · (\d+)( Simétrica)?$/,
    m => `${m[1]} ${T(m[2])} Sound «${m[3]}» ${T(m[4])} · ${m[5]}${m[6] ? ' Symmetrical' : ''}`],
  [/^Tiragem (.+?)\. (.+)$/, m => `${T(m[1])} spread. ` + m[2].split(/\.\s*/).filter(Boolean).map(p => {
    const [k, ...v] = p.split(': ');
    return `${T(k)}: ${v.join(': ').replace(/, invertida$/, ', reversed')}`;
  }).join('. ') + '.'],
  [/^Ogham\. (.+)$/, m => 'Ogham. ' + m[1].split(/\.\s*/).filter(Boolean).map(p => {
    const i = p.indexOf(', ');
    return i < 0 ? T(p) : `${p.slice(0, i)}, ${T(p.slice(i + 2))}`;
  }).join('. ') + '.'],
  [/^(\p{Extended_Pictographic}️?) (.+)$/u, m => `${m[1]} ${T(m[2])}`],
  [/^(\p{L}+) (\d+d?)$/u, m => { const r = tx(m[1]); return r == null ? null : `${r} ${m[2]}`; }],
  // «Nome (Glosa)»: em inglês, a glosa já é o nome, por isso não se repete
  [/^(.+) \(([^()]+)\)$/, m => {
    const a = tx(m[1]), b = tx(m[2]);
    if (a == null && b == null) return null;
    const A = a == null ? m[1] : a, B = b == null ? m[2] : b;
    return A.toLowerCase() === B.toLowerCase() ? A : `${A} (${B})`;
  }]
];
const SEPS = [' — ', ' · ', ' • ', ' | ', ': ', ' & '];

const cache = new Map();
function tx(k) {
  if (has(D, k)) return D[k];
  if (cache.has(k)) return cache.get(k);
  cache.set(k, null); // evita ciclos
  let r = null;
  for (const [re, fn] of PATTERNS) {
    const m = k.match(re);
    if (m) { r = fn(m); if (r != null) break; }
  }
  if (r == null) {
    for (const sep of SEPS) {
      if (!k.includes(sep)) continue;
      const parts = k.split(sep);
      const out = parts.map(p => { const t = p.trim() ? tx(p.trim()) : null; return t == null ? p : p.replace(p.trim(), t); });
      if (out.some((o, i) => o !== parts[i])) { r = out.join(sep); break; }
    }
  }
  if (r == null && k.length > 1) {
    const l = low(k), u = cap(k);
    if (l !== k && has(D, l)) r = cap(D[l]);
    else if (u !== k && has(D, u)) r = low(D[u]);
    else if (/[:.]$/.test(k) && has(D, k.slice(0, -1))) r = D[k.slice(0, -1)] + k.slice(-1);
    else if (has(D, k + ':')) r = D[k + ':'].replace(/:$/, '');
  }
  cache.set(k, r);
  return r;
}
function T(s) {
  if (typeof s !== 'string' || !/\p{L}/u.test(s)) return s;
  const k = s.replace(/\s+/g, ' ').trim();
  const r = tx(k);
  if (r == null || r === k) return s;
  return s.match(/^\s*/)[0] + r + s.match(/\s*$/)[0];
}
window.t = T;

/* ——— Ecrã ——— */
const ATTRS = ['aria-label', 'title', 'placeholder', 'alt', 'aria-description', 'data-tip'];
const SKIP = 'script,style,textarea,code,pre,[translate="no"],.notranslate,[contenteditable="true"]';
function trText(n) {
  const p = n.parentElement;
  if (!p || p.closest(SKIP)) return;
  const v = n.nodeValue, r = T(v);
  if (r !== v) n.nodeValue = r;
}
const ATTR_SKIP = '[translate="no"],.notranslate';
function trAttrs(el) {
  if (el.closest(ATTR_SKIP)) return;
  for (const a of ATTRS) {
    const v = el.getAttribute(a);
    if (v) { const r = T(v); if (r !== v) el.setAttribute(a, r); }
  }
  if (el.tagName === 'INPUT' && /^(button|submit|reset)$/i.test(el.type) && el.value) {
    const r = T(el.value); if (r !== el.value) el.value = r;
  }
}
function walk(root) {
  if (root.nodeType === 3) return trText(root);
  if (root.nodeType !== 1) return;
  trAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n;
  while ((n = w.nextNode())) n.nodeType === 3 ? trText(n) : trAttrs(n);
}
const mo = new MutationObserver(ms => {
  for (const m of ms) {
    if (m.type === 'characterData') trText(m.target);
    else if (m.type === 'attributes') trAttrs(m.target);
    else m.addedNodes.forEach(walk);
  }
});
walk(document.documentElement);
mo.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
done();

/* ——— Datas e números ——— */
const fix = l => (l === undefined || /^pt/i.test(Array.isArray(l) ? l[0] : String(l))) ? 'en-GB' : l;
for (const [obj, names] of [[Date.prototype, ['toLocaleDateString', 'toLocaleTimeString', 'toLocaleString']], [Number.prototype, ['toLocaleString']]]) {
  for (const name of names) {
    const orig = obj[name];
    obj[name] = function (l, o) { return orig.call(this, fix(l), o); };
  }
}
for (const name of ['DateTimeFormat', 'NumberFormat', 'RelativeTimeFormat', 'PluralRules']) {
  const Orig = Intl[name];
  if (!Orig) continue;
  Intl[name] = new Proxy(Orig, {
    construct: (t, [l, o]) => new t(fix(l), o),
    apply: (t, self, [l, o]) => t(fix(l), o)
  });
}

/* ——— Diálogos do browser, canvas e voz ——— */
for (const name of ['alert', 'confirm', 'prompt']) {
  const orig = window[name];
  if (typeof orig === 'function') window[name] = function (msg, ...rest) { return orig.call(window, T(String(msg ?? '')), ...rest); };
}
for (const C of [window.CanvasRenderingContext2D, window.OffscreenCanvasRenderingContext2D]) {
  if (!C) continue;
  for (const name of ['fillText', 'strokeText', 'measureText']) {
    const orig = C.prototype[name];
    if (orig) C.prototype[name] = function (text, ...rest) { return orig.call(this, T(text), ...rest); };
  }
}
if (window.SpeechSynthesisUtterance) {
  const U = window.SpeechSynthesisUtterance;
  window.SpeechSynthesisUtterance = function (text) { const u = new U(T(String(text ?? ''))); u.lang = 'en-GB'; return u; };
  window.SpeechSynthesisUtterance.prototype = U.prototype;
}
})();
