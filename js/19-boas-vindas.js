/* Boas-vindas (1.ª visita) e sugestão de lembrete após a primeira tiragem */
(() => {
  const $ = id => document.getElementById(id);
  const get = k => { try { return localStorage.getItem(k); } catch { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
  const dlg = $('onboard');
  let step = 0;

  function show(n) {
    step = n;
    dlg.querySelectorAll('.ob-step').forEach(s => { s.hidden = +s.dataset.step !== n; });
    dlg.querySelectorAll('.ob-dots i').forEach((d, i) => d.classList.toggle('on', i === n));
    $('ob-next').textContent = n === 2 ? 'Começar' : 'Continuar';
  }
  function markTheme() {
    const cur = get('druid_theme') || window.__theme || 'theme-night';
    dlg.querySelectorAll('.ob-themes button').forEach(b => b.setAttribute('aria-checked', b.dataset.theme === cur));
  }
  dlg.querySelectorAll('.ob-themes button').forEach(b => b.addEventListener('click', () => {
    if (typeof changeTheme === 'function') changeTheme(b.dataset.theme);
    set('druid_theme', b.dataset.theme);
    markTheme();
  }));
  window.onboardNext = () => (step < 2 ? show(step + 1) : finishOnboard());
  window.finishOnboard = () => { set('druid_onboarded', '1'); if (dlg.open) dlg.close(); if (typeof switchTab === 'function') switchTab('today'); };
  window.onboardLocate = () => {
    const st = $('ob-loc-status');
    if (!('geolocation' in navigator)) { st.textContent = 'Este dispositivo não permite obter a localização.'; return; }
    st.textContent = 'A pedir a localização…';
    try { if (typeof refreshWeatherAndElement === 'function') refreshWeatherAndElement(true); } catch {}
    navigator.geolocation.getCurrentPosition(
      () => { st.textContent = 'Localização ativa. Os ciclos já refletem o seu lugar.'; $('ob-loc').disabled = true; },
      () => { st.textContent = 'Sem permissão. Pode ativar mais tarde em Ciclos › Atualizar GPS & Clima.'; },
      { timeout: 10000, maximumAge: 3600000 });
  };
  dlg.addEventListener('cancel', () => set('druid_onboarded', '1'));
  document.addEventListener('DOMContentLoaded', () => {
    if (get('druid_onboarded')) return;
    // Quem já usou a app (tem dados) não vê as boas-vindas
    if (get('druid_readings') || get('druid_journal')) { set('druid_onboarded', '1'); return; }
    markTheme(); show(0);
    setTimeout(() => { try { dlg.showModal(); } catch {} }, 400);
  });

  // Lembrete: sugerido uma única vez, depois da primeira tiragem registada
  const nudge = $('reminder-nudge');
  window.closeReminderNudge = () => { nudge.hidden = true; set('druid_reminder_asked', '1'); };
  window.acceptReminderNudge = () => {
    const [h, m] = ($('nudge-time').value || '09:00').split(':').map(Number);
    if (typeof schedulePracticeReminder === 'function') schedulePracticeReminder(h || 0, m || 0);
    closeReminderNudge();
  };
  const _rec = recordReading;
  recordReading = function (type) {
    _rec(type);
    try {
      if (get('druid_reminder_asked')) return;
      const cfg = JSON.parse(get('druid_reminder') || '{}');
      if (cfg.on) return;
      if (JSON.parse(get('druid_readings') || '[]').length >= 1) setTimeout(() => { nudge.hidden = false; }, 1200);
    } catch {}
  };
})();
