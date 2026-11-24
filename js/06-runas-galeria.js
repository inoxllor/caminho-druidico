/* ============================================================
   RUNAS ELDER FUTHARK: Galeria completa (24), filtros por Aett e pesquisa
   ============================================================ */
const RUNES_EXTENDED = [
    { symbol: "ᚠ", name: "Fehu", aett: "Freyr", symmetric: false, meaning: "Prosperidade, energia vital, abundância em movimento e novos recursos.", reversed: "Perda material, estagnação de recursos, ganância ou dispersão de energia." },
    { symbol: "ᚢ", name: "Uruz", aett: "Freyr", symmetric: false, meaning: "Força primordial, saúde física, coragem indomável e vitalidade.", reversed: "Fraqueza passageira, oportunidade desperdiçada ou força mal direcionada." },
    { symbol: "ᚦ", name: "Thurisaz", aett: "Freyr", symmetric: false, meaning: "Proteção ativa, defesa, superação de obstáculos e despertar.", reversed: "Vulnerabilidade, reatividade impulsiva ou perigo de decisões precipitadas." },
    { symbol: "ᚨ", name: "Ansuz", aett: "Freyr", symmetric: false, meaning: "Sabedoria divina, inspiração poética (Awen), comunicação e sinais.", reversed: "Mal-entendidos, bloqueio na expressão, ilusão ou conselhos enganadores." },
    { symbol: "ᚱ", name: "Raidho", aett: "Freyr", symmetric: false, meaning: "Jornada espiritual, movimento certo, ritmo cósmico e evolução.", reversed: "Atrasos no caminho, desorientação, rigidez ou interrupção de planos." },
    { symbol: "ᚲ", name: "Kenaz", aett: "Freyr", symmetric: false, meaning: "Tocha interior, criatividade, iluminação técnica e clareza.", reversed: "Falta de clareza, criatividade apagada, isolamento ou perda de foco." },
    { symbol: "ᚷ", name: "Gebo", aett: "Freyr", symmetric: true, meaning: "Troca sagrada, parceria equilibrada, generosidade e união.", reversed: "Sombra (simétrica): desequilíbrio entre dar e receber, dívida emocional ou dependência." },
    { symbol: "ᚹ", name: "Wunjo", aett: "Freyr", symmetric: false, meaning: "Alegria harmónica, realização, paz interior e fraternidade.", reversed: "Desarmonia, tristeza passageira, alienação ou atraso na celebração." },
    { symbol: "ᚺ", name: "Hagalaz", aett: "Heimdall", symmetric: true, meaning: "Ruptura purificadora, mudança inevitável e libertação de padrões.", reversed: "Sombra (simétrica): resistência dolorosa à mudança, crise súbita ou caos." },
    { symbol: "ᚾ", name: "Nauthiz", aett: "Heimdall", symmetric: false, meaning: "Necessidade, resiliência na adversidade e fogo interior.", reversed: "Privação extrema, impaciência, autolimitação ou desespero." },
    { symbol: "ᛁ", name: "Isa", aett: "Heimdall", symmetric: true, meaning: "Quietude, pausa contemplativa, concentração e clareza cristalina.", reversed: "Sombra (simétrica): estagnação emocional, frieza, teimosia ou paralisia." },
    { symbol: "ᛃ", name: "Jera", aett: "Heimdall", symmetric: true, meaning: "Colheita justa, ciclos naturais do tempo e recompensa pelo esforço.", reversed: "Sombra (simétrica): impaciência com os ciclos naturais ou repetição de erros." },
    { symbol: "ᛇ", name: "Eihwaz", aett: "Heimdall", symmetric: true, meaning: "Teixo sagrado, eixo entre mundos, resistência e proteção profunda.", reversed: "Sombra (simétrica): medo da transformação, insegurança ou confusão de propósito." },
    { symbol: "ᛈ", name: "Perthro", aett: "Heimdall", symmetric: false, meaning: "Mistério do destino (Wyrd), intuição, sincronicidade e revelação.", reversed: "Segredos ocultos, desilusão, resistência ao desconhecido ou estagnação." },
    { symbol: "ᛉ", name: "Algiz", aett: "Heimdall", symmetric: false, meaning: "Proteção espiritual elevada, conexão com o sagrado e alerta.", reversed: "Vulnerabilidade energética, descuido ou desconexão da intuição." },
    { symbol: "ᛊ", name: "Sowilo", aett: "Heimdall", symmetric: true, meaning: "Sol vitorioso, força vital, clareza absoluta e sucesso.", reversed: "Sombra (simétrica): excesso de ego, exaustão por excesso de ação ou cegueira." },
    { symbol: "ᛏ", name: "Tiwaz", aett: "Tyr", symmetric: false, meaning: "Justiça, honra, sacrifício nobre e liderança íntegra.", reversed: "Injustiça, desmotivação, conflito mal resolvido ou falta de coragem." },
    { symbol: "ᛒ", name: "Berkano", aett: "Tyr", symmetric: false, meaning: "Nascimento, fertilidade, nutrição maternal e crescimento suave.", reversed: "Bloqueio criativo, tensões familiares ou dificuldade em iniciar algo novo." },
    { symbol: "ᛖ", name: "Ehwaz", aett: "Tyr", symmetric: false, meaning: "Avanço conjunto, confiança mútua, lealdade e progresso.", reversed: "Desconfiança, falta de sintonia em parcerias ou desejo de fuga." },
    { symbol: "ᛗ", name: "Mannaz", aett: "Tyr", symmetric: false, meaning: "Humanidade, autoconhecimento, mente consciente e comunidade.", reversed: "Isolamento social, egoísmo, autocrítica excessiva ou desconexão." },
    { symbol: "ᛚ", name: "Laguz", aett: "Tyr", symmetric: false, meaning: "Águas profundas da intuição, sonhos, fluidez e cura emocional.", reversed: "Confusão emocional, medo do subconsciente ou bloqueio intuitivo." },
    { symbol: "ᛜ", name: "Ingwaz", aett: "Tyr", symmetric: true, meaning: "Semente latente, paz interior, gestação de novos projetos.", reversed: "Sombra (simétrica): dispersão de energia antes da conclusão ou ansiedade." },
    { symbol: "ᛞ", name: "Dagaz", aett: "Tyr", symmetric: true, meaning: "Amanhecer, despertar súbito, transformação luminosa e equilíbrio.", reversed: "Sombra (simétrica): dificuldade em encerrar um ciclo ou medo da mudança." },
    { symbol: "ᛟ", name: "Othala", aett: "Tyr", symmetric: false, meaning: "Herança ancestral, lar espiritual, raízes e sabedoria herdada.", reversed: "Conflitos familiares, apego excessivo ao passado ou sensação de desenraizamento." }
];

