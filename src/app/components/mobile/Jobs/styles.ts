'use client';

import styled from 'styled-components';
import { glassCard } from '../glass';

// Margem lateral de 20px; à direita, o espaço dos pontos da lateral (44px de toque + 4px da borda).
const SIDE = '20px';
const DOTS = '48px';

// O texto fica direto sobre o Mar: o tom vem da Tela (`--sea-ink` e `--sea-accent`).
export const Container = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  padding: 3rem ${DOTS} 3rem ${SIDE};
  color: ${({ theme }) => theme.colors.onSea};
`;

export const Label = styled.h2`
  font: 600 ${({ theme }) => theme.sizes.xxxsmall} / 1.3 ${({ theme }) => theme.font.family.poppins};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.onSeaAccent};
`;

export const Title = styled.p`
  margin-top: 0.25rem;
  font: 700 1.5rem / 1.2 ${({ theme }) => theme.font.family.poppins};
  letter-spacing: -0.01em;
  overflow-wrap: break-word;
`;

export const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Item = styled.li<{ $open: boolean }>`
  border-radius: 16px;
  ${glassCard}
  transition: border-color 0.25s ease, background 0.25s ease;

  svg {
    flex: none;
    width: 14px;
    height: 14px;
    transform: rotate(${({ $open }) => ($open ? 180 : 0)}deg);
    transition: transform 0.25s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    svg {
      transition: none;
    }
  }
`;

// O resumo inteiro é o alvo de toque: empresa (e o vínculo), cargo e período.
export const Summary = styled.button`
  width: 100%;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  > span {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  strong {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.25rem 0.5rem;
    font: 700 1.0625rem / 1.3 ${({ theme }) => theme.font.family.poppins};
  }

  // O vínculo vira uma etiqueta no tom do texto: o tom de destaque não tem contraste sobre o cartão.
  small {
    padding: 0 0.5rem;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, currentColor 50%, transparent);
    font: 600 ${({ theme }) => theme.sizes.xxxsmall} / 1.5 ${({ theme }) => theme.font.family.inter};
  }

  strong + span {
    font: 500 ${({ theme }) => theme.sizes.xxxsmall} / 1.4 ${({ theme }) => theme.font.family.inter};
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
    border-radius: 16px;
  }
`;

// Abre e fecha pela altura (de 0fr a 1fr); fechado, fica escondido também do leitor de tela e do Tab.
export const Panel = styled.div<{ $open: boolean; $animate: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transition: ${({ $animate, $open }) =>
    $animate
      ? `grid-template-rows 0.3s ease, visibility 0s linear ${$open ? '0s' : '0.3s'}`
      : 'none'};
`;

export const Body = styled.div`
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 1rem;

  > :first-child {
    margin-top: 0.25rem;
  }

  > :last-child {
    margin-bottom: 1rem;
  }
`;

export const Highlight = styled.p`
  font: 600 1rem / 1.5 ${({ theme }) => theme.font.family.inter};
`;

// O Projeto relacionado: o link ocupa a altura de um toque.
export const Project = styled.p`
  font: 400 1rem / 1.5 ${({ theme }) => theme.font.family.inter};

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    min-width: 44px;
    font-weight: 600;
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export const Achievements = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1.125rem;

  li {
    font: 400 1rem / 1.5 ${({ theme }) => theme.font.family.inter};
  }
`;

export const Techs = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;

  li {
    padding: 0.25rem 0.625rem;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
    font: 500 ${({ theme }) => theme.sizes.xxxsmall} / 1.4 ${({ theme }) => theme.font.family.inter};
  }
`;

export const Subtitle = styled.h3`
  margin-bottom: 0.5rem;
  font: 600 1.125rem / 1.3 ${({ theme }) => theme.font.family.poppins};
`;

export const Education = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  li {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  strong {
    font: 600 1rem / 1.4 ${({ theme }) => theme.font.family.inter};
  }

  span {
    font: 400 ${({ theme }) => theme.sizes.xxxsmall} / 1.4 ${({ theme }) => theme.font.family.inter};
  }
`;
