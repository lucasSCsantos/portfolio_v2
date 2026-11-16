'use client';

import styled, { css, keyframes } from 'styled-components';
import { glassCard } from '../glass';

// Margem lateral de 20px; à direita, o espaço dos pontos da lateral (44px de toque + 4px da borda).
const SIDE = '20px';
const DOTS = '48px';

// O texto fica direto sobre o Mar, no tom da Tela (`--sea-ink`). Sem respiro embaixo: o fundo do mar
// ocupa o pé da seção, logo acima do Rodapé.
export const Container = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 3rem ${DOTS} 0 ${SIDE};
  color: ${({ theme }) => theme.colors.onSea};
`;

export const Label = styled.h2`
  font: 600 ${({ theme }) => theme.sizes.xxxsmall} / 1.3 ${({ theme }) => theme.font.family.poppins};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Title = styled.p`
  margin-top: 0.25rem;
  font: 700 1.5rem / 1.2 ${({ theme }) => theme.font.family.poppins};
  letter-spacing: -0.01em;
  overflow-wrap: break-word;
`;

export const Description = styled.p`
  font: 400 1rem / 1.6 ${({ theme }) => theme.font.family.inter};
`;

// Os assuntos possíveis, como etiquetas sobre a água.
export const Topics = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;

  li {
    padding: 0.375rem 0.875rem;
    border-radius: 999px;
    ${glassCard}
    font: 500 ${({ theme }) => theme.sizes.xxxsmall} / 1.4 ${({ theme }) => theme.font.family.inter};
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// Botão grande, da largura do conteúdo. O do WhatsApp é o principal: cheio, na cor da marca.
export const Action = styled.a<{ $principal?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-height: 56px;
  padding: 0 1.25rem;
  border-radius: 16px;
  font: 600 1rem / 1.3 ${({ theme }) => theme.font.family.inter};
  text-decoration: none;
  ${({ $principal, theme }) =>
    $principal
      ? css`
          color: ${theme.colors.backgroundDarkBlue};
          background: ${theme.colors.primary};
          border: 1px solid transparent;
        `
      : glassCard}
  transition: transform 0.15s ease;

  svg {
    flex: none;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }
`;

export const CopyEmail = styled.button`
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0 0.75rem;
  border: none;
  background: none;
  color: inherit;
  font: 500 ${({ theme }) => theme.sizes.xxxsmall} / 1.3 ${({ theme }) => theme.font.family.inter};
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
`;

// Os seletores de Modo e de Idioma de novo, para não precisar voltar ao topo.
export const Switches = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;

  a,
  button {
    min-width: 44px;
    min-height: 44px;
  }
`;

// O fundo do mar sangra até as bordas da Tela e fica no pé da seção. A areia da frente tem a cor do
// Rodapé, que continua logo abaixo.
export const SeabedBand = styled.div`
  position: relative;
  flex: none;
  height: 140px;
  margin: auto -${DOTS} 0 -${SIDE};
  overflow: hidden;
  pointer-events: none;
`;

export const Hill = styled.svg<{ $z: number }>`
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: ${({ $z }) => $z};
  width: 100%;
  height: 100%;
`;

const sway = keyframes`
  from { transform: var(--flip) rotate(-4deg); }
  to { transform: var(--flip) rotate(4deg); }
`;

// Uma peça presa ao fundo pela base: `$baseX` diz onde fica o pé na largura do desenho, para a base
// cair no ponto `$x` (% da faixa). `$bottom` e `$h` em px. As que balançam acompanham a água.
export const Piece = styled.svg<{
  $x: number;
  $h: number;
  $ratio: number;
  $baseX: number;
  $bottom: number;
  $z: number;
  $flip?: boolean;
  $rotate?: number;
  $sway?: boolean;
}>`
  --flip: ${({ $flip }) => ($flip ? 'scaleX(-1)' : 'scaleX(1)')};
  position: absolute;
  z-index: ${({ $z }) => $z};
  bottom: ${({ $bottom }) => $bottom}px;
  height: ${({ $h }) => $h}px;
  width: ${({ $h, $ratio }) => Math.round($h * $ratio)}px;
  left: calc(${({ $x }) => $x}% - ${({ $h, $ratio, $baseX }) => Math.round($h * $ratio * $baseX)}px);
  transform: var(--flip) rotate(${({ $rotate = 0 }) => $rotate}deg);
  transform-origin: ${({ $baseX, $flip }) => `${($flip ? 1 - $baseX : $baseX) * 100}% 100%`};
  animation: ${({ $sway }) => ($sway ? sway : 'none')} 5s ease-in-out infinite alternate;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem ${SIDE} 1.5rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textMuted};

  p {
    font: 400 ${({ theme }) => theme.sizes.xxxsmall} / 1.5 ${({ theme }) => theme.font.family.inter};
  }

  p a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    min-width: 44px;
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

export const Social = styled.div`
  display: flex;
  gap: 0.5rem;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    min-height: 44px;
    color: inherit;
  }
`;
