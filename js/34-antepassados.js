/* ============================================================
   Constelações & Antepassados (Prática):
   - aviso de cuidado com contactos de ajuda, antes de começar;
   - o círculo dos antepassados: a pessoa coloca os familiares
     como representantes num tabuleiro (arrastando, ou com as setas
     do teclado), arruma-os em árvore ou em círculo e escreve o que
     sente em cada lugar;
   - a Tiragem dos Antepassados, em runas ou em Ogham, com cinco
     casas: linha materna, linha paterna, o que se herda, o que se
     devolve e a bênção;
   - o ritual de Samhain para honrar os antepassados, registado no
     diário (cifrado, se tiver PIN).
   Tudo fica só neste aparelho (localStorage «druid_ancestors»).
   Preparado para o Caminho+: a secção pergunta a CaminhoPlus.has()
   se está desbloqueada (por agora, é gratuita).
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const toast = m => { if (typeof showToast === 'function') showToast(m); };
const T = s => (typeof window.t === 'function' ? window.t(s) : s);
const KEY = 'druid_ancestors';
const EN = () => window.APP_LANG === 'en-GB';

/* ——— Caminho+ (desbloqueio futuro) ——— */
const Plus = window.CaminhoPlus = window.CaminhoPlus || {
  features: {},
  /** Por agora tudo está desbloqueado; quando houver Caminho+, basta mudar aqui. */
  has(f) { const x = this.features[f]; return !x || x.free !== false || this.unlocked === true; },
  unlocked: false
};
Plus.features.ancestors = { name: 'Constelações & Antepassados', free: true };

/* ——— Lugar no menu: portal Prática ——— */
const R = window.DruidRealms;
if (R && R.PORTALS && R.PORTALS.pratica && !R.PORTALS.pratica.items.some(i => i[0] === 'ancestors')) {
  R.PORTALS.pratica.items.push(['ancestors', 'ancestors', 'Constelações & antepassados',
    'O círculo da família, a Tiragem dos Antepassados e o ritual de Samhain para os honrar.']);
  R.REALM_OF.ancestors = 'pratica';
}

