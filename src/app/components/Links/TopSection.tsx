'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Text } from '../ui/typography';
import Avatar from '../Hero/Avatar';
import profile from '@/meta/profile';
import { useDict } from '@/app/lib/locale';
import { Availability } from '../Hero/styles';
import { AvailabilityTag, Title, TopContent } from './styles';

export default function TopSection() {
  const { content, profile: text } = useDict();
  const reducedMotion = useReducedMotion();
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
        >
          {profile.name}
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
          style={{
            backgroundImage: 'linear-gradient(180deg, black 80%, #1762A6)',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          {titleLine1}{' '}
          <br />
          {titleLine2}
        </Title>
      </motion.div>
      <AvailabilityTag
        initial={reducedMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 1.6 }}
      >
        <Availability>{text.availability}</Availability>
      </AvailabilityTag>
    </TopContent>
  );
}
