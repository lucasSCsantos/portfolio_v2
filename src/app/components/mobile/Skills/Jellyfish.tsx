'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useInView } from 'framer-motion';
import { Art } from './styles';

// A animação pesa (quase 1 MB comprimida): só é baixada quando a Tela se aproxima, fora da carga inicial.
const JellyfishLottie = dynamic(() => import('./JellyfishLottie'), { ssr: false });

/** A ilustração pequena junto ao título: a mesma água-viva das Habilidades do desktop. */
export default function Jellyfish() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: '600px 0px' });
  const visible = useInView(ref);

  return (
    <Art ref={ref} data-lottie aria-hidden>
      {near && <JellyfishLottie playing={visible} />}
    </Art>
  );
}
