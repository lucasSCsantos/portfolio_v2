'use client';

import styled, { keyframes } from 'styled-components';

// Margem lateral de 20px; à direita, o espaço dos pontos da lateral (44px de toque + 4px da borda).
const SIDE = '20px';
const DOTS = '48px';

// O texto fica direto sobre o Mar, no tom da Tela (`--sea-ink`); o destaque vem do peso e do tamanho.
// Sem respiro embaixo: os corais ocupam o pé da Tela.
export const Container = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 3rem ${DOTS} 0 ${SIDE};
  color: ${({ theme }) => theme.colors.onSea};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
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

// Silhueta clara da água-viva, como no desktop: decoração, mais apagada que o texto.
export const Art = styled.div`
  flex: none;
  width: 64px;
  height: 72px;
  opacity: 0.6;
  filter: brightness(0) invert(1);

  svg {
    display: block;
  }
`;

export const Description = styled.p`
  font: 400 1rem / 1.6 ${({ theme }) => theme.font.family.inter};
`;

// Três colunas a partir de 360px, quatro em 430px; em 320px, duas.
export const Grid = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 0.5rem;

  li {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    min-height: 76px;
    padding: 0.625rem 0.25rem;
    border-radius: 14px;
    border: 1px solid color-mix(in srgb, currentColor 25%, transparent);
    background: color-mix(in srgb, currentColor 8%, transparent);
    font: 500 ${({ theme }) => theme.sizes.xxxsmall} / 1.3 ${({ theme }) => theme.font.family.inter};
    text-align: center;
    white-space: nowrap;
  }

  svg {
    flex: none;
  }
`;

export const CompetenciesTitle = styled.h3`
  margin-bottom: 0.75rem;
  font: 600 1.125rem / 1.3 ${({ theme }) => theme.font.family.poppins};
`;

export const Competencies = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  li {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding-left: 0.875rem;
    border-left: 2px solid color-mix(in srgb, currentColor 45%, transparent);
  }

  strong {
    font: 700 1rem / 1.4 ${({ theme }) => theme.font.family.poppins};
  }

  span {
    font: 400 1rem / 1.6 ${({ theme }) => theme.font.family.inter};
  }
`;

// A faixa dos corais sangra até as bordas da Tela e fica no pé dela.
export const ReefBand = styled.div`
  position: relative;
  flex: none;
  height: 112px;
  margin: auto -${DOTS} 0 -${SIDE};
  overflow: hidden;
  pointer-events: none;
`;

const sway = keyframes`
  from { transform: var(--flip) rotate(-3deg); }
  to { transform: var(--flip) rotate(3deg); }
`;

export const Coral = styled.svg<{ $x: number; $h: number; $flip?: boolean }>`
  --flip: ${({ $flip }) => ($flip ? 'scaleX(-1)' : 'scaleX(1)')};
  position: absolute;
  bottom: -4px;
  left: ${({ $x }) => $x}%;
  height: ${({ $h }) => $h}%;
  width: auto;
  transform: var(--flip);
  transform-origin: 50% 100%;
  animation: ${sway} 5s ease-in-out infinite alternate;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
