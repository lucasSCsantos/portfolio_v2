'use client';

import { motion } from 'framer-motion';
import { Text } from '../ui/typography';
import Avatar from '../Hero/Avatar';
import content from '@/meta/content';
import { Title, TopContent } from './styles';

export default function TopSection() {
  const [titleLine1, titleLine2] = content.hero.title.split('\n');

  return (
    <TopContent>
      <Avatar />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 0.4 }}
      >
        <Text
          $size="xxsmall"
          $textAlign="center"
          $font="inter"
          $fontWeight={400}
          $lineHeight="auto"
          $letterSpacing={-0.9}
        >
          {content.hero.greeting}
        </Text>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 1.2 }}
      >
        <Title
          $level={1}
          $textAlign="center"
          $lineHeight="96%"
          $letterSpacing={-2.8}
          style={{
            backgroundImage: 'linear-gradient(180deg, black 80%, #1762A6)',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          {titleLine1}
          <br />
          {titleLine2}
        </Title>
      </motion.div>
    </TopContent>
  );
}
