/* ============================================================
   Sugestões dos utilizadores (v16):
   • Diário cifrado com o PIN (AES-GCM 256, chave PBKDF2) e aviso
     de cópia de segurança.
   • Título da página por secção e opção «Texto maior».
   • Primeiros passos no Hoje e ajuda dos botões do topo.
   • Lembretes das festas e das Luas Cheias (notificação e .ics).
   • Registo do ritual de cada festa e «o meu ano na Roda».
   • Ervas: favoritas, época de colheita e parte usada.
   • Aviso quando não há rede.
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ls = {
  get: (k, d = null) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* nada */ } },
  del: k => { try { localStorage.removeItem(k); } catch { /* nada */ } },
  json: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  setJson: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* nada */ } }
};
const toast = m => (typeof showToast === 'function' ? showToast(m) : null);
const ico = i => `<svg class="ic" aria-hidden="true"><use href="#i-${i}"></use></svg>`;
const MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/* ============================================================
   1) Diário cifrado com o PIN
   ============================================================ */
const ENC = 'druid_journal_enc', PEND = 'druid_journal_pending', LEGACY_PIN = 'druid_journal_pin';
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const hasCrypto = () => !!(window.crypto && crypto.subtle && window.isSecureContext !== false);
let key = null, salt = null, saving = Promise.resolve();
const encOn = () => !!ls.get(ENC);
const locked = () => (encOn() || !!ls.get(LEGACY_PIN)) && !key;

