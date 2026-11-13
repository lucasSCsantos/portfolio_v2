'use client';

import { useReducedMotion } from 'framer-motion';
import { mixColor, type SceneParams } from '@/app/lib/scene';
import { SkyLayer, Star, Moon, Cloud, Drop } from './styles';

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

// Nuvens e gotas também têm lugar fixo; o clima só decide quantas aparecem.
const CLOUDS = Array.from({ length: 7 }, (_, i) => ({
  x: (i * 0.17 + random() * 0.08) % 1,
  y: 0.06 + random() * 0.42,
  width: 220 + random() * 260,
  duration: 14 + random() * 22
}));
const DROPS = Array.from({ length: 110 }, () => ({
  x: random(),
  delay: random() * 1.2,
  duration: 0.55 + random() * 0.4,
  length: 14 + random() * 16
}));

function Clouds({ scene }: { scene: SceneParams }) {
  const visible = Math.ceil(scene.cloud * CLOUDS.length);
  if (visible === 0) return null;
  // Brancas de dia, cinza-azuladas à noite, mais carregadas com chuva.
  const color = mixColor(mixColor('#ffffff', '#2b3445', scene.dark), '#4b5563', scene.rain * 0.7);
  return (
    <SkyLayer aria-hidden data-cena-camada="nuvens">
      {CLOUDS.slice(0, visible).map((cloud, i) => (
        <Cloud
          key={i}
          style={
            {
              left: `${cloud.x * 100}%`,
              top: `${cloud.y * 100}%`,
              width: cloud.width,
              height: cloud.width * 0.32,
              background: color,
              opacity: 0.25 + scene.cloud * 0.5,
              '--duration': `${cloud.duration}s`
            } as React.CSSProperties
          }
        />
      ))}
    </SkyLayer>
  );
}

// Com movimento reduzido não há gotas: o céu só fica mais nublado e escuro.
function Rain({ scene }: { scene: SceneParams }) {
  const reducedMotion = useReducedMotion();
  const count = Math.round(scene.rain * DROPS.length);
  if (count === 0 || reducedMotion) return null;
  const color = scene.dark > 0.5 ? 'rgba(190, 215, 240, 0.45)' : 'rgba(60, 90, 130, 0.4)';
  return (
    <SkyLayer aria-hidden data-cena-camada="chuva">
      {DROPS.slice(0, count).map((drop, i) => (
        <Drop
          key={i}
          style={
            {
              left: `${drop.x * 100}%`,
              height: drop.length,
              background: color,
              '--duration': `${drop.duration}s`,
              '--delay': `${drop.delay}s`
            } as React.CSSProperties
          }
        />
      ))}
    </SkyLayer>
  );
}

// Estrelas, lua, nuvens e chuva: decorativas, os leitores de tela as ignoram.
export default function Sky({ scene }: { scene: SceneParams }) {
  return (
    <>
      <Stars scene={scene} />
      <Clouds scene={scene} />
      <Rain scene={scene} />
    </>
  );
}

function Stars({ scene }: { scene: SceneParams }) {
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
