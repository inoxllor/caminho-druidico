/* ============================================================
   v9 — Expansão: oráculo diário, prompts, checklist, partilha,
   sim/não, mapa lunar, estatísticas, perfil, offline, .ics
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const esc = window.esc || (s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
const todayKey = () => new Date().toLocaleDateString('sv');
let lastDailyOracle = null;

const PROMPTS = [
  'O que a árvore deste mês te pede para soltar?',
  'Que semente queres plantar nesta fase da Lua?',
  'Onde sentiste a presença dos ancestrais hoje?',
  'Que fronteira precisas de honrar ou atravessar?',
  'Qual foi o sinal mais subtil que a natureza te deu?',
  'O que a tua intuição sussurrou e a mente ignorou?',
  'Como podes servir o teu grove (interno ou externo) esta semana?',
  'Que hábito antigo já não te serve no caminho?',
  'Onde está a água estagnada na tua vida — e como a podes fazer fluir?',
  'Que gratidão simples podes oferecer à Terra agora?'
];

const FEST_CHECKS = {
  Yule: ['Preparar altar com sempre-vivas e velas', 'Reflectir sobre o ano que termina', 'Fazer uma intenções para o retorno da luz', 'Partilhar uma refeição ou brinde simbólico'],
  Imbolc: ['Acender uma vela a Brigid', 'Limpar e abençoar o espaço de prática', 'Escrever uma intenção de renovação', 'Oferecer leite ou água à terra'],
  Ostara: ['Observar o equilíbrio dia/noite', 'Plantar sementes (reais ou simbólicas)', 'Fazer uma caminhada ao ar livre', 'Registar o que quer fazer crescer'],
  Beltane: ['Acender uma chama sagrada (mesmo digital)', 'Celebrar a vitalidade do corpo', 'Criar ou cantar algo novo', 'Honrar a união de polaridades'],
  Litha: ['Saudar o nascer ou o pôr do sol', 'Fazer uma oferta de flores ou ervas', 'Meditar na plenitude do ano', 'Registar o que está em pleno florescimento'],
  Lughnasadh: ['Agradecer a primeira colheita', 'Partilhar pão ou fruta com alguém', 'Avaliar o progresso das intenções de primavera', 'Oferecer algo feito com as próprias mãos'],
  Mabon: ['Fazer um inventário de gratidão', 'Equilibrar dar e receber', 'Preparar o espaço para o recolher', 'Honrar os ancestrais da colheita'],
  Samhain: ['Acender uma vela pelos antepassados', 'Fazer um pequeno altar de memória', 'Escrever o que queres deixar para trás', 'Caminhar em silêncio ao entardecer']
};

// ——— Streak badge ———
function updateStreakBadge() {
  const s = typeof streak === 'function' ? streak() : 0;
  const el = $('streak-label');
  if (el) el.textContent = `${s} dia${s === 1 ? '' : 's'}`;
}

// ——— Daily prompt ———
function setDailyPrompt() {
  const el = $('daily-prompt');
  if (!el) return;
  const seed = parseInt(todayKey().replace(/-/g, ''), 10);
  el.textContent = PROMPTS[seed % PROMPTS.length];
}
window.useDailyPrompt = function () {
  const p = $('daily-prompt')?.textContent || '';
  switchTab('journal');
  const area = $('journal-input');
  if (area) {
    area.value = (area.value + `\n\n--- Prompt (${new Date().toLocaleDateString('pt-PT')}) ---\n${p}\n\n`).trimStart();
    if (typeof autoSaveJournal === 'function') autoSaveJournal();
    area.focus();
  }
  showToast('Prompt inserido no Diário.');
};

// ——— Daily triad ———
window.drawDailyTriad = function () {
  const box = $('daily-triad-box');
  if (!box || !window.TRIADS_DATA?.length) return;
  const t = TRIADS_DATA[Math.floor(Math.random() * TRIADS_DATA.length)];
  box.textContent = `"${t}"`;
  box.classList.add('reveal-in');
  if (navigator.vibrate) try { navigator.vibrate(12); } catch {}
};

// ——— Daily oracle ———
window.drawDailyOracle = function (type) {
  const box = $('daily-oracle');
  const actions = $('daily-oracle-actions');
  if (!box) return;
  let html = '', text = '';
  if (type === 'rune' && ((typeof RUNES_DATA !== 'undefined' && RUNES_DATA?.length) || window.RUNES_DATA?.length)) {
    const r = RUNES_DATA[Math.floor(Math.random() * RUNES_DATA.length)];
    html = `<div class="reveal-in space-y-2"><div class="text-5xl theme-glyph">${r.symbol}</div><h4 class="font-cinzel text-lg font-bold theme-info-hl">${esc(r.name)}</h4><p class="text-sm theme-muted">${esc(r.meaning)}</p></div>`;
    text = `RUNA DO DIA: ${r.symbol} ${r.name} — ${r.meaning}`;
  } else if (type === 'ogham' && ((typeof OGHAM_DATA !== 'undefined' && OGHAM_DATA?.length) || window.OGHAM_DATA?.length)) {
    const o = OGHAM_DATA[Math.floor(Math.random() * OGHAM_DATA.length)];
    html = `<div class="reveal-in space-y-2"><div class="text-5xl theme-glyph">${o.symbol}</div><h4 class="font-cinzel text-lg font-bold theme-info-hl">${esc(o.name)} · ${esc(o.tree)}</h4><p class="text-sm theme-muted">${esc(o.meaning)}</p></div>`;
    text = `OGHAM DO DIA: ${o.symbol} ${o.name} (${o.tree}) — ${o.meaning}`;
  } else if (type === 'tarot' && ((typeof NORDIC_TAROT_DECK !== 'undefined' && NORDIC_TAROT_DECK?.length) || window.NORDIC_TAROT_DECK?.length)) {
    const c = NORDIC_TAROT_DECK[Math.floor(Math.random() * NORDIC_TAROT_DECK.length)];
    const rev = Math.random() < 0.3;
    const meaning = rev ? c.reversed : c.upright;
    html = `<div class="reveal-in space-y-2"><h4 class="font-cinzel text-lg font-bold theme-info-hl">${esc(c.name)}${rev ? ' (inv.)' : ''}</h4><p class="text-xs theme-muted">${esc(c.title || '')}</p><p class="text-sm theme-muted">${esc(meaning)}</p></div>`;
    text = `TAROT DO DIA: ${c.name}${rev ? ' (invertida)' : ''} — ${meaning}`;
  } else {
    html = `<p class="text-sm theme-muted">Dados do oráculo indisponíveis.</p>`;
  }
  box.innerHTML = html;
  lastDailyOracle = text;
  if (actions) actions.classList.remove('hidden');
  try { localStorage.setItem('druid_daily_oracle', JSON.stringify({ day: todayKey(), type, text })); } catch {}
  if (navigator.vibrate) try { navigator.vibrate(18); } catch {}
};
window.saveDailyOracleToJournal = function () {
  if (!lastDailyOracle) return;
  if (typeof appendToJournal === 'function') appendToJournal(lastDailyOracle);
  else {
    const area = $('journal-input');
    if (area) { area.value += `\n--- [${new Date().toLocaleString('pt-PT')}] ${lastDailyOracle}\n`; if (typeof autoSaveJournal === 'function') autoSaveJournal(); }
  }
  showToast('Oráculo do dia guardado no Diário!');
};

// ——— Festival checklist ———
function renderFestivalChecklist() {
  const n = typeof nextFestival === 'function' ? nextFestival() : (window.__druid?.nextFestival?.() || null);
  if (!n) return;
  const nameEl = $('fest-check-name');
  const list = $('festival-checklist');
  if (!nameEl || !list) return;
  nameEl.textContent = `${n.name}${n.days === 0 ? ' (hoje)' : ' · em ' + n.days + 'd'}`;
  const items = FEST_CHECKS[n.name] || ['Preparar o altar', 'Reflectir sobre o tema do festival', 'Registar intenções no diário', 'Honrar os elementos'];
  const key = `druid_fest_check_${n.name}_${new Date().getFullYear()}`;
  let done = {};
  try { done = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
  list.innerHTML = items.map((label, i) => `
    <li class="check-item ${done[i] ? 'done' : ''}" data-i="${i}">
      <input type="checkbox" ${done[i] ? 'checked' : ''} aria-label="${esc(label)}">
      <span>${esc(label)}</span>
    </li>`).join('');
  list.querySelectorAll('.check-item').forEach(li => {
    const cb = li.querySelector('input');
    cb.addEventListener('change', () => {
      done[li.dataset.i] = cb.checked;
      li.classList.toggle('done', cb.checked);
      try { localStorage.setItem(key, JSON.stringify(done)); } catch {}
    });
  });
}

// ——— Yes / No ———
window.drawYesNo = function (system) {
  try {
    const leanYes = Math.random() < 0.5;
    const answer = leanYes ? 'Sim' : 'Não';
    const runes = (typeof RUNES_DATA !== 'undefined' && RUNES_DATA) || window.RUNES_DATA;
    const ogham = (typeof OGHAM_DATA !== 'undefined' && OGHAM_DATA) || window.OGHAM_DATA;
    const tarot = (typeof NORDIC_TAROT_DECK !== 'undefined' && NORDIC_TAROT_DECK) || window.NORDIC_TAROT_DECK;

    if (system === 'runes') {
      if (!runes || !runes.length) { showToast('Dados de runas indisponíveis.'); return; }
      const r = castRune(runes[Math.floor(Math.random() * runes.length)]);
      lastRuneReading = [r];
      renderOracleReading('runes', [r], ['Sim ou Não'], { answer });
      noticeReversedRunes([r]);
      document.getElementById('rune-save-bar')?.classList.remove('hidden');
      if (typeof switchRuneMode === 'function') try { switchRuneMode('draw'); } catch(e) {}
    } else if (system === 'ogham') {
      if (!ogham || !ogham.length) { showToast('Dados de Ogham indisponíveis.'); return; }
      const o = ogham[Math.floor(Math.random() * ogham.length)];
      lastOghamReading = [o];
      renderOracleReading('ogham', [o], ['Sim ou Não'], { answer });
      document.getElementById('ogham-save-bar')?.classList.remove('hidden');
    } else if (system === 'tarot') {
      if (!tarot || !tarot.length) { showToast('Dados de Tarot indisponíveis.'); return; }
      if (typeof switchTarotMode === 'function') try { switchTarotMode('draw'); } catch(e) {}
      const c = tarot[Math.floor(Math.random() * tarot.length)];
      const rev = Math.random() < 0.35;
      lastTarotReading = [{ card: c, isReversed: rev, pos: 'Sim / Não' }];
      lastTarotMeta = { question: 'Sim ou Não?', spread: 'Sim / Não' };
      const el = document.getElementById('tarot-card-container');
      if (el) {
        el.classList.remove('draw-area');
        el.innerHTML = '<div class="oc-answer ' + (answer === 'Sim' ? 'is-yes' : 'is-no') + '" role="status"><span>O oráculo responde</span><b class="font-cinzel">' + answer + '</b></div>'
          + '<div class="grid grid-cols-1 gap-5 w-full items-start justify-center oc-tarot-yn">' + buildPixelCardHTML(c, rev, 'Sim ou Não') + '</div>';
      }
      document.getElementById('tarot-save-bar')?.classList.remove('hidden');
    } else {
      showToast('Sistema de oráculo desconhecido.');
      return;
    }
    if (navigator.vibrate) try { navigator.vibrate(15); } catch {}
  } catch (err) {
    console.error('drawYesNo', err);
    showToast('Erro ao gerar resposta Sim/Não.');
  }
};

// ——— Share reading (text + optional image via canvas) ———
window.shareReading = async function (type) {
  let title = 'Caminho Druídico', body = '';
  if (type === 'daily' && lastDailyOracle) { body = lastDailyOracle; title = 'Oráculo de hoje'; }
  else if (type === 'runes' && lastRuneReading?.length) {
    body = lastRuneReading.map(r => `${r.symbol} ${r.name}: ${r.meaning}`).join('\n');
    title = 'Tiragem de Runas';
  } else if (type === 'ogham' && lastOghamReading?.length) {
    body = lastOghamReading.map(o => `${o.symbol} ${o.name} (${o.tree}): ${o.meaning}`).join('\n');
    title = 'Tiragem de Ogham';
  } else if (type === 'tarot' && lastTarotReading?.length) {
    body = lastTarotReading.map(t => `${t.pos}: ${t.card.name}${t.isReversed ? ' (inv.)' : ''} — ${t.isReversed ? t.card.reversed : t.card.upright}`).join('\n');
    title = lastTarotMeta?.spread || 'Tiragem de Tarot';
  } else {
    showToast('Nenhuma tiragem ativa para partilhar.');
    return;
  }
  const text = `${title}\n\n${body}\n\n— Caminho Druídico`;
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      showToast('Partilhado!');
      return;
    }
  } catch (e) { if (e.name === 'AbortError') return; }
  try {
    await navigator.clipboard.writeText(text);
    showToast('Texto copiado para a área de transferência.');
  } catch {
    showToast('Não foi possível partilhar automaticamente.');
  }
};

// ——— Motor lunar unificado (mapa + ciclo) ———
// Fases reais calculadas por LunarCalc (Meeus) a partir da data atual
const LUNAR_ICONS = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
const LUNAR_NAMES = [
  'Lua Nova', 'Lua Crescente', 'Quarto Crescente', 'Gibosa Crescente',
  'Lua Cheia', 'Gibosa Minguante', 'Quarto Minguante', 'Lua Minguante'
];

/** Idade da lua em dias e índice de fase 0–7 para qualquer data */
window.getMoonPhaseInfo = function (date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const st = LunarCalc.state(d);
  return { age: st.age, idx: st.idx, icon: st.icon, name: st.name, illumination: st.illumPct, frac: st.frac, event: st.event, nextFull: st.nextFull, nextNew: st.nextNew };
};

