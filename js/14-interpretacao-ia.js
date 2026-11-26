/* ============================================================
   Interpretação híbrida: local + API opcional (OpenAI-compatible)
   ============================================================ */
(() => {
  const $ = id => document.getElementById(id);
  const esc = window.esc || (s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  let lastInterpretationText = '';

  const CFG_KEY = 'druid_ai_config';
  function getAIConfig() {
    try { return JSON.parse(localStorage.getItem(CFG_KEY) || '{}'); } catch { return {}; }
  }
  function setAIConfig(c) {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(c)); } catch {}
  }

  function collectReading(type) {
    const q = ($('tarot-question') && type === 'tarot') ? $('tarot-question').value.trim() : '';
    if (type === 'runes' && typeof lastRuneReading !== 'undefined' && lastRuneReading?.length) {
      const S = window.lastRuneSpreadInfo;
      return {
        type: 'runes',
        question: q,
        spread: S ? S.name : '',
        guide: S ? S.how : '',
        items: lastRuneReading.map((r, i) => ({
          pos: r.pos || ['Conselho', 'Passado', 'Presente', 'Futuro'][i] || `Posição ${i + 1}`,
          hint: r.hint || '',
          label: `${r.symbol} ${r.name}`,
          text: r.meaning + ((window.RUNE_MESSAGES || {})[r.baseName || r.name] ? ` Mensagem: ${window.RUNE_MESSAGES[r.baseName || r.name]}` : '')
        }))
      };
    }
    if (type === 'ogham' && typeof lastOghamReading !== 'undefined' && lastOghamReading?.length) {
      return {
        type: 'ogham',
        question: q,
        items: lastOghamReading.map((o, i) => ({
          pos: ['Conselho', 'Tríade 1', 'Tríade 2', 'Tríade 3', 'Roda'][i] || `Letra ${i + 1}`,
          label: `${o.symbol} ${o.name}${o.tree ? ' (' + o.tree + ')' : ''}`,
          text: o.meaning
        }))
      };
    }
    if (type === 'tarot' && typeof lastTarotReading !== 'undefined' && lastTarotReading?.length) {
      return {
        type: 'tarot',
        question: q || (typeof lastTarotMeta !== 'undefined' ? lastTarotMeta.question : '') || '',
        items: lastTarotReading.map((t, i) => ({
          pos: t.pos || ['Oráculo', 'Urd', 'Verdandi', 'Skuld'][i] || `Carta ${i + 1}`,
          label: `${t.card?.name || ''}${t.isReversed ? ' (invertida)' : ''}`,
          text: t.isReversed ? (t.card?.reversed || '') : (t.card?.upright || ''),
          art: t.card?.artDesc || ''
        }))
      };
    }
    if (type === 'daily' && typeof lastDailyOracle === 'string' && lastDailyOracle) {
      return { type: 'daily', question: '', items: [{ pos: 'Oráculo de hoje', label: 'Símbolo do dia', text: lastDailyOracle }] };
    }
    return null;
  }

  // ——— Local heuristic engine ———
  function localInterpret(reading) {
    const n = reading.items.length;
    const lines = [];
    const q = reading.question;

    lines.push(q
      ? `À luz da pergunta «${q}», esta tiragem sugere o seguinte.`
      : `Esta tiragem oferece um espelho do momento presente.`);

    // Per card
    reading.items.forEach((it, i) => {
      lines.push(`\n${it.pos} — ${it.label}${it.hint ? `\n(${it.hint})` : ''}\n${it.text}`);
      if (it.art) lines.push(`Imagem: ${it.art}`);
    });

    // Synthesis by count
    lines.push('\n— Síntese —');
    if (reading.guide && n > 1) {
      lines.push(`Tiragem «${reading.spread}». ${reading.guide}`);
      lines.push(`O fio da leitura vai de ${reading.items[0].label} (${reading.items[0].pos.toLowerCase()}) até ${reading.items[n - 1].label} (${reading.items[n - 1].pos.toLowerCase()}): leia as runas em diálogo, cada uma à luz da sua casa.`);
    } else if (n === 1) {
      lines.push(`O núcleo da mensagem concentra-se em «${reading.items[0].label}». Trate este símbolo como um conselho único: uma qualidade a cultivar ou um aviso a respeitar nas próximas decisões.`);
    } else if (n === 3) {
      const [a, b, c] = reading.items;
      lines.push(`O fio entre ${a.label}, ${b.label} e ${c.label} descreve uma passagem: o que veio de ${a.pos.toLowerCase()} condiciona o ${b.pos.toLowerCase()}, e aponta para ${c.pos.toLowerCase()} se nada for conscientemente redireccionado.`);
      lines.push('Pergunte-se: que hábito do “passado” ainda alimenta o presente — e que pequena acção hoje deslocaria o “futuro”?');
    } else if (n >= 5) {
      lines.push('Na cruz ou roda elemental, leia primeiro o centro (a situação). Depois cruze desafio (norte/terra) com conselho (leste/ar); a força (sul/fogo) diz com que energia actuar, e o oeste/água indica o tom emocional do desfecho.');
      lines.push('Procure uma palavra que se repita em espírito entre as posições — esse é muitas vezes o verdadeiro tema.');
    } else {
      lines.push('Leia as peças em diálogo, não isoladas. O sentido emerge da relação entre elas.');
    }

    // Keywords heuristic
    const blob = reading.items.map(i => i.text).join(' ').toLowerCase();
    const tips = [];
    if (/protec|defesa|alerta|limite/.test(blob)) tips.push('Há um pedido de fronteira ou protecção: diga não onde for preciso.');
    if (/colheita|abund|recompensa|sucesso/.test(blob)) tips.push('Algo amadureceu: reconheça e colha sem precipitação.');
    if (/mudança|ruptura|libert|transform/.test(blob)) tips.push('A mudança já está em curso; resistir gasta mais do que atravessar.');
    if (/silêncio|pausa|quiet|espera/.test(blob)) tips.push('O momento pede pausa contemplativa mais do que acção forçada.');
    if (/união|parceria|laço|amor/.test(blob)) tips.push('A relação — consigo ou com outros — é parte central da resposta.');
    if (tips.length) {
      lines.push('\n— Notas práticas —');
      tips.slice(0, 3).forEach(t => lines.push('• ' + t));
    }

    lines.push('\n— Fecho —');
    lines.push('Escolha uma acção pequena e concreta nas próximas 24 horas que honre esta leitura. Depois, se quiser, registe no Diário.');

    return {
      mode: 'local',
      title: 'Interpretação local',
      text: lines.join('\n')
    };
  }

  // ——— OpenAI-compatible API ———
  async function apiInterpret(reading) {
    const cfg = getAIConfig();
    if (!cfg.apiKey || !cfg.apiKey.trim()) {
      throw new Error('Configure a chave API em Sobre → Interpretação IA.');
    }
    const base = (cfg.baseUrl || 'https://api.openai.com/v1').replace(/\/$/, '');
    const model = cfg.model || 'gpt-4o-mini';

    const system = `És um intérprete experiente de oráculos (Tarot nórdico, Runas Elder Futhark e Ogham), com linguagem clara em português europeu.
Não decides o destino: orientas com respeito, praticidade e profundidade simbólica.
Estrutura a resposta em: 1) Síntese (4-6 frases), 2) Leitura posição a posição (breve), 3) Conselho prático (2-3 acções), 4) Pergunta de reflexão final.
Evita fatalismo e diagnósticos médicos/legais.`;

    const user = `Sistema: ${reading.type}
Pergunta: ${reading.question || '(não formulada)'}
Tiragem${reading.spread ? ' «' + reading.spread + '»' : ''}:${reading.guide ? '\nComo ler: ' + reading.guide : ''}
${reading.items.map(it => `- ${it.pos}${it.hint ? ' (' + it.hint + ')' : ''}: ${it.label}\n  ${it.text}${it.art ? '\n  Arte: ' + it.art : ''}`).join('\n')}`;

    const res = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cfg.apiKey.trim()
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error('API ' + res.status + (errText ? ': ' + errText.slice(0, 180) : ''));
    }
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
    if (!text) throw new Error('Resposta vazia da API.');
    return { mode: 'api', title: 'Interpretação IA', text: text.trim() };
  }

  function showInterpretation(result) {
    lastInterpretationText = result.text;
    const dlg = $('ai-interpret-dialog');
    const body = $('ai-interpret-body');
    const eye = $('ai-interpret-eyebrow');
    const title = $('ai-interpret-title');
    if (eye) eye.textContent = result.mode === 'api' ? 'IA · aprofundamento' : 'Motor local · offline';
    if (title) title.textContent = result.title;
    if (body) {
      const html = result.text
        .split(/\n\n+/).map(para => {
          const lines = para.split('\n').map(l => esc(l)).join('<br>');
          return `<p>${lines}</p>`;
        }).join('');
      body.innerHTML = html;
    }
    if (dlg?.showModal) dlg.showModal();
    else if (dlg) dlg.setAttribute('open', '');
  }

  window.interpretReading = async function (type, opts = {}) {
    const reading = collectReading(type);
    if (!reading || !reading.items.length) {
      showToast('Não há tiragem activa para interpretar.');
      return;
    }
    const deep = !!(opts && opts.deep);
    try {
      if (deep) {
        showToast('A consultar a IA…');
        const result = await apiInterpret(reading);
        showInterpretation(result);
      } else {
        const result = localInterpret(reading);
        showInterpretation(result);
      }
    } catch (e) {
      console.error(e);
      // fallback to local if API fails
      const local = localInterpret(reading);
      local.text = 'Não foi possível usar a IA (' + (e.message || e) + ').\n\nSegue-se a interpretação local:\n\n' + local.text;
      local.title = 'Interpretação local (fallback)';
      showInterpretation(local);
      showToast('IA indisponível — mostrou-se a leitura local.');
    }
  };

  window.saveInterpretationToJournal = function () {
    if (!lastInterpretationText) return;
    const block = `\n--- Interpretação (${new Date().toLocaleString('pt-PT')}) ---\n${lastInterpretationText}\n`;
    if (typeof appendToJournal === 'function') appendToJournal(block);
    else {
      const area = $('journal-input');
      if (area) {
        area.value = (area.value + block).trimStart();
        if (typeof autoSaveJournal === 'function') autoSaveJournal();
      }
    }
    showToast('Interpretação guardada no Diário.');
  };

  window.saveAIConfig = function () {
    const apiKey = $('ai-api-key')?.value?.trim() || '';
    const baseUrl = $('ai-base-url')?.value?.trim() || 'https://api.openai.com/v1';
    const model = $('ai-model')?.value?.trim() || 'gpt-4o-mini';
    setAIConfig({ apiKey, baseUrl, model });
    showToast(apiKey ? 'Configuração IA guardada neste dispositivo.' : 'Chave removida — só interpretação local.');
  };

  function injectAISettings() {
    const host = $('profile-panel') || $('tab-about');
    if (!host || $('ai-config-box')) return;
    const cfg = getAIConfig();
    const box = document.createElement('div');
    box.id = 'ai-config-box';
    box.className = 'theme-card border rounded-2xl p-5 space-y-3 mt-4';
    box.innerHTML = `
      <h3 class="font-cinzel text-lg font-bold theme-title">Interpretação IA (opcional)</h3>
      <p class="text-sm theme-muted">A interpretação local funciona sempre offline. Para «Aprofundar IA», use uma API compatível com OpenAI (a chave fica só neste browser).</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="sm:col-span-2">
          <label class="text-xs theme-muted block mb-1" for="ai-api-key">Chave API</label>
          <input id="ai-api-key" type="password" autocomplete="off" placeholder="sk-…" class="w-full theme-inner border rounded-lg px-3 py-2 text-sm" value="${esc(cfg.apiKey || '')}">
        </div>
        <div>
          <label class="text-xs theme-muted block mb-1" for="ai-base-url">Base URL</label>
          <input id="ai-base-url" type="url" placeholder="https://api.openai.com/v1" class="w-full theme-inner border rounded-lg px-3 py-2 text-sm" value="${esc(cfg.baseUrl || 'https://api.openai.com/v1')}">
        </div>
        <div>
          <label class="text-xs theme-muted block mb-1" for="ai-model">Modelo</label>
          <input id="ai-model" type="text" placeholder="gpt-4o-mini" class="w-full theme-inner border rounded-lg px-3 py-2 text-sm" value="${esc(cfg.model || 'gpt-4o-mini')}">
        </div>
      </div>
      <button type="button" onclick="saveAIConfig()" class="bg-[var(--btn-primary)] text-[var(--on-primary)] font-semibold text-sm px-4 py-2 rounded-lg cursor-pointer">Guardar configuração IA</button>
      <p class="text-xs theme-muted">A chave nunca é enviada para os servidores desta app — só para o endpoint que indicar, quando usar «Aprofundar IA».</p>
      <p class="text-xs bot-warn" role="note">⚠ A chave fica guardada <strong>sem cifra</strong> neste browser: quem usar este aparelho pode vê-la. Use uma chave com limite de gastos e apague-a em aparelhos partilhados. As leituras enviadas para a IA saem do aparelho.</p>
      <button type="button" onclick="document.getElementById('ai-api-key').value='';saveAIConfig()" class="theme-inner theme-title border border-[var(--border-color)] font-semibold text-sm px-4 py-2 rounded-lg cursor-pointer">Apagar a chave</button>`;
    host.appendChild(box);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectAISettings, 400);
  });
})();
