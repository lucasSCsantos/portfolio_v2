import { motion, useScroll, useTransform } from 'framer-motion';
import { Heading, Text } from '../ui/typography';
import Avatar from './Avatar';
import { useRef } from 'react';
import { useDict } from '@/app/lib/locale';

export default function TopSection() {
  const { content } = useDict();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0], {
    clamp: true
  });

  const y = useTransform(scrollYProgress, [0, 0.9], [0, -20], {
    clamp: true
  });

  const [titleLine1, titleLine2] = content.hero.title.split('\n');

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'inherit'
      }}
    >
      <Avatar />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 0.4 }}
      >
        <motion.div style={{ zIndex: 2, opacity, y }}>
          <Text
            $size="small"
            $textAlign="center"
            $font="inter"
            $fontWeight={400}
            $lineHeight={'auto'}
            id="greeting-text"
          >
            {content.hero.greeting}
          </Text>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 1.2 }}
      >
        <motion.div
          style={{
            zIndex: 2,
            opacity,
            y,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'inherit'
          }}
        >
          <Heading
            $level={1}
            $size="xlarge"
            $textAlign="center"
            $lineHeight={'96%'}
            id="title-text"
          >
            {titleLine1}{' '}
            <br />
            {titleLine2}
          </Heading>
        </motion.div>
      </motion.div>
    </div>
  );
}
