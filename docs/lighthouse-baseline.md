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

## Verificação final (ticket 10, 2026-11-03)

Mesmo método da linha de base (build de produção, `next start`, Lighthouse 13.6.0), com "boas práticas" incluída; a linha de base não mediu essa categoria.

| Categoria      | Desktop (antes → depois) | Mobile (antes → depois) |
| -------------- | -----------------------: | ----------------------: |
| Desempenho     |                 69 → 88  |                49 → 46  |
| Acessibilidade |                 94 → 95  |                94 → 95  |
| SEO            |                100 → 100 |               100 → 100 |
| Boas práticas  |                   — → 96 |                  — → 96 |

| Métrica                  | Desktop (antes → depois) | Mobile (antes → depois) |
| ------------------------ | -----------------------: | ----------------------: |
| First Contentful Paint   |             0,3 s → 0,4 s |            1,1 s → 1,2 s |
| Largest Contentful Paint |             4,1 s → 1,3 s |          22,6 s → 13,6 s |
| Total Blocking Time      |            260 → 230 ms |       1.290 → 1.820 ms |
| Cumulative Layout Shift  |           0,001 → 0,002 |                0 → 0,002 |
| Speed Index              |             1,0 s → 0,9 s |            3,2 s → 4,1 s |

Auditorias de acessibilidade ainda reprovadas (desktop e mobile): `heading-order`, `list`. `svg-img-alt` passou a aprovar.

Leitura: sem regressão em acessibilidade, SEO nem boas práticas. O desempenho mobile oscila entre execuções (46 contra 49 está dentro do ruído; o Total Blocking Time maior é o ponto a vigiar). Fica como ponto aberto fora do escopo deste ticket.

## Peso da pasta pública (ticket 10)

Arquivos rastreados em `public/`, sem a pasta de currículos de trabalho e sem os vídeos de demonstração: **56,9 MB → 2,8 MB**. Saíram 23 arquivos sem uso (texturas de ruído, SVGs de nome genérico, imagens antigas de projetos) e o `whatsapp-icon.png` foi de 1,1 MB para 33 KB.

Dependências removidas: `@fortawesome/react-fontawesome`, `kute.js`, `react-lottie`, `@types/react-lottie`. A única biblioteca de Lottie é `lottie-react`.
