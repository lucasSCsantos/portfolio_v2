'use client';

import Image from 'next/image';
import { MotionValue, useAnimationFrame, useMotionValue } from 'framer-motion';
import { BubbleWrapper } from './styles';

export type BubbleSpec = {
  src: string;
  /** Lado (px) da bolha. */
  size: number;
  /** Posição horizontal base, em % da largura da tela. */
  left: number;
  /** Subida própria, em px/s. */
  rise: number;
  /** Quanto a rolagem empurra a bolha para cima (profundidade: maior = mais perto). */
  depth: number;
  /** Amplitude do balanço lateral, em px. */
  sway: number;
  /** Desloca a bolha no ciclo, em px. */
  offset: number;
  opacity: number;
  /** Passa por cima do conteúdo (em vez de ficar atrás). */
  front?: boolean;
  /** Desfoque (px), para bolhas fora de foco. */
  blur?: number;
  /** Bolhas extras somem em telas pequenas. */
  extra?: boolean;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Bolha livre: sobe sem parar, balança em caminho feito de várias senoides
 * (nunca repete igual) e sobe mais rápido quando a página desce.
 */
export default function FloatingBubble({
  spec,
  index,
  scrollY
}: {
  spec: BubbleSpec;
  index: number;
  scrollY: MotionValue<number>;
}) {
  const {
    src,
    size,
    left,
    rise,
    depth,
    sway,
    offset,
    opacity,
    front,
    blur,
    extra
  } = spec;
  const x = useMotionValue(0);
  const y = useMotionValue(-size * 2);
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);

  // Fases e frequências próprias de cada bolha, para que nenhuma ande igual.
  const seed = index * 2.399;

  useAnimationFrame(time => {
    const t = time / 1000;
    const vh = window.innerHeight;
    const range = vh + size * 2;

    const travel = t * rise + scrollY.get() * depth + offset;
    y.set(vh + size - mod(travel, range));

    x.set(
      Math.sin(t * 0.55 + seed) * sway +
        Math.sin(t * 1.3 + seed * 2) * sway * 0.35 +
        Math.sin(t * 0.17 + seed * 3) * sway * 0.8
    );
    rotate.set(Math.sin(t * 0.4 + seed) * 14);
    scale.set(1 + Math.sin(t * 0.9 + seed * 1.7) * 0.045);
  });

  return (
    <BubbleWrapper
      $extra={extra}
      $front={front}
      style={{
        left: `${left}%`,
        width: size,
        x,
        y,
        rotate,
        scale,
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined
      }}
    >
      <Image
        src={src}
        width={size}
        height={size}
        sizes={`${size}px`}
        alt=""
        aria-hidden
        style={{ width: '100%', height: 'auto' }}
      />
    </BubbleWrapper>
  );
}
