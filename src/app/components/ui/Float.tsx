'use client';

import { ReactNode, useRef } from 'react';
import { motion } from 'framer-motion';
import useFloat from './useFloat';

/** Faz o conteúdo flutuar. Ocupa todo o espaço do pai, sem alterar o layout. */
export default function Float({
  amplitude = 6,
  children
}: {
  amplitude?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { floatX, floatY, floatRotate } = useFloat(ref, amplitude);

  return (
    <motion.div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        x: floatX,
        y: floatY,
        rotate: floatRotate
      }}
    >
      {children}
    </motion.div>
  );
}
