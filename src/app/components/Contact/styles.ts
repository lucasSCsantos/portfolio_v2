'use client';

import styled from 'styled-components';
import { Button } from '../ui/default';

export const Container = styled.section`
  /* Altura dos corais: chegar ao Contato é chegar ao fundo, com corais e algas na mesma tela. */
  --coral-h: clamp(200px, 32vh, 400px);

  flex: 1;
  overflow: hidden;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  padding-top: 88px;
  /* O conteúdo pode invadir a água acima dos corais, não as colinas. */
  padding-bottom: calc(var(--coral-h) * 0.45);
  z-index: 98;
  background-color: transparent;

  /* Telas baixas: o conteúdo aperta para Contato e rodapé caberem juntos. */
  @media (min-width: 835px) and (max-height: 880px) {
    h2 {
      font-size: 2.25rem;
    }
  }

  @media (min-width: 835px) and (max-height: 760px) {
    padding-top: 80px;
  }

  @media (max-width: 834px) {
    --coral-h: 46vw;

    padding: 80px 0 calc(var(--coral-h) * 1.7);
    & > div {
      flex-direction: column;
    }

    h1,
    h2 {
      line-height: 1.2;
    }
  }
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 0 0 495px;
  max-width: 495px;

  @media (max-width: 1024px) {
    flex: 0 0 380px;
    max-width: 380px;
  }

  @media (max-width: 834px) {
    max-width: 100%;
    flex: 1;
  }
`;

export const TopicList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const TopicItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxsmall};
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 500;

  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`;

export const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 32px;
  @media (max-width: 834px) {
    width: 100%;
    align-items: flex-start;
  }
`;

export const ContactButton = styled(Button)`
  background-image: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 35%,
    ${({ theme }) => theme.colors.tertiary} 100%
  );
  border: none;
  width: 100%;
  padding: 18px 24px;
  font-size: ${({ theme }) => theme.sizes.xsmall};
  color: ${({ theme }) => theme.colors.textLight};
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.primary}55;

  &:hover {
    filter: brightness(1.05);
    box-shadow: 0 6px 24px ${({ theme }) => theme.colors.primary}77;
  }

  @media (max-width: 428px) {
    font-size: ${({ theme }) => theme.sizes.xxsmall};
  }
`;

export const ContactCard = styled.div`
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.textLight}d9;
  border: 1.6px solid ${({ theme }) => theme.colors.white};
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 12, 32, 0.35);
  text-align: center;

  @media (max-width: 428px) {
    padding: 32px 20px;
  }
`;

export const SecondaryActions = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const SecondaryLink = styled.a<{ $full?: boolean }>`
  flex: ${({ $full }) => ($full ? 'none' : 1)};
  width: ${({ $full }) => ($full ? '100%' : 'auto')};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 12px 16px;
  border-radius: 100px;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.tertiary};
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: 1.05rem;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryShadow};
    transform: translateY(-2px);
  }

  @media (max-width: 428px) {
    font-size: 1rem;
    padding: 12px 8px;
  }
`;

export const CopyEmailButton = styled.button<{ $onGlass?: boolean }>`
  min-height: 44px;
  padding: 0 8px;
  background: none;
  border: none;
  color: ${({ theme, $onGlass }) =>
    $onGlass ? theme.colors.quaternary : theme.colors.textLight};
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
`;

export const Status = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const StatusItem = styled.li<{ $available?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textLight};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: ${({ $available }) => ($available ? '#1E9E5A' : 'transparent')};
    display: ${({ $available }) => ($available ? 'inline-block' : 'none')};
  }
`;

// Variante C: a coluna de vidro da página de Links, sem card.
export const CenterSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  z-index: 3;

  @media (min-width: 835px) {
    gap: 16px;
  }

  @media (min-width: 835px) and (max-height: 880px) {
    gap: 10px;
  }
`;

export const GlassStack = styled.div`
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* Em telas largas cabe tudo na mesma tela: WhatsApp e currículo largos, e-mail e LinkedIn lado a lado. */
  @media (min-width: 835px) {
    max-width: min(640px, max(480px, 100vw - 504px));
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    & > :first-child,
    & > :last-child {
      grid-column: span 2;
    }
  }
`;

export const GlassButton = styled.a<{ $principal?: boolean }>`
  display: flex;
  position: relative;
  align-items: center;
  gap: 16px;
  min-height: 56px;
  padding: 0 24px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.white};
  text-decoration: none;
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.family.inter};
  font-size: ${({ theme }) => theme.sizes.xxsmall};
  font-weight: 600;
  color: ${({ theme, $principal }) =>
    $principal ? theme.colors.textLight : theme.colors.text};
  background-color: ${({ theme, $principal }) =>
    $principal ? `${theme.colors.tertiary}e6` : `${theme.colors.textLight}d9`};
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(0, 12, 32, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 12, 32, 0.45);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.white};
    outline-offset: 3px;
  }

  @media (min-width: 835px) and (max-height: 880px) {
    min-height: 48px;
  }

  @media (max-width: 1279px) {
    gap: 12px;
    padding: 0 16px;
  }

  img {
    filter: ${({ $principal }) =>
      $principal ? 'brightness(0) invert(1)' : 'brightness(0)'};
  }

  /* espelha o ícone para manter o texto centralizado */
  &::after {
    content: '';
    width: 28px;
    flex-shrink: 0;
  }
`;

export const GlassIcon = styled.span`
  display: flex;
  width: 28px;
  height: 28px;
  flex-shrink: 0;

  svg,
  img {
    width: 100%;
    height: 100%;
  }
`;

export const GlassLabel = styled.span`
  flex: 1;
  text-align: center;
  white-space: nowrap;
`;

