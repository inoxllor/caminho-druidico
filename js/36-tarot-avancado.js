/* ============================================================
   TAROT PARA LEITORES AVANÇADOS (2026-11-28)
   - Sentidos próprios para os 56 Arcanos Menores, direitos e
     invertidos, na linha da tradição Rider-Waite-Smith (substituem
     o modelo genérico de js/02, que dava o mesmo invertido aos
     quatro naipes).
   - Figuras da corte: retrato como pessoa, combinação elemental e
     zodíaco (Golden Dawn).
   - Correspondências da Golden Dawn: planeta ou signo e letra
     hebraica dos Maiores, caminho na Árvore da Vida, decanatos dos
     Menores 2 a 10, sefirá de cada número, numerologia e cores
     (escala do Rei para os caminhos, escala da Rainha para as
     sefirot).
   - Ficha da carta e cartas tiradas mostram as correspondências.
   - Opção de desligar as invertidas (tarotRevChance) e carta
     significadora (fica fora do baralho e abre a leitura).
   - Análise da tiragem para a interpretação local (tarotAnalysis):
     Maiores, naipes dominantes e em falta, números repetidos,
     cortes, invertidas, quintessência e dignidades elementais.
   As traduções inglesas dos sentidos estão aqui ao lado do português
   e entram no dicionário (window.I18N_EN) quando a app está em en-GB.
   ============================================================ */