async function derive(pin, s) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: s, iterations: 310000, hash: 'SHA-256' }, base,
    { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function decryptWith(pin) {
  const box = JSON.parse(ls.get(ENC));
  const s = unb64(box.salt);
  const k = await derive(pin, s);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(box.iv) }, k, unb64(box.ct));
  return { k, s, data: JSON.parse(new TextDecoder().decode(plain)) };
}
function texts() {
  return { journal: ($('journal-input') || {}).value || '', bardic: ($('bardic-input') || {}).value || '' };
}
function encryptSave() {
  if (!key) return Promise.resolve();
  const k = key, s = salt, payload = JSON.stringify(texts());
  saving = saving.then(async () => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(payload));
    ls.set(ENC, JSON.stringify({ v: 1, alg: 'AES-GCM-256/PBKDF2-SHA256-310000', salt: b64(s), iv: b64(iv), ct: b64(ct) }));
    ['druid_journal', 'druid_bardic', LEGACY_PIN].forEach(ls.del);
  }).catch(e => console.warn('cifra do diário', e));
  return saving;
}
function stamp(msg) {
  const st = $('save-status');
  if (st) st.textContent = msg || `Guardado e cifrado às ${new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
}

const baseAutoJournal = window.autoSaveJournal, baseAutoBardic = window.autoSaveBardic;
window.autoSaveJournal = function () {
  if (!encOn()) return baseAutoJournal.apply(this, arguments);
  ls.del('druid_journal');
  if (key) { encryptSave(); stamp(); }
  else {
    // Diário fechado: o texto novo fica à espera e é cifrado ao desbloquear.
    ls.set(PEND, ($('journal-input') || {}).value || '');
    stamp('Guardado. Será cifrado quando desbloquear o diário.');
  }
  if (typeof updateWordCount === 'function') try { updateWordCount(); } catch { /* nada */ }
};
window.autoSaveBardic = function () {
  const r = baseAutoBardic.apply(this, arguments);
  if (encOn()) { ls.del('druid_bardic'); if (key) { encryptSave(); stamp(); } }
  return r;
};

window.checkJournalPinLock = function () {
  const lockScreen = $('journal-lock-screen'), area = $('journal-unlocked-area');
  if (!lockScreen || !area) return;
  const l = locked();
  lockScreen.classList.toggle('hidden', !l);
  area.classList.toggle('hidden', l);
  if (!l) renderBackupNotice();
};
window.unlockJournalWithPin = async function () {
  const inp = $('journal-pin-unlock-input'), err = $('pin-error-msg');
  const pin = inp ? inp.value : '';
  const fail = () => { if (err) err.classList.remove('hidden'); toast('PIN incorreto.'); };
  if (!pin) return fail();
  if (!hasCrypto()) { toast('Este navegador não permite cifrar. Abra o site em https.'); return; }
  try {
    if (encOn()) {
      const r = await decryptWith(pin);
      key = r.k; salt = r.s;
      const pend = ls.get(PEND, '');
      $('journal-input').value = (r.data.journal || '') + (pend ? (r.data.journal ? '\n' : '') + pend : '');
      $('bardic-input').value = r.data.bardic || '';
      ls.del(PEND);
      if (pend) await encryptSave();
      if (typeof autoSaveBardic === 'function') { try { baseAutoBardic(); ls.del('druid_bardic'); } catch { /* nada */ } }
    } else if (ls.get(LEGACY_PIN)) {
      if (pin !== ls.get(LEGACY_PIN)) return fail();
      // Migração: o PIN antigo só escondia o texto. Agora passa a cifrá-lo.
      salt = crypto.getRandomValues(new Uint8Array(16));
      key = await derive(pin, salt);
      await encryptSave();
      toast('O diário passou a estar cifrado com o seu PIN.');
    } else return;
    if (inp) inp.value = '';
    if (err) err.classList.add('hidden');
    stamp();
    window.checkJournalPinLock();
    toast('Santuário desbloqueado.');
  } catch (e) {
    fail();
  }
};
window.saveNewJournalPin = async function () {
  const inp = $('new-pin-input');
  const pin = inp ? inp.value.trim() : '';
  if (pin.length < 4) { toast('Use pelo menos 4 caracteres.'); return; }
  if (!hasCrypto()) { toast('Este navegador não permite cifrar. Abra o site em https.'); return; }
  if (locked()) { toast('Desbloqueie o diário antes de mudar o PIN.'); return; }
  salt = crypto.getRandomValues(new Uint8Array(16));
  key = await derive(pin, salt);
  await encryptSave();
  if (inp) inp.value = '';
  const box = $('pin-settings-box'); if (box) box.classList.add('hidden');
  stamp();
  toast('Diário cifrado com o PIN. Guarde-o bem: sem ele o texto não se recupera.');
};
window.removeJournalPin = async function () {
  if (locked()) { toast('Desbloqueie o diário antes de remover o PIN.'); return; }
  const t = texts();
  ls.set('druid_journal', t.journal); ls.set('druid_bardic', t.bardic);
  [ENC, PEND, LEGACY_PIN].forEach(ls.del);
  key = null; salt = null;
  const box = $('pin-settings-box'); if (box) box.classList.add('hidden');
  toast('PIN removido: o diário deixou de estar cifrado.');
};
window.lockJournalNow = function () {
  if (!encOn()) return;
  key = null; salt = null;
  $('journal-input').value = ''; $('bardic-input').value = '';
  window.checkJournalPinLock();
};

/* ——— Cópias de segurança ——— */
const baseExport = window.exportBackupJSON, baseImport = window.importBackupJSON;
window.exportBackupJSON = function () {
  if (encOn()) {
    if (!key) { toast('Desbloqueie o diário para incluir os seus escritos na cópia.'); return; }
    const t = texts();
    const data = { ...t, theme: ls.get('druid_theme', 'theme-night'), readings: ls.json('druid_readings', []), festLog: ls.json('druid_fest_log', []), herbFavs: ls.json('druid_herb_favs', []), exportedAt: new Date().toISOString() };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = `Backup_Caminho_Druidico_${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1e4);
    toast('Cópia de segurança exportada. Atenção: o ficheiro não vai cifrado.');
  } else baseExport.apply(this, arguments);
  ls.set('druid_last_backup', String(Date.now()));
  renderBackupNotice();
};
window.importBackupJSON = function (ev) {
  if (locked()) { toast('Desbloqueie o diário antes de restaurar uma cópia.'); if (ev && ev.target) ev.target.value = ''; return; }
  const r = baseImport.apply(this, arguments);
  const file = ev && ev.target && ev.target.files && ev.target.files[0];
  if (file) file.text().then(txt => {
    try {
      const d = JSON.parse(txt);
      if (Array.isArray(d.festLog)) ls.setJson('druid_fest_log', d.festLog);
      if (Array.isArray(d.herbFavs)) ls.setJson('druid_herb_favs', d.herbFavs);
    } catch { /* nada */ }
    setTimeout(() => { if (encOn() && key) encryptSave(); }, 50);
  });
  return r;
};
function renderBackupNotice() {
  const area = $('journal-unlocked-area');
  if (!area) return;
  let n = $('backup-notice');
  const len = texts().journal.length + texts().bardic.length;
  const last = +ls.get('druid_last_backup', 0), snooze = +ls.get('druid_backup_snooze', 0);
  const days = last ? Math.floor((Date.now() - last) / 864e5) : null;
  const show = len > 200 && (days === null || days >= 30) && Date.now() > snooze;
  if (!show) { if (n) n.remove(); return; }
  if (!n) {
    n = document.createElement('div');
    n.id = 'backup-notice';
    n.className = 'backup-notice';
    n.setAttribute('role', 'status');
    area.prepend(n);
  }
  n.innerHTML = `<span class="bn-ic" aria-hidden="true">${ico('download')}</span>
    <p><b>${days === null ? 'Ainda não fez nenhuma cópia de segurança.' : `A última cópia de segurança foi há ${days} dias.`}</b>
    Os seus escritos só existem neste dispositivo${encOn() ? ' e, se esquecer o PIN, não se recuperam' : ''}.</p>
    <div class="bn-actions"><button type="button" class="btn-sec theme-accent" onclick="exportBackupJSON()">Fazer cópia agora</button>
    <button type="button" class="btn-link" onclick="snoozeBackup()">Lembrar daqui a uma semana</button></div>`;
}
window.snoozeBackup = () => { ls.set('druid_backup_snooze', String(Date.now() + 7 * 864e5)); renderBackupNotice(); };

/* ============================================================
   2) Título por secção e «Texto maior»
   ============================================================ */
