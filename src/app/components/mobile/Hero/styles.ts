'use client';

import styled, { keyframes } from 'styled-components';
import { ctaVariant } from '../../ui/default';
import Waves from '../../Hero/Waves';
import { textOnScene, type SceneParams } from '@/app/lib/scene';

// Largura dos convites e da proposta de valor: centrados, sem entrar na área de toque dos pontos da
// lateral (44px a 4px da borda, mais folga).
const COLUMN = 'min(18.5rem, 100vw - 104px)';

// O céu vem por variáveis (--sky-top, --sky-middle, --sky-bottom), como no Hero do desktop.
export const Container = styled.section<{ $tone: SceneParams['tone'] }>`
  position: relative;
  flex: 1;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
  background-image: linear-gradient(
    180deg,
    var(--sky-top) 0%,
    var(--sky-middle) 55%,
    var(--sky-bottom) 100%
  );
  color: ${({ $tone }) => textOnScene($tone).ink};
`;

// Os seletores de Modo e de Idioma, com área de toque de 44px.
export const TopBar = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 16px 16px 0;

  a,
  button {
    min-width: 44px;
    min-height: 44px;
  }
`;

const enter = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: none; }
`;

export const Intro = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  /* Embaixo, espaço para o convite "Mergulhe" sobre as ondas. */
  padding: 12px 16px 88px;
  text-align: center;
  animation: ${enter} 0.8s ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Greeting = styled.p`
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxsmall};
  line-height: 1.3;
`;

export const Title = styled.h1<{ $tone: SceneParams['tone'] }>`
  margin-top: -6px;
  padding-bottom: 0.1em;
  font-family: ${({ theme }) => theme.font.family.poppins};
  font-size: clamp(2.125rem, 10.5vw, 3rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  -webkit-text-fill-color: transparent;
  background-image: ${({ $tone }) => textOnScene($tone).titleGradient};
  background-clip: text;
  -webkit-background-clip: text;
`;

export const ValueProp = styled.p`
  max-width: calc(${COLUMN});
  padding: 8px 16px;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.colors.backgroundDarkBlue}e6;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  line-height: 1.5;
`;

// O selo de disponibilidade e, logo abaixo, o Aviso de sono (rótulos de 14px).
export const AvailabilityStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  p {
    font-size: 0.875rem;
  }
`;

export const Availability = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 4px 14px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.primaryShadow};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};

  &::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: #1f9d55;
  }
`;

// O convite principal ocupa a linha; os outros dois dividem a de baixo quando cabem.
export const Ctas = styled.div`
  width: min(100%, ${COLUMN});
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;

  & > * {
    flex: 1 1 auto;
  }

  & > :first-child {
    flex-basis: 100%;
  }
`;

const ctaBase = `
  min-height: 48px;
  padding: 0 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
`;

export const Cta = styled.a<{ $variant: 'solid' | 'light' }>`
  ${ctaBase}
  font-family: ${({ theme }) => theme.font.family.inter};
  ${({ $variant }) => ctaVariant($variant)}

  &:active {
    transform: scale(0.98);
  }
`;

const bob = keyframes`
  0%, 100% { transform: none; }
  50% { transform: translateY(4px); }
`;

// O convite para descer, sobre a onda da frente.
export const DiveLink = styled.a`
  position: absolute;
  left: 50%;
  bottom: 20px;
  z-index: 2;
  min-width: 44px;
  min-height: 44px;
  padding: 0 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.backgroundDarkBlue}e6;
  color: ${({ theme }) => theme.colors.textLight};
  font: 600 1rem / 1 ${({ theme }) => theme.font.family.poppins};
  transform: translateX(-50%);
  -webkit-tap-highlight-color: transparent;

  /* Só a seta balança: o convite em si fica parado sob o dedo. */
  svg {
    animation: ${bob} 2.4s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    svg {
      animation: none;
    }
  }
`;

// As ondas da Cena preenchem a largura cortando as laterais, centradas (sem a largura explícita, o SVG
// posicionado toma a largura própria e encosta à esquerda). Altas o bastante para que o deslize e o
// parallax das camadas nunca mostrem a ponta do desenho; em paisagem, crescem com a largura.
export const PhoneWaves = styled(Waves)`
  && {
    width: 100%;
    height: max(200px, 34vw);
  }
`;
