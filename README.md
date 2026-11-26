# Caminho Druídico Pro Ultimate
(Edição baseada na OBOD)

Aplicação web progressiva (PWA) *offline-first* com ferramentas para a exploração do caminho druídico: oráculos de Ogham, Runas e Tarot nórdico, ciclo lunar com fases astronómicas reais, Roda do Ano, altar, rituais, diário bárdico, meditações guiadas e estudo do Ogham.

## Usar

- **No site:** abra a página publicada no GitHub Pages. Em *Mais › Sobre* aparece o botão **Instalar app**; depois da primeira visita funciona sem rede.
- **Em inglês (en-GB):** escolha o idioma em *Ambiente & ajustes* ou abra o site com `?lang=en` (e `?lang=pt` para voltar). Num browser em inglês (ou noutra língua que não o português), a app abre logo em inglês.
- **Num só ficheiro:** o ramo `HTML-UNICO` guarda a versão num só ficheiro (o site publicado já não oferece o download).

## Estrutura

```
index.html          Página (HTML) — carrega o CSS e os scripts abaixo, por ordem
css/app.css         Estilos
i18n/en-GB.js       Dicionário português → inglês (en-GB), usado por js/00-idioma.js
js/01-…25-*.js      Código, por funcionalidade (scripts clássicos, partilham o âmbito global)
sw.js               Service worker: guarda a app para uso offline
manifest.json       Manifesto da app instalável
icons/              Ícones da app
tools/              build-single.mjs (gera o HTML único), build-pages.mjs (junta e minifica o JS e o CSS no Pages) e serve.mjs (servidor local)
tests/              Testes automáticos
```

Os textos estão em português no código. A versão inglesa traduz o que aparece no ecrã com `i18n/en-GB.js` (frases) e os padrões de `js/00-idioma.js` (números, datas, combinações); ao acrescentar um texto novo, junte a tradução ao dicionário.

Os ficheiros `js/` são carregados pela ordem numérica. Ao acrescentar um ficheiro novo, junte-o também à lista `PRECACHE` em `sw.js` e suba a `VERSION` (o teste `estrutura` avisa se faltar).

## Desenvolver

```bash
npm install                          # só para os testes (instala o Playwright)
npx playwright install chromium      # uma vez
npm run serve                        # http://localhost:8080/
npm test                             # testes unitários e no browser
npm run build:single                 # gera dist/caminho-druidico.html
npm run build:pages -- _site         # junta e minifica o JS e o CSS numa cópia do site (o Pages faz isto sozinho)
```

## Publicação

O workflow `.github/workflows/pages.yml` corre os testes em cada pull request e, a cada alteração no `main`, publica o site no GitHub Pages.
É preciso ativar uma vez: **Settings → Pages → Source: GitHub Actions**.

Para atualizar o ramo `HTML-UNICO` a partir do `main`: **Actions → Atualizar ramo HTML-UNICO → Run workflow**.

## Licença

GPL-3.0. Ver `LICENSE`.