const TAB_NAMES = { today: 'Hoje', treewheel: 'Roda das árvores', runelore: 'Runas: guia & treino', herbal: 'Árvores & ervas' };
function tabName(id) {
  if (TAB_NAMES[id]) return TAB_NAMES[id];
  if (String(id).startsWith('portal-')) { const p = ((window.DruidRealms || {}).PORTALS || {})[id.slice(7)]; if (p) return p.label; }
  const b = $('desk-nav-' + id);
  return b ? b.textContent.trim() : '';
}
function setTitle(id) {
  const n = tabName(id);
  document.title = n && id !== 'today' ? `${n} · Caminho Druídico` : 'Caminho Druídico';
}

const SIZES = [['md', 'Normal'], ['lg', 'Maior'], ['xl', 'Muito maior']];
function applySize(z) {
  const h = document.documentElement;
  h.classList.remove('ts-lg', 'ts-xl');
  if (z === 'lg' || z === 'xl') h.classList.add('ts-' + z);
  ls.set('druid_text_size', z);
  document.querySelectorAll('.ts-pick button').forEach(b => b.setAttribute('aria-pressed', b.dataset.size === z));
}
window.setTextSize = applySize;
function addSizeControls() {
  const cur = ls.get('druid_text_size', 'md');
  const make = id => {
    const w = document.createElement('div');
    w.className = 'ts-wrap';
    w.innerHTML = `<p class="${id === 'mob' ? 'nav-group' : 'ts-label'}" id="ts-label-${id}">Tamanho do texto</p>
      <div class="ts-pick" role="group" aria-labelledby="ts-label-${id}">${SIZES.map(([z, l], i) => `<button type="button" data-size="${z}" aria-pressed="${z === cur}" onclick="setTextSize('${z}')"><span style="font-size:${[13, 15.5, 18][i]}px" aria-hidden="true">A</span><span class="sr-only">${l}</span><span class="ts-name">${l}</span></button>`).join('')}</div>`;
    return w;
  };
  const desk = $('theme-selector-desktop'), mob = $('theme-selector-mobile');
  if (desk && !$('ts-label-desk')) desk.after(make('desk'));
  if (mob && !$('ts-label-mob')) mob.after(make('mob'));
}

/* ============================================================
   3) Primeiros passos e ajuda dos botões do topo
   ============================================================ */
const FS = [
  ['ogham', 'Tirar uma letra Ogham', 'O conselho das árvores para hoje.', "drawDailyOracle('ogham')"],
  ['tree', 'Ver a lua arbórea', 'Em que árvore do calendário celta estamos.', "switchTab('treewheel')"],
  ['journal', 'Escrever no diário', 'Uma linha basta: o que sentiu hoje?', "switchTab('journal')"]
];
const fsDone = () => ls.json('druid_first_steps', {});
function markStep(k) {
  const d = fsDone();
  if (d[k]) return;
  d[k] = Date.now(); ls.setJson('druid_first_steps', d);
  renderFirstSteps();
}
function renderFirstSteps() {
  const host = $('today-feature');
  if (!host) return;
  let box = $('first-steps');
  const d = fsDone();
  const all = FS.every(([k]) => d[k]);
  const veteran = ls.json('druid_readings', []).length >= 5 && !!(ls.get('druid_journal') || ls.get(ENC));
  if (ls.get('druid_fs_hidden') || all || veteran) { if (box) box.remove(); return; }
  if (!box) {
    box = document.createElement('section');
    box.id = 'first-steps';
    box.className = 'first-steps theme-card border';
    box.setAttribute('aria-labelledby', 'fs-title');
    host.after(box);
  }
  const n = FS.filter(([k]) => d[k]).length;
  box.innerHTML = `
    <div class="fs-head">
      <div><p class="eyebrow">Primeiros passos · ${n} de 3</p><h3 id="fs-title" class="font-cinzel">Comece por aqui</h3></div>
      <button type="button" class="icon-btn" onclick="hideFirstSteps()" aria-label="Esconder os primeiros passos">${ico('close')}</button>
    </div>
    <ol class="fs-list">${FS.map(([k, t, s, act], i) => `
      <li class="${d[k] ? 'is-done' : ''}">
        <button type="button" onclick="${act}">
          <span class="fs-n" aria-hidden="true">${d[k] ? '✓' : i + 1}</span>
          <span class="fs-t"><b>${t}</b><span>${s}</span></span>
          <span class="sr-only">${d[k] ? '(feito)' : ''}</span>
        </button>
      </li>`).join('')}</ol>
`;
}
window.hideFirstSteps = () => { ls.set('druid_fs_hidden', '1'); renderFirstSteps(); };

/* ============================================================
   4) Lembretes das festas e das Luas Cheias
   ============================================================ */