// Camada própria: cobre a seção e prende os corais ao fundo dela.
// As algas plantam a base na superfície da camada da mesma cor: as brancas na
// colina branca da frente, a azul na faixa azul do meio. As frações vêm do
// desenho dos corais (altura da superfície em cada ponto) e de cada alga (onde
// fica a base dela), então a base cai na superfície em qualquer largura.
export const CoralLayer = styled.div`
  --u: calc(var(--coral-h) / 645);
  /* Escala das algas: menores onde a margem ao lado do conteúdo é estreita. */
  --k: 1;
  /* Quanto a base afunda na superfície, para encostar sem fresta. */
  --sink: calc(var(--coral-h) * 0.015);

  position: absolute;
  inset: 0;
  pointer-events: none;

  /* O align-self: flex-end dos corais empurraria a camada para fora do bloco.
     Sem z-index próprio, a âncora pode ficar entre as camadas e afundar na areia. */
  & > div {
    align-self: auto;
    top: 0;
    z-index: auto;
  }

  && .sea-coral-back,
  && .sea-coral-mid,
  && .sea-coral-front {
    width: 100vw;
  }

  /* Ordem das camadas: fundo 0, plantas azul-escuras 1, meio 2, plantas azuis 2
     (depois do meio), âncora 3, frente 4, o que fica sobre a areia 5. */
  && .sea-coral-back {
    z-index: 0;
    bottom: 0;
    height: var(--coral-h);
  }

  && .sea-coral-mid {
    z-index: 2;
    bottom: calc(var(--coral-h) * 0.06);
    height: calc(var(--coral-h) * 0.8);
  }

  /* Passa 2px do fim: sem isso sobra uma fresta de subpixel entre a areia e o rodapé. */
  && .sea-coral-front {
    z-index: 4;
    bottom: -2px;
    height: calc(var(--coral-h) * 0.8 + 2px);
  }

  && .seaweed-1,
  && .seaweed-2,
  && .seaweed-3,
  && .seaweed-4 {
    display: block;
    width: auto;
    right: auto;
  }

  /* Branca grande no platô da esquerda (superfície a 76% da camada branca). */
  && .seaweed-2 {
    height: calc(658 * var(--u) * 1.15 * var(--k));
    left: calc(7% - var(--coral-h) * 0.51 * var(--k));
    /* A base desta fica acima do pé do desenho (13% da altura dela). */
    bottom: calc(
      var(--coral-h) * 0.6116 - var(--coral-h) * 0.1549 * var(--k) - var(--sink)
    );
  }

  /* Azul na faixa azul, no platô logo à direita (superfície a 80% da camada do meio). */
  && .seaweed-4 {
    z-index: 100;
    height: calc(312 * var(--u) * 1.15 * var(--k));
    left: calc(18% - var(--coral-h) * 0.1777 * var(--k));
    bottom: calc(var(--coral-h) * 0.6992 - var(--sink));
  }

  /* Branca na subida à direita do vale (superfície a 29%). */
  && .seaweed-1 {
    height: calc(294 * var(--u) * 1.15 * var(--k));
    left: calc(88% - var(--coral-h) * 0.3535 * var(--k));
    bottom: calc(var(--coral-h) * 0.2344 - var(--sink));
  }

  /* Branca na borda da direita (superfície a 28%). */
  && .seaweed-3 {
    height: calc(303 * var(--u) * 1.15 * var(--k));
    left: calc(97% - var(--coral-h) * 0.3129 * var(--k));
    bottom: calc(var(--coral-h) * 0.224 - var(--sink));
  }

  @media (max-width: 1279px) {
    --k: 0.8;
  }

  @media (max-width: 1023px) {
    --k: 0.65;
  }
`;

// Âncora velha assentada no vale da direita, com as patas abaixo da areia
// (superfície a 18% da altura dos corais). Translúcida e clara, como a água-viva.
export const Anchor = styled.svg`
  position: absolute;
  z-index: 3;
  height: calc(var(--coral-h) * 0.5 * var(--k));
  left: calc(76% - var(--coral-h) * 0.208 * var(--k));
  bottom: calc(var(--coral-h) * (0.178 - 0.1 * var(--k)));
  color: #f2f2f2;
  opacity: 0.22;
  transform: rotate(12deg);
`;

// Na areia, na encosta à esquerda do centro (superfície a 30%).
export const Starfish = styled.svg`
  position: absolute;
  z-index: 5;
  height: calc(var(--coral-h) * 0.12);
  left: calc(33% - var(--coral-h) * 0.06);
  bottom: calc(var(--coral-h) * 0.269);
  color: #d9826a;
  transform: rotate(18deg);
`;

// Planta presa ao fundo pela base: `$baseX` diz onde fica o pé na largura do
// desenho e `$ratio` é largura ÷ altura, para a base cair no ponto `$x`.
export const Growth = styled.svg<{
  $x: number;
  $h: number;
  $base: number;
  $z: number;
  $ratio: number;
  $baseX: number;
  $flip?: boolean;
}>`
  position: absolute;
  z-index: ${({ $z }) => $z};
  height: calc(var(--coral-h) * ${({ $h }) => $h} * var(--k));
  left: calc(
    ${({ $x }) => $x}% - var(--coral-h) *
      ${({ $h, $ratio, $baseX, $flip }) =>
        +($h * $ratio * ($flip ? 1 - $baseX : $baseX)).toFixed(4)} *
      var(--k)
  );
  bottom: calc(var(--coral-h) * ${({ $base }) => $base} - var(--sink));
  transform: ${({ $flip }) => ($flip ? 'scaleX(-1)' : 'none')};
`;
