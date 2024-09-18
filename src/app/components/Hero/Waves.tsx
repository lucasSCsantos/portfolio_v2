'use client';
import { useScroll, motion, useTransform, useAnimation } from 'framer-motion';
import { WavesContainer } from './styles';
import { useEffect } from 'react';

function Waves() {
  const { scrollYProgress } = useScroll();

  const backWaveAnimation = useAnimation();
  const midWaveAnimation = useAnimation();
  const frontWaveAnimation = useAnimation();

  const BACK_WAVE_ANIMATION_DURATION = 8;
  const MID_WAVE_ANIMATION_DURATION = 12;
  const FRONT_WAVE_ANIMATION_DURATION = 16;

  const backWaveX = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const midWaveX = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const frontWaveX = useTransform(scrollYProgress, [0, 1], [0, -200]);

  useEffect(() => {
    backWaveAnimation.start({
      x: [-100, 0],
      transition: {
        duration: BACK_WAVE_ANIMATION_DURATION,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'reverse'
      }
    });
    midWaveAnimation.start({
      x: [-200, 0],
      transition: {
        duration: MID_WAVE_ANIMATION_DURATION,
        delay: 1.2,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'reverse'
      }
    });
    frontWaveAnimation.start({
      x: [-300, 0],
      transition: {
        duration: FRONT_WAVE_ANIMATION_DURATION,
        delay: 0.7,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'reverse'
      }
    });
  }, [backWaveAnimation, midWaveAnimation, frontWaveAnimation]);

  return (
    <WavesContainer xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 240">
      <motion.path
        className="backWave"
        fill="#1462A6"
        fillOpacity="1"
        d="M0,224L80,192C160,160,320,96,480,106.7C640,117,800,203,960,224C1120,245,1280,203,1360,181.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        style={{ translateX: backWaveX, translateY: '-6rem' }}
        animate={backWaveAnimation}
      />
      <motion.path
        className="midWave"
        fill="#398CBF"
        fillOpacity="1"
        d="M0,32L40,37.3C80,43,160,53,240,74.7C320,96,400,128,480,133.3C560,139,640,117,720,112C800,107,880,117,960,133.3C1040,149,1120,171,1200,154.7C1280,139,1360,85,1400,58.7L1440,32L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        style={{ translateX: midWaveX, translateY: '-1rem' }}
        animate={midWaveAnimation}
      />
      <motion.path
        className="frontWave"
        fill="#79BED9"
        fillOpacity="1"
        d="M0,64L30,96C60,128,120,192,180,197.3C240,203,300,149,360,122.7C420,96,480,96,540,106.7C600,117,660,139,720,149.3C780,160,840,160,900,144C960,128,1020,96,1080,74.7C1140,53,1200,43,1260,53.3C1320,64,1380,96,1410,112L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        style={{ translateX: frontWaveX, translateY: '2rem' }}
        animate={frontWaveAnimation}
      />
    </WavesContainer>
  );
  // );
}

export default Waves;