const FEST_NAMES = { 1: 'Yule', 2: 'Imbolc', 3: 'Ostara', 4: 'Beltane', 5: 'Litha', 6: 'Lughnasadh', 7: 'Mabon', 8: 'Samhain' };
const FEST_ID = Object.fromEntries(Object.entries(FEST_NAMES).map(([k, v]) => [v, +k]));
function festivalsOf(y) {
  const se = (window.__druid || {}).solarEvent;
  const l = [['Imbolc', new Date(y, 1, 1)], ['Beltane', new Date(y, 4, 1)], ['Lughnasadh', new Date(y, 7, 1)], ['Samhain', new Date(y, 9, 31)]];
  if (se) l.push(['Ostara', se(y, 0)], ['Litha', se(y, 1)], ['Mabon', se(y, 2)], ['Yule', se(y, 3)]);
  return l.map(([n, d]) => ({ name: n, id: FEST_ID[n], date: d })).sort((a, b) => a.date - b.date);
}
function upcomingEvents(days = 370) {
  const now = new Date(), t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()), end = new Date(t0.getTime() + days * 864e5);
  const cfg = ls.json('druid_cycle_rem', { fest: true, full: true });
  const out = [];
  if (cfg.fest) [now.getFullYear(), now.getFullYear() + 1].forEach(y => festivalsOf(y).forEach(f => {
    const d = new Date(f.date.getFullYear(), f.date.getMonth(), f.date.getDate());
    if (d >= t0 && d < end) out.push({ kind: 'fest', title: f.name, day: d, uid: `fest-${f.name}-${y}` });
  }));
  if (cfg.full && window.LunarCalc) LunarCalc.events(t0.getTime(), end.getTime()).filter(e => e.type === 2).forEach(e => {
    const d = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate());
    out.push({ kind: 'full', title: 'Lua Cheia', day: d, time: e.date, uid: `full-${d.toISOString().slice(0, 10)}` });
  });
  return out.sort((a, b) => a.day - b.day);
}
function checkCycleReminders() {
  const cfg = ls.json('druid_cycle_rem', { fest: true, full: true, on: false });
  if (!cfg.on) return;
  const sent = ls.json('druid_cycle_sent', {});
  const t0 = new Date(); t0.setHours(0, 0, 0, 0);
  upcomingEvents(2).forEach(ev => {
    const when = Math.round((ev.day - t0) / 864e5);
    const k = ev.uid + '-' + when;
    if (sent[k]) return;
    const body = ev.kind === 'fest'
      ? (when === 0 ? `Hoje é ${ev.title}. Bom ritual!` : `Amanhã é ${ev.title}. Prepare o altar.`)
      : (when === 0 ? 'Hoje é Lua Cheia.' : 'Amanhã é Lua Cheia.') + (ev.time ? ` Pico às ${ev.time.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}.` : '');
    sent[k] = Date.now();
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification('Caminho Druídico', { body, tag: k }); } catch { toast(body); }
    } else toast(body);
  });
  ls.setJson('druid_cycle_sent', sent);
}
const icsDate = d => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
window.exportCycleICS = function () {
  const evs = upcomingEvents(370);
  if (!evs.length) { toast('Escolha pelo menos festas ou Luas Cheias.'); return; }
  const stampNow = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Caminho Druidico//Ciclos//PT', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Caminho Druídico · Ciclos'];
  evs.forEach(ev => {
    const next = new Date(ev.day.getTime() + 864e5);
    lines.push('BEGIN:VEVENT', `UID:${ev.uid}@caminho-druidico`, `DTSTAMP:${stampNow}`, `DTSTART;VALUE=DATE:${icsDate(ev.day)}`, `DTEND;VALUE=DATE:${icsDate(next)}`,
      `SUMMARY:${ev.kind === 'fest' ? '☀ ' + ev.title : '◯ Lua Cheia'}`,
      `DESCRIPTION:${ev.kind === 'fest' ? 'Festa da Roda do Ano.' : 'Lua Cheia' + (ev.time ? ' (pico às ' + ev.time.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) + ')' : '') + '.'}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${ev.title} amanhã`, 'TRIGGER:-PT15H', 'END:VALARM', 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }));
  a.download = 'caminho-druidico-ciclos.ics';
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1e4);
  toast('Calendário descarregado: abra-o para juntar os avisos ao seu calendário.');
};
window.setCycleReminder = async function (field, val) {
  const cfg = ls.json('druid_cycle_rem', { fest: true, full: true, on: false });
  cfg[field] = val;
  if (field === 'on' && val && 'Notification' in window && Notification.permission === 'default') {
    try { await Notification.requestPermission(); } catch { /* nada */ }
  }
  ls.setJson('druid_cycle_rem', cfg);
  renderCycleCard();
  if (field === 'on' && val) { toast('Avisos ativos: na véspera e no dia, sempre que abrir a app.'); checkCycleReminders(); }
};
function renderCycleCard() {
  const sec = $('tab-wheel');
  if (!sec) return;
  let box = $('cycle-reminders');
  if (!box) { box = document.createElement('div'); box.id = 'cycle-reminders'; box.className = 'theme-card border rounded-2xl p-5 lg:p-8 space-y-4 max-w-4xl mx-auto'; sec.appendChild(box); }
  const cfg = ls.json('druid_cycle_rem', { fest: true, full: true, on: false });
  const perm = 'Notification' in window ? Notification.permission : 'unsupported';
  const next = upcomingEvents(60).slice(0, 4);
  box.innerHTML = `
    <div><p class="eyebrow">Lembretes do ciclo</p><h3 class="font-cinzel text-xl font-bold theme-title mt-1">Avisos das festas e das Luas Cheias</h3>
    <p class="text-sm theme-muted mt-1">Receba um aviso na véspera e no próprio dia. Para avisos mesmo com a app fechada, junte as datas ao calendário do telemóvel.</p></div>
    <div class="cr-opts">
      <label class="cr-opt"><input type="checkbox" ${cfg.fest ? 'checked' : ''} onchange="setCycleReminder('fest', this.checked)"> Festas da Roda do Ano</label>
      <label class="cr-opt"><input type="checkbox" ${cfg.full ? 'checked' : ''} onchange="setCycleReminder('full', this.checked)"> Luas Cheias</label>
    </div>
    <div class="flex flex-wrap gap-2">
      <button type="button" class="${cfg.on ? 'btn-sec theme-title' : 'bg-[var(--btn-primary)] text-[var(--on-primary)] font-semibold text-sm px-4 rounded-lg cursor-pointer'}" onclick="setCycleReminder('on', ${!cfg.on})">${cfg.on ? 'Desligar avisos na app' : 'Ligar avisos na app'}</button>
      <button type="button" class="btn-sec theme-accent" onclick="exportCycleICS()">${ico('download')}<span>&nbsp;Juntar ao calendário (.ics)</span></button>
    </div>
    ${cfg.on && perm === 'denied' ? '<p class="text-xs theme-muted">As notificações estão bloqueadas neste navegador: os avisos aparecem dentro da app.</p>' : ''}
    ${next.length ? `<ul class="cr-next">${next.map(e => `<li><span>${e.kind === 'fest' ? ico('wheel') : (window.moonSVG ? moonSVG(0.5, 18) : '')}</span><b>${escH(e.title)}</b><span class="theme-muted">${e.day.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'long' })}</span></li>`).join('')}</ul>` : ''}`;
}

