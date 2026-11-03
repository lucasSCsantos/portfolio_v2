'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heading } from '../ui/typography';
import HeroWaves from '../Hero/Waves';
import { AvatarContainer } from '../Hero/styles';

// Cedem por altura, nesta ordem: a disponibilidade, o avatar, o tamanho do título.
const NO_PILL = '@media (max-height: 760px)';
const NO_AVATAR = '@media (max-height: 580px)';
const SHORT = '@media (max-height: 440px)';
// Celular deitado: duas colunas. Em retrato a coluna única continua cabendo.
const LANDSCAPE = '@media (max-height: 440px) and (orientation: landscape)';

export const AvailabilityTag = styled(motion.div)`
  margin-top: 0.5rem;
`;

export const Container = styled.main`
  /* A página nunca rola: cada medida abaixo encolhe com a altura da tela. */
  --link-height: clamp(44px, 7dvh, 56px);
  --link-gap: clamp(6px, 1.2dvh, 12px);
  --wave-height: clamp(3.5rem, 12dvh, 12rem);

  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};

  &:focus {
    outline: none;
  }

  ${AvatarContainer} {
    --avatar: clamp(72px, 14dvh, 150px);
  }

  /* Primeiro cede a disponibilidade, depois o avatar, depois o título encolhe. */
  ${NO_PILL} {
    ${AvailabilityTag} {
      display: none;
    }
  }

  ${NO_AVATAR} {
    ${AvatarContainer} {
      display: none;
    }
  }

  /* Celular deitado: duas colunas, para a lista caber na altura. */
  ${SHORT} {
    --link-gap: 6px;
  }
`;

export const Top = styled.section`
  display: flex;
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  align-items: center;
  flex-direction: column;
  padding: 3dvh 16px calc(var(--wave-height) * 1.05);
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

  ${NO_AVATAR} {
    font-size: 1.75rem;
  }

  ${SHORT} {
    font-size: 1.5rem;
  }
`;

export const Waves = styled(HeroWaves)`
  && {
    /* Mais larga que a tela: as camadas deslizam até 300 unidades e não podem deixar vazio à direita. */
    width: 130%;
    height: var(--wave-height);
  }
`;

export const Body = styled.section`
  flex: none;
  display: flex;
  justify-content: center;
  padding: 8px 16px max(16px, env(safe-area-inset-bottom));
  background-image: linear-gradient(
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
`;

export const List = styled.ul`
  display: grid;
  width: 100%;
  max-width: 480px;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--link-gap);
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    height: var(--link-height);
  }

  ${LANDSCAPE} {
    max-width: 640px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const LinkButton = styled.a<{ $principal?: boolean }>`
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
  color: ${({ theme, $principal }) =>
    $principal ? theme.colors.textLight : theme.colors.text};
  /* Vidro como o do Button do site: #f2f2f2 a 48% (7b). O Link principal é o vidro tingido de azul a 90% (e6):
     com menos que isso o texto claro cai abaixo de 4,5:1 sobre o gradiente. */
  background-color: ${({ theme, $principal }) =>
    $principal ? `${theme.colors.tertiary}e6` : `${theme.colors.textLight}7b`};
  border: 1px solid ${({ theme }) => theme.colors.white};
  backdrop-filter: blur(8px);
  /* O vidro branco tem sombra leve, para parecer parte do mar; o principal mantém a sua. */
  box-shadow: ${({ $principal }) =>
    $principal ? '0 4px 16px rgba(0, 47, 91, 0.18)' : '0 2px 8px rgba(0, 47, 91, 0.08)'};
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $principal }) =>
      $principal ? '0 8px 24px rgba(0, 47, 91, 0.28)' : '0 4px 12px rgba(0, 47, 91, 0.14)'};
  }

  /* Os PNGs são azul-claro e ficam apagados sobre o vidro: todos viram cor plana, como o texto. */
  img {
    filter: ${({ $principal }) =>
      $principal ? 'brightness(0) invert(1)' : 'brightness(0)'};
  }

  &:active {
    transform: scale(0.98);
    box-shadow: ${({ $principal }) =>
      $principal ? '0 2px 8px rgba(0, 47, 91, 0.28)' : '0 1px 4px rgba(0, 47, 91, 0.14)'};
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

  ${LANDSCAPE} {
    gap: 8px;
    padding: 0 12px;
    font-size: 0.9375rem;

    &::after {
      display: none;
    }
  }
`;

export const Label = styled.span`
  flex: 1;
  min-width: 0;
  text-align: center;
  white-space: nowrap;
`;

export const Icon = styled.span`
  display: flex;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  svg,
  img {
    width: 100%;
    height: 100%;
  }

  ${LANDSCAPE} {
    width: 24px;
    height: 24px;
  }
`;
