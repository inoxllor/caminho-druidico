#!/usr/bin/env node
// Gera uma versão de ficheiro único (HTML-ÚNICO) a partir do código modular:
// junta css/*.css e js/*.js locais dentro do index.html.
// Uso: node tools/build-single.mjs [saída]   (por omissão: dist/caminho-druidico.html)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(process.argv[2] || join(root, 'dist', 'caminho-druidico.html'));
const isLocal = p => !/^(https?:)?\/\//.test(p) && !p.startsWith('data:');
const read = p => readFileSync(join(root, p), 'utf8').replace(/\n$/, '');
// Evita fechar a tag <script> antes do tempo se o código contiver "</script"
const safeJs = s => s.replace(/<\/script/gi, '<\\/script');

let html = read('index.html');
// Fontes locais referidas no CSS (url(../fonts/x.woff2)) passam a data: URIs.
const inlineFonts = (css, href) => css.replace(/url\((\.\.\/fonts\/[^)]+\.woff2)\)/g, (m, rel) =>
  `url(data:font/woff2;base64,${readFileSync(join(root, dirname(href), rel)).toString('base64')})`);
html = html.replace(/^([ \t]*)<link rel="stylesheet" href="([^"]+)">$/gm, (m, ind, href) =>
  isLocal(href) ? `${ind}<style>\n${inlineFonts(read(href), href)}\n</style>` : m);
// O pré-carregamento de fontes locais não faz sentido no ficheiro único.
html = html.replace(/^[ \t]*<link rel="preload" href="fonts\/[^"]+"[^>]*>\n/gm, '');
html = html.replace(/^([ \t]*)<script src="([^"]+)"><\/script>$/gm, (m, ind, src) =>
  isLocal(src) ? `${ind}<script>\n${safeJs(read(src))}\n${ind}</script>` : m);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html + '\n');
console.log(`HTML único gerado: ${out} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
