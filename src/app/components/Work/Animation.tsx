'use client';

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
  opacity: 0.36,
  top: 300,
  left: 0,
  zIndex: 2,
  filter: 'brightness(0)'
};

export default function ServicesAnimation() {
  const lottieObj = useLottie(options, style);
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
