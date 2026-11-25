// Verificações estáticas: ficheiros referidos existem, o service worker guarda
// tudo o que a página precisa e o gerador do HTML único não deixa nada de fora.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = new URL('..', import.meta.url).pathname;
const read = p => readFileSync(join(root, p), 'utf8');
const html = read('index.html');
const isLocal = p => !/^(https?:)?\/\//.test(p) && !p.startsWith('data:');
const localRefs = [
  ...[...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]),
  ...[...html.matchAll(/<link rel="(?:stylesheet|manifest|apple-touch-icon)" href="([^"]+)"/g)].map(m => m[1])
].filter(isLocal);

test('todos os ficheiros referidos no index.html existem', () => {
  assert.ok(localRefs.length > 20);
  for (const ref of localRefs) assert.ok(existsSync(join(root, ref)), `falta ${ref}`);
});

test('o service worker guarda todos os ficheiros locais da página', () => {
  const sw = read('sw.js');
  const precache = [...sw.matchAll(/'\.\/([^']*)'/g)].map(m => m[1]).filter(Boolean);
  for (const ref of localRefs) assert.ok(precache.includes(ref), `sw.js não guarda ${ref}`);
  for (const p of precache) assert.ok(existsSync(join(root, p)), `sw.js refere ${p}, que não existe`);
});

test('manifest válido e com ícones existentes', () => {
  assert.match(html, /<link rel="manifest" href="manifest.json">/);
  const m = JSON.parse(read('manifest.json'));
  assert.equal(m.display, 'standalone');
  assert.ok(m.start_url && m.name && m.short_name);
  const sizes = m.icons.map(i => i.sizes);
  assert.ok(sizes.includes('192x192') && sizes.includes('512x512'), 'faltam ícones 192 e 512');
  assert.ok(m.icons.some(i => i.purpose === 'maskable'), 'falta ícone maskable');
  for (const i of m.icons) assert.ok(existsSync(join(root, i.src)), `falta ${i.src}`);
});

test('o registo do service worker usa o ficheiro sw.js (não um blob)', () => {
  const js = localRefs.filter(r => r.endsWith('.js')).map(read).join('\n');
  assert.match(js, /serviceWorker\.register\('\.\/sw\.js'\)/);
  assert.doesNotMatch(js, /serviceWorker\.register\(url\)/);
});

test('o HTML único inclui todo o CSS e JS e não depende de ficheiros locais', () => {
  const out = join(mkdtempSync(join(tmpdir(), 'druid-')), 'single.html');
  execFileSync(process.execPath, [join(root, 'tools/build-single.mjs'), out]);
  const single = readFileSync(out, 'utf8');
  assert.doesNotMatch(single, /^\s*<script src="(?!https?:)/m, 'ainda há scripts locais');
  assert.doesNotMatch(single, /^\s*<link rel="stylesheet" href="(?!https?:)/m, 'ainda há CSS local');
  for (const ref of localRefs.filter(r => r.endsWith('.js'))) {
    const firstLine = read(ref).split('\n').find(l => l.trim().length > 10);
    assert.ok(single.includes(firstLine), `${ref} não foi incluído`);
  }
});

test('a publicação no Pages copia todas as pastas que o service worker guarda', () => {
  const wf = read('.github/workflows/pages.yml');
  const cp = (wf.match(/cp -r ([^\n]+) _site\//) || [])[1] || '';
  const copied = cp.split(/\s+/);
  const sw = read('sw.js');
  const tops = new Set([...sw.matchAll(/'\.\/([^'\/]+)(?:\/[^']*)?'/g)].map(m => m[1]).filter(Boolean));
  for (const t of tops) assert.ok(copied.includes(t), `pages.yml não copia ${t} para o site`);
});
