# Idiomas por prefixo de rota, sem redirecionamento automático

O site existe em português (`/`, padrão e sem prefixo) e em inglês (`/en`). Cada idioma é um layout raiz próprio (route groups `(pt)` e `(en)`), para que o `<html lang>` seja correto no HTML do servidor.

Decisões difíceis de reverter, e o porquê:

- **Prefixo de rota, não cookie.** URLs distintas por idioma são indexáveis e compartilháveis; um idioma escolhido só em cookie deixaria o Google ver só um deles. O português fica sem prefixo para não mudar as URLs que já existem.
- **Sem redirecionamento por `Accept-Language` nem por cookie.** O Googlebot não envia cookie e redirecionar por idioma esconde uma versão. O botão `PT | EN` é um link comum, e cada página declara `canonical` e `hreflang` (`pt-BR`, `en`, `x-default`).
- **Dicionário próprio tipado, sem biblioteca.** É uma página com pouco texto. `src/meta/dictionaries/{pt,en}.ts` têm o mesmo shape, e o TypeScript e um teste garantem que `en` não perde chaves de `pt`.
- **A Página de Links fica só em português** (`/links`), e não tem o botão.
- **IDs de seção seguem em português** (`#sobre`, `#projetos`...) nos dois idiomas: só o rótulo visível é traduzido.