let lunarMapOffset = 0;
let _lunarLastDayKey = '';

function lunarDayKey(d = new Date()) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/** Actualiza mapa + ciclo + textos para a data actual do sistema */
window.refreshLunarUI = function (opts = {}) {
  const resetMonth = opts.resetMonth !== false;
  if (resetMonth) lunarMapOffset = 0;
  try {
    if (typeof updateAstronomy === 'function') updateAstronomy();
  } catch (e) {}
  try {
    if (typeof updateAstronomyCharts === 'function') updateAstronomyCharts();
  } catch (e) {}
  try { renderLunarMap(); } catch (e) {}
  try {
    if (typeof updateLunarCounsel === 'function') updateLunarCounsel();
  } catch (e) {}
  _lunarLastDayKey = lunarDayKey();
};

function ensureLunarMap() {
  if ($('lunar-month-map')) renderLunarMap();
}

window.shiftLunarMap = function (delta) {
  lunarMapOffset = (lunarMapOffset || 0) + (delta || 0);
  renderLunarMap();
};
window.resetLunarMap = function () {
  lunarMapOffset = 0;
  renderLunarMap();
};

window.renderLunarMap = function () {
  const map = $('lunar-month-map');
  if (!map) return;
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth() + (lunarMapOffset || 0), 1);
  const y = base.getFullYear();
  const m = base.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstWeekday = (new Date(y, m, 1).getDay() + 6) % 7; // segunda = 0

  const title = $('lunar-map-title');
  if (title) {
    title.textContent = base.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  }

  const phaseClass = (idx) => (idx === 0 ? 'is-new' : idx === 4 ? 'is-full' : idx === 2 || idx === 6 ? 'is-quarter' : '');
  let out = '';
  for (let i = 0; i < firstWeekday; i++) {
    out += '<div class="lunar-day is-empty" aria-hidden="true"></div>';
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const info = LunarCalc.dayPhase(y, m, d);
    info.icon = LUNAR_ICONS[info.idx]; info.name = LUNAR_NAMES[info.idx];
    let ev = '';
    if (info.event) {
      const hm = info.event.date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
      info.name += ' às ' + hm;
      ev = '<span class="ld-ev" aria-hidden="true">' + (['Nova', '', 'Q.C.', '', 'Cheia', '', 'Q.M.', ''][info.idx] || '') + ' ' + hm + '</span>';
    }
    const isToday = (lunarMapOffset || 0) === 0 &&
      d === now.getDate() && m === now.getMonth() && y === now.getFullYear();
    const cls = ['lunar-day', phaseClass(info.idx), isToday ? 'is-today' : ''].filter(Boolean).join(' ');
    const label = d + '/' + (m + 1) + '/' + y + ' · ' + info.icon + ' ' + info.name;
    out += '<div class="' + cls + '" role="gridcell" title="' + label + '" aria-label="' + label + '">' +
      '<span class="ld-phase" aria-hidden="true">' + info.icon + '</span>' +
      '<span class="ld-num">' + d + '</span>' + ev + '</div>';
  }
  const total = firstWeekday + daysInMonth;
  const trail = (7 - (total % 7)) % 7;
  for (let i = 0; i < trail; i++) {
    out += '<div class="lunar-day is-empty" aria-hidden="true"></div>';
  }
  map.innerHTML = out;
};