/* ============================================================
   5) Registo do ritual de cada festa e o meu ano na Roda
   ============================================================ */
const festLog = () => ls.json('druid_fest_log', []);
let editing = null;
function renderYearCard() {
  const sec = $('tab-wheel');
  if (!sec) return;
  let box = $('wheel-year');
  if (!box) {
    box = document.createElement('div'); box.id = 'wheel-year'; box.className = 'theme-card border rounded-2xl p-5 lg:p-8 space-y-4 max-w-4xl mx-auto';
    const rem = $('cycle-reminders');
    if (rem) sec.insertBefore(box, rem); else sec.appendChild(box);
  }
  const y = new Date().getFullYear(), log = festLog(), t0 = new Date(); t0.setHours(0, 0, 0, 0);
  const fests = festivalsOf(y);
  const done = fests.filter(f => log.some(e => e.fest === f.name && e.year === y)).length;
  box.innerHTML = `
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div><p class="eyebrow">O meu ano na Roda · ${y}</p><h3 class="font-cinzel text-xl font-bold theme-title mt-1">Rituais celebrados: ${done} de 8</h3></div>
      <div class="wy-bar" aria-hidden="true">${fests.map(f => `<i class="${log.some(e => e.fest === f.name && e.year === y) ? 'on' : ''}"></i>`).join('')}</div>
    </div>
    <ul class="wy-list">${fests.map(f => {
      const e = log.find(x => x.fest === f.name && x.year === y);
      const past = f.date < t0;
      const isEd = editing === f.name;
      return `<li class="${e ? 'is-done' : ''}">
        <div class="wy-row">
          <span class="wy-ic" aria-hidden="true">${e ? '✓' : ico('wheel')}</span>
          <div class="wy-txt"><b>${f.name}</b><span>${f.date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}${e ? ` · celebrado a ${new Date(e.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}` : past ? ' · passou' : ''}</span>
            ${e && e.text ? `<p>${escH(e.text.length > 220 ? e.text.slice(0, 217) + '…' : e.text)}</p>` : e && e.inJournal ? '<p class="theme-muted">Registado no diário.</p>' : ''}</div>
          <button type="button" class="btn-sec ${e ? 'theme-muted' : 'theme-accent'}" onclick="editFestLog('${f.name}')" aria-expanded="${isEd}">${e ? 'Editar' : 'Registar'}</button>
        </div>
        ${isEd ? `<div class="wy-form">
          <label>Data <input type="date" id="wy-date" value="${(e ? new Date(e.date) : (past ? f.date : new Date())).toLocaleDateString('sv')}" class="theme-inner border rounded-lg px-3"></label>
          <label class="wy-wide">O que fez e o que sentiu<textarea id="wy-text" rows="3" class="theme-inner border rounded-lg p-3" placeholder="Ex.: acendi a vela ao amanhecer, li uma tríade, deixei uma oferenda de maçã…">${escH(e ? e.text || '' : '')}</textarea></label>
          <label class="cr-opt"><input type="checkbox" id="wy-journal" ${encOn() ? 'checked disabled' : 'checked'}> Copiar também para o Diário${encOn() ? ' (o texto fica só no diário cifrado)' : ''}</label>
          <div class="flex flex-wrap gap-2"><button type="button" class="bg-[var(--btn-primary)] text-[var(--on-primary)] font-semibold text-sm px-4 rounded-lg cursor-pointer" onclick="saveFestLog('${f.name}')">Guardar</button>
          <button type="button" class="btn-link" onclick="editFestLog(null)">Cancelar</button>
          ${e ? `<button type="button" class="btn-link tone-danger" onclick="deleteFestLog('${f.name}')">Apagar registo</button>` : ''}</div>
        </div>` : ''}
      </li>`;
    }).join('')}</ul>`;
  document.querySelectorAll('.wheel-node').forEach(g => {
    const n = FEST_NAMES[g.dataset.fest];
    g.classList.toggle('is-done', log.some(e => e.fest === n && e.year === y));
  });
}
window.editFestLog = name => { editing = name; renderYearCard(); const t = $('wy-text'); if (t) t.focus(); };
window.saveFestLog = function (name) {
  const y = new Date().getFullYear();
  const date = ($('wy-date') || {}).value || new Date().toLocaleDateString('sv');
  const text = (($('wy-text') || {}).value || '').trim();
  const toJournal = encOn() || ($('wy-journal') || {}).checked;
  const log = festLog().filter(e => !(e.fest === name && e.year === y));
  log.push({ fest: name, year: y, date, text: encOn() ? '' : text, inJournal: !!toJournal });
  ls.setJson('druid_fest_log', log);
  if (toJournal && text && typeof appendToJournal === 'function') {
    if (locked()) { const pend = ls.get(PEND, ''); ls.set(PEND, `${pend}\n--- [${new Date(date).toLocaleDateString('pt-PT')}] RITUAL DE ${name.toUpperCase()}: ${text}\n`); }
    else appendToJournal(`RITUAL DE ${name.toUpperCase()}: ${text}`);
  }
  editing = null;
  renderYearCard();
  toast(`Ritual de ${name} registado.`);
};
/** Junta um texto ao diário sem perder o que está à espera de cifra
    (usado por outras secções, p. ex. js/34-antepassados.js). */
