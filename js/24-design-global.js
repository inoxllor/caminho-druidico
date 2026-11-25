/* ============================================================
   Design global: cada secção pertence a um «reino» (Oráculos,
   Ciclos, Prática, Saber, Comunidade) com cor própria; cabeçalho
   comum nas secções; quatro portais com página de entrada; o
   ecrã Hoje esconde o contador a zero e a repetição da barra do topo.
   ============================================================ */
(() => {
const $ = id => document.getElementById(id);
const escH = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const PORTALS = {
  oraculos: {
    label: 'Oráculos', sigil: 'ᚁ ᚠ ✦', eyebrow: 'Ler os sinais',
    intro: 'Três maneiras de fazer uma pergunta ao invisível: as varas das árvores, as pedras gravadas e as cartas dos deuses do Norte.',
    items: [
      ['oracle', 'ogham', 'Ogham', 'As 20 letras das árvores sagradas celtas. Conselho ligado à natureza e às estações.'],
      ['runes', 'runes', 'Runas', 'O Futhark antigo em pedras gravadas. Forças e desafios em jogo, direitas ou invertidas.'],
      ['tarot', 'tarot', 'Tarot nórdico', '78 cartas com deuses e mundos da mitologia nórdica, com o ritual de baralhar.']
    ]
  },
  ciclos: {
    label: 'Ciclos', sigil: '☽ ◯ ☾', eyebrow: 'O tempo que gira',
    intro: 'A Lua, o Sol, a Roda do Ano e as luas das árvores: os ritmos que marcam a prática, calculados para o lugar onde está.',
    items: [
      ['astro', 'astro', 'Astronomia', 'Fase da Lua, nascer e pôr do Sol, mapa lunar do mês, solstícios e equinócios.'],
      ['wheel', 'wheel', 'Roda do Ano', 'As oito festas celtas, a próxima celebração e o que preparar.'],
      ['treewheel', 'treewheel', 'Roda das árvores', 'As 13 luas do calendário arbóreo celta, com o mês atual e as Luas Cheias do ano.'],
      ['compass', 'compass', 'Bússola', 'Os quatro quadrantes e os seus elementos, para orientar o círculo.']
    ]
  },
  pratica: {
    label: 'Prática', sigil: '🜂 🜄 🜁 🜃', eyebrow: 'O caminho no dia a dia',
    intro: 'O altar, os rituais, o diário e o silêncio: as ferramentas para trazer o caminho para a vida de todos os dias.',
    items: [
      ['altar', 'altar', 'Altar', 'Disponha os quatro elementos e acenda a chama da intenção.'],
      ['ritual', 'ritual', 'Liturgia & rituais', 'Modelos de ritual para as festas da Roda, que pode adaptar e exportar.'],
      ['journal', 'journal', 'Diário', 'Reflexões, sonhos e poesia bárdica, guardados só neste dispositivo.'],
      ['grounding', 'sound', 'Meditação & som', 'Meditações guiadas com voz, respiração, sons da natureza e canto do Awen.']
    ]
  },
  saber: {
    label: 'Saber', sigil: '⟁ ✧ ⟁', eyebrow: 'A tradição',
    intro: 'O conhecimento das árvores, das tríades e dos símbolos, e os graus da Ordem dos Bardos, Ovates e Druidas.',
    items: [
      ['herbal', 'herbal', 'Árvores & ervas', 'O guia das 20 letras Ogham, o estudo das letras e escrever em Ogham.'],
      ['runelore', 'runes', 'Runas', 'O guia das 24 runas do Futhark antigo, com som, nome e sentido, e o treino para as decorar.'],
      ['triads', 'triads', 'Tríades', 'A sabedoria dos bardos galeses em grupos de três.'],
      ['library', 'library', 'Biblioteca', 'Símbolos, deuses e conceitos da tradição, num só lugar.'],
      ['obod', 'obod', 'Graus OBOD', 'Bardo, Ovate e Druida: o percurso dos três graus.']
    ]
  }
};
const REALM_OF = { today: 'hoje', orgs: 'comunidade', grove: 'comunidade', about: 'comunidade' };
Object.entries(PORTALS).forEach(([r, p]) => { REALM_OF['portal-' + r] = r; p.items.forEach(([t]) => { REALM_OF[t] = r; }); });
const REALM_LABEL = { hoje: 'Hoje', oraculos: 'Oráculos', ciclos: 'Ciclos', pratica: 'Prática', saber: 'Saber', comunidade: 'Comunidade' };

/* ——— Páginas de entrada dos portais ——— */
function buildPortals() {
  const main = $('main');
  if (!main) return;
  Object.entries(PORTALS).forEach(([r, p]) => {
    if ($('tab-portal-' + r)) return;
    const sec = document.createElement('section');
    sec.id = 'tab-portal-' + r;
    sec.className = 'tab-content hidden space-y-6 portal-page';
    sec.innerHTML = `
      <div class="theme-card border rounded-2xl portal-hero text-center">
        <div class="oracle-sigil" aria-hidden="true">${p.sigil}</div>
        <p class="eyebrow">${escH(p.eyebrow)}</p>
        <h2 class="font-cinzel text-2xl lg:text-3xl font-bold theme-title">${escH(p.label)}</h2>
        <p class="oracle-sub">${escH(p.intro)}</p>
      </div>
      <div class="portal-grid">
        ${p.items.map(([tab, icon, name, desc]) => `
          <button type="button" class="portal-card" onclick="switchTab('${tab}')">
            <span class="pc-ic" aria-hidden="true"><svg class="ic"><use href="#i-${icon}"></use></svg></span>
            <span class="pc-name font-cinzel">${escH(name)}</span>
            <span class="pc-desc">${escH(desc)}</span>
            <span class="pc-go" aria-hidden="true">Entrar →</span>
          </button>`).join('')}
      </div>`;
    main.appendChild(sec);
  });
}

/* ——— Reino de cada secção e cabeçalho comum ——— */
function decorateSections() {
  document.querySelectorAll('section.tab-content[id^="tab-"]').forEach(sec => {
    const id = sec.id.slice(4);
    const realm = REALM_OF[id];
    if (!realm) return;
    sec.classList.add('realm-' + realm);
    if (id === 'today' || sec.classList.contains('portal-page')) return;
    const visible = el => !el.closest('.hidden:not(.tab-content)');
    const lead = [...sec.querySelectorAll(':scope > .theme-card, :scope > div > .theme-card, :scope > .grid > .theme-card')].find(visible);
    if (lead) lead.classList.add('sec-lead');
    if (sec.querySelector('.oracle-head')) return;
    const h2 = [...sec.querySelectorAll('h2')].find(visible);
    if (!h2 || h2.classList.contains('sec-title')) return;
    h2.classList.add('sec-title');
    const box = h2.parentElement;
    const hasEyebrow = [...box.children].some(c => c !== h2 && c.classList.contains('eyebrow') && (c.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING));
    if (!hasEyebrow) {
      const eb = document.createElement('p');
      eb.className = 'eyebrow sec-eyebrow';
      eb.textContent = REALM_LABEL[realm];
      box.insertBefore(eb, h2);
      if (getComputedStyle(h2).textAlign === 'center') eb.classList.add('is-centered');
    }
  });
}

/* ——— Navegação: reino ativo e página atual no <body> ——— */
const prevSwitch = window.switchTab;
window.switchTab = function (id) {
  const r = prevSwitch.apply(this, arguments);
  applyNavState(id);
  return r;
};
function applyNavState(id) {
  const realm = REALM_OF[id] || 'hoje';
  document.body.dataset.tab = id;
  document.body.dataset.realm = realm;
  document.querySelectorAll('.nav-portal').forEach(b => b.classList.toggle('realm-on', b.dataset.realm === realm));
  if (String(id).startsWith('portal-')) { try { scrollTo({ top: 0 }); } catch (e) { /* nada */ } }
}

/* ——— Contador de dias: só aparece a partir de 1 ——— */
function watchStreak() {
  const label = $('streak-label'), badge = $('streak-badge');
  if (!label || !badge) return;
  const upd = () => { badge.hidden = /^\s*0\b/.test(label.textContent || '0'); };
  upd();
  new MutationObserver(upd).observe(label, { childList: true, characterData: true, subtree: true });
}

/* ——— Barra do topo: marcar a zona de informação (escondida no Hoje) ——— */
function markTopInfo() {
  const t = $('top-moon-text');
  const box = t && t.closest('.gap-6');
  if (box) box.classList.add('top-info');
}

window.DruidRealms = { PORTALS, REALM_OF };
const init = () => {
  buildPortals(); decorateSections(); watchStreak(); markTopInfo();
  const cur = [...document.querySelectorAll('.tab-content')].find(s => !s.classList.contains('hidden'));
  applyNavState(cur ? cur.id.slice(4) : 'today');
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
