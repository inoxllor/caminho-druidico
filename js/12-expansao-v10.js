/* ============================================================
   v10 — 16 funcionalidades: biblioteca, bosque, intenção,
   conselho lunar, prep festival, PNG, tags/humor, sonhos,
   revisão mês, QR backup, stats, cartão partilha, grove,
   notificações, comparar tiragens
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const esc = window.esc || (s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  raw(k, v) { try { localStorage.setItem(k, v); } catch {} }
};

const LUNAR_COUNSEL = [
  { k: 'nova', t: 'Lua Nova', c: 'Momento de plantar intenções em silêncio. Escreva uma semente no diário e não a force a germinar ainda.' },
  { k: 'crescente', t: 'Lua Crescente', c: 'Bom dia para iniciar projetos e dar o primeiro passo visível. Ação ligeira e constante.' },
  { k: 'quarto_crescente', t: 'Quarto Crescente', c: 'Tempo de ajustar o rumo. Revê compromissos e corta o que drena energia.' },
  { k: 'gibosa_crescente', t: 'Gibosa Crescente', c: 'Aproxima-se a plenitude: refine, pratique e prepare o terreno para colher clareza.' },
  { k: 'cheia', t: 'Lua Cheia', c: 'Iluminação e culminação. Celebre, agradeça e liberta o que já não serve.' },
  { k: 'gibosa_minguante', t: 'Gibosa Minguante', c: 'Comece a recolher. Partilhe aprendizagens e desacelere o ritmo exterior.' },
  { k: 'quarto_minguante', t: 'Quarto Minguante', c: 'Liberte hábitos e perdoe. Bom para limpezas rituais e cortes conscientes.' },
  { k: 'minguante', t: 'Lua Minguante', c: 'Descanso e integração. Ouça mais do que fala; deixe a terra pousar.' }
];

function moonPhaseIndex(date = new Date()) {
  const st = LunarCalc.state(date);
  return { age: st.age, idx: st.idx, frac: st.frac };
}

function updateLunarCounsel() {
  const { idx } = moonPhaseIndex();
  const info = LUNAR_COUNSEL[idx] || LUNAR_COUNSEL[0];
  const el = $('lunar-counsel');
  const ph = $('lunar-counsel-phase');
  if (el) el.textContent = info.c;
  if (ph) ph.textContent = info.t;
}

// ——— 5. Intenção da semana ———
function weekKey() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return d.getFullYear() + '-W' + week;
}
window.saveWeekIntention = function () {
  const v = ($('week-intention-input')?.value || '').trim();
  LS.set('druid_week_intention', { week: weekKey(), text: v });
  renderWeekIntention();
  showToast(v ? 'Intenção da semana guardada.' : 'Intenção limpa.');
};
function renderWeekIntention() {
  const data = LS.get('druid_week_intention', {});
  const disp = $('week-intention-display');
  const input = $('week-intention-input');
  if (!disp) return;
  if (data.week === weekKey() && data.text) {
    disp.textContent = data.text;
    if (input && !input.value) input.value = data.text;
  } else {
    disp.textContent = 'Ainda não definiu uma intenção para esta semana.';
  }
}

// ——— 7. Preparação do festival (passos + oferendas) ———
const FEST_PREP = {
  Yule: { steps: ['Preparar o espaço com sempre-vivas', 'Acender a vela do retorno da luz', 'Escrever intenções para o ano'], offerings: 'Pinhas, canela, laranja, vinho quente simbólico' },
  Imbolc: { steps: ['Limpar e abençoar o altar', 'Acender vela a Brigid', 'Abençoar sementes ou projetos'], offerings: 'Leite, mel, pão, velas brancas' },
  Ostara: { steps: ['Observar o equilíbrio dia/noite', 'Plantar uma semente', 'Caminhar ao ar livre'], offerings: 'Flores, ovos, água da fonte, rebentos' },
  Beltane: { steps: ['Acender uma chama sagrada', 'Celebrar vitalidade', 'Criar algo novo'], offerings: 'Flores do campo, fita colorida, hidromel' },
  Litha: { steps: ['Saudar o sol no auge', 'Oferecer ervas colhidas', 'Meditar na plenitude'], offerings: 'Ervas solares, girassol, mel' },
  Lughnasadh: { steps: ['Agradecer a primeira colheita', 'Partilhar pão', 'Avaliar intenções de primavera'], offerings: 'Pão, cereais, cerveja artesanal, frutos' },
  Mabon: { steps: ['Inventário de gratidão', 'Equilibrar dar e receber', 'Preparar o recolher'], offerings: 'Maçãs, nozes, vinho, folhas de outono' },
  Samhain: { steps: ['Acender vela pelos antepassados', 'Altar de memória', 'Soltar o que termina'], offerings: 'Maçã, romã, incenso, silêncio' }
};

const _origFestCheck = typeof renderFestivalChecklist === 'function' ? renderFestivalChecklist : null;
window.renderFestivalChecklist = function () {
  if (_origFestCheck) _origFestCheck();
  try {
    const n = typeof nextFestival === 'function' ? nextFestival() : null;
    if (!n) return;
    const prep = FEST_PREP[n.name];
    const steps = $('fest-prep-steps');
    const off = $('fest-offerings');
    if (prep && steps) {
      steps.innerHTML = '<strong class="theme-title">Passos:</strong> ' + prep.steps.map((s, i) => `${i + 1}. ${esc(s)}`).join(' · ');
    }
    if (prep && off) off.innerHTML = '<strong class="theme-title">Oferendas sugeridas:</strong> ' + esc(prep.offerings);
  } catch (e) {}
};

// ——— 2. Biblioteca de símbolos ———
window.renderSymbolLibrary = function () {
  const box = $('library-results');
  if (!box) return;
  const q = ($('library-search')?.value || '').toLowerCase().trim();
  const filter = $('library-filter')?.value || 'all';
  const items = [];
  const runes = (typeof RUNES_DATA !== 'undefined' && RUNES_DATA) || window.RUNES_DATA || [];
  const ogham = (typeof OGHAM_DATA !== 'undefined' && OGHAM_DATA) || window.OGHAM_DATA || [];
  const tarot = (typeof NORDIC_TAROT_DECK !== 'undefined' && NORDIC_TAROT_DECK) || window.NORDIC_TAROT_DECK || [];
  if (filter === 'all' || filter === 'rune') {
    runes.forEach(r => items.push({ type: 'Runa', sym: r.symbol, name: r.name, text: r.meaning }));
  }
  if (filter === 'all' || filter === 'ogham') {
    ogham.forEach(o => items.push({ type: 'Ogham', sym: o.symbol, name: `${o.name} · ${o.tree || ''}`, text: o.meaning }));
  }
  if (filter === 'all' || filter === 'tarot') {
    tarot.forEach(c => items.push({ type: 'Tarot', sym: '✦', name: c.name, text: (c.artDesc ? c.artDesc + ' — ' : '') + (c.upright || c.title || '') + (c.reversed ? ' | Inv: ' + c.reversed : '') }));
  }
  const filtered = q ? items.filter(it => (it.name + it.text + it.type).toLowerCase().includes(q)) : items;
  box.innerHTML = filtered.slice(0, 60).map(it => `
    <article class="library-item">
      <div class="flex items-start gap-3">
        <span class="sym theme-glyph">${it.sym}</span>
        <div>
          <div class="text-[10px] uppercase tracking-wider theme-muted">${esc(it.type)}</div>
          <h4 class="font-cinzel font-bold theme-title text-sm">${esc(it.name)}</h4>
          <p class="text-xs theme-muted mt-1 leading-relaxed">${esc(it.text)}</p>
        </div>
      </div>
    </article>`).join('') || '<p class="text-sm theme-muted">Nenhum símbolo encontrado.</p>';
};

// ——— 3. Comparar tiragens ———
function getCompare() { return LS.get('druid_compare', []); }
function setCompare(a) { LS.set('druid_compare', a.slice(0, 3)); renderCompareSlots(); }
window.saveCompareSlot = function (type) {
  let text = '', title = type;
  if (type === 'runes' && typeof lastRuneReading !== 'undefined' && lastRuneReading?.length) {
    text = lastRuneReading.map(r => `${r.pos ? r.pos + ': ' : ''}${r.symbol} ${r.name}: ${r.meaning}`).join('\n');
    title = window.lastRuneSpreadInfo ? `Runas · ${window.lastRuneSpreadInfo.name}` : 'Runas';
  } else if (type === 'ogham' && typeof lastOghamReading !== 'undefined' && lastOghamReading?.length) {
    text = lastOghamReading.map(o => `${o.symbol} ${o.name}: ${o.meaning}`).join('\n');
    title = 'Ogham';
  } else if (type === 'tarot' && typeof lastTarotReading !== 'undefined' && lastTarotReading?.length) {
    text = lastTarotReading.map(t => `${t.pos || ''}: ${t.card?.name || ''}${t.isReversed ? ' (inv.)' : ''}`).join('\n');
    title = 'Tarot';
  } else {
    showToast('Faça primeiro uma tiragem desse tipo.');
    return;
  }
  const arr = getCompare();
  arr.unshift({ title, text, at: new Date().toLocaleString('pt-PT') });
  setCompare(arr);
  showToast('Tiragem guardada para comparação.');
};
window.clearCompareSlots = function () { setCompare([]); };
function renderCompareSlots() {
  const box = $('compare-slots');
  if (!box) return;
  const arr = getCompare();
  if (!arr.length) {
    box.innerHTML = '<div class="compare-slot theme-muted">Slot 1 vazio</div><div class="compare-slot theme-muted">Slot 2 vazio</div><div class="compare-slot theme-muted">Slot 3 vazio</div>';
    return;
  }
  box.innerHTML = [0, 1, 2].map(i => {
    const s = arr[i];
    if (!s) return '<div class="compare-slot theme-muted">Vazio</div>';
    return `<div class="compare-slot"><strong class="theme-accent">${esc(s.title)}</strong><div class="text-[10px] theme-muted mb-1">${esc(s.at)}</div><pre class="whitespace-pre-wrap font-sans text-xs theme-title m-0">${esc(s.text)}</pre></div>`;
  }).join('');
}

// ——— 4. Modo Bosque ———
window.enterBosqueMode = function () {
  const ov = $('bosque-overlay');
  if (!ov) return;
  ov.classList.add('active');
  ov.setAttribute('aria-hidden', 'false');
  document.body.classList.add('zen-active');
  drawBosqueOracle();
  try { if (typeof toggleAmbientSound === 'function') toggleAmbientSound('forest'); } catch {}
};
window.exitBosqueMode = function () {
  const ov = $('bosque-overlay');
  if (ov) { ov.classList.remove('active'); ov.setAttribute('aria-hidden', 'true'); }
  document.body.classList.remove('zen-active');
  try { if (typeof stopAmbientSound === 'function') stopAmbientSound(); } catch {}
};
window.drawBosqueOracle = function () {
  const runes = (typeof RUNES_DATA !== 'undefined' && RUNES_DATA) || window.RUNES_DATA || [];
  if (!runes.length) return;
  const r = runes[Math.floor(Math.random() * runes.length)];
  if ($('bosque-glyph')) $('bosque-glyph').textContent = r.symbol;
  if ($('bosque-title')) $('bosque-title').textContent = r.name;
  if ($('bosque-text')) $('bosque-text').textContent = r.meaning;
};

// ——— 8. Export lunar map PNG ———
window.exportLunarMapPNG = function () {
  const map = $('lunar-month-map');
  const title = $('lunar-map-title')?.textContent || 'Mapa lunar';
  if (!map) return;
  const cells = [...map.querySelectorAll('.lunar-day')];
  const cols = 7, rows = Math.ceil(cells.length / 7);
  const cw = 44, ch = 48, pad = 24, head = 36;
  const canvas = document.createElement('canvas');
  canvas.width = pad * 2 + cols * cw;
  canvas.height = pad * 2 + head + rows * ch + 20;
  const ctx = canvas.getContext('2d');
  const bg = getComputedStyle(document.body).getPropertyValue('--bg-card').trim() || '#121a2c';
  const fg = getComputedStyle(document.body).getPropertyValue('--text-title').trim() || '#f1f5f9';
  const muted = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#8b9bb4';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fg;
  ctx.font = 'bold 16px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, pad + 16);
  const wd = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  ctx.font = '11px sans-serif';
  ctx.fillStyle = muted;
  wd.forEach((w, i) => ctx.fillText(w, pad + i * cw + cw / 2, pad + head - 6));
  cells.forEach((cell, i) => {
    const x = pad + (i % 7) * cw, y = pad + head + Math.floor(i / 7) * ch;
    if (cell.classList.contains('is-empty')) return;
    const phase = cell.querySelector('.ld-phase')?.textContent || '';
    const num = cell.querySelector('.ld-num')?.textContent || '';
    ctx.fillStyle = fg;
    ctx.font = '16px sans-serif';
    ctx.fillText(phase, x + cw / 2, y + 20);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = muted;
    ctx.fillText(num, x + cw / 2, y + 34);
  });
  canvas.toBlob(blob => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mapa-lunar-${title.replace(/\s+/g, '_')}.png`;
    a.click();
    showToast('Mapa lunar exportado em PNG.');
  });
};

// ——— 9. Tags + humor ———
window.appendJournalEntryMeta = function () {
  const mood = $('journal-mood')?.value || '';
  const tags = ($('journal-tags')?.value || '').trim();
  const area = $('journal-input');
  if (!area) return;
  const stamp = new Date().toLocaleString('pt-PT');
  const moodLabel = mood ? ` Humor:${mood}/5` : '';
  const tagLabel = tags ? ` ${tags}` : '';
  const block = `\n\n--- [${stamp}]${moodLabel}${tagLabel} ---\n`;
  area.value = (area.value + block).trimStart();
  if (typeof autoSaveJournal === 'function') autoSaveJournal();
  area.focus();
  showToast('Cabeçalho de entrada inserido.');
};

// ——— 11. Caderno de sonhos ———
function loadDreams() {
  const list = $('dreams-list');
  if (!list) return;
  const dreams = LS.get('druid_dreams', []);
  list.innerHTML = dreams.slice(0, 20).map(d => `<div class="border-b border-[var(--border-color)] py-1"><span class="theme-accent text-xs">${esc(d.at)}</span> — ${esc(d.text.slice(0, 120))}${d.text.length > 120 ? '…' : ''}</div>`).join('') || '<span class="text-xs">Ainda sem sonhos registados.</span>';
}
window.saveDreamEntry = function () {
  const area = $('dreams-input');
  if (!area || !area.value.trim()) { showToast('Escreva o sonho primeiro.'); return; }
  const dreams = LS.get('druid_dreams', []);
  dreams.unshift({ at: new Date().toLocaleString('pt-PT'), text: area.value.trim() });
  LS.set('druid_dreams', dreams.slice(0, 100));
  area.value = '';
  loadDreams();
  showToast('Sonho guardado.');
};

// ——— 10 + 14. Revisão do mês + stats visuais ———
window.renderMonthReview = function () {
  const log = typeof getReadingLog === 'function' ? getReadingLog() : [];
  const now = new Date();
  const ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const monthLogs = log.filter(r => { const ts = r.t || r.ts; if (ts) { const d = new Date(ts); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth(); } return (r.date || r.at || '').startsWith(ym); });
  const byType = { runes: 0, ogham: 0, tarot: 0 };
  monthLogs.forEach(r => { if (byType[r.type] != null) byType[r.type]++; });
  const total = monthLogs.length || 1;
  const streakN = typeof streak === 'function' ? streak() : 0;
  const dreams = LS.get('druid_dreams', []).filter(d => {
    try { const p = d.at.split(','); return p[0] && p[0].includes(String(now.getFullYear())); } catch { return false; }
  }).length;
  const bars = $('month-stats-bars');
  if (bars) {
    const row = (label, n, max) => {
      const pct = Math.min(100, Math.round((n / max) * 100) || 0);
      return `<div><div class="flex justify-between text-xs mb-0.5"><span class="theme-muted">${label}</span><span class="theme-title">${n}</span></div><div class="stat-bar"><i style="width:${pct}%"></i></div></div>`;
    };
    const max = Math.max(byType.runes, byType.ogham, byType.tarot, 1);
    bars.innerHTML = row('Runas', byType.runes, max) + row('Ogham', byType.ogham, max) + row('Tarot', byType.tarot, max) + row('Sequência (dias)', streakN, Math.max(streakN, 7));
  }
  const txt = $('month-review-text');
  if (txt) {
    txt.textContent = `Este mês: ${monthLogs.length} tiragens registadas · ${dreams} sonhos no caderno · sequência atual ${streakN} dia(s).`;
  }
  const hint = $('tm-hint-stats');
  if (hint) hint.textContent = monthLogs.length ? `${monthLogs.length} ${monthLogs.length === 1 ? 'tiragem' : 'tiragens'} este mês` : 'Ainda sem tiragens';
  if (!monthLogs.length && bars) {
    bars.innerHTML = `<div class="empty-invite"><p>Ainda não há tiragens este mês. Cada tiragem que fizer aparece aqui.</p>
      <div class="flex flex-wrap gap-2 justify-center"><button type="button" class="btn-sec theme-accent" onclick="switchTab('oracle')">Tirar Ogham</button><button type="button" class="btn-sec theme-accent" onclick="switchTab('tarot')">Tirar Tarot</button></div></div>`;
    if (txt) txt.textContent = '';
  }
};

// ——— 12. Backup QR (texto em QR via API externa de imagem ou fallback) ———
window.showBackupQR = function () {
  const payload = {
    journal: $('journal-input')?.value || '',
    bardic: $('bardic-input')?.value || '',
    dreams: LS.get('druid_dreams', []),
    intention: LS.get('druid_week_intention', {}),
    theme: localStorage.getItem('druid_theme') || 'theme-night',
    v: 10
  };
  const json = JSON.stringify(payload);
  // Compact: download always + optional QR of short note
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `druid-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  // QR for a hash/code only (full JSON too large for QR) — show instructions
  const code = btoa(unescape(encodeURIComponent(json.slice(0, 80)))).slice(0, 12);
  showToast('Backup JSON descarregado. Código de referência: ' + code);
  // Draw simple QR-like pattern is heavy; use Google chart API if online
  try {
    const url = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent('DRUID-BACKUP-REF:' + code);
    window.open(url, '_blank');
  } catch {}
};

// ——— 15. Cartão PNG de partilha ———
window.exportShareCard = function (source) {
  let title = 'Caminho Druídico';
  let body = '';
  let glyph = '✧';
  if (source === 'last' || source === 'runes') {
    if (typeof lastRuneReading !== 'undefined' && lastRuneReading?.length) {
      glyph = lastRuneReading[0].symbol;
      title = lastRuneReading.map(r => r.name).join(' · ');
      body = lastRuneReading.map(r => (r.pos ? r.pos + ': ' : '') + r.meaning).join('\n');
    }
  }
  if (!body && typeof lastOghamReading !== 'undefined' && lastOghamReading?.length) {
    glyph = lastOghamReading[0].symbol;
    title = lastOghamReading.map(o => o.name).join(' · ');
    body = lastOghamReading.map(o => o.meaning).join('\n');
  }
  if (!body && typeof lastTarotReading !== 'undefined' && lastTarotReading?.length) {
    glyph = '✦';
    title = lastTarotReading.map(t => t.card?.name || '').join(' · ');
    body = lastTarotReading.map(t => (t.isReversed ? t.card?.reversed : t.card?.upright) || '').join('\n');
  }
  if (!body && lastDailyOracle) {
    body = lastDailyOracle;
    title = 'Oráculo do dia';
  }
  if (!body) { showToast('Sem tiragem ativa para o cartão.'); return; }
  const canvas = $('share-card-canvas') || document.createElement('canvas');
  canvas.width = 720; canvas.height = 900;
  const ctx = canvas.getContext('2d');
  const bg = getComputedStyle(document.body).getPropertyValue('--bg-body').trim() || '#080c14';
  const card = getComputedStyle(document.body).getPropertyValue('--bg-card').trim() || '#121a2c';
  const accent = getComputedStyle(document.body).getPropertyValue('--text-accent').trim() || '#a5b4fc';
  const titleC = getComputedStyle(document.body).getPropertyValue('--text-title').trim() || '#f1f5f9';
  const muted = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#8b9bb4';
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 720, 900);
  roundRect(ctx, 40, 40, 640, 820, 24, card);
  ctx.fillStyle = accent; ctx.font = '64px serif'; ctx.textAlign = 'center';
  ctx.fillText(glyph, 360, 180);
  ctx.fillStyle = titleC; ctx.font = 'bold 28px Cinzel, serif';
  wrapText(ctx, title, 360, 240, 560, 34);
  ctx.fillStyle = muted; ctx.font = '18px Inter, sans-serif';
  wrapText(ctx, body.slice(0, 420), 360, 340, 560, 28);
  ctx.fillStyle = accent; ctx.font = '14px Inter, sans-serif';
  ctx.fillText('Caminho Druídico', 360, 820);
  canvas.toBlob(blob => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tiragem-druidica.png';
    a.click();
    showToast('Cartão PNG gerado.');
  });
};
function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
}
function wrapText(ctx, text, x, y, maxW, lineH) {
  const words = String(text).split(/\s+/);
  let line = '', yy = y;
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW) { ctx.fillText(line, x, yy); line = w; yy += lineH; }
    else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
}

// Improve shareReading to offer PNG
const _share = window.shareReading;
window.shareReading = async function (type) {
  if (_share) await _share(type);
  // also offer card
  try { if (type !== 'daily') exportShareCard(type); } catch {}
};

// ——— 16. Grove local ———
window.generateGrovePack = function () {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const pack = {
    code,
    created: new Date().toISOString(),
    intention: LS.get('druid_week_intention', {}),
    triads: (typeof TRIADS_DATA !== 'undefined' ? [] : []),
    note: ($('journal-input')?.value || '').slice(0, 2000),
    festival: typeof nextFestival === 'function' ? nextFestival() : null
  };
  LS.set('druid_grove_last', pack);
  const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `grove-${code}.json`;
  a.click();
  if ($('grove-code')) $('grove-code').textContent = code;
  $('grove-code-box')?.classList.remove('hidden');
  showToast('Pacote Grove ' + code + ' gerado.');
};
window.importGrovePack = function (ev) {
  const file = ev.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const pack = JSON.parse(reader.result);
      LS.set('druid_grove_imported', pack);
      if (pack.intention?.text) {
        LS.set('druid_week_intention', pack.intention);
        renderWeekIntention();
      }
      if (pack.note && $('journal-input')) {
        $('journal-input').value += `\n\n--- Grove ${pack.code || ''} ---\n${pack.note}\n`;
        if (typeof autoSaveJournal === 'function') autoSaveJournal();
      }
      showToast('Pacote Grove importado' + (pack.code ? ': ' + pack.code : ''));
    } catch { showToast('Ficheiro Grove inválido.'); }
  };
  reader.readAsText(file);
};

// ——— 1. Notificações de prática ———
window.disablePracticeReminder = function () {
  try { localStorage.setItem('druid_reminder', JSON.stringify({ on: false })); } catch {}
  showToast('Lembrete desativado.');
};
window.schedulePracticeReminder = function (hour = 9, minute = 0) {
  LS.set('druid_reminder', { hour, minute, on: true });
  requestReminderPermission();
  showToast(`Lembrete local às ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}.`);
};
function requestReminderPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') Notification.requestPermission();
}
function checkReminder() {
  const cfg = LS.get('druid_reminder', null);
  if (!cfg || !cfg.on || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  const now = new Date();
  const key = 'druid_reminder_sent_' + now.toLocaleDateString('sv');
  if (localStorage.getItem(key)) return;
  if (now.getHours() === cfg.hour && now.getMinutes() === cfg.minute) {
    try {
      new Notification('Caminho Druídico', { body: 'Hora da prática: oráculo, altar ou diário.', icon: undefined });
      localStorage.setItem(key, '1');
    } catch {}
  }
}

// Hook renderToday
const _rt = window.renderToday;
if (typeof _rt === 'function') {
  window.renderToday = function () {
    _rt();
    try { updateLunarCounsel(); } catch {}
    try { renderWeekIntention(); } catch {}
    try { renderMonthReview(); } catch {}
    try { if (typeof renderFestivalChecklist === 'function') renderFestivalChecklist(); } catch {}
  };
}

// Hook switchTab for library
const _st = window.switchTab;
window.switchTab = function (tabId) {
  _st(tabId);
  if (tabId === 'library') { renderSymbolLibrary(); renderCompareSlots(); }
  if (tabId === 'journal') loadDreams();
  if (tabId === 'today') {
    try { updateLunarCounsel(); renderWeekIntention(); renderMonthReview(); } catch {}
  }
};

document.addEventListener('DOMContentLoaded', () => {
  try { updateLunarCounsel(); } catch {}
  try { renderWeekIntention(); } catch {}
  try { loadDreams(); } catch {}
  try { renderCompareSlots(); } catch {}
  try { renderMonthReview(); } catch {}
  // default reminder 9:00 if none
  if (!LS.get('druid_reminder', null)) LS.set('druid_reminder', { hour: 9, minute: 0, on: false });
  setInterval(checkReminder, 30000);
  // settings button in about profile if exists
  const about = $('profile-panel');
  if (about && !$('reminder-settings')) {
    const div = document.createElement('div');
    div.id = 'reminder-settings';
    div.className = 'pt-4 border-t border-[var(--border-color)] space-y-2';
    div.innerHTML = `<h4 class="font-cinzel text-sm font-bold theme-title">Lembrete de prática</h4>
      <div class="reminder-row">
        <input id="reminder-hour" type="number" min="0" max="23" value="9" class="w-16 theme-inner border rounded-lg px-2 py-1 text-sm">
        <span class="theme-muted">:</span>
        <input id="reminder-minute" type="number" min="0" max="59" value="0" class="w-16 theme-inner border rounded-lg px-2 py-1 text-sm">
        <button type="button" onclick="schedulePracticeReminder(+document.getElementById('reminder-hour').value,+document.getElementById('reminder-minute').value)" class="theme-inner border text-sm font-semibold px-3 py-1.5 rounded-lg cursor-pointer">Ativar</button>
        <button type="button" onclick="disablePracticeReminder()" class="text-sm theme-muted underline cursor-pointer">Desativar</button>
      </div>
      <p class="text-xs theme-muted">Requer permissão de notificações do browser. Funciona com a app aberta ou em segundo plano limitado.</p>`;
    about.appendChild(div);
  }
});
})();