/* ——— Dados ——— */
const SIDES = { m: 'Linha materna', p: 'Linha paterna', o: 'Outra ligação' };
// chave: [nome, geração (0 = a minha), linha por omissão]
const RELS = {
  mae: ['Mãe', 1, 'm'], pai: ['Pai', 1, 'p'],
  avo_mf: ['Avó materna', 2, 'm'], avo_mm: ['Avô materno', 2, 'm'],
  avo_pf: ['Avó paterna', 2, 'p'], avo_pm: ['Avô paterno', 2, 'p'],
  bisavo_f: ['Bisavó', 3, 'm'], bisavo_m: ['Bisavô', 3, 'p'],
  tia: ['Tia', 1, 'm'], tio: ['Tio', 1, 'p'],
  irma: ['Irmã', 0, 'o'], irmao: ['Irmão', 0, 'o'],
  par: ['Companheiro/a', 0, 'o'],
  filha: ['Filha', -1, 'o'], filho: ['Filho', -1, 'o'],
  antep: ['Antepassado/a sem nome', 3, 'm'],
  outro: ['Outra pessoa', 0, 'o']
};
const PHRASES = ['Eu vejo-te.', 'Obrigado/a pela vida.', 'Tu és o grande e eu sou o pequeno.', 'Tens um lugar no meu coração.',
  'O que é teu deixo contigo, com respeito.', 'Abençoa-me se eu ficar bem.'];

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (d && Array.isArray(d.people)) return d;
  } catch { /* nada */ }
  return { v: 1, ack: false, people: [] };
}
let S = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { toast('Não foi possível guardar neste aparelho.'); } };
const me = () => ({ id: 'eu', rel: 'eu', name: '', side: '', x: S.meX ?? 50, y: S.meY ?? 74 });
const people = () => [me(), ...S.people];
const relName = k => k === 'eu' ? 'Eu' : (RELS[k] || RELS.outro)[0];
const genOf = p => p.rel === 'eu' ? 0 : (RELS[p.rel] || RELS.outro)[1];
const initials = n => String(n || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
let sel = null, view = 'circle';

/* ——— Moldura da secção ——— */
function shell() {
  const sec = $('tab-ancestors');
  if (!sec || sec.dataset.ready) return sec;
  sec.dataset.ready = '1';
  sec.innerHTML = `
    <div class="theme-card border rounded-2xl anc-hero">
      <div class="oracle-sigil" aria-hidden="true">ᛟ ᛗ ᛟ</div>
      <p class="eyebrow">Prática · linhagem</p>
      <h2 class="font-cinzel text-2xl lg:text-3xl font-bold theme-title">Constelações &amp; antepassados</h2>
      <p class="anc-sub">Os antepassados são as raízes da árvore que somos. Coloque a sua família no círculo, pergunte às runas ou ao Ogham o que a linhagem lhe traz e honre quem veio antes, no espírito de Samhain.</p>
    </div>
    <div id="anc-care"></div>
    <div id="anc-body"></div>`;
  return sec;
}

/* ——— Aviso de cuidado e contactos de ajuda ——— */
function helpLines() {
  const pt = `<div class="anc-help-group"><p class="anc-help-h">Em Portugal</p><ul>
      <li><b>SNS 24</b> <a href="tel:808242424" translate="no">808 24 24 24</a> <span>aconselhamento psicológico, 24 horas</span></li>
      <li><b>SOS Voz Amiga</b> <a href="tel:213544545" translate="no">213 544 545</a> · <a href="tel:912802669" translate="no">912 802 669</a> · <a href="tel:963524660" translate="no">963 524 660</a> <span>escuta anónima</span></li>
      <li><b>Emergência</b> <a href="tel:112" translate="no">112</a></li></ul></div>`;
  const uk = `<div class="anc-help-group"><p class="anc-help-h">No Reino Unido e na Irlanda</p><ul>
      <li><b>Samaritans</b> <a href="tel:116123" translate="no">116 123</a> <span>gratuito, 24 horas</span></li>
      <li><b>NHS 111</b> <a href="tel:111" translate="no">111</a> <span>opção de saúde mental (Inglaterra)</span></li>
      <li><b>Emergência</b> <a href="tel:999" translate="no">999</a> · <a href="tel:112" translate="no">112</a></li></ul></div>`;
  return `<div class="anc-help">${EN() ? uk + pt : pt + uk}</div>`;
}
function renderCare() {
  const host = $('anc-care');
  if (!host) return;
  const points = `<ul class="anc-care-list">
      <li>Esta ferramenta é para reflexão e ritual pessoal. Não substitui terapia nem acompanhamento médico ou psicológico.</li>
      <li>As constelações familiares são uma prática alternativa sem validação científica. Use-as como espelho simbólico, não como diagnóstico nem para decidir sobre a sua família.</li>
      <li>Olhar para a história da família pode despertar dor. Vá ao seu ritmo e pare quando precisar.</li>
      <li>Tudo o que escreve aqui fica só neste aparelho. Nada é enviado para a internet.</li>
    </ul>`;
  if (!S.ack) {
    host.innerHTML = `<div class="theme-card border rounded-2xl anc-care is-open" role="note" aria-labelledby="anc-care-h">
      <h3 id="anc-care-h" class="font-cinzel anc-care-title"><svg class="ic" aria-hidden="true"><use href="#i-about"></use></svg>Um cuidado antes de começar</h3>
      ${points}
      <p class="anc-help-lead">Se sentir angústia, fale com alguém. Estas linhas atendem com sigilo:</p>
      ${helpLines()}
      <button type="button" class="anc-btn anc-btn-primary" onclick="ancAck()">Compreendo, quero continuar</button>
    </div>`;
    return;
  }
  host.innerHTML = `<details class="theme-card border rounded-2xl anc-care">
      <summary><svg class="ic" aria-hidden="true"><use href="#i-about"></use></svg><span>Não substitui terapia · contactos de ajuda</span></summary>
      ${points}${helpLines()}
    </details>`;
}
window.ancAck = function () {
  S.ack = true; save(); renderCare(); renderBody();
  const b = $('anc-body'); if (b) b.querySelector('[role="tab"]')?.focus({ preventScroll: true });
};

/* ——— Corpo: separadores ——— */
const VIEWS = [['circle', 'O círculo'], ['spread', 'Tiragem'], ['ritual', 'Ritual de Samhain']];
function renderBody() {
  const host = $('anc-body');
  if (!host) return;
  if (!Plus.has('ancestors')) {
    host.innerHTML = `<div class="theme-card border rounded-2xl p-5 text-center"><p class="theme-title font-semibold">Esta ferramenta faz parte do Caminho+.</p></div>`;
    return;
  }
  if (!S.ack) { host.innerHTML = ''; return; }
  host.innerHTML = `
    <div class="anc-tabs" role="tablist" aria-label="Constelações & antepassados">
      ${VIEWS.map(([k, n]) => `<button type="button" role="tab" id="anc-tab-${k}" aria-controls="anc-view" aria-selected="${view === k}" tabindex="${view === k ? 0 : -1}" data-view="${k}">${n}</button>`).join('')}
    </div>
    <div id="anc-view" role="tabpanel" aria-labelledby="anc-tab-${view}"></div>`;
  const tabs = host.querySelector('.anc-tabs');
  tabs.addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) setView(b.dataset.view); });
  tabs.addEventListener('keydown', e => {
    if (!/^Arrow(Left|Right)$/.test(e.key)) return;
    const i = VIEWS.findIndex(v => v[0] === view), n = (i + (e.key === 'ArrowRight' ? 1 : -1) + VIEWS.length) % VIEWS.length;
    setView(VIEWS[n][0]); host.querySelector(`#anc-tab-${VIEWS[n][0]}`)?.focus();
  });
  ({ circle: renderCircle, spread: renderSpreadView, ritual: renderRitual })[view]();
}
function setView(v) { view = v; renderBody(); }
window.ancView = v => { switchTab('ancestors'); setView(v); };

/* ============================================================
   1) O círculo dos antepassados
   ============================================================ */
