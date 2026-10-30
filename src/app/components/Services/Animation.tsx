'use client';

import { useReducedMotion } from 'framer-motion';
import { useLottie, useLottieInteractivity } from 'lottie-react';
import { CSSProperties } from 'styled-components';
import fishes from '@/lotties/fishes-animation-blue.json';

const options = {
  animationData: fishes
};

const style: CSSProperties = {
  position: 'absolute',
  width: '100vw',
  height: 'auto',
  opacity: 0.36,
  top: -10,
  zIndex: 2,
  filter: 'brightness(0)'
};

function Fishes() {
  const lottieObj = useLottie(options, style);
  const Animation = useLottieInteractivity({
    lottieObj,
    mode: 'scroll',
    actions: [
      {
        visibility: [0, 1],
        type: 'seek',
        frames: [0, 200],
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
