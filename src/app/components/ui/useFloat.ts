'use client';

import { RefObject, useRef, useState } from 'react';
import {
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion
} from 'framer-motion';

// Cada elemento recebe uma fase diferente (ângulo áureo) para não flutuarem em uníssono.
let created = 0;

// Fração da amplitude pedida que de fato se move: mantém o balanço quase imperceptível.
const SUBTLETY = 0.35;

/**
 * Flutuação ociosa: balanço suave e contínuo, feito de senoides com frequências
 * próprias para nunca repetir igual. Só anima enquanto o elemento está na tela.
 * `amplitude` é o deslocamento vertical máximo, em px (0 desliga).
 */
export default function useFloat(ref: RefObject<Element>, amplitude: number) {
  const [seed] = useState(() => created++ * 2.399);
  const floatX = useMotionValue(0);
  const floatY = useMotionValue(0);
  const floatRotate = useMotionValue(0);

  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { margin: '120px' });
  const active = useRef(false);
  active.current = amplitude > 0 && inView && !reducedMotion;

  useAnimationFrame(time => {
    if (!active.current) return;
    const t = time / 1000;
    const reach = amplitude * SUBTLETY;
    floatY.set(
      Math.sin(t * 0.55 + seed) * reach +
        Math.sin(t * 1.2 + seed * 2) * reach * 0.3
    );
    floatX.set(Math.sin(t * 0.35 + seed * 0.8) * reach * 0.35);
    floatRotate.set(Math.sin(t * 0.4 + seed * 1.3) * reach * 0.04);
  });

  return { floatX, floatY, floatRotate };
}
