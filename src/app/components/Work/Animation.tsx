'use client';

import { useReducedMotion } from 'framer-motion';
import { useLottie, useLottieInteractivity } from 'lottie-react';
import { CSSProperties } from 'styled-components';
import fishes from '@/lotties/Jellyfish.json';

const options = {
  animationData: fishes
};

const style: CSSProperties = {
  position: 'absolute',
  width: '20vw',
  height: 'auto',
  // Silhueta clara: no fundo escuro do mar, a preta sumia.
  opacity: 0.22,
  top: 300,
  left: 0,
  zIndex: 2,
  filter: 'brightness(0) invert(1)'
};

const hiddenStyle: CSSProperties = { ...style, display: 'none' };

function Fishes() {
  const isSmallScreen = window.matchMedia('(max-width: 834px)').matches;
  const lottieObj = useLottie(options, isSmallScreen ? hiddenStyle : style);
  const Animation = useLottieInteractivity({
    lottieObj,
    mode: 'scroll',
    actions: [
      {
        visibility: [0, 1],
        type: 'seek',
        frames: [0, 400],
      }
    ],
  });

  return Animation;
}

// Os peixes nadam conforme a rolagem; sem eles quando se pede menos movimento.
export default function Animation() {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? null : <Fishes />;
}
