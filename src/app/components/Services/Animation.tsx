'use client';

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
  opacity: 1,
  top: -100,
  zIndex: 2
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
        frames: [0, 100]
      }
    ]
  });

  return Animation;
}
