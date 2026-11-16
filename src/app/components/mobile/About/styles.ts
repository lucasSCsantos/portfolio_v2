'use client';

import styled from 'styled-components';
import { glassCard } from '../glass';

// Margem lateral de 20px; à direita, o espaço dos pontos da lateral (44px de toque + 4px da borda).
const SIDE = '20px';
const DOTS = '48px';

// O texto fica direto sobre o Mar, no tom da Tela (`--sea-ink`). O tom de destaque do Mar não chega a
// 4,5:1 neste trecho da descida (de dia, nem 3:1): o destaque vem do peso e do tamanho, não da cor.
export const Container = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  padding: 3rem ${DOTS} 3rem ${SIDE};
  color: ${({ theme }) => theme.colors.onSea};
`;

export const Intro = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    flex: none;
    width: 88px;
    height: 88px;
    border-radius: 20px;
    object-fit: cover;
    box-shadow: 0 8px 24px rgba(0, 12, 32, 0.25);
  }
`;

export const Label = styled.h2`
  font: 600 ${({ theme }) => theme.sizes.xxxsmall} / 1.3 ${({ theme }) => theme.font.family.poppins};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Name = styled.p`
  margin-top: 0.25rem;
  font: 700 1.5rem / 1.2 ${({ theme }) => theme.font.family.poppins};
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
`;

export const Bio = styled.p`
  font: 400 1rem / 1.6 ${({ theme }) => theme.font.family.inter};
`;

export const Stats = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 0.75rem;

  li {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  strong {
    font: 700 1.5rem / 1.15 ${({ theme }) => theme.font.family.poppins};
  }

  span {
    font: 500 ${({ theme }) => theme.sizes.xxxsmall} / 1.4 ${({ theme }) => theme.font.family.inter};
  }
`;

export const MethodTitle = styled.h3`
  font: 600 1.125rem / 1.3 ${({ theme }) => theme.font.family.poppins};
`;

// A faixa sangra até as bordas da Tela e rola por dentro; a página nunca rola para o lado.
export const Method = styled.ol`
  list-style: none;
  display: flex;
  gap: 0.5rem;
  margin: 0 -${DOTS} 0 -${SIDE};
  padding: 0.75rem ${DOTS} 0.25rem ${SIDE};
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  scroll-padding-inline: ${SIDE};
  scrollbar-width: none;
  counter-reset: step;

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
  }

  li {
    flex: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    padding: 0.5rem 0.875rem;
    border-radius: 14px;
    ${glassCard}
    font: 500 1rem / 1.3 ${({ theme }) => theme.font.family.inter};
    white-space: nowrap;
    scroll-snap-align: start;
    counter-increment: step;
  }

  li::before {
    content: counter(step);
    font: 700 1rem / 1 ${({ theme }) => theme.font.family.poppins};
  }
`;
