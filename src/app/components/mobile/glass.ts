import { css } from 'styled-components';

// O mesmo fundo dos cartões do desktop (borda branca, branco 60%, sombra) com o vidro líquido por cima:
// desfoque do que passa atrás e um brilho nas bordas. O texto volta à tinta escura, como no desktop.
export const glassCard = css`
  color: ${({ theme }) => theme.colors.text};
  --sea-ink: ${({ theme }) => theme.colors.text};
  --sea-accent: ${({ theme }) => theme.colors.tertiary};
  border: 1.6px solid white;
  background-color: ${({ theme }) => theme.colors.textLight}9a;
  -webkit-backdrop-filter: blur(12px) saturate(1.5);
  backdrop-filter: blur(12px) saturate(1.5);
  box-shadow:
    -5px 7px 16px rgba(0, 0, 0, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    inset 0 -1px 1px rgba(255, 255, 255, 0.4);
`;
