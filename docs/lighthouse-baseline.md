# Linha de base do Lighthouse

Registrada em 2026-10-30 para comparação na verificação final de `profissionalizar-portfolio`.

- Página: `/` (build de produção, `next start`)
- Lighthouse 13.6.0, Chrome 156 local, categorias: desempenho, acessibilidade, SEO
- Estado do código: identidade única já aplicada (ticket 01), nenhuma outra mudança de conteúdo, design, tipografia ou acessibilidade

| Categoria     | Desktop | Mobile |
| ------------- | ------: | -----: |
| Desempenho    |      69 |     49 |
| Acessibilidade |     94 |     94 |
| SEO           |     100 |    100 |

| Métrica                            | Desktop | Mobile  |
| ---------------------------------- | ------- | ------- |
| First Contentful Paint             | 0,3 s   | 1,1 s   |
| Largest Contentful Paint           | 4,1 s   | 22,6 s  |
| Total Blocking Time                | 260 ms  | 1.290 ms |
| Cumulative Layout Shift            | 0,001   | 0       |
| Speed Index                        | 1,0 s   | 3,2 s   |

Auditorias de acessibilidade reprovadas (iguais em desktop e mobile): `heading-order`, `list`, `svg-img-alt`.

## Como reproduzir

```bash
npm run build && npm run start -- -p 3101
# desktop
CHROME_PATH="<caminho do chrome.exe>" npx lighthouse http://localhost:3101/ --preset=desktop --only-categories=performance,accessibility,seo --chrome-flags=--headless=new
# mobile (padrão do Lighthouse)
CHROME_PATH="<caminho do chrome.exe>" npx lighthouse http://localhost:3101/ --only-categories=performance,accessibility,seo --chrome-flags=--headless=new
```
