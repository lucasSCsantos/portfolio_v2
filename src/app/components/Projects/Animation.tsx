'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLottie, useLottieInteractivity } from 'lottie-react';
import { CSSProperties } from 'styled-components';
import fishes from '@/lotties/fish.json';

const options = {
  animationData: fishes
};

const style: CSSProperties = {
  position: 'absolute',
  width: '100vw',
  height: 'auto',
  opacity: 0.36,
  top: 280,
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

// Os peixes nadam sozinhos, em laço, do tamanho que quem os usa der; com menos movimento, ficam parados.
function LoopingFishes({ style }: { style?: CSSProperties }) {
  const reducedMotion = useReducedMotion();
  const { View, play, stop } = useLottie({ ...options, autoplay: !reducedMotion }, style);

  useEffect(() => {
    if (reducedMotion) stop();
    else play();
  }, [reducedMotion, play, stop]);

  return View;
}

// Os peixes nadam conforme a rolagem; sem eles quando se pede menos movimento.
// Com `loop`, viram uma ilustração pequena (a da Tela de Projetos no celular).
export default function Animation({ loop, style }: { loop?: boolean; style?: CSSProperties }) {
  const reducedMotion = useReducedMotion();
  if (loop) return <LoopingFishes style={style} />;
  return reducedMotion ? null : <Fishes />;
}
