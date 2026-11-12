# Portfolio

Site de página única em que Lucas apresenta seus projetos e serviços e convida visitantes a entrarem em contato.

## Language

**Seção de Contato**:
A última grande seção da página (âncora `#contato`), cuja função é convidar o visitante a enviar mensagem a Lucas.
_Avoid_: Footer (reservado para o Rodapé)

**Rodapé**:
A faixa final da página, abaixo da Seção de Contato, com copyright e links sociais.
_Avoid_: Footer, seção de contato

**Idioma**:
A língua em que a página é mostrada: português (`/`, padrão) ou inglês (`/en`). Só a home tem os dois; a Página de Links é só em português. O visitante troca pelo botão `PT | EN` no Header, que é um link para a mesma seção no outro idioma.
_Avoid_: Locale, tradução (no código e nas conversas, use Idioma)

**Dicionário**:
O conjunto tipado de todos os textos visíveis de um Idioma (`src/meta/dictionaries`). Os dois Dicionários têm o mesmo formato.
_Avoid_: Arquivo de tradução, i18n

**Projeto**:
Um trabalho de Lucas exibido no carrossel da seção Projetos, com o papel dele, as tecnologias, o resultado (quando há) e a relação com quem o pediu (cliente, empregador, iniciativa própria ou voluntário). Um Projeto não é uma Experiência: a Torcida Imperial, por exemplo, é um Projeto de iniciativa própria.
_Avoid_: Case, item

**Vídeo do projeto**:
Um vídeo curto, opcional, de um Projeto, exibido sobre a página quando o visitante clica nele.
_Avoid_: Demo, preview

**Página de Links**:
Página separada (rota `/links`), pensada para a bio de redes sociais, que reúne em uma lista os destinos pelos quais Lucas pode ser encontrado.
_Avoid_: Handlink, LinkHand, link-tree

**Link**:
Um item da lista da Página de Links, que leva o visitante a um destino (portfólio, WhatsApp, LinkedIn etc.).
_Avoid_: Botão, atalho

**Link principal**:
O Link que a Página de Links destaca como o caminho preferido para falar com Lucas (o WhatsApp). Há um só por página, e ele vem primeiro na lista.
_Avoid_: Link em destaque, featured, CTA

**Cena**:
O céu e as ondas do Hero. O Header e o Mar acompanham as cores da Cena para dar continuidade, e os textos que ficam direto sobre o Mar trocam de tom quando a Cena é escura; cartões, botões e o card de estatísticas não mudam. A Página de Links não tem Cena.
_Avoid_: Fundo, tema, background do hero

**Modo da Cena**:
Como a Cena se apresenta: `dia` (o visual original, padrão), `noite` (céu escuro com estrelas e mar mais agitado) ou `ao vivo` (Salvador ao vivo). É escolha do visitante, num seletor de três posições (☀️ / 🌙 / 🌎) ao lado do seletor de Idioma, e a escolha é lembrada.
_Avoid_: Tema, modo escuro (só `noite` é escuro)

**Salvador ao vivo**:
O Modo da Cena em que o céu segue a hora de Salvador (fuso America/Bahia, independente de onde o visitante está) e o clima e o mar reais da cidade (chuva, nuvens, vento, altura das ondas). Enquanto o clima carrega, ou se ele não puder ser obtido, o céu continua seguindo a hora, sem nuvens nem chuva e com ondas calmas padrão.
_Avoid_: Tempo real, easter egg

**Mar**:
A zona submersa abaixo do Hero, que escurece conforme o visitante rola a página. No Modo `noite` a profundidade começa já escura, em continuidade com as ondas, e o texto que fica direto sobre ele passa a ser claro.
_Avoid_: Sea, fundo do mar

**Aviso de sono**:
A frase discreta ("provavelmente dormindo... 😴" / "probably sleeping...") que aparece junto ao selo de disponibilidade entre 22h e 5h, hora de Salvador, em todos os Modos da Cena. Não esconde nem altera o selo de disponibilidade.
_Avoid_: Status, offline
