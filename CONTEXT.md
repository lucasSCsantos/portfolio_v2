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