window.journalAppend = function (text) {
  if (locked()) {
    ls.set(PEND, `${ls.get(PEND, '')}\n--- [${new Date().toLocaleString('pt-PT')}] ${text}\n`);
    toast('Guardado. Será cifrado quando desbloquear o diário.');
    return 'pending';
  }
  if (typeof appendToJournal === 'function') appendToJournal(text);
  return encOn() ? 'encrypted' : 'plain';
};
window.journalEncrypted = () => encOn();
window.deleteFestLog = function (name) {
  const y = new Date().getFullYear();
  ls.setJson('druid_fest_log', festLog().filter(e => !(e.fest === name && e.year === y)));
  editing = null; renderYearCard();
};

/* ============================================================
   6) Ervas: favoritas, época de colheita e parte usada
   ============================================================ */
const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const HARVEST = {
  'casca de vidoeiro': ['casca e folhas novas', [3, 4, 5], 'primavera'],
  'dente-de-leão': ['folhas e raiz', [3, 4, 5, 9, 10], 'folhas na primavera, raiz no outono'],
  'bagas de sorveira': ['bagas maduras', [9, 10], 'outono'],
  'verbena': ['partes aéreas em flor', [6, 7, 8], 'verão'],
  'folhas de amieiro': ['folhas', [5, 6, 7], 'primavera e verão'],
  'ulmeira': ['flores', [6, 7, 8], 'verão'],
  'casca de salgueiro': ['casca de ramos novos', [2, 3, 4], 'fim do inverno e primavera'],
  'artemísia': ['folhas e sumidades floridas', [7, 8, 9], 'verão'],
  'sementes de freixo': ['sementes (sâmaras)', [9, 10], 'outono'],
  'agrimónia': ['partes aéreas em flor', [6, 7, 8], 'verão'],
  'flores de espinheiro': ['flores e bagas', [4, 5, 9, 10], 'flor na primavera, baga no outono'],
  'rosa silvestre': ['frutos (cinórrodos)', [9, 10, 11], 'outono'],
  'bolota': ['bolotas', [10, 11], 'outono'],
  'musgo de carvalho': ['o líquen inteiro', [10, 11, 12, 1, 2, 3], 'outono e inverno, com humidade'],
  'viscum': ['folhas e raminhos', [11, 12, 1], 'inverno'],
  'folhas de azevinho': ['folhas', [11, 12], 'inverno'],
  'cardo santo': ['partes aéreas em flor', [6, 7], 'verão'],
  'avelãs': ['frutos', [8, 9], 'fim do verão'],
  'sálvia': ['folhas', [5, 6, 7], 'antes de florir, primavera e verão'],
  'flor de macieira': ['flores', [4, 5], 'primavera'],
  'camomila': ['flores', [5, 6, 7], 'primavera e verão'],
  'folha de videira': ['folhas', [5, 6], 'primavera'],
  'amora silvestre': ['folhas e frutos', [4, 5, 8, 9], 'folha na primavera, fruto no fim do verão'],
  'hera terrestre': ['partes aéreas', [4, 5, 6], 'primavera'],
  'alecrim': ['ramos com folhas', ALL, 'todo o ano'],
  'raiz de junco': ['rizoma', [10, 11], 'outono'],
  'valeriana': ['raiz', [9, 10], 'outono'],
  'abrunhos': ['frutos', [10, 11], 'outono, depois das primeiras geadas'],
  'absinto': ['folhas e sumidades floridas', [7, 8], 'verão'],
  'flor e baga de sabugueiro': ['flores e bagas maduras', [5, 6, 8, 9], 'flor na primavera, baga no fim do verão'],
  'agulhas de pinheiro': ['agulhas novas', [3, 4, 5], 'primavera'],
  'resina': ['resina já seca no tronco', [6, 7, 8], 'verão'],
  'flores douradas de tojo': ['flores', [1, 2, 3, 4], 'fim do inverno e primavera'],
  'calêndula': ['flores', [5, 6, 7, 8, 9], 'da primavera ao outono'],
  'flores de urze': ['ramos em flor', [8, 9], 'fim do verão'],
  'lavanda': ['espigas floridas', [6, 7], 'verão'],
  'folhas de choupo': ['gomos e folhas novas', [2, 3, 4], 'fim do inverno e primavera'],
  'erva-cidreira': ['folhas', [5, 6, 7, 8], 'primavera e verão'],
  'teixo': ['nenhuma: não colher', [], 'nunca: todas as partes são venenosas']
};
window.HERB_HARVEST = HARVEST;
const favs = () => ls.json('druid_herb_favs', []);
const label = k => k.charAt(0).toUpperCase() + k.slice(1);
function decorateHerbs() {
  document.querySelectorAll('#tree-list .bot-use[data-herb]').forEach(u => {
    const k = u.dataset.herb, h = HARVEST[k];
    const txt = u.querySelector('.bot-use-txt');
    if (!txt || u.dataset.harvest) return;
    u.dataset.harvest = '1';
    if (h) {
      const p = document.createElement('p');
      p.className = 'bot-harvest';
      p.innerHTML = `<span>Colheita</span> ${escH(h[2])} · <span>Parte usada</span> ${escH(h[0])}`;
      txt.appendChild(p);
    }
    if (k !== 'teixo') {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'herb-fav'; b.dataset.herb = k;
      txt.appendChild(b);
    }
  });
  syncFavButtons();
}
function syncFavButtons() {
  const f = favs();
  document.querySelectorAll('.herb-fav').forEach(b => {
    const on = f.includes(b.dataset.herb);
    b.setAttribute('aria-pressed', on);
    b.innerHTML = `<span aria-hidden="true">${on ? '★' : '☆'}</span> ${on ? 'Na minha lista' : 'Juntar à minha lista'}`;
    b.setAttribute('aria-label', `${on ? 'Tirar' : 'Juntar'} ${label(b.dataset.herb)} ${on ? 'da' : 'à'} minha lista de ervas`);
  });
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.herb-fav');
  if (!b) return;
  const k = b.dataset.herb, f = favs();
  ls.setJson('druid_herb_favs', f.includes(k) ? f.filter(x => x !== k) : [...f, k]);
  syncFavButtons(); renderHarvestPanel();
});
function treeOfHerb(k) {
  const D = typeof OGHAM_DATA !== 'undefined' ? OGHAM_DATA : [];
  const hk = (window.botanica || {}).herbKey;
  return D.find(o => ((window.botanica || {}).splitHerbs || (x => [x]))(o.herb).some(n => (hk ? hk(n) : n.toLowerCase()) === k));
}
function chip(k, inSeason) {
  const o = treeOfHerb(k);
  return `<button type="button" class="hv-chip${inSeason ? ' in-season' : ''}" onclick="openTreeInGuide && openTreeInGuide('${o ? o.name : ''}')" title="${escH(HARVEST[k] ? HARVEST[k][2] : '')}">
    ${favs().includes(k) ? '<span aria-hidden="true">★</span>' : ''}${escH(label(k))}${o ? `<small>${escH(o.name)}</small>` : ''}</button>`;
}
function renderHarvestPanel() {
  const host = $('tab-herbal');
  if (!host) return;
  let box = $('harvest-panel');
  if (!box) {
    box = document.createElement('div'); box.id = 'harvest-panel'; box.className = 'theme-card border rounded-2xl p-5 lg:p-6 space-y-4';
    const first = host.querySelector(':scope > .theme-card');
    if (first) first.after(box); else host.appendChild(box);
  }
  const m = new Date().getMonth() + 1;
  const now = Object.keys(HARVEST).filter(k => HARVEST[k][1].includes(m));
  const f = favs();
  const bySeason = [['Inverno', [12, 1, 2]], ['Primavera', [3, 4, 5]], ['Verão', [6, 7, 8]], ['Outono', [9, 10, 11]]];
  box.innerHTML = `
    <div><p class="eyebrow">Colheita</p><h3 class="font-cinzel text-xl font-bold theme-title mt-1">Em época em ${MES[m - 1]}</h3>
    <p class="text-sm theme-muted mt-1">Ervas e árvores do guia que se colhem este mês. Toque numa para ver a ficha. Colha só o que conhece bem, longe de estradas e sem arrancar a planta.</p></div>
    <div class="hv-chips">${now.length ? now.map(k => chip(k, true)).join('') : '<p class="text-sm theme-muted">Nenhuma erva do guia se colhe este mês.</p>'}</div>
    <div class="hv-mine">
      <h4 class="font-cinzel theme-title">A minha lista ${f.length ? `(${f.length})` : ''}</h4>
      ${f.length ? `<div class="hv-seasons">${bySeason.map(([s, ms]) => {
        const ks = f.filter(k => HARVEST[k] && HARVEST[k][1].some(x => ms.includes(x)));
        return ks.length ? `<div class="hv-season${ms.includes(m) ? ' is-now' : ''}"><p>${s}${ms.includes(m) ? ' · agora' : ''}</p><div class="hv-chips">${ks.map(k => chip(k, HARVEST[k][1].includes(m))).join('')}</div></div>` : '';
      }).join('')}</div>` : '<p class="text-sm theme-muted">Toque em «☆ Juntar à minha lista» nas ervas do guia para montar a sua lista de colheita por estação.</p>'}
    </div>`;
}

