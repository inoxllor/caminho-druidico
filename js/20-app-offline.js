/* ============================================================
   App instalável e offline: regista o service worker (sw.js),
   mostra o estado offline e o botão «Instalar app», e gera o
   .zip de ficheiro único a partir dos ficheiros modulares.
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

// ——— .zip com a página num ficheiro único ———
async function fetchText(url) {
  const r = await fetch(url, { cache: 'no-cache' });
  if (!r.ok) throw new Error(url + ' ' + r.status);
  return r.text();
}
const isLocal = p => !/^(https?:)?\/\//.test(p) && !p.startsWith('data:');

/** Junta CSS e JS locais dentro do index.html (igual a tools/build-single.mjs). */
async function buildSingleHTML() {
  try { return await fetchText('caminho-druidico.html'); } catch (e) { /* não publicado: gerar aqui */ }
  let html = await fetchText('index.html');
  const jobs = [];
  html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, href) => { if (isLocal(href)) jobs.push([m, href, 'css']); return m; });
  html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => { if (isLocal(src)) jobs.push([m, src, 'js']); return m; });
  const texts = await Promise.all(jobs.map(([, u]) => fetchText(u)));
  jobs.forEach(([tag, , kind], i) => {
    const body = kind === 'css' ? `<style>\n${texts[i]}</style>` : `<script>\n${texts[i].replace(/<\/script/gi, '<\\/script')}</script>`;
    html = html.split(tag).join(body);
  });
  return html;
}

const previousZip = window.downloadProjectZip;
window.downloadProjectZip = async function () {
  if (!/^https?:$/.test(location.protocol)) return previousZip && previousZip();
  if (typeof window.loadLib === 'function') {
    try { await window.loadLib('jszip'); } catch (e) { return showToast('Sem ligação: não foi possível carregar a biblioteca de exportação.'); }
  }
  if (typeof JSZip === 'undefined') return showToast('Biblioteca JSZip ainda a carregar.');
  const pending = showToast('A preparar o ficheiro…', { duration: 15000 });
  try {
    const z = new JSZip();
    z.file('caminho-druidico.html', await buildSingleHTML());
    const a = document.createElement('a');
    a.href = URL.createObjectURL(await z.generateAsync({ type: 'blob' }));
    a.download = 'caminho-druidico.zip';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1e4);
    if (pending && pending.dismiss) pending.dismiss();
    showToast('ZIP descarregado!');
  } catch (e) {
    console.error(e);
    if (pending && pending.dismiss) pending.dismiss();
    showToast('Não foi possível criar o ZIP.');
  }
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderAppPanel);
else renderAppPanel();
})();
