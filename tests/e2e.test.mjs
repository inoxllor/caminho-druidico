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
const TABS = ['today', 'oracle', 'runes', 'tarot', 'astro', 'wheel', 'treewheel', 'compass', 'altar', 'ritual', 'grove',
  'journal', 'grounding', 'herbal', 'runelore', 'library', 'obod', 'triads', 'orgs', 'about'];
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
  // Apresentação: varas de Ogham, pedras rúnicas, disposição em cruz e resposta Sim/Não
  await page.evaluate(() => { switchTab('oracle'); drawOghamCard(5); });
  assert.equal(await page.$$eval('#ogham-card .oc-card .oc-stave', e => e.length), 5);
  assert.equal(await page.$$eval('#ogham-card .oc-cross', e => e.length), 1);
  await page.evaluate(() => { switchTab('runes'); drawRunes(3); });
  assert.equal(await page.$$eval('#rune-card .oc-card .oc-stone', e => e.length), 3);
  assert.ok(await page.isVisible('#rune-save-bar'), 'ações da leitura de runas escondidas');
  // Runas invertidas: Fehu (não simétrica) sai invertida; Gebo (simétrica) nunca
  const rev = await page.evaluate(() => {
    const fehu = RUNES_DATA.find(r => r.name === 'Fehu'), gebo = RUNES_DATA.find(r => r.name === 'Gebo');
    const a = castRune(fehu, 1), b = castRune(gebo, 1);
    renderOracleReading('runes', [a, b], ['A', 'B']);
    return { a, b, chips: [...document.querySelectorAll('#rune-card .oc-chip-rev')].length, turned: document.querySelectorAll('#rune-card .oc-stone.is-reversed').length };
  });
  assert.equal(rev.a.reversed, true);
  assert.equal(rev.a.name, 'Fehu (invertida)');
  assert.notEqual(rev.a.meaning, rev.a.upright);
  assert.equal(rev.b.reversed, false, 'runa simétrica não pode sair invertida');
  assert.equal(rev.chips, 1);
  assert.equal(rev.turned, 1);
  for (const sys of ['ogham', 'runes', 'tarot']) {
    await page.evaluate(s => { switchTab(s === 'ogham' ? 'oracle' : s); drawYesNo(s); }, sys);
    const sel = sys === 'ogham' ? '#ogham-card' : sys === 'runes' ? '#rune-card' : '#tarot-card-container';
    assert.match(await page.textContent(`${sel} .oc-answer b`), /^(Sim|Não)$/);
  }
  assert.equal(await page.$$eval('#tab-oracle .spread-card', e => e.length), 4);
  assert.equal(await page.$$eval('#tab-runes .spread-card', e => e.length), 3);
  assert.equal(await page.$$eval('#tab-tarot .spread-card', e => e.length), 4);
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