/* ============================================================
   7) Aviso quando não há rede
   ============================================================ */
function renderNet() {
  const off = navigator.onLine === false;
  let b = $('net-banner');
  if (!off) { if (b) b.remove(); document.querySelectorAll('.net-note').forEach(n => n.remove()); return; }
  if (!b) {
    b = document.createElement('div'); b.id = 'net-banner'; b.className = 'net-banner'; b.setAttribute('role', 'status');
    b.innerHTML = `<span aria-hidden="true">⦸</span> Sem rede. Tudo funciona, exceto a meteorologia, o nome do lugar e a interpretação por IA.`;
    const main = $('main'); if (main) main.prepend(b);
  }
  const cache = ls.json('druid_weather_cache', null);
  const when = cache && cache.ts ? new Date(cache.ts).toLocaleString('pt-PT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : null;
  const msg = when ? `Sem rede: a meteorologia mostra o último valor guardado (${when}).` : 'Sem rede: a meteorologia volta quando houver ligação.';
  ['today-element-weather', 'weather-elem-assoc'].forEach(id => {
    const el = $(id);
    if (!el) return;
    let n = el.parentElement.querySelector(':scope > .net-note');
    if (!n) { n = document.createElement('p'); n.className = 'net-note'; el.after(n); }
    n.textContent = msg;
  });
}
window.addEventListener('online', renderNet);
window.addEventListener('offline', renderNet);

/* ============================================================
   Ligações e arranque
   ============================================================ */
const prevSwitch = window.switchTab;
window.switchTab = function (id) {
  const r = prevSwitch.apply(this, arguments);
  setTitle(id);
  if (id === 'treewheel') markStep('tree');
  if (id === 'today') renderFirstSteps();
  if (id === 'wheel') { renderYearCard(); renderCycleCard(); }
  if (id === 'herbal') { decorateHerbs(); renderHarvestPanel(); }
  if (id === 'journal') renderBackupNotice();
  return r;
};
const prevDaily = window.drawDailyOracle;
if (typeof prevDaily === 'function') window.drawDailyOracle = function (t) { const r = prevDaily.apply(this, arguments); if (t === 'ogham') markStep('ogham'); return r; };
const prevOgham = window.drawOghamCard;
if (typeof prevOgham === 'function') window.drawOghamCard = function () { const r = prevOgham.apply(this, arguments); markStep('ogham'); return r; };
const wrappedJournal = window.autoSaveJournal;
window.autoSaveJournal = function () { const r = wrappedJournal.apply(this, arguments); if ((($('journal-input') || {}).value || '').trim()) markStep('journal'); return r; };

function init() {
  // Começa fechado se o diário estiver cifrado (ou com o PIN antigo).
  if (encOn()) { const j = $('journal-input'), b = $('bardic-input'); if (j) j.value = ''; if (b) b.value = ''; }
  addSizeControls();
  renderFirstSteps();
  renderYearCard(); renderCycleCard();
  decorateHerbs(); renderHarvestPanel();
  const list = $('tree-list');
  if (list && 'MutationObserver' in window) new MutationObserver(() => decorateHerbs()).observe(list, { childList: true });
  renderNet();
  const cur = [...document.querySelectorAll('.tab-content')].find(s => !s.classList.contains('hidden'));
  setTitle(cur ? cur.id.slice(4) : 'today');
  if (cur && cur.id === 'tab-journal') window.checkJournalPinLock();
  checkCycleReminders();
  setInterval(checkCycleReminders, 30 * 60 * 1000);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
window.DruidPrivacy = { encOn, locked, lock: () => window.lockJournalNow() };
})();
