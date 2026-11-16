'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useLottie } from 'lottie-react';
import jellyfish from '@/lotties/Jellyfish.json';

// Com movimento reduzido, a água-viva fica parada num quadro em que aparece inteira.
const STILL_FRAME = 120;

/** A água-viva da Tela de Habilidades: só nada enquanto a Tela está à vista. */
export default function JellyfishLottie({ playing }: { playing: boolean }) {
  const reducedMotion = useReducedMotion();
  const { View, play, pause, goToAndStop, animationLoaded } = useLottie({
    animationData: jellyfish,
    loop: true,
    autoplay: false
  });

  useEffect(() => {
    if (!animationLoaded) return;
    if (reducedMotion) goToAndStop(STILL_FRAME, true);
    else if (playing) play();
    else pause();
  }, [animationLoaded, playing, reducedMotion, play, pause, goToAndStop]);

  return View;
}
