#!/usr/bin/env node
// Prepara a pasta do GitHub Pages para carregar mais depressa:
// - junta todos os js/*.js locais (pela ordem do index.html) num só
//   ficheiro minificado, js/app.min.js;
// - minifica css/app.css;
// - atualiza o index.html e a lista PRECACHE do sw.js.
// O código-fonte do repositório não muda: só a cópia em <pasta>.
// Uso: node tools/build-pages.mjs _site
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { transformSync } from 'esbuild';

const dir = resolve(process.argv[2] || '_site');
const read = p => readFileSync(join(dir, p), 'utf8');
const isLocal = p => !/^(https?:)?\/\//.test(p) && !p.startsWith('data:');
const kb = n => Math.round(n / 1024) + ' KB';

let html = read('index.html');
const tagRe = /^[ \t]*<script src="([^"]+)"><\/script>\n/gm;
const srcs = [...html.matchAll(tagRe)].map(m => m[1]).filter(isLocal);
if (!srcs.length) throw new Error('index.html sem scripts locais');

// Cada ficheiro é minificado à parte e sem «format»: assim o esbuild não muda
// os nomes globais (funções chamadas em onclick e entre ficheiros).
let before = 0;
const parts = srcs.map(src => {
  const code = read(src);
  before += Buffer.byteLength(code);
  const { code: min } = transformSync(code, { loader: 'js', minify: true, target: 'es2020', legalComments: 'inline', sourcefile: src });
  return `/* ${src} */\n${min.trim().replace(/;?$/, ';')}`;
});
const bundle = parts.join('\n') + '\n';
const hash = createHash('sha256').update(bundle).digest('hex').slice(0, 10);
writeFileSync(join(dir, 'js/app.min.js'), bundle);

// O bundle fica no lugar do último script local, para que todo o HTML que os
// scripts esperam encontrar já exista quando ele corre.
const last = srcs[srcs.length - 1];
html = html.replace(tagRe, (m, src) => !isLocal(src) ? m
  : src === last ? m.replace(src, `js/app.min.js?v=${hash}`) : '');
writeFileSync(join(dir, 'index.html'), html);
for (const src of srcs) rmSync(join(dir, src));

// CSS
const css = read('css/app.css');
const { code: cssMin } = transformSync(css, { loader: 'css', minify: true });
writeFileSync(join(dir, 'css/app.css'), cssMin);

// Service worker: a lista PRECACHE passa a ter só o bundle em vez dos scripts.
let sw = read('sw.js');
const drop = new Set(srcs.map(s => `'./${s}',`));
sw = sw.split('\n').filter(l => !drop.has(l.trim())).join('\n');
sw = sw.replace(/(\n[ \t]*)'\.\/css\/app\.css',/, `$1'./css/app.css',$1'./js/app.min.js?v=${hash}',`);
if (!sw.includes('app.min.js')) throw new Error('sw.js: não encontrei onde pôr o bundle');
writeFileSync(join(dir, 'sw.js'), sw);

console.log(`JS: ${srcs.length} ficheiros, ${kb(before)} → ${kb(Buffer.byteLength(bundle))} (js/app.min.js?v=${hash})`);
console.log(`CSS: ${kb(Buffer.byteLength(css))} → ${kb(Buffer.byteLength(cssMin))}`);
