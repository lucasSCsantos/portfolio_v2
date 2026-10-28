'use client';

import styled from 'styled-components';
import { Heading } from '../ui/typography';
import HeroWaves from '../Hero/Waves';

export const Container = styled.main`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Top = styled.section`
  --wave-height: 14rem;

  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  flex-direction: column;
  padding: 4dvh 16px calc(var(--wave-height) * 1.1);

  @media (max-width: 834px) {
    --wave-height: 11rem;
  }

  @media (max-width: 428px) {
    --wave-height: 8rem;
    padding-top: 3dvh;
  }
`;

export const TopContent = styled.div`
  display: flex;
  position: relative;
  z-index: 2;
  align-items: center;
  flex-direction: column;
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
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px 16px 64px;
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
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const LinkButton = styled.a<{ $featured?: boolean }>`
  display: flex;
  position: relative;
  overflow: hidden;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-radius: 999px;
  text-decoration: none;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxsmall};
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
    padding: 14px 20px;
    font-size: 1.125rem;
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