test('design global: portais, reinos, Hoje e mapa lunar compacto', async () => {
  const { ctx, page, errors } = await open(base);
  // Contador de dias escondido a zero
  assert.equal(await page.evaluate(() => document.getElementById('streak-badge').hidden), true);
  // Quatro portais com página de entrada e cartões que levam às secções
  for (const [r, n] of [['oraculos', 3], ['ciclos', 4], ['pratica', 4], ['saber', 5]]) {
    await page.evaluate(id => switchTab(id), 'portal-' + r);
    assert.equal(await page.evaluate(() => document.body.dataset.realm), r);
    assert.equal(await page.$$eval(`#tab-portal-${r}:not(.hidden) .portal-card`, els => els.length), n);
  }
  await page.evaluate(() => switchTab('portal-oraculos'));
  await page.click('#tab-portal-oraculos .portal-card:nth-child(2)');
  assert.equal(await page.evaluate(() => document.body.dataset.tab), 'runes');
  assert.equal(await page.evaluate(() => document.body.dataset.realm), 'oraculos');
  // Cabeçalho comum nas secções que não são oráculos
  await page.evaluate(() => switchTab('triads'));
  assert.equal(await page.textContent('#tab-triads .sec-eyebrow'), 'Saber');
  // Mapa lunar: células baixas e fases principais assinaladas
  await page.evaluate(() => switchTab('astro'));
  const h = await page.$eval('#lunar-month-map .lunar-day:not(.is-empty)', el => el.getBoundingClientRect().height);
  assert.ok(h <= 60, `célula do mapa lunar com ${h}px`);
  assert.ok(await page.$$eval('#lunar-month-map .ld-ev', els => els.length) >= 3);
  // Fases desenhadas em SVG (iguais em todos os aparelhos); a Cheia fica toda iluminada
  assert.ok(await page.$$eval('#lunar-month-map .lunar-day .moon-svg', els => els.length) >= 28);
  assert.equal(await page.evaluate(() => document.createRange().createContextualFragment(moonSVG(0.5)).querySelectorAll('circle.moon-lit').length), 1);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('runas no Saber: guia completo e treino', async () => {
  const { ctx, page, errors } = await open(base);
  await page.evaluate(() => switchTab('runes'));
  await page.click('#rune-mode-gallery');
  assert.equal(await page.evaluate(() => document.body.dataset.tab), 'runelore');
  assert.equal(await page.evaluate(() => document.body.dataset.realm), 'saber');
  assert.equal(await page.$$eval('#rune-gallery-grid .rl-card', els => els.length), 24);
  await page.fill('#rune-search', 'teixo');
  assert.equal(await page.$$eval('#rune-gallery-grid .rl-card', els => els.length), 1);
  for (const mode of ['glyph', 'name', 'meaning']) {
    await page.click(`#rune-study .rq-mode[data-mode="${mode}"]`);
    assert.equal(await page.$$eval('#rune-quiz-options button', els => els.length), 4);
    await page.click('#rune-quiz-options button >> nth=0');
    assert.match(await page.textContent('#rune-quiz-feedback'), /Certo|Era/);
  }
  assert.match(await page.textContent('#rune-quiz-score'), /de 3/);
  assert.deepEqual(errors, []);
  await ctx.close();
});

test('renovação: Hoje com cartão principal, roda das árvores, pesquisa, Mais e ficha partilhável', async () => {
  const { ctx, page, errors } = await open(base);
  // Hoje: cartão principal com a árvore do mês, a Lua e a próxima festa
  await page.waitForSelector('#today-feature .tf-card');
  const tree = await page.evaluate(() => getCelticTree(new Date()).name);
  assert.match(await page.textContent('#today-feature .tf-title'), new RegExp(tree));
  assert.equal(await page.$$eval('#today-feature .tf-stat', els => els.length), 2);
  // Roda das árvores: 13 meses, o atual em destaque, Luas Cheias, abrir uma árvore
  await page.evaluate(() => switchTab('treewheel'));
  assert.equal(await page.$$eval('#tree-wheel .tw-seg', els => els.length), 13);
  assert.equal(await page.$eval('#tree-wheel .tw-seg.is-current', el => el.dataset.tree), tree);
  assert.ok(await page.$$eval('#tree-wheel .tw-full', els => els.length) >= 12);
  await page.click('#tree-wheel .tw-seg[data-tree="Duir"]');
  assert.match(await page.textContent('#tw-detail .tw-title'), /Duir/);
  // Ficha como imagem
  const size = await page.evaluate(async () => { const c = await __treeCardImage('Duir'); return [c.width, c.height]; });
  assert.deepEqual(size, [1080, 1350]);
  // Pesquisa global
  await page.keyboard.press('/');
  await page.fill('#search-input', 'valeriana');
  await page.waitForSelector('.sd-item');
  assert.ok(await page.$$eval('.sd-item', els => els.length) >= 1);
  await page.fill('#search-input', 'fehu');
  await page.waitForFunction(() => document.querySelector('.sd-item .sd-title')?.textContent === 'Fehu');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.body.dataset.tab === 'runelore');
  // Mais: os quatro portais
  assert.equal(await page.$$eval('#more-sheet .realm-tile', els => els.length), 4);
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
  const plates = await page.$$eval('#tree-list .bot-plate img', els => els.length);
  assert.equal(plates, 20, 'cada árvore deve ter a sua gravura');
  const uses = await page.$$eval('#tree-list .bot-use', els => els.map(e => ({ art: !!e.querySelector('img, svg'), txt: e.querySelector('.bot-use-txt p')?.textContent || '' })));
  assert.equal(uses.length, 39, 'cada erva deve aparecer com a sua indicação');
  for (const u of uses) { assert.ok(u.art, 'erva sem ilustração'); assert.ok(u.txt.length > 20, 'erva sem indicação de fitoterapia'); }
  await page.locator('#tree-list .bot-plate-btn').first().scrollIntoViewIfNeeded();
  await page.waitForFunction(() => { const i = document.querySelector('#tree-list .bot-plate img'); return i && i.complete && i.naturalWidth > 0; });
  await page.click('#tree-list .bot-plate-btn');
  // A imagem ampliada só tem altura depois de descodificada: esperar por ela em vez de verificar logo a seguir ao clique.
  await page.waitForSelector('dialog.bot-zoom[open] img', { state: 'visible', timeout: 5000 }).catch(() => null);
  assert.ok(await page.isVisible('dialog.bot-zoom img'), 'a gravura deve abrir ampliada');
  await page.click('dialog.bot-zoom [data-close]');
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
  // «ready» resolve quando já há um worker ativo, que pode ainda estar em «activating»
  await page.evaluate(async () => {
    const reg = await window.appOfflineReady;
    const sw = reg && reg.active;
    if (!sw) throw new Error('sem service worker ativo');
    if (sw.state !== 'activated') await new Promise(r => sw.addEventListener('statechange', () => sw.state === 'activated' && r()));
  });
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
