'use client';

import { CSSProperties, useMemo, useRef } from 'react';
import { useAnimationFrame, useReducedMotion } from 'framer-motion';
import { useScene } from '@/app/lib/scene-mode';
import { seaAt } from '@/app/lib/sea';
import { SHAPES, type Part } from './creatures';
import { SEA_LIFE, swim, zoneAt, type Creature } from './life';
import { Swimmer } from './styles';

// A silhueta contrasta com a água da profundidade do animal: escura na água clara, clara na escura.
const SILHOUETTE = { light: '#03294D', dark: '#DCEBFA' };

function Drawing({ part }: { part: Part }) {
  const { d, stroke, glow, move, motion } = part;
  return (
    <g transform={move}>
      <path
        d={d}
        data-motion={motion?.kind}
        data-glow={glow ? '' : undefined}
        fill={stroke ? 'none' : glow ? 'var(--glow)' : 'currentColor'}
        fillRule="evenodd"
        stroke={stroke ? 'currentColor' : undefined}
        strokeWidth={stroke}
        strokeLinecap="round"
        style={
          motion &&
          ({
            '--amount': motion.amount,
            '--seconds': `${motion.seconds}s`,
            transformOrigin: `${motion.origin[0]}px ${motion.origin[1]}px`,
            animationDelay: `${motion.delay ?? 0}s`
          } as CSSProperties)
        }
      />
    </g>
  );
}

function Animal({ creature }: { creature: Creature }) {
  const { width, height, parts } = SHAPES[creature.kind];
  const lights = parts.filter(({ glow }) => glow);
  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g opacity={creature.opacity}>
        {parts.map((part, i) => !part.glow && <Drawing key={i} part={part} />)}
      </g>
      {lights.map((part, i) => (
        <Drawing key={i} part={part} />
      ))}
    </svg>
  );
}

/**
 * A Vida marinha: animais diferentes em cada zona de profundidade, que passam nadando atrás do
 * conteúdo conforme se desce. `measure` devolve a caixa do Mar na tela (topo e altura, em px).
 * Com movimento reduzido, não há animais.
 */
export default function SeaLife({
  measure,
  phone
}: {
  measure: () => { top: number; height: number } | undefined;
  phone?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const { scene } = useScene();
  const creatures = useMemo(() => SEA_LIFE.filter(({ extra }) => !phone || !extra), [phone]);
  const swimmers = useRef<(HTMLDivElement | null)[]>([]);

  useAnimationFrame(time => {
    const sea = measure();
    if (!sea) return;
    const { innerWidth: width, innerHeight: height } = window;
    const span = Math.max(1, sea.height - height);
    const water = { depth: -sea.top / span, span, width, height, time: time / 1000 };

    creatures.forEach((creature, index) => {
      const el = swimmers.current[index];
      if (!el) return;
      const { x, y, width: w, visible, facing } = swim(creature, index, water);
      const display = visible ? 'block' : 'none';
      if (el.style.display !== display) el.style.display = display;
      if (!visible) return;
      el.style.width = `${w}px`;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${facing})`;
    });
  });

  return (
    <div data-vida-marinha aria-hidden>
      {!reducedMotion &&
        creatures.map((creature, index) => {
          const { tone } = seaAt(creature.at, scene);
          // Sem luzes próprias no desenho, o brilho tinge o animal inteiro (a água-viva do abismo).
          const lit = creature.glow && !SHAPES[creature.kind].parts.some(({ glow }) => glow);
          return (
            <Swimmer
              key={index}
              ref={el => {
                swimmers.current[index] = el;
              }}
              data-animal={creature.kind}
              data-zona={zoneAt(creature.at)}
              data-glow={lit ? '' : undefined}
              style={
                {
                  color: lit ? creature.glow : SILHOUETTE[tone],
                  '--glow': creature.glow
                } as CSSProperties
              }
            >
              <Animal creature={creature} />
            </Swimmer>
          );
        })}
    </div>
  );
}
