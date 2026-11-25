/* Navegação em grupos: «Oráculos» (Ogham, Runas, Tarot) e «Ciclos» (Astronomia, Roda do Ano).
   O botão da barra abre o último separador usado do grupo; no topo de cada um há um seletor. */
(() => {
  const GROUPS = {
    oracles: { label: 'Oráculos', tabs: [['oracle', 'Ogham'], ['runes', 'Runas'], ['tarot', 'Tarot']] },
    cycles: { label: 'Ciclos', tabs: [['astro', 'Astronomia'], ['wheel', 'Roda do Ano'], ['treewheel', 'Árvores']] }
  };
  const groupOf = id => Object.keys(GROUPS).find(g => GROUPS[g].tabs.some(t => t[0] === id));
  const last = g => { try { return localStorage.getItem('druid_last_' + g); } catch { return null; } };

  window.openNavGroup = function (g) {
    const tabs = GROUPS[g].tabs.map(t => t[0]);
    const l = last(g);
    switchTab(tabs.includes(l) ? l : tabs[0]);
    scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  };

  // Seletor no topo de cada separador do grupo
  Object.entries(GROUPS).forEach(([g, def]) => {
    def.tabs.forEach(([id]) => {
      const sec = document.getElementById('tab-' + id);
      if (!sec || sec.querySelector('.subnav')) return;
      const nav = document.createElement('div');
      nav.className = 'subnav';
      nav.setAttribute('role', 'tablist');
      nav.setAttribute('aria-label', def.label);
      nav.innerHTML = def.tabs.map(([t, label]) => `<button type="button" role="tab" data-sub="${t}" aria-selected="${t === id}" onclick="switchTab('${t}')">${label}</button>`).join('');
      sec.prepend(nav);
    });
  });

  const _sw = switchTab;
  switchTab = function (id) {
    _sw(id);
    const g = groupOf(id);
    document.querySelectorAll('#bot-nav-oracles, #bot-nav-cycles').forEach(b => {
      const on = b.id === 'bot-nav-' + g;
      b.classList.toggle('active', on); b.classList.toggle('theme-muted', !on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    if (g) { try { localStorage.setItem('druid_last_' + g, id); } catch {} }
  };
  // Estado inicial (ex.: link com #tarot)
  document.addEventListener('DOMContentLoaded', () => {
    const cur = [...document.querySelectorAll('.tab-content')].find(s => !s.classList.contains('hidden'));
    const id = cur && cur.id.replace('tab-', '');
    const g = id && groupOf(id);
    if (g) { const b = document.getElementById('bot-nav-' + g); b && (b.classList.add('active'), b.classList.remove('theme-muted')); }
  });
})();
