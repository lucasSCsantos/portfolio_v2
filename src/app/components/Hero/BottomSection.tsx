import { useRef } from 'react';
import { Area, Button } from '../ui/default';
import { motion, useScroll, useTransform } from 'framer-motion';
import content from '@/meta/content';

export default function BottomSection() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const id = 'contato';
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0], {
    clamp: true
  });

  const y = useTransform(scrollYProgress, [0, 0.3], [0, -50], {
    clamp: true
  });

  return (
    <Area
      ref={ref}
      $width={100}
      $height={'50%'}
      $direction="column"
      $justify="flex-start"
      style={{ paddingTop: 32, zIndex: 99 }}
      id="hero-bottom-section"
    >
      <motion.div
        id="hero-button"
        style={{ zIndex: 2, opacity, y }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 2 }}
      >
        <Button onClick={handleClick}>
          {content.hero.cta}
        </Button>
      </motion.div>
    </Area>
  );
}
