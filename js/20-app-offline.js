/* ============================================================
   App instalável e offline: regista o service worker (sw.js),
   mostra o estado offline e o botão «Instalar app».
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const canUseSW = 'serviceWorker' in navigator && /^https?:$/.test(location.protocol);
let installPrompt = null;

const isStandalone = () =>
  matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// ——— Registo do service worker ———
window.appOfflineReady = canUseSW
  ? navigator.serviceWorker.register('./sw.js').then(reg => navigator.serviceWorker.ready.then(() => reg))
      .catch(err => { console.warn('Service worker não registado:', err); return null; })
  : Promise.resolve(null);

// ——— Painel «Aplicação» em Sobre ———
function renderAppPanel() {
  const about = $('tab-about');
  if (!about || $('app-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'app-panel';
  panel.className = 'theme-card border rounded-2xl p-5 lg:p-8 space-y-3 mt-6 max-w-3xl mx-auto';
  panel.innerHTML = `
    <h3 class="font-cinzel text-xl font-bold theme-title">Aplicação</h3>
    <p class="text-sm theme-muted">Instale o Caminho Druídico no ecrã inicial para o abrir como uma app, mesmo sem rede.</p>
    <p id="app-offline-status" class="text-sm theme-title" role="status">A verificar o modo offline…</p>
    <div class="flex flex-wrap gap-2">
      <button type="button" id="app-install-btn" hidden class="bg-[var(--btn-primary)] text-[var(--on-primary)] font-semibold text-sm py-2 px-4 rounded-lg cursor-pointer">Instalar app</button>
    </div>
    <p id="app-install-hint" class="text-xs theme-muted" hidden></p>`;
  const first = about.firstElementChild;
  if (first && first.nextSibling) about.insertBefore(panel, first.nextSibling); else about.appendChild(panel);
  $('app-install-btn').addEventListener('click', installApp);
  updateInstallUI();
  updateOfflineStatus();
}

function updateInstallUI() {
  const btn = $('app-install-btn'), hint = $('app-install-hint');
  if (!btn || !hint) return;
  btn.hidden = !installPrompt;
  if (isStandalone()) {
    hint.hidden = false; hint.textContent = 'Está a usar a app instalada.';
  } else if (!installPrompt && isIOS()) {
    hint.hidden = false; hint.textContent = 'No iPhone ou iPad: toque em Partilhar e depois em «Adicionar ao ecrã principal».';
  } else if (!installPrompt) {
    hint.hidden = false; hint.textContent = 'Se o botão não aparecer, use o menu do navegador e escolha «Instalar app» ou «Adicionar ao ecrã principal».';
  } else {
    hint.hidden = true;
  }
}

async function updateOfflineStatus() {
  const el = $('app-offline-status');
  if (!el) return;
  if (!canUseSW) {
    el.textContent = location.protocol === 'file:'
      ? 'Aberto a partir de um ficheiro: funciona sem rede, mas o modo app só existe quando o site é aberto pela internet.'
      : 'Este navegador não suporta o modo offline.';
    return;
  }
  const reg = await window.appOfflineReady;
  el.textContent = reg && reg.active
    ? (navigator.onLine ? '✓ Pronto para usar offline.' : '✓ Sem rede: está a usar a cópia guardada.')
    : 'O modo offline ainda não está ativo. Recarregue a página com rede.';
}

async function installApp() {
  if (!installPrompt) return;
  installPrompt.prompt();
  const { outcome } = await installPrompt.userChoice.catch(() => ({ outcome: 'dismissed' }));
  installPrompt = null;
  updateInstallUI();
  if (outcome === 'accepted' && typeof showToast === 'function') showToast('App instalada.');
}

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; updateInstallUI(); });
window.addEventListener('appinstalled', () => { installPrompt = null; updateInstallUI(); });
window.addEventListener('online', updateOfflineStatus);
window.addEventListener('offline', updateOfflineStatus);

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderAppPanel);
else renderAppPanel();
})();
