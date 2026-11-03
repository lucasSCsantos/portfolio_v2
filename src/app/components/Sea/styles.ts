'use client';

import { motion } from 'framer-motion';
import styled from 'styled-components';

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

// Fundo do mar: Contato e rodapé dividem a última tela, então chegar ao Contato é chegar ao fim da página.
export const Seabed = styled.div`
  min-height: 100svh;
  display: flex;
  flex-direction: column;
`;
