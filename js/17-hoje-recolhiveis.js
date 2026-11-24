/* Secções recolhíveis do ecrã Hoje: memoriza o estado aberto/fechado */
(() => {
  document.querySelectorAll('details.today-more[data-key]').forEach(d => {
    const k = 'druid_today_open_' + d.dataset.key;
    try { if (localStorage.getItem(k) === '1') d.open = true; } catch {}
    d.addEventListener('toggle', () => { try { localStorage.setItem(k, d.open ? '1' : '0'); } catch {} });
  });
})();
