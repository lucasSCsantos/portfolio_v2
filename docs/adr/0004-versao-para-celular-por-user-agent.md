# Versão para celular separada, escolhida no servidor pelo User-Agent

A home (`/` e `/en`) tem duas árvores de componentes visuais: a Versão para desktop (computadores e tablets) e a Versão para celular (só celulares). O servidor escolhe qual renderizar pelo User-Agent da requisição, na mesma URL.

Por que não só CSS responsivo: tentar fazer uma única página servir do celular ao monitor largo deixava seções ruins em tela pequena, pesava no celular, exigia ajustar quatro breakpoints a cada mudança (e algo sempre quebrava) e não permitia uma experiência realmente pensada para o celular. Na Versão para celular, cada seção, inclusive a Cena, pode ser redesenhada, sem remover conteúdo nem animações.

Decisões difíceis de reverter, e o porquê:

- **Mesma URL, escolha no servidor.** Uma rota `/m` com redirecionamento duplicaria URLs, dividiria o SEO e faria um link compartilhado do celular abrir a versão errada no desktop (a mesma lógica do ADR 0001). Escolher no cliente pela largura obrigaria o HTML inicial a adivinhar a versão (flash ou erro de hidratação) ou a mandar as duas árvores. A home passa a ser renderizada por requisição, com `Vary: User-Agent`.
- **Na dúvida, desktop.** Só celulares reconhecidos (incluindo o Googlebot Smartphone, que indexa pela versão de celular) recebem a Versão para celular. Como o conteúdo é o mesmo nas duas, a indexação não perde nada.
- **Sem botão de troca de versão.** Dobraria os casos para testar e para lembrar; se a Versão para celular for boa, ele não é necessário.
- **Só a aparência é duplicada.** Dicionários, `profile.ts`, dados de Projetos e Serviços, o modelo da Cena (ADR 0003), o clima e a lógica dos Modos são compartilhados; só os componentes visuais têm uma cópia para celular. Conteúdo novo aparece nas duas versões sem trabalho extra.
- **Tablets ficam no desktop**, que mantém os breakpoints de 1440, 1024 e 834. As regras de 428px saem depois que a Versão para celular estiver no ar; o desktop numa janela muito estreita só precisa não quebrar.
- **A Página de Links tem uma versão só.**
