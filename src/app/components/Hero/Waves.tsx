'use client';

import { sceneFor, type ColorTrio } from '@/app/lib/scene';
import { CROSSFADE_SECONDS } from '@/app/lib/scene-mode';
import { useCallback, useEffect, useRef } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type AnimationPlaybackControls
} from 'framer-motion';
import { WavesContainer } from './styles';

const waveTransition = (duration: number, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  ease: 'easeInOut' as const,
  repeatType: 'reverse' as const
});

// Os laços das ondas começam uma vez e depois só mudam de ritmo: trocar a duração da transição não
// refaz a animação, e refazê-la levaria a onda de volta ao começo, num salto. `durationScale` é o
// multiplicador da duração (menor = mais rápido); o framer pede o contrário, a taxa de reprodução.
function useRhythm(durationScale: number) {
  const loop = useRef<AnimationPlaybackControls>();
  const rate = useRef(1 / durationScale);
  rate.current = 1 / durationScale;

  useEffect(() => {
    if (loop.current) loop.current.speed = rate.current;
  }, [durationScale]);

  // Põe um laço já no ritmo atual e o acompanha nas próximas mudanças de ritmo; devolve a limpeza.
  return useCallback((controls: AnimationPlaybackControls) => {
    controls.speed = rate.current;
    loop.current = controls;
    return () => {
      controls.stop();
      if (loop.current === controls) loop.current = undefined;
    };
  }, []);
}

// O deslize de uma camada.
function useSlide(from: number, duration: number, delay: number, durationScale: number, still: boolean) {
  // Parada, a onda fica na base, sem o deslocamento do deslize.
  const x = useMotionValue(still ? 0 : from);
  const play = useRhythm(durationScale);

  useEffect(() => {
    if (still) {
      x.set(0);
      return;
    }
    return play(animate(x, [from, 0], waveTransition(duration, delay)));
  }, [x, from, duration, delay, still, play]);

  return x;
}

// O sobe-e-desce de uma camada. Sem balanço, ela volta suavemente à base em vez de ficar parada onde estava.
function useBob(height: number, duration: number, durationScale: number, still: boolean) {
  const y = useMotionValue(0);
  const play = useRhythm(durationScale);

  useEffect(() => {
    if (height <= 0) {
      const settle = animate(y, 0, { duration: still ? 0 : CROSSFADE_SECONDS });
      return () => settle.stop();
    }
    return play(animate(y, [0, -height, 0], { duration, repeat: Infinity, ease: 'easeInOut' }));
  }, [y, height, duration, still, play]);

  return y;
}

type WavesProps = {
  className?: string;
  parallax?: boolean;
  // Preenche a largura cortando a base lisa, em vez de deixar faixas vazias nas laterais.
  cover?: boolean;
  // Cores de trás para a frente, a altura (1 = as ondas de sempre) e o multiplicador da duração do deslize.
  colors?: ColorTrio;
  amplitude?: number;
  // A altura que dita o sobe-e-desce; por padrão, a própria amplitude.
  bobAmplitude?: number;
  speed?: number;
};

// As ondas de sempre são as da Cena em `dia`: uma fonte só para essas cores.
const DEFAULT_COLORS = sceneFor({ mode: 'dia' }).waves;

function Waves({
  className,
  parallax = true,
  cover = false,
  colors = DEFAULT_COLORS,
  amplitude = 1,
  bobAmplitude = amplitude,
  speed = 1
}: WavesProps) {
  const { scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();

  const scrollRange = (distance: number) =>
    parallax && !reducedMotion ? [0, distance] : [0, 0];

  const backWaveX = useTransform(scrollYProgress, [0, 1], scrollRange(2000));
  const midWaveX = useTransform(scrollYProgress, [0, 1], scrollRange(-1350));
  const frontWaveX = useTransform(scrollYProgress, [0, 1], scrollRange(-800));

  const still = Boolean(reducedMotion);
  const backSlide = useSlide(-100, 8, 0, speed, still);
  const midSlide = useSlide(-200, 12, 1.2, speed, still);
  const frontSlide = useSlide(-300, 18, 0.7, speed, still);

  // A altura vem de um esticão suave a partir da base mais um sobe-e-desce; com a amplitude de sempre, nenhum dos dois.
  const scaleY = 1 + (amplitude - 1) * 0.3;
  const bob = still ? 0 : Math.max(0, bobAmplitude - 1) * 12;
  const backBob = useBob(bob, 7, speed, still);
  const midBob = useBob(bob, 10, speed, still);
  const frontBob = useBob(bob, 13, speed, still);

  return (
    <WavesContainer
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 240"
      preserveAspectRatio={cover ? 'xMidYMin slice' : undefined}
    >
      <motion.g style={{ x: backWaveX }}>
        <motion.g style={{ y: backBob }}>
        <motion.path
          fill={colors[0]}
          fillOpacity="1"
          d="M0,224L80,192C160,160,320,96,480,106.7C640,117,800,203,960,224C1120,245,1280,203,1360,181.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          style={{ x: backSlide, translateY: '-6rem', scaleY, originY: 1 }}
        />
        </motion.g>
      </motion.g>
      <motion.g style={{ x: midWaveX }}>
        <motion.g style={{ y: midBob }}>
        <motion.path
          fill={colors[1]}
          fillOpacity="1"
          d="M0,32L40,37.3C80,43,160,53,240,74.7C320,96,400,128,480,133.3C560,139,640,117,720,112C800,107,880,117,960,133.3C1040,149,1120,171,1200,154.7C1280,139,1360,85,1400,58.7L1440,32L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          style={{ x: midSlide, translateY: '-1rem', scaleY, originY: 1 }}
        />
        </motion.g>
      </motion.g>
      <motion.g style={{ x: frontWaveX }}>
        <motion.g style={{ y: frontBob }}>
        <motion.path
          fill={colors[2]}
          fillOpacity="1"
          d="M0,64L30,96C60,128,120,192,180,197.3C240,203,300,149,360,122.7C420,96,480,96,540,106.7C600,117,660,139,720,149.3C780,160,840,160,900,144C960,128,1020,96,1080,74.7C1140,53,1200,43,1260,53.3C1320,64,1380,96,1410,112L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          style={{ x: frontSlide, translateY: '2rem', scaleY, originY: 1 }}
        />
        </motion.g>
      </motion.g>
    </WavesContainer>
  );
}

export default Waves;
