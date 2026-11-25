/* Service worker do Caminho Druídico: permite usar a app sem rede.
   - Ficheiros da app (HTML, CSS, JS, ícones): com rede, vêm sempre da rede
     (assim uma atualização nunca mistura ficheiros novos com antigos);
     sem rede, vêm da cópia guardada na instalação.
   - Fontes e bibliotecas de CDN: guardadas na primeira utilização.
   - APIs externas (tempo, localização, IA, QR): sempre pela rede.
   Ao mudar a lista PRECACHE ou o código, suba VERSION. */
const VERSION = 'v22';
const CORE = `caminho-core-${VERSION}`;
const RUNTIME = 'caminho-runtime-v1';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/app.css',
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
  './img/plantas/herb-absinto.webp',
  './img/plantas/herb-agrimonia.webp',
  './img/plantas/herb-alecrim.webp',
  './img/plantas/herb-amora-silvestre.webp',
  './img/plantas/herb-artemisia.webp',
  './img/plantas/herb-calendula.webp',
  './img/plantas/herb-camomila.webp',
  './img/plantas/herb-cardo-santo.webp',
  './img/plantas/herb-dente-de-leao.webp',
  './img/plantas/herb-erva-cidreira.webp',
  './img/plantas/herb-hera-terrestre.webp',
  './img/plantas/herb-lavanda.webp',
  './img/plantas/herb-pinheiro.webp',
  './img/plantas/herb-rosa-silvestre.webp',
  './img/plantas/herb-salvia.webp',
  './img/plantas/herb-ulmeira.webp',
  './img/plantas/herb-valeriana.webp',
  './img/plantas/herb-verbena.webp',
  './img/plantas/herb-viscum.webp',
  './img/plantas/tree-Ailm.webp',
  './img/plantas/tree-Beith.webp',
  './img/plantas/tree-Coll.webp',
  './img/plantas/tree-Duir.webp',
  './img/plantas/tree-Eadha.webp',
  './img/plantas/tree-Fearn.webp',
  './img/plantas/tree-Gort.webp',
  './img/plantas/tree-Huath.webp',
  './img/plantas/tree-Ioho.webp',
  './img/plantas/tree-Luis.webp',
  './img/plantas/tree-Muin.webp',
  './img/plantas/tree-Ngetal.webp',
  './img/plantas/tree-Nion.webp',
  './img/plantas/tree-Onn.webp',
  './img/plantas/tree-Quert.webp',
  './img/plantas/tree-Ruis.webp',
  './img/plantas/tree-Saille.webp',
  './img/plantas/tree-Straif.webp',
  './img/plantas/tree-Tinne.webp',
  './img/plantas/tree-Ur.webp',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

// Recursos de terceiros que podem ficar em cache (fontes e bibliotecas fixas)
const CACHEABLE_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

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
  } else if (url.origin === self.location.origin) {
    event.respondWith(networkFirstAsset(request));
  } else if (CACHEABLE_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request));
  }
  // Restantes pedidos (APIs) seguem normalmente pela rede.
});
