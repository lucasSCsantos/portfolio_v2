'use client';

import { Heading, Text } from '@/app/components/ui/typography';
import { Body, Header } from './styles';
import { motion } from 'framer-motion';
import Waves from './Waves';
import Image from 'next/image';

function HandLink() {
  return (
    <>
      <Header>
        <motion.div
          style={{ zIndex: 2 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: 'easeInOut', duration: 0.8 }}
        >
          <Image src="/avatar.jpeg" width={100} height={100} alt="avatar" style={{ border: '4px solid #f2f2f2', borderRadius: '100%'}} />
        </motion.div>
        <motion.div
          style={{ zIndex: 2 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: 'easeInOut', duration: 0.4, delay: 0.8 }}
        >
          <Text
            $size="xsmall"
            $textAlign="center"
            $lineHeight={1}
            $color="textLight"
            style={{ marginBottom: 16 }}
          >
            Oi, eu sou Lucas!
          </Text>
        </motion.div>
        <Waves />
      </Header>
      <Body />
    </>
  );
}

export default HandLink;
