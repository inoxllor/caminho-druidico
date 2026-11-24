/* Guia de tiragem */
window.showGuidePanel = function (id) {
  document.querySelectorAll('#reading-guide .guide-panel').forEach(p => {
    p.classList.toggle('hidden', p.getAttribute('data-panel') !== id);
  });
  document.querySelectorAll('#reading-guide .guide-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-guide') === id);
  });
};
window.openReadingGuide = function (section) {
  const dlg = document.getElementById('reading-guide');
  if (!dlg) return;
  const map = { tarot: 'tarot', runes: 'runes', ogham: 'ogham', prep: 'prep', read: 'read' };
  showGuidePanel(map[section] || 'prep');
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open', '');
};
