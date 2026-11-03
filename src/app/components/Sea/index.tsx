'use client';

import { ReactNode, useRef } from 'react';
import {
  useReducedMotion,
  useScroll,
  useTransform
} from 'framer-motion';
import { dive } from '@/app/lib/scroll';
import FloatingBubble, { BubbleSpec } from './FloatingBubble';
import { Backdrop, Vignette, Zone } from './styles';

// Do raso (cor da onda do Hero) ao fundo do mar.
const DEPTH_STOPS = [0, 0.22, 0.5, 0.78, 1];
const DEPTH_COLORS = ['#79BED9', '#2A74A6', '#085690', '#043A6B', '#010F22'];

const BUBBLES: BubbleSpec[] = [
  // Atrás do conteúdo: de blobs grandes e lentos a gotas minúsculas.
  { src: '/bubble5.png', size: 300, left: 3, rise: 9, depth: 0.5, sway: 44, offset: 0, opacity: 0.55 },
  { src: '/bubble-2.svg', size: 220, left: 70, rise: 11, depth: 0.6, sway: 40, offset: 1400, opacity: 0.9 },
  { src: '/bubble4.png', size: 260, left: 84, rise: 8, depth: 0.45, sway: 36, offset: 900, opacity: 0.5, extra: true },
  { src: '/bubble7.png', size: 150, left: 16, rise: 14, depth: 0.55, sway: 38, offset: 520, opacity: 0.75 },
  { src: '/bubble6.png', size: 120, left: 38, rise: 17, depth: 0.4, sway: 30, offset: 1100, opacity: 0.7, extra: true },
  { src: '/bubble.png', size: 100, left: 50, rise: 19, depth: 0.35, sway: 28, offset: 300, opacity: 0.65 },
  { src: '/bubble-1.svg', size: 70, left: 61, rise: 23, depth: 0.25, sway: 24, offset: 1700, opacity: 0.9, extra: true },
  { src: '/bubble2.png', size: 56, left: 24, rise: 26, depth: 0.2, sway: 22, offset: 700, opacity: 0.5 },
  { src: '/bubble3.png', size: 40, left: 92, rise: 30, depth: 0.15, sway: 18, offset: 200, opacity: 0.45, extra: true },
  { src: '/bubble2.png', size: 34, left: 9, rise: 32, depth: 0.18, sway: 20, offset: 1250, opacity: 0.8 },
  { src: '/bubble3.png', size: 24, left: 31, rise: 38, depth: 0.12, sway: 16, offset: 80, opacity: 0.75, extra: true },
  { src: '/bubble2.png', size: 18, left: 56, rise: 42, depth: 0.1, sway: 14, offset: 960, opacity: 0.7 },
  { src: '/bubble3.png', size: 12, left: 74, rise: 46, depth: 0.08, sway: 12, offset: 420, opacity: 0.7, extra: true },
  { src: '/bubble2.png', size: 28, left: 97, rise: 34, depth: 0.14, sway: 18, offset: 1550, opacity: 0.75 },

  // À frente do conteúdo: mais perto da tela, então passam mais rápido na rolagem.
  { src: '/bubble4.png', size: 340, left: 58, rise: 8, depth: 1.1, sway: 50, offset: 600, opacity: 0.3, blur: 3, front: true },
  { src: '/bubble5.png', size: 220, left: -3, rise: 10, depth: 0.95, sway: 40, offset: 1300, opacity: 0.35, blur: 2, front: true, extra: true },
  { src: '/bubble7.png', size: 90, left: 27, rise: 18, depth: 0.8, sway: 30, offset: 100, opacity: 0.6, front: true },
  { src: '/bubble3.png', size: 52, left: 64, rise: 24, depth: 0.85, sway: 24, offset: 1000, opacity: 0.65, front: true, extra: true },
  { src: '/bubble3.png', size: 46, left: 80, rise: 22, depth: 1.0, sway: 26, offset: 350, opacity: 0.85, front: true },
  { src: '/bubble2.png', size: 36, left: 7, rise: 26, depth: 0.9, sway: 22, offset: 1650, opacity: 0.85, front: true },
  { src: '/bubble3.png', size: 22, left: 42, rise: 30, depth: 1.2, sway: 18, offset: 780, opacity: 0.9, front: true, extra: true },
  { src: '/bubble2.png', size: 14, left: 91, rise: 36, depth: 1.25, sway: 14, offset: 1450, opacity: 0.9, front: true }
];

/**
 * Zona submersa da página: o mar fica fixo na tela, escurece conforme se desce
 * e só o conteúdo rola por cima, dando a sensação de mergulho.
 */
export default function Sea({ children }: { children: ReactNode }) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // 0 quando o topo da zona encosta no topo da tela; 1 quando o fim da zona chega ao fim da tela.
  const { scrollYProgress: depth } = useScroll({
    target: zoneRef,
    offset: ['start start', 'end end']
  });

  const backgroundColor = useTransform(depth, DEPTH_STOPS, DEPTH_COLORS);
  const baseVignette = useTransform(depth, [0, 1], [0.1, 0.95]);
  // Durante o mergulho a vinheta fecha um pouco, como a pressão da água.
  const vignetteOpacity = useTransform(
    [baseVignette, dive],
    ([base, d]: number[]) => Math.min(1, base + d * 0.3)
  );

  return (
    <Zone ref={zoneRef}>
      <Backdrop style={{ backgroundColor }} />
      <Vignette style={{ opacity: vignetteOpacity }} />
      {!reducedMotion &&
        BUBBLES.map((spec, index) => (
          <FloatingBubble
            key={index}
            spec={spec}
            index={index}
            scrollY={scrollY}
          />
        ))}
      {children}
    </Zone>
  );
}
