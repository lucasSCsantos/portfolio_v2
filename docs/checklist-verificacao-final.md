# Checklist de verificação final

Cobertura automática = testes e2e (`npm run test:e2e`, viewports desktop e mobile). Itens marcados "olho humano" precisam ser vistos por Lucas.

| Item | Automático | Olho humano |
| ---- | ---------- | ----------- |
| Hero (nome, cargo, números, currículo) | `hero.spec.ts` | [ ] |
| Linha do tempo de Experiências | `experiences.spec.ts` | [ ] |
| Transição para o Contato | `contact.spec.ts` | [ ] |
| Imagem de prévia (Open Graph) | `seo.spec.ts` | [ ] |
| Leitura em mobile (428, 834 px) | `typography.spec.ts`, `projects.spec.ts`, `services.spec.ts` | [ ] |
| Fluidez da animação | `accessibility.spec.ts` (movimento reduzido) | [ ] |
| Botões "Ver demo" | — | [ ] (vídeos saíram do repositório; ver pendência) |

## Pendência conhecida

Os vídeos de demonstração (`biblio*.mp4`, `jogopassa*.mp4`, `mural-onda*.mp4`) foram removidos do git e `src/meta/projects.ts` ainda aponta para `/biblio.mp4` etc. Enquanto não forem hospedados em outro lugar, o "Ver demo" fica quebrado no site publicado.
