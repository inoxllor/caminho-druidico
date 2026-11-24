/* Sync lunar UI on tab + interval */
(function () {
  const prev = window.switchTab;
  if (typeof prev === 'function') {
    window.switchTab = function (id) {
      prev(id);
      if (id === 'astro' || id === 'today') {
        try { refreshLunarUI({ resetMonth: id === 'astro' ? false : true }); } catch (e) {}
      }
    };
  }
  // Ao carregar: sempre mês e dia actuais
  function bootLunar() {
    try { refreshLunarUI({ resetMonth: true }); } catch (e) {
      try { if (typeof updateAstronomy === 'function') updateAstronomy(); } catch (_) {}
      try { if (typeof renderLunarMap === 'function') renderLunarMap(); } catch (_) {}
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootLunar);
  } else {
    bootLunar();
  }
  // Cada minuto: se o dia civil mudou, re-sincronizar
  setInterval(() => {
    try {
      if (typeof lunarDayKey === 'function' && typeof _lunarLastDayKey !== 'undefined' && lunarDayKey() !== _lunarLastDayKey) {
        refreshLunarUI({ resetMonth: true });
      } else if (typeof updateAstronomy === 'function') {
        updateAstronomy();
        if (typeof updateAstronomyCharts === 'function') updateAstronomyCharts();
      }
    } catch (e) {}
  }, 60000);
})();
