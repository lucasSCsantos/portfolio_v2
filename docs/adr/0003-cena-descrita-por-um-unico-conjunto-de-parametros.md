# A Cena é um único conjunto de parâmetros

O Hero deixa de ser estático e passa a ter três Modos da Cena (`dia`, `noite`, `ao vivo`). Em vez de três implementações, a Cena é descrita por um único conjunto de parâmetros (gradiente do céu, estrelas, lua, nuvens, chuva, amplitude e velocidade das ondas, paleta das ondas e do Mar, tom do texto). O modo só decide de onde ele vem: `dia` e `noite` são presets fixos; `ao vivo` calcula o conjunto a partir da hora e do clima.

Decisões difíceis de reverter, e o porquê:

- **`dia` é idêntico ao visual de antes.** É o padrão de quem não escolhe nada, e é testável: um parâmetro `dia` reproduz as cores, caminhos e animações atuais.
- **Header e Mar leem a mesma fonte.** A cor de partida do Mar é a cor da onda da frente da Cena, em qualquer modo, e o Header e os textos que ficam direto sobre o Mar (hoje: o bloco do `About` e o título de `Projetos`; o resto está em cartões claros) trocam de cor pelo tom da Cena. O brilho do topo do `About`, hoje fixo em `#79BED9`, também segue a cor do Mar. Sem emenda e sem regra por modo.
- **Ondas com os três caminhos SVG de hoje**, variando altura (`scaleY`) e duração do deslize, em vez de morphing ou canvas: mantém o `dia` igual e custa pouco.
- **A Página de Links não tem Cena.** Por isso `Waves` aceita parâmetros com os valores atuais como padrão.
- **A escolha do visitante é guardada em `localStorage` e aplicada por um script inline antes da pintura**, para não piscar Hero claro em quem escolheu `noite` (a troca de Idioma recarrega a página). A home segue estática, e o HTML estático sai em `dia`.
- **`prefers-reduced-motion`:** sem gotas, estrelas fixas e ondas paradas; cores e céu continuam mudando.
