'use client';

import styled, { keyframes } from 'styled-components';
import { CardBack, CardInner } from '../../Work/styles';

// Margem lateral de 20px; à direita, o espaço dos pontos da lateral (44px de toque + 4px da borda).
const SIDE = '20px';
const DOTS = '48px';

// O texto fica direto sobre o Mar, no tom da Tela (`--sea-ink`); o destaque vem do peso e do tamanho.
export const Container = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 3rem ${DOTS} 3rem ${SIDE};
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

const pass = keyframes`
  to { transform: translateX(-50%); }
`;

export const Row = styled.div<{ $offset: boolean }>`
  transform: ${({ $offset }) => $offset ? 'translateX(-50px)' : 'none'};

  @media (prefers-reduced-motion: reduce) {
    transform: none;
    padding-left: ${({ $offset }) => $offset ? '50px' : '0'};
  }
`;

export const Track = styled.div<{ $paused: boolean; $duration: number }>`
  display: flex;
  width: max-content;
  animation: ${pass} ${({ $duration }) => $duration}s linear infinite;
  animation-play-state: ${({ $paused }) => ($paused ? 'paused' : 'running')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Rail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 -${DOTS} 0 -${SIDE};
  padding: 12px 0;
  overflow: hidden;

  @media (hover: hover) and (pointer: fine) {
    &:hover ${Track} { animation-play-state: paused; }
  }

  &:has(:focus-visible) {
    overflow-x: auto;
    ${Track} { animation: none; }
    ${Row} { transform: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    overflow-x: auto;
  }
`;

export const Grid = styled.ul`
  list-style: none;
  display: flex;
  flex: none;
  gap: 12px;
  padding-right: 12px;

  li { flex: none; }

  @media (prefers-reduced-motion: reduce) {
    &[aria-hidden] { display: none; }
  }
`;

export const SkillInner = styled(CardInner)<{ $flipped: boolean }>`
  animation: none;
  transform: ${({ $flipped }) => $flipped ? 'rotateY(180deg)' : 'none'};
  transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const SkillBack = styled(CardBack)`
  background: transparent;
  box-shadow: none;
  padding: 2px 0;
  overflow-wrap: normal;
  font-family: ${({ theme }) => theme.font.family.inter};

  strong {
    font-weight: ${({ theme }) => theme.type.subtitle.weight};
    white-space: nowrap;
    letter-spacing: -0.03em;
  }

  span {
    max-width: 100%;
    letter-spacing: -0.03em;
    text-wrap: balance;
  }
`;

export const SkillButton = styled.button`
  display: block;
  width: 88px;
  aspect-ratio: 1;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: none;
  perspective: 800px;
  font: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.white};
    outline-offset: 3px;
  }
`;

export const MotionToggle = styled.button`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 4px;
  padding: 0 8px;
  border: 0;
  background: none;
  color: inherit;
  font: 600 0.875rem / 1.4 ${({ theme }) => theme.font.family.inter};
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
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
