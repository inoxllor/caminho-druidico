/* Design Pro v7: progresso de leitura, regresso ao topo e microinterações */
(() => {
  const progress = document.getElementById('scroll-progress');
  const topBtn = document.getElementById('back-to-top');
  let ticking = false;
  function updateScrollUI(){
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const y = Math.max(0, scrollY || document.documentElement.scrollTop || 0);
    if (progress) progress.style.width = Math.min(100, (y / max) * 100) + '%';
    if (topBtn) topBtn.classList.toggle('is-visible', y > 520);
    ticking = false;
  }
  addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScrollUI); ticking = true; }
  }, { passive: true });
  addEventListener('resize', updateScrollUI, { passive: true });
  if (topBtn) topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  document.addEventListener('DOMContentLoaded', updateScrollUI);
})();
