'use client';

import styled from 'styled-components';
import { Heading } from '../ui/typography';
import HeroWaves from '../Hero/Waves';

export const Container = styled.main`
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Top = styled.section`
  /* o piso em vw evita faixas vazias nas laterais do SVG (viewBox 6:1) em telas largas */
  --wave-height: max(clamp(6rem, 24dvh, 14rem), 16.7vw);

  display: flex;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  align-items: center;
  flex-direction: column;
  padding: 3dvh 16px calc(var(--wave-height) * 1.1);
`;

export const TopContent = styled.div`
  display: flex;
  position: relative;
  z-index: 2;
  align-items: center;
  flex-direction: column;

  /* encolhe o topo em telas baixas para a lista caber sem scroll */
  @media (max-height: 760px) {
    zoom: 0.85;
  }

  @media (max-height: 660px) {
    zoom: 0.72;
  }

  @media (max-height: 560px) {
    zoom: 0.6;
  }
`;

export const Title = styled(Heading)`
  font-size: ${({ theme }) => theme.sizes.normal};

  @media (max-width: 834px) {
    font-size: 2.5rem;
  }

  @media (max-width: 428px) {
    font-size: ${({ theme }) => theme.sizes.small};
  }
`;

export const Waves = styled(HeroWaves)`
  && {
    height: var(--wave-height);
  }
`;

export const Body = styled.section`
  flex: 1;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 1dvh 16px 2.5dvh;
  background-image: linear-gradient(
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
`;

export const List = styled.ul`
  display: flex;
  width: 100%;
  max-width: 480px;
  flex-direction: column;
  justify-content: center;
  gap: clamp(6px, 1.6dvh, 14px);
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    flex: 0 1 4.5rem;
    min-height: 0;
  }
`;

export const LinkButton = styled.a<{ $featured?: boolean }>`
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  flex: 1;
  gap: 16px;
  padding: 0 24px;
  border-radius: 999px;
  text-decoration: none;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: clamp(1rem, 2.6dvh, ${({ theme }) => theme.sizes.xxsmall});
  font-weight: 600;
  color: ${({ theme, $featured }) =>
    $featured ? theme.colors.textLight : theme.colors.text};
  background-color: ${({ theme, $featured }) =>
    $featured ? theme.colors.tertiary : `${theme.colors.white}b8`};
  box-shadow: 0 4px 16px rgba(0, 47, 91, 0.18);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 47, 91, 0.28);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.white};
    outline-offset: 3px;
  }

  /* espelha o ícone para manter o texto centralizado */
  &::after {
    content: '';
    width: 28px;
    flex-shrink: 0;
  }

  .ripple {
    z-index: 2;
  }

  @media (max-width: 428px) {
    padding: 0 20px;
  }
`;

export const Label = styled.span`
  flex: 1;
  text-align: center;
`;

export const Icon = styled.span`
  display: flex;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;