// Ao voltar ao separador Astronomia ou ao foco da janela, sincronizar com o calendário actual
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && lunarDayKey() !== _lunarLastDayKey) {
    refreshLunarUI({ resetMonth: true });
  }
});


// ——— Export festivals as .ics ———
window.exportFestivalsICS = function () {
  const y = new Date().getFullYear();
  const names = ['Yule','Imbolc','Ostara','Beltane','Litha','Lughnasadh','Mabon','Samhain'];
  const dates = [];
  if (window.__druid?.solarEvent) {
    const se = window.__druid.solarEvent;
    dates.push([y, 11, 21, 'Yule'], [y, 1, 1, 'Imbolc'],
      ...[[0,'Ostara'],[1,'Litha'],[2,'Mabon'],[3,'Yule']].map(([k, n]) => {
        const d = se(y, k); return [d.getFullYear(), d.getMonth(), d.getDate(), n];
      }),
      [y, 4, 1, 'Beltane'], [y, 7, 1, 'Lughnasadh'], [y, 9, 31, 'Samhain']);
  }
  const uniq = {};
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Caminho Druidico//PT'];
  const add = (Y, M, D, title) => {
    const key = `${title}-${Y}`;
    if (uniq[key]) return;
    uniq[key] = 1;
    const ds = `${Y}${String(M + 1).padStart(2, '0')}${String(D).padStart(2, '0')}`;
    lines.push('BEGIN:VEVENT', `DTSTART;VALUE=DATE:${ds}`, `DTEND;VALUE=DATE:${ds}`, `SUMMARY:${title} — Roda do Ano`, 'END:VEVENT');
  };
  // Fixed + approximate
  [[0,1,'Imbolc'],[4,1,'Beltane'],[7,1,'Lughnasadh'],[9,31,'Samhain'],[11,21,'Yule']].forEach(([mo, da, n]) => add(y, mo, da, n));
  if (window.__druid?.solarEvent) {
    [[0,'Ostara'],[1,'Litha'],[2,'Mabon'],[3,'Yule']].forEach(([k, n]) => {
      const d = window.__druid.solarEvent(y, k);
      add(d.getFullYear(), d.getMonth(), d.getDate(), n);
    });
  }
  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Roda_do_Ano_${y}.ics`;
  a.click();
  showToast('Calendário .ics exportado!');
};

// ——— Statistics ———
window.showReadingStats = function () {
  const log = typeof getReadingLog === 'function' ? getReadingLog() : [];
  const byType = { ogham: 0, runes: 0, tarot: 0 };
  log.forEach(r => { if (byType[r.type] !== undefined) byType[r.type]++; });
  const s = typeof streak === 'function' ? streak() : 0;
  const msg = `Estatísticas\n\nSequência: ${s} dia(s)\nTiragens no histórico: ${log.length}\n· Runas: ${byType.runes}\n· Ogham: ${byType.ogham}\n· Tarot: ${byType.tarot}`;
  showToast(`Runas ${byType.runes} · Ogham ${byType.ogham} · Tarot ${byType.tarot} · Sequência ${s}d`);
  console.info(msg);
};

// ——— Profile (local) ———
window.saveProfile = function () {
  const name = $('profile-name')?.value?.trim() || '';
  const grove = $('profile-grove')?.value?.trim() || '';
  const grade = $('profile-grade')?.value || '';
  try { localStorage.setItem('druid_profile', JSON.stringify({ name, grove, grade })); } catch {}
  showToast('Perfil guardado localmente.');
};
function loadProfile() {
  try {
    const p = JSON.parse(localStorage.getItem('druid_profile') || '{}');
    if ($('profile-name')) $('profile-name').value = p.name || '';
    if ($('profile-grove')) $('profile-grove').value = p.grove || '';
    if ($('profile-grade')) $('profile-grade').value = p.grade || '';
  } catch {}
}

// ——— Journal PDF (via jsPDF if available) ———
window.exportJournalPDF = async function () {
  try {
    if (typeof loadLib === 'function') await loadLib('jspdf');
  } catch {}
  if (typeof window.jspdf === 'undefined') {
    // Fallback: download as text
    if (typeof exportJournalTXT === 'function') { exportJournalTXT(); return; }
    showToast('jsPDF indisponível — use exportar TXT.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Diário Druídico', 20, 20);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  const text = ($('journal-input')?.value || '') + '\n\n' + ($('bardic-input')?.value || '');
  const lines = doc.splitTextToSize(text, 170);
  let y = 30;
  lines.forEach(line => {
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(line, 20, y);
    y += 5;
  });
  doc.save(`Diario_Druidico_${todayKey()}.pdf`);
  showToast('Diário exportado em PDF!');
};

// ——— Enhance empty states after draws ———
function enhanceEmptyStates() {
  const E = window.ORACLE_EMPTY || {};
  [['rune-card', 'runes'], ['ogham-card', 'ogham']].forEach(([id, k]) => {
    const el = $(id);
    if (el && !el.querySelector('.oracle-empty, .oc-spread') && E[k]) el.innerHTML = E[k];
  });
  const tarot = $('tarot-card-container');
  if (tarot && !tarot.children.length) {
    tarot.innerHTML = E.tarot || '';
    tarot.classList.add('draw-area');
  }
}

// ——— Wrap draw functions for reveal animation ———
['drawRunes', 'drawOghamCard', 'drawTarotCard'].forEach(fn => {
  const orig = window[fn];
  if (typeof orig !== 'function') return;
  window[fn] = function (...args) {
    const r = orig.apply(this, args);
    requestAnimationFrame(() => {
      const sel = fn === 'drawRunes' ? '#rune-card' : fn === 'drawOghamCard' ? '#ogham-card' : '#tarot-card-container';
      const root = document.querySelector(sel);
      if (root) {
        root.classList.remove('reveal-in');
        void root.offsetWidth;
        root.classList.add('reveal-in');
        const grid = root.querySelector('.grid');
        if (grid) grid.classList.add('reveal-stagger');
      }
      if (navigator.vibrate) try { navigator.vibrate(10); } catch {}
    });
    return r;
  };
});

// ——— Auto daily oracle from cache ———
function restoreDailyOracle() {
  try {
    const cached = JSON.parse(localStorage.getItem('druid_daily_oracle') || 'null');
    if (cached && cached.day === todayKey() && cached.text) {
      lastDailyOracle = cached.text;
      const box = $('daily-oracle');
      if (box) box.innerHTML = `<div class="reveal-in"><p class="text-sm theme-title leading-relaxed">${esc(cached.text)}</p></div>`;
      $('daily-oracle-actions')?.classList.remove('hidden');
    }
  } catch {}
}

// ——— Inject profile + tools into About if present ———
function enhanceAbout() {
  const about = $('tab-about');
  if (!about || $('profile-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'profile-panel';
  panel.className = 'theme-card border rounded-2xl p-5 lg:p-8 space-y-4 mt-6';
  panel.innerHTML = `
    <h3 class="font-cinzel text-xl font-bold theme-title">Perfil local</h3>
    <p class="text-sm theme-muted">Dados guardados só neste dispositivo.</p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div><label class="text-xs theme-muted block mb-1" for="profile-name">Nome</label>
        <input id="profile-name" class="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm" placeholder="O seu nome"></div>
      <div><label class="text-xs theme-muted block mb-1" for="profile-grove">Grove / círculo</label>
        <input id="profile-grove" class="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm" placeholder="Opcional"></div>
      <div><label class="text-xs theme-muted block mb-1" for="profile-grade">Grau OBOD</label>
        <select id="profile-grade" class="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm">
          <option value="">—</option><option>Bardo</option><option>Ovate</option><option>Druida</option><option>Amigo da Ordem</option>
        </select></div>
    </div>
    <div class="flex flex-wrap gap-2">
      <button type="button" onclick="saveProfile()" class="bg-[var(--btn-primary)] text-[var(--on-primary)] font-semibold text-sm py-2 px-4 rounded-lg cursor-pointer">Guardar perfil</button>
      <button type="button" onclick="showReadingStats()" class="theme-inner border text-sm font-semibold py-2 px-4 rounded-lg cursor-pointer">Ver estatísticas</button>
      <button type="button" onclick="exportFestivalsICS()" class="theme-inner border text-sm font-semibold py-2 px-4 rounded-lg cursor-pointer">Exportar festivais (.ics)</button>
      <button type="button" onclick="exportJournalPDF()" class="theme-inner border text-sm font-semibold py-2 px-4 rounded-lg cursor-pointer">Diário em PDF</button>
    </div>`;
  about.appendChild(panel);
  loadProfile();
}


// O registo do service worker (modo offline) está em js/20-app-offline.js

// ——— Init ———
const _origRenderToday = typeof renderToday === 'function' ? renderToday : null;
if (_origRenderToday) {
  window.renderToday = function () {
    _origRenderToday();
    updateStreakBadge();
    renderFestivalChecklist();
  };
}

document.addEventListener('DOMContentLoaded', () => {
  try { setDailyPrompt(); } catch (e) {}
  try { updateStreakBadge(); } catch (e) {}
  try { renderFestivalChecklist(); } catch (e) {}
  try { restoreDailyOracle(); } catch (e) {}
  try { enhanceEmptyStates(); } catch (e) {}
  try { if (typeof refreshLunarUI === 'function') refreshLunarUI({ resetMonth: true }); else ensureLunarMap(); } catch (e) {}
  try { enhanceAbout(); } catch (e) {}
});
})();
