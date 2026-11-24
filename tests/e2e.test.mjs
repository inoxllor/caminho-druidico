// Testes no browser (Playwright + Chromium): a app abre sem erros, todas as
// secções funcionam, funciona offline e o HTML único também funciona.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { createStaticServer } from '../tools/serve.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const root = new URL('..', import.meta.url).pathname;
const TABS = ['today', 'oracle', 'runes', 'tarot', 'astro', 'wheel', 'compass', 'altar', 'ritual', 'grove',
  'journal', 'grounding', 'herbal', 'library', 'obod', 'triads', 'orgs', 'about'];
// Erros de rede de serviços externos (fontes, meteorologia, mapas) não contam:
// o ambiente de testes pode não ter acesso à internet.
const EXTERNAL = /Failed to load resource|net::ERR_|fonts\.g|open-meteo|nominatim|qrserver|cdnjs/i;

let server, base, browser;
before(async () => {
  server = createStaticServer(root.replace(/\/$/, ''));
  await new Promise(r => server.listen(0, r));
  base = `http://localhost:${server.address().port}/`;
  browser = await chromium.launch();
});
after(async () => { await browser?.close(); server?.close(); });

async function open(url, { context } = {}) {
  const ctx = context || await browser.newContext({ locale: 'pt-PT', timezoneId: 'Europe/Lisbon' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !EXTERNAL.test(m.text())) errors.push(m.text()); });
  await page.addInitScript(() => { try { localStorage.setItem('druid_onboarded', '1'); } catch { /* nada */ } });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof window.switchTab === 'function');
  return { ctx, page, errors };
}

async function checkAllTabs(page) {
  for (const t of TABS) {
    await page.evaluate(id => switchTab(id), t);
    const len = await page.evaluate(id => {
      const el = document.getElementById('tab-' + id);
      return el && !el.classList.contains('hidden') ? el.innerText.trim().length : -1;
    }, t);
    assert.ok(len > 100, `secção ${t} vazia ou escondida (${len})`);
  }
}

test('abre sem erros e todas as secções têm conteúdo', async () => {
  const { ctx, page, errors } = await open(base);
  await checkAllTabs(page);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('oráculos: Ogham, Runas e Tarot tiram cartas', async () => {
  const { ctx, page, errors } = await open(base);
  await page.evaluate(() => { switchTab('oracle'); drawOghamCard(3); });
  await page.waitForFunction(() => document.getElementById('ogham-card').innerText.length > 30);
  await page.evaluate(() => { switchTab('runes'); drawRunes(3); });
  await page.waitForFunction(() => document.getElementById('rune-card').innerText.length > 30);
  await page.evaluate(() => { switchTab('tarot'); drawTarotCard(3); });
  await page.waitForFunction(() => document.querySelectorAll('#tarot-card-container .tarot-flip-wrapper, #tarot-card-container > *').length >= 1);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('ciclo lunar mostra a fase de hoje e o mapa do mês', async () => {
  const { ctx, page, errors } = await open(base);
  await page.evaluate(() => switchTab('astro'));
  const name = await page.textContent('#moon-phase-name');
  assert.match(name, /Lua|Quarto|Gibosa/);
  const days = await page.$$eval('#lunar-month-map > *', els => els.length);
  assert.ok(days >= 28, `mapa lunar com ${days} células`);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('estudo do Ogham: escrever em Ogham, saber antigo e treino', async () => {
  const { ctx, page, errors } = await open(base);
  await page.evaluate(() => switchTab('herbal'));
  assert.equal(await page.evaluate(() => toOgham('Beith')), '᚛ᚁᚓᚔᚈᚆ᚜');
  assert.equal(await page.evaluate(() => toOgham('Ana Luísa')), '᚛ᚐᚅᚐ ᚂᚗᚄᚐ᚜');
  assert.equal(await page.evaluate(() => toOgham('Ana Luísa', { useForfeda: false })), '᚛ᚐᚅᚐ ᚂᚒᚔᚄᚐ᚜');
  await page.fill('#ogham-write-input', 'Coll');
  assert.equal(await page.textContent('#ogham-write-out'), '᚛ᚉᚑᚂᚂ᚜');
  const lore = await page.$$eval('#tree-list .ogham-lore', els => els.length);
  assert.equal(lore, 20, 'cada letra deve ter o nome antigo e o Bríatharogam');
  await page.click('#ogham-quiz-options button');
  assert.match(await page.textContent('#ogham-quiz-score'), /Acertos: \d de 1/);
  await page.click('#ogham-quiz-next');
  assert.equal(await page.$$eval('#ogham-quiz-options button:not([disabled])', b => b.length), 4);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('meditação guiada corre do início ao fim', async () => {
  const { ctx, page, errors } = await open(base);
  await page.evaluate(() => switchTab('grounding'));
  assert.equal(await page.$$eval('#gm-list .gm-item', b => b.length), 5);
  await page.evaluate(() => { window.__medSpeed = 0.002; GuidedMeditations.state.voiceOn = false; });
  await page.click('#gm-list .gm-item[data-id="awen"]');
  await page.click('#gm-play');
  assert.equal(await page.textContent('#gm-play'), 'Pausar');
  await page.click('#gm-play');
  assert.equal(await page.textContent('#gm-play'), 'Continuar');
  await page.click('#gm-play');
  await page.waitForFunction(() => document.getElementById('gm-progress-label').textContent === 'Concluída', null, { timeout: 15000 });
  assert.match(await page.textContent('#gm-count'), /Meditações concluídas: 1/);
  assert.equal(await page.textContent('#gm-play'), 'Iniciar');
  // A letra do dia tem passos gerados a partir dos dados do Ogham
  const steps = await page.evaluate(() => GuidedMeditations.list.find(m => m.id === 'ogham-dia').build().length);
  assert.ok(steps >= 8);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('app instalável e funciona sem rede', async () => {
  const context = await browser.newContext({ locale: 'pt-PT', timezoneId: 'Europe/Lisbon' });
  const { page, errors } = await open(base, { context });
  const manifest = await page.evaluate(async () => {
    const href = document.querySelector('link[rel="manifest"]').href;
    return (await fetch(href)).json();
  });
  assert.equal(manifest.display, 'standalone');
  const active = await page.evaluate(async () => (await window.appOfflineReady)?.active?.state);
  assert.equal(active, 'activated');
  await page.reload({ waitUntil: 'load' });
  assert.ok(await page.evaluate(() => !!navigator.serviceWorker.controller), 'o service worker não controla a página');
  await page.evaluate(() => switchTab('about'));
  assert.match(await page.textContent('#app-offline-status'), /Pronto para usar offline/);

  await context.setOffline(true);
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => typeof window.switchTab === 'function');
  await checkAllTabs(page);
  await page.evaluate(() => { switchTab('oracle'); drawOghamCard(1); });
  assert.ok((await page.textContent('#ogham-card')).length > 10);
  assert.deepEqual(errors, []);
  await context.close();
});

test('HTML único funciona aberto a partir de um ficheiro', async () => {
  const out = join(mkdtempSync(join(tmpdir(), 'druid-')), 'caminho-druidico.html');
  execFileSync(process.execPath, [join(root, 'tools/build-single.mjs'), out]);
  const { ctx, page, errors } = await open(pathToFileURL(out).href);
  await checkAllTabs(page);
  assert.equal(await page.evaluate(() => toOgham('Duir')), '᚛ᚇᚗᚏ᚜');
  assert.deepEqual(errors, []);
  await ctx.close();
});
