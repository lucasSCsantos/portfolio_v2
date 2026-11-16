'use client';

import styled from 'styled-components';
import { glassCard } from '../glass';

// Margem lateral de 20px; à direita, o espaço dos pontos da lateral (44px de toque + 4px da borda).
const SIDE = '20px';
const DOTS = '48px';

// O texto fica direto sobre o Mar, no tom da Tela (`--sea-ink`). Nada no tom de destaque: a Tela é mais alta
// que o celular, e no alto dela a água ainda é a da Tela de cima, mais clara.
export const Container = styled.section`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  padding: 3rem ${DOTS} 2rem ${SIDE};
  color: ${({ theme }) => theme.colors.onSea};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
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
  overflow-wrap: anywhere;
`;

// A animação dos peixes, pequena ao lado do título, em silhueta clara sobre a água funda.
export const Fishes = styled.div`
  flex: none;
  width: 88px;
  opacity: 0.6;
  filter: brightness(0) invert(1);
  pointer-events: none;
`;

export const List = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  li {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.125rem 1rem 1rem;
    border-radius: 18px;
    ${glassCard}
  }

  h3 {
    font: 600 1.125rem / 1.3 ${({ theme }) => theme.font.family.poppins};
    overflow-wrap: anywhere;
  }
`;

export const Position = styled.span`
  font: 700 ${({ theme }) => theme.sizes.xxxsmall} / 1 ${({ theme }) => theme.font.family.poppins};
  letter-spacing: 0.08em;
`;

export const Description = styled.p`
  font: 400 1rem / 1.55 ${({ theme }) => theme.font.family.inter};
`;

// A prova leva à Tela que a comprova; o link tem altura de toque sem afastar a linha do texto.
export const Proof = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 0.25rem;
  font: 500 1rem / 1.4 ${({ theme }) => theme.font.family.inter};

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
    -webkit-tap-highlight-color: transparent;
  }
`;

export const Button = styled.a`
  /* Mesmo botão da versão desktop (ServiceButton), com altura de toque. */
  align-self: flex-start;
  min-height: 48px;
  margin-top: 0.5rem;
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: none;
  white-space: nowrap;
  font: 600 ${({ theme }) => theme.sizes.xxxsmall} / 1.25 ${({ theme }) => theme.font.family.inter};
  color: white;
  text-align: center;
  box-shadow: -5px 7px 16px rgba(0, 0, 0, 0.15);
  background-color: ${({ theme }) => theme.colors.tertiary}cd;
  transition: 0.4s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.colors.tertiary}ff;
  }

  &:active {
    transform: scale(0.98);
  }
`;
