/* Service worker do Caminho Druídico: permite usar a app sem rede.
   - Ficheiros da app (HTML, CSS, JS, ícones): com rede, vêm sempre da rede
     (assim uma atualização nunca mistura ficheiros novos com antigos);
     sem rede, vêm da cópia guardada na instalação.
   - Fontes e bibliotecas de CDN e gravuras das ervas (img/plantas):
     guardadas na primeira utilização, para a instalação ser leve.
   - APIs externas (tempo, localização, IA, QR): sempre pela rede.
   Ao mudar a lista PRECACHE ou o código, suba VERSION. */
const VERSION = 'v33';
const CORE = `caminho-core-${VERSION}`;
const RUNTIME = 'caminho-runtime-v1';
const ON_DEMAND = /\/img\/plantas\//;

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/app.css',
  './fonts/cinzel-latin-500-normal.woff2',
  './fonts/cinzel-latin-700-normal.woff2',
  './fonts/inter-latin-400-normal.woff2',
  './fonts/inter-latin-500-normal.woff2',
  './fonts/inter-latin-600-normal.woff2',
  './fonts/inter-latin-700-normal.woff2',
  './i18n/en-GB.js',
  './js/00-idioma.js',
  './js/01-lunar-calc.js',
  './js/02-tarot-nordico.js',
  './js/03-nucleo.js',
  './js/04-ajustes-v2.js',
  './js/05-tarot-tiragens.js',
  './js/06-runas-galeria.js',
  './js/07-astronomia-v4.js',
  './js/08-navegacao-v5.js',
  './js/09-elemento-clima-v6.js',
  './js/10-design-v7.js',
  './js/11-expansao-v9.js',
  './js/12-expansao-v10.js',
  './js/13-guia-tiragem.js',
  './js/14-interpretacao-ia.js',
  './js/15-sincronizacao-lunar.js',
  './js/16-ritual-baralhar.js',
  './js/17-hoje-recolhiveis.js',
  './js/18-navegacao-grupos.js',
  './js/19-boas-vindas.js',
  './js/20-app-offline.js',
  './js/21-ogham-estudo.js',
  './js/22-meditacoes-guiadas.js',
  './js/23-oraculos.js',
  './js/24-design-global.js',
  './js/25-runas-estudo.js',
  './js/26-ilustracoes-botanicas.js',
  './js/27-renovacao-design.js',
  './js/28-sugestoes-utilizadores.js',
  './js/29-runas-tiragens.js',
  './js/30-acessibilidade.js',
  './js/31-ajustes-fichas.js',
  './js/32-saber-origem.js',
  './js/vendor-qrcode.js',
  './js/33-grove-leituras.js',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

// Recursos de terceiros que podem ficar em cache (fontes e bibliotecas fixas)
const CACHEABLE_HOSTS = ['cdnjs.cloudflare.com'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CORE)
      .then(cache => cache.addAll(PRECACHE.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CORE && k !== RUNTIME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'version') event.ports[0]?.postMessage(VERSION);
});

async function networkFirstPage(request) {
  const cache = await caches.open(CORE);
  try {
    const res = await fetch(request, { cache: 'no-cache' });
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) ||
           (await cache.match('./index.html')) ||
           new Response('<h1>Sem ligação</h1>', { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}

async function networkFirstAsset(request) {
  const cache = await caches.open(CORE);
  try {
    // «no-cache»: confirma com o servidor em vez de usar a cache HTTP do navegador
    const res = await fetch(request, { cache: 'no-cache' });
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    return (await cache.match(request, { ignoreSearch: true })) || new Response('', { status: 504 });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok || res.type === 'opaque') cache.put(request, res.clone());
  return res;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (request.mode === 'navigate' && url.origin === self.location.origin) {
    event.respondWith(networkFirstPage(request));
  } else if (url.origin === self.location.origin && ON_DEMAND.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else if (url.origin === self.location.origin) {
    event.respondWith(networkFirstAsset(request));
  } else if (CACHEABLE_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request));
  }
  // Restantes pedidos (APIs) seguem normalmente pela rede.
});
