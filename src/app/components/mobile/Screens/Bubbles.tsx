'use client';

import { useReducedMotion, useScroll } from 'framer-motion';
import FloatingBubble from '../../Sea/FloatingBubble';
import { BUBBLES } from '../../Sea';

// As bolhas de trás do Mar do desktop, sem as extras: no celular, nenhuma passa à frente do conteúdo.
const PHONE_BUBBLES = BUBBLES.filter(({ front, extra }) => !front && !extra);

/** Bolhas subindo devagar ao fundo do mergulho; com movimento reduzido, não há bolhas. */
export default function Bubbles() {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  return (
    <div data-bolhas aria-hidden>
      {!reducedMotion &&
        PHONE_BUBBLES.map((spec, index) => (
          <FloatingBubble key={index} spec={spec} index={index} scrollY={scrollY} />
        ))}
    </div>
  );
}
