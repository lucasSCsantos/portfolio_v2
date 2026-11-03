'use client';

import styled, { css } from 'styled-components';
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

// Espaço entre o topo da base azul e o primeiro Link.
const BODY_PADDING_TOP = '8px';

export const Container = styled.main<{ $count: number }>`
  /* A página nunca rola: cada medida abaixo encolhe com a altura da tela. */
  --link-height: clamp(44px, 7dvh, 56px);
  --link-gap: clamp(6px, 1.2dvh, 12px);
  --wave-height: clamp(3.5rem, 12dvh, 12rem);
  /* Altura da base azul, para o texto e o ícone vazados acharem a cor do gradiente atrás deles. */
  --rows: ${({ $count }) => $count};
  --body-height: calc(
    ${BODY_PADDING_TOP} + var(--rows) * var(--link-height) +
      (var(--rows) - 1) * var(--link-gap) + max(16px, env(safe-area-inset-bottom))
  );

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

  ${LANDSCAPE} {
    --rows: ${({ $count }) => Math.ceil($count / 2)};
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
  padding: ${BODY_PADDING_TOP} 16px max(16px, env(safe-area-inset-bottom));
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
    --r: var(--row);
    /* Distância do topo da base azul até este Link. */
    --item-top: calc(${BODY_PADDING_TOP} + var(--r) * (var(--link-height) + var(--link-gap)));
    display: flex;
    height: var(--link-height);
  }

  ${LANDSCAPE} {
    max-width: 640px;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    li {
      --r: var(--row2);
    }
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
  --icon-size: 28px;
  ${({ theme, $principal }) =>
    $principal
      ? css`
          color: ${theme.colors.textLight};
          /* O Link principal é o vidro tingido de azul a 90% (e6): com menos que isso
             o texto claro cai abaixo de 4,5:1 sobre o gradiente. */
          background-color: ${theme.colors.tertiary}e6;
        `
      : css`
          /* Vidro como o do Button do site: #f2f2f2 a 48% (7b). O texto é vazado: a camada de
             cima, recortada no formato das letras, é o mesmo gradiente da base azul, alinhado
             com ele, e por isso o texto mostra o mar atrás do botão. */
          color: transparent;
          background-image:
            linear-gradient(${theme.colors.primary}, ${theme.colors.secondary}),
            linear-gradient(${theme.colors.textLight}7b, ${theme.colors.textLight}7b);
          background-size:
            100% var(--body-height),
            auto;
          background-position:
            0 calc(-1 * var(--item-top)),
            0 0;
          background-repeat: no-repeat;
          background-origin: border-box;
          -webkit-background-clip: text, border-box;
          background-clip: text, border-box;
        `}
  border: 1px solid ${({ theme }) => theme.colors.white};
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(0, 47, 91, 0.18);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 47, 91, 0.28);
  }

  /* Os PNGs são azul-claro e somem sobre o vidro azul: no Link principal ficam brancos. */
  img {
    filter: brightness(0) invert(1);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 47, 91, 0.28);
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
    --icon-size: 24px;
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
  width: var(--icon-size);
  height: var(--icon-size);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  svg,
  img {
    width: 100%;
    height: 100%;
  }
`;

// O ícone vira um furo no botão: a máscara dá o formato e o fundo é o gradiente da base azul.
export const KnockoutIcon = styled.span`
  display: block;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  background-size: 100% var(--body-height);
  background-repeat: no-repeat;
  background-position: 0
    calc(-1 * (var(--item-top) + (var(--link-height) - var(--icon-size)) / 2));
  -webkit-mask: var(--icon) center / contain no-repeat;
  mask: var(--icon) center / contain no-repeat;
`;
