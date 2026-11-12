'use client';

import type { SceneParams } from '@/app/lib/scene';
import { SkyLayer, Star, Moon } from './styles';

const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Sempre as mesmas estrelas: o céu não muda de desenho a cada visita.
const random = seeded(7);
const STARS = Array.from({ length: 70 }, () => ({
  x: random(),
  y: random() * 0.62,
  size: 1 + random() * 1.8,
  duration: 2 + random() * 3,
  delay: random() * 4
}));

// Estrelas e lua: decorativas, os leitores de tela as ignoram.
export default function Sky({ scene }: { scene: SceneParams }) {
  if (scene.stars <= 0) return null;
  return (
    <>
      <SkyLayer aria-hidden data-cena-camada="estrelas" style={{ opacity: scene.stars }}>
        {STARS.map((star, i) => (
          <Star
            key={i}
            style={
              {
                left: `${star.x * 100}%`,
                top: `${star.y * 100}%`,
                width: star.size,
                height: star.size,
                '--duration': `${star.duration}s`,
                '--delay': `${star.delay}s`
              } as React.CSSProperties
            }
          />
        ))}
      </SkyLayer>
      <SkyLayer aria-hidden data-cena-camada="lua" style={{ opacity: scene.stars }}>
        <Moon />
      </SkyLayer>
    </>
  );
}
