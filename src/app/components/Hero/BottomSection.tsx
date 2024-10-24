import { useRef } from 'react';
import { Area, Button } from '../ui/default';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function BottomSection() {

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0], {
    clamp: false
  });

  const y = useTransform(scrollYProgress, [0, 0.3], [0, -50], {
    clamp: false
  });

  return (
    <Area
      $width={100}
      $height={'50%'}
      $direction="column"
      $justify="flex-start"
      style={{ paddingTop: 32 }}
    >
      <motion.div
        style={{
          zIndex: 2,
          marginTop: 64,
          opacity,
          y
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 2 }}
      >
        <Button>Entrar em contato!</Button>
      </motion.div>
    </Area>
  );
}