let activeRuneMode = 'draw';
let activeRuneAett = 'all';
let runeQuery = '';

function initRuneFilters() {
    const container = document.getElementById('rune-filters');
    if (!container || container.children.length > 0) return;
    const filters = [
        { id: 'all', label: 'Todas (24)' },
        { id: 'Freyr', label: 'Aett de Freyr (8)' },
        { id: 'Heimdall', label: 'Aett de Heimdall (8)' },
        { id: 'Tyr', label: 'Aett de Tyr (8)' }
    ];
    container.innerHTML = filters.map(f => `
        <button type="button" onclick="setRuneAett('${f.id}')" id="rune-aett-${f.id}"
            class="${f.id === activeRuneAett ? 'bg-[var(--btn-primary)] text-[var(--on-primary)]' : 'theme-inner theme-muted border border-[var(--border-color)]'} text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer">
            ${f.label}
        </button>
    `).join('');
}

function setRuneAett(aett) {
    activeRuneAett = aett;
    ['all', 'Freyr', 'Heimdall', 'Tyr'].forEach(id => {
        const btn = document.getElementById(`rune-aett-${id}`);
        if (!btn) return;
        btn.className = id === aett
            ? 'bg-[var(--btn-primary)] text-[var(--on-primary)] text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer'
            : 'theme-inner theme-muted border border-[var(--border-color)] text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer';
    });
    renderRuneGallery();
}

function setRuneQuery(q) {
    runeQuery = q || '';
    renderRuneGallery();
}

function renderRuneGallery() {
    initRuneFilters();
    const grid = document.getElementById('rune-gallery-grid');
    const countEl = document.getElementById('rune-gallery-count');
    if (!grid) return;

    const q = runeQuery.trim().toLowerCase();
    const filtered = RUNES_EXTENDED.filter(r => {
        const matchAett = activeRuneAett === 'all' || r.aett === activeRuneAett;
        const matchText = q.length < 2 || `${r.name} ${r.aett} ${r.meaning} ${r.reversed}`.toLowerCase().includes(q);
        return matchAett && matchText;
    });

    if (countEl) countEl.textContent = `A mostrar ${filtered.length} de 24 runas`;

    grid.innerHTML = filtered.map(r => `
        <div class="theme-inner border rounded-xl p-4 space-y-2.5 flex flex-col justify-between">
            <div>
                <div class="flex items-center justify-between gap-2">
                    <span class="text-4xl theme-glyph font-bold leading-none">${r.symbol}</span>
                    <span class="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-md theme-card border theme-muted">Aett de ${r.aett}</span>
                </div>
                <h3 class="font-cinzel text-base font-bold theme-info-hl mt-2">${r.name}</h3>
                <p class="text-sm theme-muted leading-relaxed mt-1"><strong class="theme-title">Direita:</strong> ${r.meaning}</p>
            </div>
            <p class="text-xs theme-muted leading-relaxed pt-2 border-t border-[var(--border-color)]">
                <strong class="${r.symmetric ? 'theme-accent' : 'c-earth'}">${r.symmetric ? 'Simétrica:' : 'Invertida:'}</strong> ${r.reversed.replace(/^Sombra \(simétrica\):\s*/i, '')}
            </p>
        </div>
    `).join('');
}

/* A galeria vive agora no Saber (Runas: guia & treino); no oráculo fica só a tiragem. */
function switchRuneMode(mode) {
    if (mode === 'gallery') { switchTab('runelore'); return; }
    activeRuneMode = 'draw';
    const cardEl = document.getElementById('rune-card');
    const actionsEl = document.getElementById('rune-draw-actions');
    if (cardEl) cardEl.classList.remove('hidden');
    if (actionsEl) actionsEl.classList.remove('hidden');
}
