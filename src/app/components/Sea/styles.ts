'use client';

import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

// O clip-path recorta o fundo `fixed` aos limites da zona: o mar fica "travado"
// na tela, mas só aparece enquanto a zona estiver na viewport.
export const Zone = styled.div`
  position: relative;
  clip-path: inset(0);
`;

export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

export const Vignette = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 35%,
    rgba(0, 12, 32, 0) 35%,
    rgba(0, 8, 24, 0.85) 100%
  );
`;

// Bolhas da frente passam por cima do conteúdo (sem capturar cliques).
export const BubbleWrapper = styled(motion.div)<{
  $extra?: boolean;
  $front?: boolean;
}>`
  position: fixed;
  top: 0;
  z-index: ${({ $front }) => ($front ? 150 : 0)};
  pointer-events: none;
  user-select: none;
  will-change: transform;

  @media (max-width: 834px) {
    display: ${({ $extra }) => ($extra ? 'none' : 'block')};
  }
`;

const sway = keyframes`
  from { transform: rotate(calc(var(--amount) * -1deg)); }
  to { transform: rotate(calc(var(--amount) * 1deg)); }
`;

const squashX = keyframes`
  to { transform: scaleX(var(--amount)); }
`;

const squashY = keyframes`
  to { transform: scaleY(var(--amount)); }
`;

// Um animal da Vida marinha: silhueta atrás do conteúdo, posicionada a cada quadro (ver SeaLife).
// As partes do desenho se mexem sozinhas: cauda, nadadeiras, tentáculos.
export const Swimmer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  display: none;
  pointer-events: none;
  user-select: none;
  will-change: transform;

  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }

  [data-motion] {
    animation: var(--seconds) ease-in-out infinite alternate;
  }

  [data-motion='sway'] {
    animation-name: ${sway};
  }

  [data-motion='squashX'] {
    animation-name: ${squashX};
  }

  [data-motion='squashY'] {
    animation-name: ${squashY};
  }

  &[data-glow],
  [data-glow] {
    filter: drop-shadow(0 0 4px var(--glow)) drop-shadow(0 0 12px var(--glow));
  }
`;

// Fundo do mar: Contato e rodapé dividem a última tela, então chegar ao Contato é chegar ao fim da página.
export const Seabed = styled.div`
  min-height: 100svh;
  display: flex;
  flex-direction: column;
`;
