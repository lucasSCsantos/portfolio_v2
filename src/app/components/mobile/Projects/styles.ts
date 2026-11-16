'use client';

import styled from 'styled-components';

// Margem lateral de 20px; à direita, o espaço dos pontos da lateral (44px de toque + 4px da borda).
const SIDE = '20px';
const DOTS = '48px';
// Linhas da descrição antes de "ler mais".
const CLAMP = 3;

// O texto fica direto sobre o Mar, todo no tom da Tela (`--sea-ink`): o destaque das Telas do meio
// não tem contraste sobre a água desta profundidade, então a ênfase vem do peso e da caixa.
export const Container = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
  padding: 3rem ${DOTS} 2.5rem ${SIDE};
  color: ${({ theme }) => theme.colors.onSea};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;

  & > div:first-child {
    min-width: 0;
  }
`;

export const Label = styled.h2`
  font: 600 ${({ theme }) => theme.sizes.xxxsmall} / 1.3 ${({ theme }) => theme.font.family.poppins};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Title = styled.p`
  margin-top: 0.25rem;
  font: 700 1.375rem / 1.2 ${({ theme }) => theme.font.family.poppins};
  letter-spacing: -0.01em;
  overflow-wrap: break-word;
`;

// Os peixes do desktop, pequenos e em silhueta junto ao título.
export const Fish = styled.div`
  flex: none;
  width: 112px;
  opacity: 0.45;
  filter: brightness(0);
  pointer-events: none;
`;

// O paginador sangra até as bordas da Tela e rola por dentro; a página nunca rola para o lado.
export const Pager = styled.ul`
  list-style: none;
  display: flex;
  margin: 0 -${DOTS} 0 -${SIDE};
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
  }
`;

// Cada página ocupa o paginador inteiro; todas esticam até a mais alta, então nada pula ao deslizar.
export const Page = styled.li`
  flex: 0 0 100%;
  display: flex;
  padding: 0 ${DOTS} 0 ${SIDE};
  scroll-snap-align: start;
  scroll-snap-stop: always;
`;

export const Card = styled.article`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.75rem;
  border-radius: 20px;
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  /* No alto da Tela a água ainda é clara para o texto: o cartão puxa para a cor do pé dela. */
  background: color-mix(in srgb, ${({ theme }) => theme.colors.sea} 60%, transparent);
`;

export const Picture = styled.div`
  position: relative;
  height: 168px;
  border-radius: 12px;
  overflow: hidden;
  background: color-mix(in srgb, currentColor 12%, transparent);

  img {
    object-fit: cover;
  }
`;

export const Relation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font: 600 ${({ theme }) => theme.sizes.xxxsmall} / 1.4 ${({ theme }) => theme.font.family.inter};
`;

export const Dot = styled.span`
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 0 1.5px color-mix(in srgb, currentColor 60%, transparent);
`;

export const ProjectTitle = styled.h3`
  font: 700 1.25rem / 1.25 ${({ theme }) => theme.font.family.poppins};
  overflow-wrap: break-word;
`;

export const Meta = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.375rem;
  font: 400 1rem / 1.4 ${({ theme }) => theme.font.family.inter};

  dt::after {
    content: ':';
  }

  dd {
    margin: 0;
    font-weight: 600;
  }
`;

export const Result = styled.p`
  font: 700 1rem / 1.35 ${({ theme }) => theme.font.family.poppins};
`;

export const Techs = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;

  li {
    padding: 0.125rem 0.625rem;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, currentColor 45%, transparent);
    font: 500 ${({ theme }) => theme.sizes.xxxsmall} / 1.5 ${({ theme }) => theme.font.family.inter};
  }
`;

export const Description = styled.p<{ $expanded: boolean }>`
  font: 400 1rem / 1.6 ${({ theme }) => theme.font.family.inter};
  ${({ $expanded }) =>
    !$expanded &&
    `
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: ${CLAMP};
      overflow: hidden;
    `}
`;

export const ReadMore = styled.button`
  align-self: flex-start;
  min-height: 44px;
  min-width: 44px;
  margin: -0.625rem 0 0 -0.5rem;
  padding: 0 0.5rem;
  border: none;
  background: none;
  font: 600 1rem / 1 ${({ theme }) => theme.font.family.inter};
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
`;

// As ações ficam no pé da página, alinhadas entre os Projetos.
export const Actions = styled.div`
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  &:empty {
    display: none;
  }
`;

// O botão inverte o Mar: fundo da cor do texto, texto da cor da água.
export const Action = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 1.25rem;
  border: none;
  border-radius: 12px;
  font: 600 1rem / 1 ${({ theme }) => theme.font.family.inter};
  color: ${({ theme }) => theme.colors.sea};
  background: ${({ theme }) => theme.colors.onSea};
  text-decoration: none;
  cursor: pointer;
`;

export const Offline = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 1rem;
  border-radius: 12px;
  border: 1px dashed currentColor;
  font: 600 ${({ theme }) => theme.sizes.xxxsmall} / 1.3 ${({ theme }) => theme.font.family.inter};
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const Step = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, currentColor 50%, transparent);
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 400 1.75rem / 1 ${({ theme }) => theme.font.family.poppins};
  color: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

export const Counter = styled.span`
  min-width: 4.5rem;
  text-align: center;
  font: 600 1rem / 1 ${({ theme }) => theme.font.family.poppins};
  font-variant-numeric: tabular-nums;
`;
