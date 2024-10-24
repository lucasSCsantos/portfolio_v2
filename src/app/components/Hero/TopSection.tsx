import { Area } from '../ui/default';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heading, Text } from '../ui/typography';
import Avatar from './Avatar';
import { useRef } from 'react';

export default function TopSection() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0], {
    clamp: false
  });

  const y = useTransform(scrollYProgress, [0, 0.9], [0, -20], {
    clamp: false
  });
  
  return (
    <Area
      $width={100}
      $height={'50%'}
      $direction="column"
      $justify="flex-end"
      style={{ paddingBottom: 16 }}
      ref={ref}
    >
      <Avatar />
      <motion.div
        style={{ zIndex: 2, opacity, y }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 0.4 }}
      >
        <Text
          $size="small"
          $textAlign="center"
          $font="inter"
          $fontWeight={400}
          $lineHeight={'auto'}
          $letterSpacing={-0.9}
        >
          Oi, eu sou Lucas!
        </Text>
      </motion.div>
      <motion.div
        style={{ zIndex: 2, opacity, y }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 1.2 }}
      >
        <Heading
          $level={1}
          $size="xlarge"
          $textAlign="center"
          $lineHeight={'96%'}
          $letterSpacing={-2.8}
          style={{
            backgroundImage: 'linear-gradient(180deg, black 80%, #1762A6)',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Desenvolvedor
          <br />
          de Software
        </Heading>
      </motion.div>
    </Area>
  );
}
