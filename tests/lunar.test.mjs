// Testes do motor lunar (js/01-lunar-calc.js) contra efemérides publicadas
// (fases da Lua do USNO / timeanddate.com, em UTC).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

process.env.TZ = 'Europe/Lisbon';
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(readFileSync(new URL('../js/01-lunar-calc.js', import.meta.url), 'utf8'), ctx);
const L = ctx.window.LunarCalc;
const MIN = 60e3;

// tipo: 0 Lua Nova, 1 Quarto Crescente, 2 Lua Cheia, 3 Quarto Minguante
const REFERENCE = [
  [2, '2024-01-25T17:54Z'],
  [0, '2024-04-08T18:21Z'], // eclipse solar total
  [2, '2025-03-14T06:55Z'], // eclipse lunar total
  [3, '2025-03-22T11:29Z'],
  [0, '2025-03-29T10:58Z'],
  [2, '2025-09-07T18:09Z'],
  [2, '2026-03-03T11:38Z']
];

test('fases principais com erro inferior a 3 minutos', () => {
  for (const [type, iso] of REFERENCE) {
    const t = Date.parse(iso);
    const ev = L.events(t - 2 * 864e5, t + 2 * 864e5).find(e => e.type === type);
    assert.ok(ev, `sem fase ${type} perto de ${iso}`);
    const err = Math.abs(ev.t - t) / MIN;
    assert.ok(err < 3, `${iso}: erro de ${err.toFixed(1)} min`);
  }
});

test('há sempre 4 fases principais por ciclo, por ordem', () => {
  const from = Date.parse('2026-01-01T00:00Z'), to = Date.parse('2026-12-31T23:59Z');
  const ev = L.events(from, to);
  assert.ok(ev.length >= 48 && ev.length <= 50, `foram ${ev.length} fases em 2026`);
  for (let i = 1; i < ev.length; i++) {
    assert.ok(ev[i].t > ev[i - 1].t, 'fases fora de ordem');
    assert.equal(ev[i].type, (ev[i - 1].type + 1) % 4, 'sequência de fases quebrada');
    const gap = (ev[i].t - ev[i - 1].t) / 864e5;
    assert.ok(gap > 6 && gap < 8.6, `intervalo estranho de ${gap.toFixed(2)} dias`);
  }
});

test('iluminação: ~100% na Lua Cheia e ~0% na Lua Nova', () => {
  const full = L.geometry(Date.parse('2025-03-14T06:55Z'));
  const nova = L.geometry(Date.parse('2025-03-29T10:58Z'));
  assert.ok(full.illum > 0.99, `cheia: ${full.illum}`);
  assert.ok(nova.illum < 0.01, `nova: ${nova.illum}`);
});

test('dia da Lua Cheia marcado no calendário (hora de Lisboa)', () => {
  const d = L.dayPhase(2025, 2, 14);
  assert.equal(d.idx, 4);
  assert.equal(L.NAMES[d.idx], 'Lua Cheia');
  const between = L.dayPhase(2025, 2, 18);
  assert.equal(between.idx, 5, 'entre a Cheia e o Quarto Minguante é Gibosa Minguante');
});

test('estado: idade da Lua e próximas fases coerentes', () => {
  const s = L.state(new Date('2025-03-20T12:00Z'));
  assert.ok(s.age > 20 && s.age < 22, `idade ${s.age}`);
  assert.ok(s.nextNew > new Date('2025-03-20T12:00Z'));
  assert.equal(new Date(s.nextNew).toISOString().slice(0, 10), '2025-03-29');
});

test('a Lua de um dia é a mesma em todo o site (dayFrac e moonSVG)', () => {
  // Dia de Lua Cheia: desenho exato da Cheia, de manhã ou à noite
  assert.equal(L.dayFrac(new Date(2026, 2, 3, 9)), 0.5);
  assert.equal(L.dayFrac(new Date(2026, 2, 3, 23)), 0.5);
  // Num dia sem evento, a hora não muda o desenho
  const a = L.dayFrac(new Date(2026, 10, 27, 0, 5)), b = L.dayFrac(new Date(2026, 10, 27, 23, 55));
  assert.equal(a, b);
  assert.ok(a > 0.5 && a < 0.75, '27/11/2026 é Gibosa Minguante');
  const svg = ctx.window.moonSVG(0.5, 20);
  assert.match(svg, /class="moon-lit"/);
  assert.equal(ctx.window.moonDaySVG(new Date(2026, 10, 27, 8), 20), ctx.window.moonSVG(a, 20));
});