function renderCircle() {
  const host = $('anc-view');
  host.innerHTML = `
    <div class="anc-circle">
      <div class="theme-card border rounded-2xl anc-board-card">
        <div class="anc-board-head">
          <p class="anc-how">Junte os seus familiares como representantes e arraste-os para onde os sente: perto ou longe de si, de frente ou de lado. O lugar diz tanto como o nome.</p>
          <div class="anc-tools" role="group" aria-label="Arrumar o tabuleiro">
            <button type="button" class="anc-btn anc-btn-primary" onclick="ancAdd()"><span aria-hidden="true">＋</span> Juntar pessoa</button>
            <button type="button" class="anc-btn" onclick="ancLayout('tree')">Arrumar em árvore</button>
            <button type="button" class="anc-btn" onclick="ancLayout('ring')">Arrumar em círculo</button>
          </div>
        </div>
        <div class="anc-board" id="anc-board" role="group" aria-label="Tabuleiro da constelação. Toque numa pessoa para a escolher; arraste-a ou use as setas do teclado para a mudar de lugar.">
          <svg class="anc-threads" id="anc-threads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>
          <span class="anc-zone anc-zone-m" aria-hidden="true">Linha materna</span>
          <span class="anc-zone anc-zone-p" aria-hidden="true">Linha paterna</span>
        </div>
        <ul class="anc-legend" aria-label="Legenda">
          <li><i class="lg-m"></i>Linha materna</li><li><i class="lg-p"></i>Linha paterna</li><li><i class="lg-o"></i>Outra ligação</li><li><i class="lg-d"></i>Já partiu</li>
        </ul>
      </div>
      <div class="theme-card border rounded-2xl anc-panel" id="anc-panel" aria-live="polite"></div>
    </div>`;
  drawBoard();
  renderPanel();
}
function drawBoard() {
  const board = $('anc-board');
  if (!board) return;
  board.querySelectorAll('.anc-tok').forEach(n => n.remove());
  const list = people();
  const m = me();
  $('anc-threads').innerHTML = list.filter(p => p.id !== 'eu').map(p =>
    `<line x1="${m.x}" y1="${m.y}" x2="${p.x}" y2="${p.y}" class="th-${p.side || 'o'}"/>`).join('');
  list.forEach(p => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `anc-tok side-${p.id === 'eu' ? 'me' : p.side || 'o'}${p.dead ? ' is-dead' : ''}${sel === p.id ? ' is-sel' : ''}`;
    b.dataset.id = p.id;
    b.style.left = p.x + '%'; b.style.top = p.y + '%';
    b.setAttribute('aria-pressed', sel === p.id ? 'true' : 'false');
    const glyph = p.id === 'eu' ? 'ᛗ' : initials(p.name) || 'ᛟ';
    b.innerHTML = `<span class="anc-disc" aria-hidden="true" translate="no">${esc(glyph)}</span>
      ${p.name ? `<span class="anc-name" translate="no">${esc(p.name)}</span>` : ''}
      <span class="anc-rel">${esc(relName(p.rel))}</span>`;
    board.appendChild(b);
  });
}
function findP(id) { return id === 'eu' ? me() : S.people.find(p => p.id === id); }
function moveP(id, x, y) {
  x = Math.max(5, Math.min(95, Math.round(x * 10) / 10)); y = Math.max(6, Math.min(94, Math.round(y * 10) / 10));
  if (id === 'eu') { S.meX = x; S.meY = y; } else { const p = findP(id); if (p) { p.x = x; p.y = y; } }
}
/* Arrastar (rato, dedo, caneta) e setas do teclado */
function wireBoard() {
  document.addEventListener('pointerdown', e => {
    const tok = e.target.closest && e.target.closest('#anc-board .anc-tok');
    if (!tok || e.button > 0) return;
    const board = $('anc-board'), r = board.getBoundingClientRect(), id = tok.dataset.id;
    const x0 = e.clientX, y0 = e.clientY;
    let moved = false;
    try { tok.setPointerCapture(e.pointerId); } catch { /* nada */ }
    const onMove = ev => {
      if (!moved && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 5) return;
      moved = true;
      tok.classList.add('is-drag');
      moveP(id, (ev.clientX - r.left) / r.width * 100, (ev.clientY - r.top) / r.height * 100);
      const p = findP(id);
      tok.style.left = p.x + '%'; tok.style.top = p.y + '%';
      updateThreads();
    };
    const onUp = () => {
      tok.removeEventListener('pointermove', onMove);
      tok.removeEventListener('pointerup', onUp);
      tok.removeEventListener('pointercancel', onUp);
      tok.classList.remove('is-drag');
      if (moved) { save(); tok.dataset.dragged = '1'; setTimeout(() => { delete tok.dataset.dragged; }, 0); select(id, false); }
    };
    tok.addEventListener('pointermove', onMove);
    tok.addEventListener('pointerup', onUp);
    tok.addEventListener('pointercancel', onUp);
  });
  document.addEventListener('click', e => {
    const tok = e.target.closest && e.target.closest('#anc-board .anc-tok');
    if (!tok || tok.dataset.dragged) return;
    select(tok.dataset.id, true);
  });
  document.addEventListener('keydown', e => {
    const tok = e.target.closest && e.target.closest('#anc-board .anc-tok');
    if (!tok || !/^Arrow/.test(e.key)) return;
    e.preventDefault();
    const p = findP(tok.dataset.id), step = e.shiftKey ? 8 : 2;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    moveP(p.id, p.x + d[0], p.y + d[1]);
    save();
    const q = findP(p.id);
    tok.style.left = q.x + '%'; tok.style.top = q.y + '%';
    updateThreads();
  });
}
function updateThreads() {
  const th = $('anc-threads');
  if (!th) return;
  const m = me();
  th.innerHTML = S.people.map(p => `<line x1="${m.x}" y1="${m.y}" x2="${p.x}" y2="${p.y}" class="th-${p.side || 'o'}"/>`).join('');
}
function select(id, focusPanel) {
  sel = id;
  document.querySelectorAll('#anc-board .anc-tok').forEach(b => {
    const on = b.dataset.id === id;
    b.classList.toggle('is-sel', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  renderPanel();
  if (focusPanel && id !== 'eu' && window.matchMedia('(max-width: 1023px)').matches) $('anc-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* Distância a mim, em palavras (para o diário e o painel) */
function distWord(p) {
  const m = me(), d = Math.hypot(p.x - m.x, p.y - m.y);
  return d < 18 ? 'perto de mim' : d < 40 ? 'a meia distância' : 'longe de mim';
}

/* Painel da pessoa escolhida */
function renderPanel() {
  const host = $('anc-panel');
  if (!host) return;
  const p = sel && sel !== 'eu' ? findP(sel) : null;
  if (!p) {
    const n = S.people.length;
    const quick = ['mae', 'pai', 'avo_mf', 'avo_mm', 'avo_pf', 'avo_pm'].filter(k => !S.people.some(q => q.rel === k));
    host.innerHTML = `
      <h3 class="font-cinzel anc-panel-title">${sel === 'eu' ? 'Eu, no centro da linhagem' : 'O seu círculo'}</h3>
      ${n ? `<p class="anc-how">Toque numa pessoa do tabuleiro para escrever o que sente nesse lugar.</p>
        <ol class="anc-roll">${S.people.map(q => `<li><button type="button" data-pick="${esc(q.id)}"><i class="dot-${q.side || 'o'}" aria-hidden="true"></i><span class="anc-roll-rel">${esc(relName(q.rel))}</span>${q.name ? `<span class="anc-roll-name" translate="no">${esc(q.name)}</span>` : ''}${q.note ? '<span class="anc-roll-note" aria-label="tem notas">✎</span>' : ''}</button></li>`).join('')}</ol>`
      : `<p class="anc-how">O tabuleiro só tem a sua pedra, ᛗ Mannaz, a pessoa. Comece por juntar a mãe e o pai, ou quem sentir que deve estar presente.</p>`}
      ${quick.length ? `<div class="anc-quick" role="group" aria-label="Juntar depressa">${quick.map(k => `<button type="button" class="anc-chip" data-quick="${k}">＋ <span>${esc(RELS[k][0])}</span></button>`).join('')}</div>` : ''}
      <div class="anc-panel-actions">
        ${n ? `<button type="button" class="anc-btn" onclick="ancCircleToJournal()"><svg class="ic" aria-hidden="true"><use href="#i-journal"></use></svg>Guardar o círculo no Diário</button>
        <button type="button" class="anc-btn anc-btn-danger" id="anc-clear" onclick="ancClear(this)">Apagar o círculo</button>` : ''}
      </div>
      <p class="anc-privacy">Fica só neste aparelho. O que guardar no Diário fica cifrado se o Diário tiver PIN.</p>`;
    host.onclick = e => {
      const pick = e.target.closest('[data-pick]'); if (pick) { select(pick.dataset.pick, false); return; }
      const q = e.target.closest('[data-quick]'); if (q) addPerson(q.dataset.quick, false);
    };
    return;
  }
  host.onclick = null;
  host.innerHTML = `
    <div class="anc-panel-top">
      <h3 class="font-cinzel anc-panel-title">${esc(relName(p.rel))}</h3>
      <button type="button" class="sd-close" aria-label="Fechar" onclick="ancSelect(null)"><svg class="ic" aria-hidden="true"><use href="#i-close"></use></svg></button>
    </div>
    <div class="anc-form">
      <label>Nome (opcional)<input id="anc-f-name" type="text" maxlength="60" autocomplete="off" value="${esc(p.name)}" placeholder="Como o/a chama" translate="no"></label>
      <label>Quem é<select id="anc-f-rel">${Object.entries(RELS).map(([k, r]) => `<option value="${k}"${k === p.rel ? ' selected' : ''}>${esc(r[0])}</option>`).join('')}</select></label>
      <label>Linha<select id="anc-f-side">${Object.entries(SIDES).map(([k, n]) => `<option value="${k}"${k === p.side ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select></label>
      <label class="anc-check"><input id="anc-f-dead" type="checkbox"${p.dead ? ' checked' : ''}> Já partiu</label>
      <p class="anc-where"><span>No tabuleiro:</span> <b>${esc(distWord(p))}</b></p>
      <label class="anc-wide">O que sinto neste lugar<textarea id="anc-f-note" rows="4" maxlength="2000" placeholder="Ao olhar para esta pessoa, aqui, sinto…" translate="no">${esc(p.note || '')}</textarea></label>
      <div class="anc-wide"><p class="anc-ph-title">Palavras que pode dizer-lhe <span>(toque para juntar às notas)</span></p>
        <div class="anc-phrases">${PHRASES.map(f => `<button type="button" class="anc-chip" data-phrase="${esc(f)}">${esc(f)}</button>`).join('')}</div></div>
    </div>
    <div class="anc-panel-actions">
      <button type="button" class="anc-btn anc-btn-primary" onclick="ancSelect(null)">Feito</button>
      <button type="button" class="anc-btn anc-btn-danger" onclick="ancRemove('${esc(p.id)}')">Tirar do círculo</button>
    </div>`;
  const upd = () => {
    p.name = $('anc-f-name').value.trim();
    const rel = $('anc-f-rel').value;
    if (rel !== p.rel) { p.rel = rel; $('anc-f-side').value = p.side = RELS[rel][2]; host.querySelector('.anc-panel-title').textContent = T(relName(rel)); }
    p.side = $('anc-f-side').value;
    p.dead = $('anc-f-dead').checked;
    p.note = $('anc-f-note').value;
    save(); drawBoard();
  };
  ['anc-f-name', 'anc-f-note'].forEach(id => $(id).addEventListener('input', upd));
  ['anc-f-rel', 'anc-f-side', 'anc-f-dead'].forEach(id => $(id).addEventListener('change', upd));
  host.querySelector('.anc-phrases').addEventListener('click', e => {
    const b = e.target.closest('[data-phrase]'); if (!b) return;
    const ta = $('anc-f-note');
    ta.value = (ta.value.trim() ? ta.value.replace(/\s*$/, '\n') : '') + T(b.dataset.phrase);
    upd(); ta.focus();
  });
}
window.ancSelect = id => { select(id, false); if (!id) $('anc-board')?.focus?.(); };

function spotFor(rel) {
  const [, g, side] = RELS[rel] || RELS.outro;
  const y = { 3: 14, 2: 32, 1: 52, 0: 74, '-1': 90 }[g] ?? 74;
  const sameRow = S.people.filter(p => genOf(p) === g && p.side === side).length;
  const base = side === 'm' ? 26 : side === 'p' ? 74 : 50;
  const x = side === 'o' ? 50 + (sameRow % 2 ? 1 : -1) * (20 + 12 * Math.floor(sameRow / 2)) : base + (sameRow % 2 ? 1 : -1) * 9 * Math.ceil(sameRow / 2);
  return { x: Math.max(6, Math.min(94, x)), y };
}
function addPerson(rel, openPanel = true) {
  const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const { x, y } = spotFor(rel);
  S.people.push({ id, rel, name: '', side: (RELS[rel] || RELS.outro)[2], dead: false, note: '', x, y });
  save(); drawBoard();
  if (openPanel) { select(id, true); setTimeout(() => $('anc-f-name')?.focus({ preventScroll: true }), 50); }
  else renderPanel();
}
window.ancAdd = () => addPerson(S.people.some(p => p.rel === 'mae') ? (S.people.some(p => p.rel === 'pai') ? 'outro' : 'pai') : 'mae');
window.ancRemove = id => { S.people = S.people.filter(p => p.id !== id); sel = null; save(); drawBoard(); renderPanel(); toast('Tirado do círculo.'); };
window.ancClear = function (btn) {
  if (!btn.dataset.sure) {
    btn.dataset.sure = '1';
    btn.textContent = T('Toque outra vez para apagar tudo');
    setTimeout(() => { if (btn.isConnected) { delete btn.dataset.sure; btn.textContent = T('Apagar o círculo'); } }, 4000);
    return;
  }
  S.people = []; delete S.meX; delete S.meY; sel = null; save(); drawBoard(); renderPanel(); toast('O círculo foi apagado deste aparelho.');
};

/* Arrumar: em árvore (gerações em filas, mães à esquerda e pais à direita) ou em círculo à minha volta */
window.ancLayout = function (kind) {
  if (kind === 'tree') {
    S.meX = 50; S.meY = 74;
    const rows = {};
    S.people.forEach(p => { const k = `${genOf(p)}|${p.side || 'o'}`; (rows[k] = rows[k] || []).push(p); });
    Object.entries(rows).forEach(([k, list]) => {
      const [g, side] = k.split('|');
      const y = { 3: 14, 2: 32, 1: 52, 0: 74, '-1': 90 }[g] ?? 74;
      let x0 = 6, x1 = 44;
      if (side === 'p') { x0 = 56; x1 = 94; }
      if (side === 'o') { x0 = 10; x1 = 90; }
      const n = list.length;
      list.forEach((p, i) => {
        let x = n === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * (i + .5) / n;
        if (side === 'o' && Math.abs(x - 50) < 10) x += x < 50 ? -12 : 12;
        moveP(p.id, x, y);
      });
    });
  } else {
    S.meX = 50; S.meY = 50;
    const order = [...S.people.filter(p => p.side === 'p'), ...S.people.filter(p => p.side === 'o'), ...S.people.filter(p => p.side === 'm')];
    const n = order.length;
    order.forEach((p, i) => {
      const a = (i + 0.5) / n * Math.PI * 2; // no sentido dos ponteiros do relógio, a partir de cima
      moveP(p.id, 50 + 38 * Math.sin(a), 50 - 38 * Math.cos(a));
    });
  }
  save(); drawBoard();
  toast(kind === 'tree' ? 'Arrumado em árvore.' : 'Arrumado em círculo.');
};

/* ——— Diário (cifrado, se tiver PIN) ——— */
function toJournal(text) {
  if (typeof window.journalAppend === 'function') return window.journalAppend(text);
  if (typeof appendToJournal === 'function') { appendToJournal(text); return 'plain'; }
  return '';
}
const lineName = p => [T(relName(p.rel)), p.name].filter(Boolean).join(' · ');
window.ancCircleToJournal = function () {
  if (!S.people.length) return;
  const lines = S.people.map(p => {
    const bits = [T(SIDES[p.side] || SIDES.o).toLowerCase(), T(distWord(p))];
    if (p.dead) bits.push(T('já partiu').toLowerCase());
    return `• ${lineName(p)} (${bits.join(', ')})${p.note ? `\n  ${p.note.trim().replace(/\n/g, '\n  ')}` : ''}`;
  });
  toJournal(`${T('CONSTELAÇÃO DOS ANTEPASSADOS')}\n${lines.join('\n')}`);
};

/* ============================================================
   2) Tiragem dos Antepassados (runas ou Ogham)
   ============================================================ */
const ANC_SPREAD = {
  key: 'antepassados',
  name: 'Tiragem dos Antepassados', short: '5 · linhagem',
  grid: ['b . a', '. c .', 'e . d'],
  pos: [
    ['Linha materna', 'O que chega pela mãe e pelas mães antes dela.'],
    ['Linha paterna', 'O que chega pelo pai e pelos pais antes dele.'],
    ['O que se herda', 'O dom ou a força que a linhagem lhe passa.'],
    ['O que se devolve', 'O peso que não é seu e pode entregar, com respeito.'],
    ['A bênção', 'A bênção dos antepassados para o seu caminho.']
  ],
  how: 'Leia de cima para baixo e da direita para a esquerda: as duas linhas, ao centro o que se herda e, em baixo, o que se devolve e, por fim, a bênção.'
};
window.ANCESTOR_SPREAD = ANC_SPREAD;
let sys = 'runes', last = null;
function renderSpreadView() {
  const host = $('anc-view');
  const named = S.people.filter(p => p.name || p.rel);
  host.innerHTML = `
    <div class="theme-card border rounded-2xl anc-spread-card">
      <div class="anc-spread-intro">
        ${typeof runeSpreadMap === 'function' ? runeSpreadMap(ANC_SPREAD) : ''}
        <div>
          <h3 class="font-cinzel anc-panel-title">Tiragem dos Antepassados</h3>
          <p class="anc-how">Cinco casas para a linhagem: a linha materna, a linha paterna, o que se herda, o que se devolve e a bênção.</p>
        </div>
      </div>
      <div class="anc-spread-opts">
        <div class="seg" role="group" aria-label="Oráculo">
          <button type="button" class="anc-seg" data-sys="runes" aria-pressed="${sys === 'runes'}">Runas</button>
          <button type="button" class="anc-seg" data-sys="ogham" aria-pressed="${sys === 'ogham'}">Ogham</button>
        </div>
        <label class="anc-focus">Em foco (opcional)<select id="anc-focus">
          <option value="">Toda a linhagem</option>
          ${named.map(p => `<option value="${esc(p.id)}">${esc(lineName(p))}</option>`).join('')}
        </select></label>
        <button type="button" class="anc-btn anc-btn-primary" onclick="ancDraw()">Tirar</button>
      </div>
      <div id="anc-reading" class="anc-reading oracle-stage" aria-live="polite">
        <div class="oracle-empty"><div class="oe-art oe-stones" aria-hidden="true"><span>ᛟ</span><span>ᛒ</span><span>ᛞ</span></div><p class="oe-text">Acenda uma vela, pense em quem veio antes de si e tire as cinco pedras.</p></div>
      </div>
      <div id="anc-reading-bar" class="oracle-actions hidden" role="group" aria-label="Ações da leitura">
        <button type="button" class="oa-btn" onclick="ancReadingToJournal()"><svg class="ic" aria-hidden="true"><use href="#i-journal"></use></svg>Guardar no Diário</button>
        <button type="button" class="oa-btn oa-quiet" onclick="ancDraw()"><svg class="ic" aria-hidden="true"><use href="#i-redo"></use></svg>Tirar outra</button>
      </div>
    </div>`;
  host.querySelector('.anc-spread-opts .seg').addEventListener('click', e => {
    const b = e.target.closest('[data-sys]'); if (!b) return;
    sys = b.dataset.sys;
    host.querySelectorAll('[data-sys]').forEach(x => x.setAttribute('aria-pressed', x.dataset.sys === sys ? 'true' : 'false'));
  });
  if (last) paintReading();
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
window.ancDraw = function () {
  const focusId = ($('anc-focus') || {}).value || '';
  const fp = focusId ? findP(focusId) : null;
  const pool = shuffle(sys === 'runes' ? (typeof runePool === 'function' ? runePool() : [...(window.RUNES_DATA || [])]) : [...(window.OGHAM_DATA || [])]);
  const items = ANC_SPREAD.pos.map((_, i) => sys === 'runes' && typeof castRune === 'function' ? castRune(pool[i]) : { ...pool[i] });
  last = { sys, items, focus: fp ? lineName(fp) : '', t: Date.now() };
  paintReading();
  if (sys === 'runes' && typeof noticeReversedRunes === 'function') noticeReversedRunes(items);
  try {
    const log = JSON.parse(localStorage.getItem('druid_readings') || '[]');
    log.unshift({ t: last.t, type: sys, spread: ANC_SPREAD.name, q: last.focus || undefined, lines: items.map(it => `${it.symbol || '◯'} ${it.name}`) });
    localStorage.setItem('druid_readings', JSON.stringify(log.slice(0, 30)));
  } catch { /* nada */ }
};
function itemBody(it) {
  if (last.sys === 'ogham') {
    return `<h3 class="oc-name font-cinzel">${esc(it.name)}</h3><p class="oc-sub">${esc(it.tree || '')}</p><p class="oc-meaning">${esc(it.meaning)}</p>`;
  }
  const name = it.baseName || it.name, msg = (window.RUNE_MESSAGES || {})[name];
  return `<h3 class="oc-name font-cinzel">${esc(name)}</h3>
    ${it.reversed ? '<div class="oc-chips"><span class="oc-chip oc-chip-rev">⟲ Invertida</span></div>' : ''}
    <p class="oc-meaning">${esc(it.meaning)}</p>
    ${msg ? `<p class="oc-extra oc-msg"><span>Mensagem</span> ${esc(msg)}</p>` : ''}`;
}
function paintReading() {
  const el = $('anc-reading');
  if (!el || !last) return;
  const style = typeof runeSpreadGridStyle === 'function' ? runeSpreadGridStyle(ANC_SPREAD) : '';
  el.innerHTML = `
    ${last.focus ? `<p class="anc-focus-line"><span>Em foco:</span> <b translate="no">${esc(last.focus)}</b></p>` : ''}
    <p class="rs-how anc-reading-how">${esc(ANC_SPREAD.how)}</p>
    <div class="grid oc-spread oc-rs" style='${style}'>${last.items.map((it, i) => `
      <article class="oc-card oc-${last.sys}${it.reversed ? ' is-reversed' : ''}" style="grid-area:${String.fromCharCode(97 + i)}">
        <span class="oc-num" aria-hidden="true">${i + 1}.ª</span>
        ${last.sys === 'ogham'
          ? `<div class="oc-object oc-stave" aria-hidden="true"><span class="stave-glyph">${esc(it.symbol)}</span></div>`
          : `<div class="oc-object oc-stone${it.reversed ? ' is-reversed' : ''}" style="--tilt:${[-4, 3, -2, 5, -3][i]}deg" aria-hidden="true"><span class="stone-glyph">${esc(it.symbol || '')}</span></div>`}
        <div class="oc-body">
          <p class="oc-pos"><span class="sr-only">${i + 1}.ª casa: </span>${esc(ANC_SPREAD.pos[i][0])}</p>
          <p class="oc-hint">${esc(ANC_SPREAD.pos[i][1])}</p>
          ${itemBody(it)}
        </div>
      </article>`).join('')}</div>`;
  el.classList.remove('draw-area');
  $('anc-reading-bar')?.classList.remove('hidden');
}
window.ancReadingToJournal = function () {
  if (!last) return;
  const head = `${T('TIRAGEM DOS ANTEPASSADOS')} · ${T(last.sys === 'runes' ? 'Runas' : 'Ogham')}`;
  const focus = last.focus ? `${T('Em foco:')} ${last.focus}\n` : '';
  const lines = last.items.map((it, i) => `• ${T(ANC_SPREAD.pos[i][0])}: ${it.symbol || ''} ${T(it.name)}: ${T(it.meaning)}`.replace(/\s{2,}/g, ' '));
  toJournal(`${head}\n${focus}${lines.join('\n')}`);
};

/* ============================================================
   3) Ritual de Samhain para honrar os antepassados
   ============================================================ */
const STEPS = [
  ['Preparar o altar', 'Um pano escuro, uma vela, fotografias ou os nomes escritos dos seus antepassados e uma oferenda simples: maçã, romã, pão ou um copo de água.'],
  ['Abrir o círculo', 'Respire fundo três vezes. Volte-se para cada quadrante e diga:', '«Que haja paz no Este. Que haja paz no Sul. Que haja paz no Oeste. Que haja paz no Norte. Que haja paz em todo o mundo.»'],
  ['Acender a vela da memória', 'Acenda a vela e diga:', '«Acendo esta luz para os que vieram antes de mim. Que ela vos encontre e vos dê as boas-vindas.»'],
  ['Dizer os nomes', 'Diga em voz alta o nome de cada antepassado que quer honrar. Se não souber os nomes, diga:', '«A todos os que vieram antes de mim, lembrados e esquecidos.»'],
  ['Deixar a oferenda', 'Ponha a oferenda junto da vela e diga:', '«Trago-vos este presente em sinal de gratidão.»'],
  ['Escutar em silêncio', 'Fique alguns minutos em silêncio, a olhar para a chama. Repare no que vem: uma memória, uma imagem, uma sensação no corpo.'],
  ['Receber e devolver', 'Escreva em baixo o que recebe da linhagem com gratidão e o que devolve com respeito, por não ser seu carregar.'],
  ['Bênção e fecho', 'Agradeça e despeça-se:', '«Obrigado/a pela vida que passou por vós até mim. Levo comigo o que é bom e deixo convosco o que é vosso. Ide em paz.» Apague a vela ou deixe-a acesa à janela, como manda a tradição, mas nunca sem ninguém a vigiar.']
];
let timer = null;
function nextSamhain() {
  const now = new Date(), y = now.getFullYear();
  const d = new Date(y, 9, 31);
  const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return t0 > d ? new Date(y + 1, 9, 31) : d;
}
function renderRitual() {
  const host = $('anc-view');
  const ns = nextSamhain();
  const t0 = new Date(); t0.setHours(0, 0, 0, 0);
  const days = Math.round((ns - t0) / 864e5);
  const dead = S.people.filter(p => p.dead), names = (dead.length ? dead : S.people).map(lineName);
  const enc = typeof window.journalEncrypted === 'function' ? window.journalEncrypted() : false;
  const y = new Date().getFullYear(), m = new Date().getMonth();
  host.innerHTML = `
    <div class="theme-card border rounded-2xl anc-ritual">
      <div class="anc-ritual-head">
        <div>
          <h3 class="font-cinzel anc-panel-title">Ritual de Samhain: honrar os antepassados</h3>
          <p class="anc-how">Samhain, de 31 de outubro para 1 de novembro, abre o ano druídico: a noite em que o véu entre os mundos fica mais fino. Pode fazer este ritual nessa noite ou noutra data com sentido, como o aniversário de alguém que partiu.</p>
        </div>
        <p class="anc-next"><span>Próximo Samhain</span><b>${ns.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</b><span>${days === 0 ? 'É hoje' : `Daqui a ${days} dias`}</span></p>
      </div>
      <ol class="anc-steps">${STEPS.map(([h, txt, words], i) => `
        <li><label class="anc-step"><input type="checkbox" aria-label="${esc(h)}: feito"><span class="anc-step-n" aria-hidden="true">${i + 1}</span>
          <span class="anc-step-body"><b>${esc(h)}</b><span>${esc(txt)}</span>${words ? `<span class="anc-words">${esc(words)}</span>` : ''}</span></label>
          ${i === 3 && names.length ? `<p class="anc-names"><span>Do seu círculo:</span> <span translate="no">${names.map(esc).join(' · ')}</span></p>` : ''}
          ${i === 5 ? `<div class="anc-timer"><button type="button" class="anc-btn" id="anc-timer-btn" onclick="ancSilence()">Começar 3 minutos de silêncio</button><span id="anc-timer" class="anc-timer-n" role="timer" aria-live="off"></span></div>` : ''}
        </li>`).join('')}</ol>
      <div class="anc-form anc-ritual-form">
        <label>O que recebo com gratidão<textarea id="anc-r-receive" rows="3" maxlength="2000" placeholder="A coragem da minha avó, as mãos para a terra…" translate="no"></textarea></label>
        <label>O que devolvo com respeito<textarea id="anc-r-return" rows="3" maxlength="2000" placeholder="O medo que não é meu, a pressa, o silêncio sobre…" translate="no"></textarea></label>
        <label class="anc-wide">O que senti<textarea id="anc-r-felt" rows="3" maxlength="3000" placeholder="Durante o silêncio veio-me…" translate="no"></textarea></label>
        <label class="anc-check anc-wide"><input id="anc-r-wheel" type="checkbox"${m === 9 || m === 10 ? ' checked' : ''}> Marcar o Samhain deste ano como celebrado na Roda do Ano</label>
      </div>
      <div class="anc-panel-actions">
        <button type="button" class="anc-btn anc-btn-primary" onclick="ancRitualSave()"><svg class="ic" aria-hidden="true"><use href="#i-lock"></use></svg>Registar no Diário</button>
      </div>
      <p class="anc-privacy">${enc ? 'O Diário está cifrado com o seu PIN: o registo fica protegido neste aparelho.'
        : 'O Diário ainda não tem PIN. Para o registo ficar cifrado, ative o PIN no Diário antes de registar.'}
        ${enc ? '' : '<button type="button" class="btn-link" onclick="switchTab(\'journal\');togglePinSettings&&togglePinSettings()">Ativar o PIN</button>'}</p>
    </div>`;
}
window.ancSilence = function () {
  const out = $('anc-timer'), btn = $('anc-timer-btn');
  if (!out) return;
  if (timer) { clearInterval(timer); timer = null; out.textContent = ''; if (btn) btn.textContent = T('Começar 3 minutos de silêncio'); return; }
  let left = 180;
  const show = () => { out.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; };
  show();
  if (btn) btn.textContent = T('Parar');
  timer = setInterval(() => {
    left -= 1; show();
    if (left <= 0 || !out.isConnected) {
      clearInterval(timer); timer = null;
      if (out.isConnected) { out.textContent = ''; if (btn) btn.textContent = T('Começar 3 minutos de silêncio'); toast('O silêncio terminou. Volte devagar.'); try { navigator.vibrate?.(200); } catch { /* nada */ } }
    }
  }, 1000);
};
window.ancRitualSave = function () {
  const v = id => (($(id) || {}).value || '').trim();
  const dead = S.people.filter(p => p.dead), names = (dead.length ? dead : S.people).map(lineName);
  const parts = [T('RITUAL DE SAMHAIN · HONRAR OS ANTEPASSADOS')];
  if (names.length) parts.push(`${T('Nomes honrados:')} ${names.join(', ')}`);
  if (v('anc-r-receive')) parts.push(`${T('Recebo com gratidão:')} ${v('anc-r-receive')}`);
  if (v('anc-r-return')) parts.push(`${T('Devolvo com respeito:')} ${v('anc-r-return')}`);
  if (v('anc-r-felt')) parts.push(`${T('O que senti:')} ${v('anc-r-felt')}`);
  toJournal(parts.join('\n'));
  if (($('anc-r-wheel') || {}).checked) {
    try {
      const y = new Date().getFullYear();
      const log = JSON.parse(localStorage.getItem('druid_fest_log') || '[]').filter(e => !(e.fest === 'Samhain' && e.year === y));
      log.push({ fest: 'Samhain', year: y, date: new Date().toLocaleDateString('sv'), text: '', inJournal: true });
      localStorage.setItem('druid_fest_log', JSON.stringify(log));
      if (typeof window.editFestLog === 'function') window.editFestLog(null);
    } catch { /* nada */ }
  }
  ['anc-r-receive', 'anc-r-return', 'anc-r-felt'].forEach(id => { const el = $(id); if (el) el.value = ''; });
};

/* ——— Arranque ——— */
function render() { if (!shell()) return; renderCare(); renderBody(); }
const prevSwitch = window.switchTab;
window.switchTab = function (id) {
  const r = prevSwitch.apply(this, arguments);
  if (id === 'ancestors') render();
  return r;
};
shell(); // já, para o design global (js/24) encontrar o título da secção
wireBoard();
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