(() => {
const EN = window.APP_LANG === 'en-GB';
const L = (pt, en) => (EN ? en : pt);
const reg = (pt, en) => {
  if (window.I18N_EN && pt && en) window.I18N_EN[String(pt).replace(/\s+/g, ' ').trim()] = en;
  return pt;
};
const tr = v => (window.t ? window.t(v) : v);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const VS = '︎'; // força os símbolos astrológicos em texto, nunca emoji

/* ——— Sentidos dos Arcanos Menores: [direito, invertido, upright, reversed] ——— */
const MINOR = {
  wands: [
    ['Centelha de inspiração, nova iniciativa, vontade de criar e energia para começar algo com paixão.', 'Atrasos no arranque, falta de motivação, ideia que não pega fogo ou energia desperdiçada.',
     'A spark of inspiration, a new venture, the will to create and the energy to begin something with passion.', 'Delays in getting started, lack of drive, an idea that will not catch fire or energy going to waste.'],
    ['Planeamento e visão de longo alcance: o mundo nas mãos e a decisão de partir ou ficar.', 'Medo do desconhecido, planos que não passam do papel, ficar na zona de conforto ou má avaliação.',
     'Planning and far-reaching vision: the world in your hands and the choice to set out or stay.', 'Fear of the unknown, plans that never leave the page, staying in your comfort zone or poor judgement.'],
    ['Expansão, horizontes que se abrem, primeiros resultados e espera confiante pelos barcos que chegam.', 'Obstáculos à expansão, atrasos, falta de previsão ou regresso frustrado.',
     'Expansion, opening horizons, first results and confident waiting for the ships to come in.', 'Obstacles to growth, delays, lack of foresight or a frustrating return.'],
    ['Celebração, lar, comunidade, alicerces firmes e um marco alcançado (festa, casamento, mudança de casa).', 'Instabilidade no lar, celebração adiada, transição ou falta de sentido de pertença.',
     'Celebration, home, community, firm foundations and a milestone reached (a feast, a wedding, a move).', 'Instability at home, a postponed celebration, transition or a lack of belonging.'],
    ['Competição, rivalidade, choque de egos e treino de forças: conflito mais ruidoso do que perigoso.', 'Evitar o conflito, tensão interior, tréguas ou disputa que finalmente acalma.',
     'Competition, rivalry, clashing egos and sparring: conflict that is noisier than it is dangerous.', 'Avoiding conflict, inner tension, a truce or a dispute that finally settles.'],
    ['Vitória pública, reconhecimento, regresso triunfal e confiança renovada.', 'Falta de reconhecimento, orgulho antes da queda, sucesso só em privado ou vaidade.',
     'Public victory, recognition, a triumphant return and renewed confidence.', 'Lack of recognition, pride before a fall, success kept private or vanity.'],
    ['Defender a posição, coragem perante a oposição, perseverança e firmeza de convicções.', 'Sentir-se sobrecarregado, ceder sob pressão, desistir ou defensividade excessiva.',
     'Holding your ground, courage against opposition, perseverance and firm convictions.', 'Feeling overwhelmed, giving way under pressure, giving up or excessive defensiveness.'],
    ['Movimento rápido, notícias, viagens, ação veloz e acontecimentos que se precipitam.', 'Atrasos, frustração, pressa que atrapalha ou energia que se dispersa.',
     'Swift movement, news, travel, fast action and events that rush forward.', 'Delays, frustration, haste that gets in the way or scattered energy.'],
    ['Resiliência, a última prova, vigilância e força para continuar apesar das feridas.', 'Exaustão, desconfiança de tudo, defesa rígida ou recusa em aceitar ajuda.',
     'Resilience, the last test, vigilance and the strength to carry on despite your wounds.', 'Exhaustion, suspicion of everything, rigid defence or refusing help.'],
    ['Fardo pesado, excesso de responsabilidades e trabalho árduo perto do fim.', 'Largar o fardo, delegar, aprender a dizer não, ou colapso por sobrecarga.',
     'A heavy burden, too many responsibilities and hard work close to the end.', 'Putting the burden down, delegating, learning to say no, or collapse from overload.'],
    ['Entusiasmo, descoberta, espírito livre e uma mensagem que acende nova paixão.', 'Ideias sem seguimento, impaciência, más notícias ou falta de rumo.',
     'Enthusiasm, discovery, a free spirit and news that kindles a new passion.', 'Ideas with no follow-through, impatience, bad news or lack of direction.'],
    ['Ação ousada, aventura, paixão impetuosa e coragem para avançar já.', 'Impulsividade, ira, imprudência ou partidas adiadas.',
     'Bold action, adventure, impetuous passion and the courage to move now.', 'Impulsiveness, anger, recklessness or delayed departures.'],
    ['Confiança, carisma, calor humano, determinação e independência criativa.', 'Ciúme, insegurança, exigência excessiva ou fogo que se vira para dentro.',
     'Confidence, charisma, warmth, determination and creative independence.', 'Jealousy, insecurity, being overly demanding or a fire turned inwards.'],
    ['Liderança natural, visão, espírito empreendedor e uma honra que inspira os outros.', 'Arrogância, impulsividade, expectativas impossíveis ou liderança tirânica.',
     'Natural leadership, vision, an enterprising spirit and honour that inspires others.', 'Arrogance, impulsiveness, impossible expectations or tyrannical leadership.']
  ],
  cups: [
    ['Novo amor, abertura emocional, compaixão, criatividade e a taça do coração a transbordar.', 'Emoções reprimidas, vazio interior, amor-próprio ferido ou sentimentos bloqueados.',
     'New love, emotional openness, compassion, creativity and the cup of the heart overflowing.', 'Repressed emotions, inner emptiness, wounded self-love or blocked feelings.'],
    ['União, atração mútua, parceria, reconciliação e um laço de igual para igual.', 'Desequilíbrio na relação, separação, desconfiança ou falta de reciprocidade.',
     'Union, mutual attraction, partnership, reconciliation and a bond between equals.', 'Imbalance in a relationship, separation, mistrust or lack of reciprocity.'],
    ['Amizade, celebração, comunidade e alegria partilhada à volta do hidromel.', 'Excessos, mexericos, isolamento social ou uma terceira pessoa a interferir.',
     'Friendship, celebration, community and joy shared over the mead.', 'Overindulgence, gossip, social isolation or a third party interfering.'],
    ['Apatia, contemplação, descontentamento e uma oferta que passa despercebida.', 'Despertar, aceitar uma nova oportunidade ou sair do alheamento.',
     'Apathy, contemplation, discontent and an offer that goes unnoticed.', 'Waking up, accepting a new opportunity or coming out of withdrawal.'],
    ['Perda, luto e arrependimento: olhar para o que se derramou e esquecer o que resta.', 'Aceitação, perdão, seguir em frente e reencontrar o que ficou de pé.',
     'Loss, grief and regret: staring at what was spilt and forgetting what remains.', 'Acceptance, forgiveness, moving on and finding what is still standing.'],
    ['Nostalgia, memórias de infância, inocência, reencontro e generosidade simples.', 'Preso ao passado, idealização, ou a necessidade de crescer e largar velhas histórias.',
     'Nostalgia, childhood memories, innocence, reunion and simple generosity.', 'Stuck in the past, idealisation, or the need to grow up and release old stories.'],
    ['Fantasia, muitas escolhas, ilusões e desejos que pedem discernimento.', 'Clareza, escolha feita, regresso à realidade ou tentação reconhecida.',
     'Fantasy, many choices, illusions and wishes that call for discernment.', 'Clarity, a choice made, a return to reality or a temptation seen for what it is.'],
    ['Partir, abandonar o que já não alimenta e procurar um sentido mais fundo.', 'Medo de partir, ficar por obrigação ou andar à deriva.',
     'Walking away, leaving what no longer nourishes and seeking a deeper meaning.', 'Fear of leaving, staying out of obligation or drifting aimlessly.'],
    ['Desejo realizado, satisfação, prazer e gratidão: a carta dos desejos.', 'Insatisfação, materialismo, excesso de indulgência ou desejo vazio.',
     'A wish fulfilled, satisfaction, pleasure and gratitude: the wish card.', 'Dissatisfaction, materialism, overindulgence or a hollow wish.'],
    ['Harmonia familiar, felicidade duradoura, um lar emocional e valores alinhados.', 'Família desavinda, valores em conflito ou um ideal de felicidade que não bate com a realidade.',
     'Family harmony, lasting happiness, an emotional home and aligned values.', 'A family at odds, conflicting values or an ideal of happiness that does not match reality.'],
    ['Mensagem afetiva, sensibilidade, intuição jovem e convite criativo.', 'Imaturidade emocional, ilusão, bloqueio criativo ou notícias tristes.',
     'An emotional message, sensitivity, young intuition and a creative invitation.', 'Emotional immaturity, illusion, creative block or sad news.'],
    ['Romance, proposta, encanto, seguir o coração: a idealista que traz a taça.', 'Ciúme, promessas vazias, humor instável ou desilusão romântica.',
     'Romance, a proposal, charm, following the heart: the idealist bearing the cup.', 'Jealousy, empty promises, moodiness or romantic disappointment.'],
    ['Compaixão, cuidado, intuição profunda e uma calma emocional que acolhe.', 'Dependência emocional, martírio, insegurança ou falta de limites.',
     'Compassion, care, deep intuition and an emotional calm that holds others.', 'Emotional dependence, martyrdom, insecurity or lack of boundaries.'],
    ['Equilíbrio emocional, diplomacia, sabedoria serena e generosidade madura.', 'Manipulação emocional, frieza, humor volátil ou emoções escondidas.',
     'Emotional balance, diplomacy, calm wisdom and mature generosity.', 'Emotional manipulation, coldness, volatile moods or hidden feelings.']
  ],
  swords: [
    ['Clareza súbita, verdade, uma ideia poderosa e a decisão que corta a confusão.', 'Confusão, caos mental, uma ideia mal usada ou verdade dita com crueldade.',
     'Sudden clarity, truth, a powerful idea and a decision that cuts through confusion.', 'Confusion, mental chaos, an idea misused or truth spoken cruelly.'],
    ['Impasse, decisão difícil adiada, olhos vendados e trégua frágil.', 'Indecisão que já não se aguenta, excesso de informação ou verdade revelada.',
     'Stalemate, a difficult decision put off, a blindfold and a fragile truce.', 'Indecision that can no longer hold, information overload or a truth revealed.'],
    ['Desgosto, dor emocional, tristeza, separação e uma verdade que fere.', 'Recuperação, perdão, libertar a dor, ou mágoa ainda guardada por dentro.',
     'Heartbreak, emotional pain, sorrow, separation and a truth that wounds.', 'Recovery, forgiveness, releasing pain, or hurt still held inside.'],
    ['Descanso, recuperação, retiro, contemplação e uma trégua para sarar.', 'Esgotamento, inquietação, regresso precoce à luta ou estagnação.',
     'Rest, recovery, retreat, contemplation and a truce in order to heal.', 'Burnout, restlessness, returning to the fight too soon or stagnation.'],
    ['Conflito, vencer a qualquer custo, derrota, humilhação e ganho vazio.', 'Reconciliação, arrependimento, abandonar a luta ou ressentimento antigo.',
     'Conflict, winning at any cost, defeat, humiliation and a hollow gain.', 'Reconciliation, remorse, walking away from the fight or old resentment.'],
    ['Transição, deixar para trás, viagem para águas mais calmas e recuperação lenta.', 'Bagagem emocional, resistência à mudança ou travessia interrompida.',
     'Transition, leaving behind, a journey to calmer waters and slow recovery.', 'Emotional baggage, resistance to change or an unfinished crossing.'],
    ['Estratégia, astúcia, segredo, engano ou agir sozinho e às escondidas.', 'Confissão, consciência pesada, engano descoberto ou autoengano.',
     'Strategy, cunning, secrecy, deception or acting alone and in hiding.', 'Confession, a guilty conscience, deceit uncovered or self-deception.'],
    ['Restrição, prisão mental, sentir-se encurralado e papel de vítima.', 'Libertação, nova perspetiva, assumir a própria força ou medos que se dissolvem.',
     'Restriction, a mental prison, feeling trapped and playing the victim.', 'Release, a new perspective, owning your strength or fears dissolving.'],
    ['Ansiedade, pesadelos, preocupação excessiva, culpa e noites sem dormir.', 'Esperança, pedir ajuda, ansiedade que se dissipa, ou desespero no seu ponto mais fundo.',
     'Anxiety, nightmares, excessive worry, guilt and sleepless nights.', 'Hope, reaching out for help, anxiety lifting, or despair at its deepest.'],
    ['Fim doloroso, traição, fundo do poço e ponto final: daqui só se pode subir.', 'Recuperação, regeneração, resistir a um fim inevitável ou dor que se arrasta.',
     'A painful ending, betrayal, rock bottom and a full stop: from here the only way is up.', 'Recovery, regeneration, resisting an inevitable end or pain that drags on.'],
    ['Curiosidade, sede de saber, vigilância, ideias novas e comunicação direta.', 'Mexericos, palavras sem pensar, espionagem ou falta de planeamento.',
     'Curiosity, thirst for knowledge, vigilance, new ideas and direct communication.', 'Gossip, thoughtless words, spying or lack of planning.'],
    ['Ambição, ação rápida e decidida, argumento afiado e avanço a direito.', 'Agressividade, pressa imprudente, palavras que ferem ou falta de rumo.',
     'Ambition, fast and decisive action, a sharp argument and a straight charge forward.', 'Aggression, reckless haste, wounding words or lack of direction.'],
    ['Independência, perceção clara, juízo imparcial e honestidade sem rodeios.', 'Frieza, amargura, crueldade ou julgamento sem compaixão.',
     'Independence, clear perception, impartial judgement and plain honesty.', 'Coldness, bitterness, cruelty or judgement without compassion.'],
    ['Autoridade intelectual, verdade, ética, lei e decisões lúcidas.', 'Manipulação, abuso de poder, tirania mental ou falta de ética.',
     'Intellectual authority, truth, ethics, law and clear-headed decisions.', 'Manipulation, abuse of power, mental tyranny or lack of ethics.']
  ],
  pentacles: [
    ['Nova oportunidade material, prosperidade, semente de riqueza, saúde e manifestação.', 'Oportunidade perdida, falta de planeamento ou insegurança financeira.',
     'A new material opportunity, prosperity, the seed of wealth, health and manifestation.', 'A missed opportunity, poor planning or financial insecurity.'],
    ['Equilíbrio de prioridades, adaptabilidade e gestão do tempo e do dinheiro.', 'Desorganização, sobrecarga, malabarismo que falha ou prioridades trocadas.',
     'Balancing priorities, adaptability and managing time and money.', 'Disorganisation, overload, juggling that fails or misplaced priorities.'],
    ['Trabalho de equipa, ofício, aprendizagem, competência reconhecida e construção em conjunto.', 'Falta de cooperação, trabalho mal feito ou competência por reconhecer.',
     'Teamwork, craft, apprenticeship, recognised skill and building together.', 'Lack of cooperation, shoddy work or skill that goes unrecognised.'],
    ['Segurança, poupança, controlo e conservar o que se tem; por vezes, avareza.', 'Generosidade, largar o controlo, gastos imprudentes ou medo da perda.',
     'Security, saving, control and holding on to what you have; at times, greed.', 'Generosity, letting go of control, reckless spending or fear of loss.'],
    ['Dificuldade material, pobreza, exclusão, doença e sentir-se à porta, ao frio.', 'Recuperação, ajuda que chega, fim de um período difícil ou pobreza espiritual.',
     'Material hardship, poverty, exclusion, illness and feeling left out in the cold.', 'Recovery, help arriving, the end of a hard spell or spiritual poverty.'],
    ['Generosidade, dar e receber, caridade e partilha justa dos recursos.', 'Dívidas, dádivas com condições, desigualdade ou egoísmo.',
     'Generosity, giving and receiving, charity and a fair sharing of resources.', 'Debt, gifts with strings attached, inequality or selfishness.'],
    ['Paciência, investimento a longo prazo, balanço do trabalho feito e espera pela colheita.', 'Impaciência, esforço sem retorno, investimento mal pensado ou desistir cedo demais.',
     'Patience, long-term investment, taking stock of the work done and waiting for the harvest.', 'Impatience, effort without reward, an ill-judged investment or giving up too soon.'],
    ['Dedicação, mestria, aperfeiçoamento, disciplina e trabalho bem feito.', 'Perfeccionismo, falta de foco, trabalho repetitivo sem alma ou atalhos.',
     'Dedication, mastery, refinement, discipline and work done well.', 'Perfectionism, lack of focus, soulless repetitive work or shortcuts.'],
    ['Abundância conquistada, independência, conforto, autossuficiência e requinte.', 'Dependência financeira, aparências, excesso de trabalho ou solidão no meio do luxo.',
     'Hard-won abundance, independence, comfort, self-sufficiency and refinement.', 'Financial dependence, keeping up appearances, overwork or loneliness amid luxury.'],
    ['Riqueza duradoura, herança, família, linhagem e legado entre gerações.', 'Conflitos de herança, perda financeira, tradição que aprisiona ou instabilidade familiar.',
     'Lasting wealth, inheritance, family, lineage and a legacy across generations.', 'Inheritance disputes, financial loss, a tradition that confines or family instability.'],
    ['Estudo, nova competência, plano prático, oportunidade concreta e diligência.', 'Preguiça, falta de progresso, adiar tudo ou oportunidade desperdiçada.',
     'Study, a new skill, a practical plan, a concrete opportunity and diligence.', 'Laziness, lack of progress, putting everything off or a wasted opportunity.'],
    ['Trabalho constante, responsabilidade, rotina, paciência e fiabilidade.', 'Estagnação, tédio, teimosia ou trabalho sem fim à vista.',
     'Steady work, responsibility, routine, patience and reliability.', 'Stagnation, boredom, stubbornness or work with no end in sight.'],
    ['Cuidado prático, abundância que nutre, bom senso terreno e segurança doméstica.', 'Desequilíbrio entre casa e trabalho, dependência, descuido consigo ou possessividade.',
     'Practical care, nurturing abundance, down-to-earth sense and domestic security.', 'Imbalance between home and work, dependence, self-neglect or possessiveness.'],
    ['Prosperidade, segurança, disciplina, sucesso material e o provedor generoso.', 'Ganância, materialismo, teimosia ou riqueza mal gerida.',
     'Prosperity, security, discipline, material success and the generous provider.', 'Greed, materialism, stubbornness or mismanaged wealth.']
  ]
};

/* ——— Figuras da corte como pessoa: [pt, en] por posto (11 a 14) ——— */
const PERSON = {
  wands: {
    11: ['Jovem entusiasta e curioso, mensageiro de ideias novas, inquieto e cheio de energia.', 'An enthusiastic, curious youth, a messenger of new ideas, restless and full of energy.'],
    12: ['Aventureira apaixonada e impetuosa, carismática, sempre a partir para a próxima conquista.', 'A passionate, impetuous adventurer, charismatic, always off to the next conquest.'],
    13: ['Alguém caloroso, confiante e magnético, que lidera pelo exemplo e protege os seus com ferocidade.', 'Someone warm, confident and magnetic, who leads by example and fiercely protects their own.'],
    14: ['Líder visionário e empreendedor, honrado e ousado, que inspira os outros a segui-lo.', 'A visionary, enterprising leader, honourable and daring, who inspires others to follow.']
  },
  cups: {
    11: ['Jovem sonhador e sensível, artístico, intuitivo e de coração aberto.', 'A sensitive young dreamer, artistic, intuitive and open-hearted.'],
    12: ['Romântica idealista, poeta ou sedutora, guiada pelos sentimentos e pela beleza.', 'An idealistic romantic, poet or charmer, led by feelings and by beauty.'],
    13: ['Alguém empático e intuitivo, que cuida, escuta e sente o que os outros não dizem.', 'Someone empathic and intuitive, who cares, listens and senses what others leave unsaid.'],
    14: ['Conselheiro sereno e diplomático, que domina as emoções sem as negar.', 'A calm, diplomatic counsellor who masters emotions without denying them.']
  },
  swords: {
    11: ['Jovem perspicaz e vigilante, curioso, rápido nas palavras e por vezes indiscreto.', 'A sharp, watchful youth, curious, quick with words and sometimes indiscreet.'],
    12: ['Guerreira intelectual, direta e veloz, que abre caminho com argumentos.', 'An intellectual warrior, direct and swift, who cuts a path with arguments.'],
    13: ['Alguém independente, lúcido e frontal, que diz a verdade e já conheceu a dor.', 'Someone independent, clear-sighted and frank, who speaks the truth and has known sorrow.'],
    14: ['Juiz ou estratega, racional, justo e exigente, guiado pela lógica e pela ética.', 'A judge or strategist, rational, fair and demanding, guided by logic and ethics.']
  },
  pentacles: {
    11: ['Estudante aplicado, prático e fiável, que aprende a fazer.', 'A diligent student, practical and reliable, who learns by doing.'],
    12: ['Trabalhadora paciente e metódica, que avança devagar mas nunca desiste.', 'A patient, methodical worker who moves slowly but never gives up.'],
    13: ['Alguém prático e acolhedor, que cria conforto, gere bem os recursos e cuida do corpo e da casa.', 'Someone practical and nurturing, who creates comfort, manages resources well and cares for body and home.'],
    14: ['Provedor próspero e estável, empresário ou chefe de família, sólido como a terra.', 'A prosperous, steady provider, a businessperson or head of a household, solid as the earth.']
  }
};

/* ——— Tabelas de correspondências ——— */
const PLANET = {
  mercury: ['☿', 'Mercúrio', 'Mercury'], moon: ['☽', 'Lua', 'Moon'], venus: ['♀', 'Vénus', 'Venus'],
  jupiter: ['♃', 'Júpiter', 'Jupiter'], mars: ['♂', 'Marte', 'Mars'], sun: ['☉', 'Sol', 'Sun'], saturn: ['♄', 'Saturno', 'Saturn']
};
const SIGN = {
  aries: ['♈', 'Carneiro', 'Aries', 'fire'], taurus: ['♉', 'Touro', 'Taurus', 'earth'], gemini: ['♊', 'Gémeos', 'Gemini', 'air'],
  cancer: ['♋', 'Caranguejo', 'Cancer', 'water'], leo: ['♌', 'Leão', 'Leo', 'fire'], virgo: ['♍', 'Virgem', 'Virgo', 'earth'],
  libra: ['♎', 'Balança', 'Libra', 'air'], scorpio: ['♏', 'Escorpião', 'Scorpio', 'water'], sagittarius: ['♐', 'Sagitário', 'Sagittarius', 'fire'],
  capricorn: ['♑', 'Capricórnio', 'Capricorn', 'earth'], aquarius: ['♒', 'Aquário', 'Aquarius', 'air'], pisces: ['♓', 'Peixes', 'Pisces', 'water']
};
const ELEM = { fire: ['Fogo', 'Fire'], water: ['Água', 'Water'], air: ['Ar', 'Air'], earth: ['Terra', 'Earth'] };
const SUIT_ELEM = { wands: 'fire', cups: 'water', swords: 'air', pentacles: 'earth' };
const HEB = {
  aleph: ['א', 'Aleph', 'boi', 'ox'], beth: ['ב', 'Beth', 'casa', 'house'], gimel: ['ג', 'Gimel', 'camelo', 'camel'],
  daleth: ['ד', 'Daleth', 'porta', 'door'], heh: ['ה', 'Heh', 'janela', 'window'], vav: ['ו', 'Vav', 'prego', 'nail'],
  zayin: ['ז', 'Zayin', 'espada', 'sword'], cheth: ['ח', 'Cheth', 'cerca', 'fence'], teth: ['ט', 'Teth', 'serpente', 'serpent'],
  yod: ['י', 'Yod', 'mão', 'hand'], kaph: ['כ', 'Kaph', 'palma da mão', 'palm of the hand'], lamed: ['ל', 'Lamed', 'aguilhão', 'ox-goad'],
  mem: ['מ', 'Mem', 'água', 'water'], nun: ['נ', 'Nun', 'peixe', 'fish'], samekh: ['ס', 'Samekh', 'esteio', 'prop'],
  ayin: ['ע', 'Ayin', 'olho', 'eye'], peh: ['פ', 'Peh', 'boca', 'mouth'], tzaddi: ['צ', 'Tzaddi', 'anzol', 'fish-hook'],
  qoph: ['ק', 'Qoph', 'nuca', 'back of the head'], resh: ['ר', 'Resh', 'cabeça', 'head'], shin: ['ש', 'Shin', 'dente', 'tooth'],
  tav: ['ת', 'Tav', 'marca, cruz', 'mark, cross']
};
// Sefirot: [nome, pt, en, cor(es) da escala da Rainha, cor pt, cor en]
const SEPH = [null,
  ['Kether', 'Coroa', 'Crown', ['#ffffff'], 'branco brilhante', 'brilliant white'],
  ['Chokmah', 'Sabedoria', 'Wisdom', ['#9ca3af'], 'cinzento', 'grey'],
  ['Binah', 'Entendimento', 'Understanding', ['#111111'], 'negro', 'black'],
  ['Chesed', 'Misericórdia', 'Mercy', ['#2563eb'], 'azul', 'blue'],
  ['Geburah', 'Severidade', 'Severity', ['#dc2626'], 'vermelho-escarlate', 'scarlet red'],
  ['Tiphareth', 'Beleza', 'Beauty', ['#facc15'], 'amarelo-dourado', 'golden yellow'],
  ['Netzach', 'Vitória', 'Victory', ['#10b981'], 'verde-esmeralda', 'emerald green'],
  ['Hod', 'Esplendor', 'Splendour', ['#f97316'], 'laranja', 'orange'],
  ['Yesod', 'Fundamento', 'Foundation', ['#7c3aed'], 'violeta', 'violet'],
  ['Malkuth', 'Reino', 'Kingdom', ['#c9b03a', '#6b7c2b', '#8b4a2b', '#111111'], 'citrino, oliva, castanho-avermelhado e negro', 'citrine, olive, russet and black']
];
// Arcanos Maiores: letra, astrologia [tipo, chave], caminho, de → para, cor (escala do Rei)
const MAJOR = {
  M00: ['aleph', ['element', 'air'], 11, 1, 2, '#fff7a8', 'amarelo-pálido brilhante', 'bright pale yellow'],
  M01: ['beth', ['planet', 'mercury'], 12, 1, 3, '#facc15', 'amarelo', 'yellow'],
  M02: ['gimel', ['planet', 'moon'], 13, 1, 6, '#2563eb', 'azul', 'blue'],
  M03: ['daleth', ['planet', 'venus'], 14, 2, 3, '#10b981', 'verde-esmeralda', 'emerald green'],
  M04: ['heh', ['sign', 'aries'], 15, 2, 6, '#dc2626', 'escarlate', 'scarlet'],
  M05: ['vav', ['sign', 'taurus'], 16, 2, 4, '#ea580c', 'vermelho-alaranjado', 'red-orange'],
  M06: ['zayin', ['sign', 'gemini'], 17, 3, 6, '#f97316', 'laranja', 'orange'],
  M07: ['cheth', ['sign', 'cancer'], 18, 3, 5, '#f59e0b', 'âmbar', 'amber'],
  M08: ['teth', ['sign', 'leo'], 19, 4, 5, '#d4dc22', 'amarelo-esverdeado', 'greenish yellow'],
  M09: ['yod', ['sign', 'virgo'], 20, 4, 6, '#a3c935', 'verde-amarelado', 'yellowish green'],
  M10: ['kaph', ['planet', 'jupiter'], 21, 4, 7, '#7c3aed', 'violeta', 'violet'],
  M11: ['lamed', ['sign', 'libra'], 22, 5, 6, '#10b981', 'verde-esmeralda', 'emerald green'],
  M12: ['mem', ['element', 'water'], 23, 5, 8, '#1e3a8a', 'azul-escuro', 'deep blue'],
  M13: ['nun', ['sign', 'scorpio'], 24, 6, 7, '#0d9488', 'azul-esverdeado', 'green-blue'],
  M14: ['samekh', ['sign', 'sagittarius'], 25, 6, 9, '#2563eb', 'azul', 'blue'],
  M15: ['ayin', ['sign', 'capricorn'], 26, 6, 8, '#3730a3', 'índigo', 'indigo'],
  M16: ['peh', ['planet', 'mars'], 27, 7, 8, '#dc2626', 'escarlate', 'scarlet'],
  M17: ['tzaddi', ['sign', 'aquarius'], 28, 7, 9, '#7c3aed', 'violeta', 'violet'],
  M18: ['qoph', ['sign', 'pisces'], 29, 7, 10, '#9f1239', 'carmesim (ultravioleta)', 'crimson (ultraviolet)'],
  M19: ['resh', ['planet', 'sun'], 30, 8, 9, '#f97316', 'laranja', 'orange'],
  M20: ['shin', ['element', 'fire'], 31, 8, 10, '#f2541b', 'laranja-escarlate incandescente', 'glowing orange-scarlet'],
  M21: ['tav', ['planet', 'saturn'], 32, 9, 10, '#3730a3', 'índigo', 'indigo']
};
// Decanatos dos Menores 2 a 10 (Golden Dawn): [planeta, signo, decanato 0-2]
const DECAN = {
  wands: [['mars', 'aries', 0], ['sun', 'aries', 1], ['venus', 'aries', 2], ['saturn', 'leo', 0], ['jupiter', 'leo', 1], ['mars', 'leo', 2], ['mercury', 'sagittarius', 0], ['moon', 'sagittarius', 1], ['saturn', 'sagittarius', 2]],
  cups: [['venus', 'cancer', 0], ['mercury', 'cancer', 1], ['moon', 'cancer', 2], ['mars', 'scorpio', 0], ['sun', 'scorpio', 1], ['venus', 'scorpio', 2], ['saturn', 'pisces', 0], ['jupiter', 'pisces', 1], ['mars', 'pisces', 2]],
  swords: [['moon', 'libra', 0], ['saturn', 'libra', 1], ['jupiter', 'libra', 2], ['venus', 'aquarius', 0], ['mercury', 'aquarius', 1], ['moon', 'aquarius', 2], ['jupiter', 'gemini', 0], ['mars', 'gemini', 1], ['sun', 'gemini', 2]],
  pentacles: [['jupiter', 'capricorn', 0], ['mars', 'capricorn', 1], ['sun', 'capricorn', 2], ['mercury', 'taurus', 0], ['moon', 'taurus', 1], ['saturn', 'taurus', 2], ['sun', 'virgo', 0], ['venus', 'virgo', 1], ['mercury', 'virgo', 2]]
};
// Cortes (Golden Dawn): Valquíria = Rei a cavalo (Fogo), Völva = Rainha (Água),
// Jarl = Príncipe (Ar), Escudeiro = Princesa (Terra). Zodíaco de 21° a 20°.
const COURT = { 11: ['earth', 10], 12: ['fire', 2], 13: ['water', 3], 14: ['air', 6] };
const COURT_ZOD = {
  wands: { 12: ['scorpio', 'sagittarius'], 13: ['pisces', 'aries'], 14: ['cancer', 'leo'], 11: ['cancer', 'leo', 'virgo'] },
  cups: { 12: ['aquarius', 'pisces'], 13: ['gemini', 'cancer'], 14: ['libra', 'scorpio'], 11: ['libra', 'scorpio', 'sagittarius'] },
  swords: { 12: ['taurus', 'gemini'], 13: ['virgo', 'libra'], 14: ['capricorn', 'aquarius'], 11: ['capricorn', 'aquarius', 'pisces'] },
  pentacles: { 12: ['leo', 'virgo'], 13: ['sagittarius', 'capricorn'], 14: ['aries', 'taurus'], 11: ['aries', 'taurus', 'gemini'] }
};
const COURT_ROLE = {
  11: ['Princesa na Golden Dawn: o elemento a tomar corpo, aprender e trazer mensagens.', 'Princess in the Golden Dawn: the element taking form, learning and bringing messages.'],
  12: ['Rei a cavalo na Golden Dawn (Cavaleiro no Rider-Waite): o elemento em ataque, rápido e decidido.', 'Mounted King in the Golden Dawn (Knight in Rider-Waite): the element charging, swift and decisive.'],
  13: ['Rainha: o elemento recebido, sentido e guardado por dentro.', 'Queen: the element received, felt and held within.'],
  14: ['Príncipe no carro na Golden Dawn (Rei no Rider-Waite): o elemento posto a governar no mundo.', 'Prince in the chariot in the Golden Dawn (King in Rider-Waite): the element set to rule in the world.']
};
const NUM = [
  ['potencial puro, o vazio antes de todo o número', 'pure potential, the void before every number'],
  ['início, unidade, a semente', 'beginning, unity, the seed'],
  ['dualidade, escolha, parceria', 'duality, choice, partnership'],
  ['expansão, criação, o primeiro fruto', 'growth, creation, the first fruit'],
  ['estrutura, estabilidade, alicerce', 'structure, stability, foundation'],
  ['crise, mudança, prova', 'crisis, change, a test'],
  ['harmonia, partilha, reequilíbrio', 'harmony, sharing, rebalancing'],
  ['avaliação, mistério, perseverança', 'assessment, mystery, perseverance'],
  ['movimento, poder, mestria', 'movement, power, mastery'],
  ['culminação, plenitude, recolhimento', 'culmination, fulfilment, solitude'],
  ['fim de ciclo, excesso, passagem ao seguinte', 'end of a cycle, excess, passing to the next']
];
const SUIT_COLOUR = {
  wands: ['laranja e ocre de Muspelheim', 'the orange and ochre of Muspelheim'],
  cups: ['azul-celeste e prata de Vanaheim', 'the sky blue and silver of Vanaheim'],
  swords: ['cinzento-azulado e branco de Niflheim', 'the slate blue and white of Niflheim'],
  pentacles: ['dourado e ocre de Midgard', 'the gold and ochre of Midgard']
};

const planet = k => `${PLANET[k][0]}${VS} ${L(PLANET[k][1], PLANET[k][2])}`;
const sign = k => `${SIGN[k][0]}${VS} ${L(SIGN[k][1], SIGN[k][2])}`;
const elem = k => L(ELEM[k][0], ELEM[k][1]);
const sephName = n => `${SEPH[n][0]} (${L(SEPH[n][1], SEPH[n][2])})`;
const majorIndex = c => parseInt(String(c.id).slice(1), 10);
const swatch = (hex, label) => `<span class="tc-sw" style="background:${hex}" title="${esc(label)}" aria-hidden="true"></span>`;

/* ——— Aplicar ao baralho ——— */
function apply() {
  const deck = (typeof NORDIC_TAROT_DECK !== 'undefined' && NORDIC_TAROT_DECK) || window.NORDIC_TAROT_DECK;
  if (!deck) return;
  deck.forEach(c => {
    if (c.suit === 'major') {
      const m = MAJOR[c.id];
      if (!m) return;
      c.value = majorIndex(c);
      c.element = m[1][0] === 'element' ? m[1][1] : m[1][0] === 'sign' ? SIGN[m[1][1]][3] : null;
      return;
    }
    const row = MINOR[c.suit] && MINOR[c.suit][c.rank - 1];
    if (!row) return;
    c.upright = reg(row[0], row[2]);
    c.reversed = reg(row[1], row[3]);
    c.element = SUIT_ELEM[c.suit];
    c.value = c.rank <= 10 ? c.rank : null;
    const p = PERSON[c.suit][c.rank];
    if (p) c.person = reg(p[0], p[1]);
  });
}

/* ——— Correspondências de uma carta: [[rótulo, html], …] ——— */
function correspondences(c) {
  const rows = [];
  if (c.suit === 'major') {
    const m = MAJOR[c.id];
    if (!m) return rows;
    const [hk, [type, key], path, from, to, hex, cpt, cen] = m;
    const h = HEB[hk];
    const astro = type === 'planet' ? planet(key)
      : type === 'sign' ? `${sign(key)} · ${L('signo de', 'a sign of')} ${elem(SIGN[key][3])}`
      : `${L('Elemento', 'Element')} ${elem(key)}${key === 'fire' ? L(' (e Espírito)', ' (and Spirit)') : ''}`;
    rows.push([L('Astrologia', 'Astrology'), esc(astro) + (c.id === 'M21' ? esc(L(' (e o elemento Terra)', ' (and the element Earth)')) : '')]);
    rows.push([L('Letra hebraica', 'Hebrew letter'), `<span class="tc-heb" lang="he">${h[0]}</span> ${esc(h[1])} · ${esc(L(h[2], h[3]))}`]);
    rows.push([L('Árvore da Vida', 'Tree of Life'), esc(`${L('Caminho', 'Path')} ${path}: ${sephName(from)} → ${sephName(to)}`)]);
    const n = c.value;
    let num;
    if (n <= 10) num = `${n} · ${L(NUM[n][0], NUM[n][1])}`;
    else {
      const steps = [];
      let s = n;
      while (s > 9) { const d = String(s).split('').map(Number); const t = d.reduce((a, b) => a + b, 0); steps.push(`${d.join('+')} = ${t}`); s = t; }
      const base = NORDIC_TAROT_DECK.find(x => x.id === 'M' + String(s).padStart(2, '0'));
      num = `${n} → ${steps.join(' → ')} · ${L('eco de', 'echoes')} ${base ? tr(base.title) : s}: ${L(NUM[s][0], NUM[s][1])}`;
    }
    rows.push([L('Numerologia', 'Numerology'), esc(num)]);
    rows.push([L('Cores', 'Colours'), `${swatch(hex, L(cpt, cen))} ${esc(L(cpt, cen))} <span class="theme-muted">· ${esc(L('escala do Rei, Golden Dawn', 'King scale, Golden Dawn'))}</span>`]);
    return rows;
  }
  const se = SUIT_ELEM[c.suit];
  if (c.rank === 1) {
    rows.push([L('Astrologia', 'Astrology'), esc(L(`Raiz dos poderes do ${elem(se)}; sem decanato`, `Root of the powers of ${elem(se)}; no decan`))]);
  } else if (c.rank <= 10) {
    const [p, s, d] = DECAN[c.suit][c.rank - 2];
    rows.push([L('Astrologia', 'Astrology'), esc(`${planet(p)} ${L('em', 'in')} ${sign(s)} (${d * 10}°–${d * 10 + 10}°)`)]);
  } else {
    const z = COURT_ZOD[c.suit][c.rank];
    const zt = z.length === 3
      ? L(`Quadrante celeste de ${z.map(sign).join(', ').replace(/, ([^,]+)$/, ' e $1')}`, `Celestial quadrant of ${z.map(sign).join(', ').replace(/, ([^,]+)$/, ' and $1')}`)
      : `21° ${sign(z[0])} – 20° ${sign(z[1])}`;
    rows.push([L('Astrologia', 'Astrology'), esc(zt)]);
    const [ce] = COURT[c.rank];
    rows.push([L('Posto', 'Rank'), esc(`${elem(ce)} ${L('de', 'of')} ${elem(se)} · ${L(COURT_ROLE[c.rank][0], COURT_ROLE[c.rank][1])}`)]);
  }
  const sn = c.rank <= 10 ? c.rank : COURT[c.rank][1];
  rows.push([L('Árvore da Vida', 'Tree of Life'), esc(`${sephName(sn)}${L(' no mundo de ', ' in the world of ')}${elem(se)}`)]);
  if (c.rank <= 10) rows.push([L('Numerologia', 'Numerology'), esc(`${c.rank} · ${L(NUM[c.rank][0], NUM[c.rank][1])}`)]);
  const sc = c.suitObj ? c.suitObj.colorPrimary : '#888';
  const sp = SEPH[sn];
  rows.push([L('Cores', 'Colours'),
    `${swatch(sc, L(SUIT_COLOUR[c.suit][0], SUIT_COLOUR[c.suit][1]))} ${esc(L('Naipe', 'Suit'))}: ${esc(L(SUIT_COLOUR[c.suit][0], SUIT_COLOUR[c.suit][1]))}<br>` +
    `${sp[3].map(h => swatch(h, L(sp[4], sp[5]))).join('')} ${esc(sp[0])}: ${esc(L(sp[4], sp[5]))} <span class="theme-muted">· ${esc(L('escala da Rainha', 'Queen scale'))}</span>`]);
  return rows;
}

// Linha curta para as cartas tiradas
function corrShort(c) {
  if (c.suit === 'major') {
    const m = MAJOR[c.id];
    if (!m) return '';
    const [hk, [type, key], path, , , hex, cpt, cen] = m;
    const a = type === 'planet' ? planet(key) : type === 'sign' ? sign(key) : elem(key);
    return `${swatch(hex, L(cpt, cen))}${esc(a)} · <span lang="he">${HEB[hk][0]}</span> ${esc(HEB[hk][1])} · ${esc(L('caminho', 'path'))} ${path}`;
  }
  const sn = c.rank <= 10 ? c.rank : COURT[c.rank][1];
  let a;
  if (c.rank === 1) a = L(`Raiz do ${elem(SUIT_ELEM[c.suit])}`, `Root of ${elem(SUIT_ELEM[c.suit])}`);
  else if (c.rank <= 10) { const [p, s] = DECAN[c.suit][c.rank - 2]; a = `${planet(p)} ${L('em', 'in')} ${sign(s)}`; }
  else a = `${elem(COURT[c.rank][0])} ${L('de', 'of')} ${elem(SUIT_ELEM[c.suit])}`;
  return `${swatch(SEPH[sn][3][0], L(SEPH[sn][4], SEPH[sn][5]))}${esc(a)} · ${esc(SEPH[sn][0])}`;
}

window.tarotCorrespondences = correspondences;
window.tarotCardExtra = function (c) {
  if (!c) return '';
  const s = corrShort(c);
  return (s ? `<p class="tc-corr">${s}</p>` : '') + (c.person ? `<p class="tc-person"><b>${esc(L('Como pessoa', 'As a person'))}:</b> ${esc(c.person)}</p>` : '');
};
window.tarotDetailExtra = function (c) {
  if (!c) return '';
  const rows = correspondences(c);
  const person = c.person ? `<div class="theme-inner border rounded-lg p-3 text-left">
      <p class="text-xs font-semibold theme-accent uppercase tracking-wide">${esc(L('Como pessoa', 'As a person'))}</p>
      <p class="text-sm theme-title leading-relaxed mt-1">${esc(c.person)}</p></div>` : '';
  if (!rows.length) return person;
  return person + `<div class="theme-inner border rounded-lg p-3 text-left">
      <p class="text-xs font-semibold theme-accent uppercase tracking-wide">${esc(L('Correspondências', 'Correspondences'))}</p>
      <dl class="tc-corr-list">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')}</dl>
      <p class="text-[11px] theme-muted mt-2">${esc(L('Sistema da Golden Dawn, o mais usado nos baralhos Rider-Waite e Thoth. A runa e o reino nórdico são criação deste baralho.', 'Golden Dawn system, the one most used with the Rider-Waite and Thoth decks. The rune and the Norse realm are this deck’s own.'))}</p>
    </div>`;
};

/* ——— Invertidas ——— */
const REV_KEY = 'druid_tarot_rev';
const revOn = () => { try { return localStorage.getItem(REV_KEY) !== 'off'; } catch { return true; } };
window.tarotRevChance = () => (revOn() ? 0.35 : 0);
window.setTarotReversals = on => {
  try { localStorage.setItem(REV_KEY, on ? 'on' : 'off'); } catch { /* sem armazenamento */ }
  const el = document.getElementById('tarot-rev-on');
  if (el) el.checked = !!on;
};

/* ——— Carta significadora ——— */
let sigId = '';
window.tarotSigCard = () => (sigId ? NORDIC_TAROT_DECK.find(c => c.id === sigId) || null : null);
window.setTarotSignificator = id => { sigId = id || ''; };
if (typeof getFilteredNordicDeck === 'function') {
  const _gf = getFilteredNordicDeck;
  getFilteredNordicDeck = function () {
    const d = _gf();
    return sigId && typeof activeTarotMode !== 'undefined' && activeTarotMode === 'draw' ? d.filter(c => c.id !== sigId) : d;
  };
}
function fillSignificator() {
  const sel = document.getElementById('tarot-sig');
  if (!sel || sel.options.length > 1) return;
  const groups = [['major', L('Arcanos Maiores', 'Major Arcana')], ['court', L('Figuras da corte', 'Court cards')], ['pips', L('Outros Menores', 'Other Minor Arcana')]];
  const pick = g => NORDIC_TAROT_DECK.filter(c => g === 'major' ? c.suit === 'major' : g === 'court' ? c.rank > 10 : c.suit !== 'major' && c.rank <= 10);
  sel.insertAdjacentHTML('beforeend', groups.map(([g, label]) =>
    `<optgroup label="${esc(label)}">${pick(g).map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</optgroup>`).join(''));
}

/* ——— Análise da tiragem (interpretação local) ——— */
const SUIT_NAME = { wands: ['Lanças', 'Spears'], cups: ['Hidromel', 'Mead'], swords: ['Espadas', 'Swords'], pentacles: ['Draupnir', 'Draupnir'] };
const ELEM_MSG = {
  fire: ['a vontade, a ação e a paixão mandam nesta questão', 'will, action and passion rule this question'],
  water: ['os sentimentos, as relações e a intuição estão no centro', 'feelings, relationships and intuition are at the centre'],
  air: ['pensamentos, decisões e palavras pesam mais do que tudo', 'thoughts, decisions and words weigh more than anything'],
  earth: ['o corpo, o trabalho, o dinheiro e o concreto dominam', 'the body, work, money and practical matters dominate']
};
const ELEM_MISSING = {
  fire: ['falta Fogo: pode faltar entusiasmo ou iniciativa', 'no Fire: enthusiasm or initiative may be missing'],
  water: ['falta Água: os sentimentos podem estar a ser postos de lado', 'no Water: feelings may be being pushed aside'],
  air: ['falta Ar: talvez falte pensar com clareza ou falar', 'no Air: clear thinking or speaking up may be missing'],
  earth: ['falta Terra: atenção ao lado prático e aos pés no chão', 'no Earth: mind the practical side and staying grounded']
};
const RANK_WORD = { 1: ['Ases', 'Aces'], 2: ['Dois', 'Twos'], 3: ['Três', 'Threes'], 4: ['Quatros', 'Fours'], 5: ['Cincos', 'Fives'], 6: ['Seis', 'Sixes'], 7: ['Setes', 'Sevens'], 8: ['Oitos', 'Eights'], 9: ['Noves', 'Nines'], 10: ['Dez', 'Tens'], 11: ['Escudeiros', 'Squires'], 12: ['Valquírias', 'Valkyries'], 13: ['Völvas', 'Völvas'], 14: ['Jarls', 'Jarls'] };
const COUNT_WORD = { 2: ['Dois', 'Two'], 3: ['Três', 'Three'], 4: ['Quatro', 'Four'] };
const friendly = (a, b) => (a === 'fire' && b === 'air') || (a === 'air' && b === 'fire') || (a === 'water' && b === 'earth') || (a === 'earth' && b === 'water');
const contrary = (a, b) => (a === 'fire' && b === 'water') || (a === 'water' && b === 'fire') || (a === 'air' && b === 'earth') || (a === 'earth' && b === 'air');

window.tarotAnalysis = function (items) {
  const cards = items.filter(it => it.card).map(it => ({ c: it.card, rev: !!it.rev, pos: it.pos }));
  const n = cards.length;
  if (!n) return [];
  const out = [];
  const majors = cards.filter(x => x.c.suit === 'major').length;
  if (n >= 3 && majors / n >= 0.5) out.push(L(`${majors} de ${n} cartas são Arcanos Maiores: forças grandes e lições de vida estão em jogo; nem tudo depende só da sua vontade.`, `${majors} of ${n} cards are Major Arcana: great forces and life lessons are at play; not everything depends on your will alone.`));
  else if (n >= 3 && majors === 0) out.push(L('Nenhum Arcano Maior: a questão vive no plano do dia a dia e está, em grande parte, nas suas mãos.', 'No Major Arcana: the question lives in everyday life and is largely in your hands.'));
  if (n >= 3) {
    const count = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
    cards.forEach(x => { if (count[x.c.suit] !== undefined) count[x.c.suit]++; });
    const minors = n - majors;
    const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
    if (minors >= 2 && top[1] >= 2 && top[1] / n >= 0.4) {
      const e = SUIT_ELEM[top[0]];
      out.push(L(`Predomina ${SUIT_NAME[top[0]][0]} (${elem(e)}, ${top[1]} cartas): ${ELEM_MSG[e][0]}.`, `${SUIT_NAME[top[0]][1]} dominate (${elem(e)}, ${top[1]} cards): ${ELEM_MSG[e][1]}.`));
    }
    if (n >= 5) {
      const miss = Object.keys(count).filter(k => !count[k]).map(k => SUIT_ELEM[k]);
      if (miss.length && miss.length < 4) out.push(L('Elementos em falta: ', 'Missing elements: ') + miss.map(e => L(ELEM_MISSING[e][0], ELEM_MISSING[e][1])).join('; ') + '.');
    }
  }
  const ranks = {};
  cards.forEach(x => { if (x.c.suit !== 'major') ranks[x.c.rank] = (ranks[x.c.rank] || 0) + 1; });
  Object.entries(ranks).filter(([, k]) => k >= 2).forEach(([r, k]) => {
    r = +r;
    const cw = COUNT_WORD[k] || [String(k), String(k)];
    const what = r <= 10 ? L(NUM[r][0], NUM[r][1]) : L(COURT_ROLE[r][0], COURT_ROLE[r][1]).split(':')[1].trim().replace(/\.$/, '');
    out.push(r <= 10
      ? L(`${cw[0]} ${RANK_WORD[r][0]} na mesa: o número reforça o tema (${what}).`, `${cw[1]} ${RANK_WORD[r][1]} on the table: the number underlines the theme (${what}).`)
      : L(`${cw[0]} ${RANK_WORD[r][0]} na mesa: o posto repete-se (${what}).`, `${cw[1]} ${RANK_WORD[r][1]} on the table: the rank repeats (${what}).`));
  });
  const courts = cards.filter(x => x.c.rank > 10).length;
  if (n >= 3 && courts >= 2) out.push(L(`${courts} figuras da corte: há pessoas envolvidas, ou papéis que a própria pessoa está a assumir. Veja o «Como pessoa» de cada uma.`, `${courts} court cards: other people are involved, or roles you yourself are taking on. See the «As a person» of each one.`));
  const revs = cards.filter(x => x.rev).length;
  if (n >= 3 && revs / n >= 0.5) out.push(L(`${revs} de ${n} cartas invertidas: muita energia está bloqueada, em atraso ou a ser vivida por dentro.`, `${revs} of ${n} cards reversed: much of the energy is blocked, delayed or being lived inwardly.`));
  if (n >= 3) {
    let sum = cards.reduce((a, x) => a + (x.c.value || 0), 0);
    if (sum > 0) {
      const orig = sum;
      while (sum > 22) sum = String(sum).split('').reduce((a, b) => a + Number(b), 0);
      const q = NORDIC_TAROT_DECK.find(c => c.id === 'M' + String(sum === 22 ? 0 : sum).padStart(2, '0'));
      if (q) out.push(L(`Quintessência: a soma dos números (${orig}) reduz-se a ${sum === 22 ? '22 = 0' : sum}, ${q.name} (${q.title}): o conselho de fundo de toda a tiragem.`, `Quintessence: the sum of the numbers (${orig}) reduces to ${sum === 22 ? '22 = 0' : sum}, ${tr(q.name)} (${tr(q.title)}): the underlying advice of the whole spread.`));
    }
  }
  if (n === 3) {
    const [a, b, c] = cards.map(x => x.c.element);
    if (b && a && c) {
      const f = [a, c].filter(e => e === b || friendly(e, b)).length;
      const k = [a, c].filter(e => contrary(e, b)).length;
      if (k === 2) out.push(L('Dignidades elementais: as duas cartas dos lados são contrárias ao elemento da carta do meio e enfraquecem-na; leia-a com menos força.', 'Elemental dignities: both side cards are contrary to the middle card’s element and weaken it; read it with less force.'));
      else if (f === 2) out.push(L('Dignidades elementais: as cartas dos lados apoiam o elemento da carta do meio, que ganha força.', 'Elemental dignities: the side cards support the middle card’s element, which gains strength.'));
      else if (contrary(a, c)) out.push(L('Dignidades elementais: as cartas dos lados são contrárias entre si; a carta do meio faz de ponte entre duas forças opostas.', 'Elemental dignities: the side cards are contrary to each other; the middle card bridges two opposing forces.'));
    }
  }
  return out;
};

apply();
document.addEventListener('DOMContentLoaded', () => {
  fillSignificator();
  const r = document.getElementById('tarot-rev-on');
  if (r) r.checked = revOn();
});
if (document.readyState !== 'loading') {
  fillSignificator();
  const r = document.getElementById('tarot-rev-on');
  if (r) r.checked = revOn();
}
})();
