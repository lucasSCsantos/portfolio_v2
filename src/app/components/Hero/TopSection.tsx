import { Area } from '../ui/default';
import { motion } from 'framer-motion';
import { Heading, Text } from '../ui/typography';
import Avatar from './Avatar';

export default function TopSection() {
  return (
    <Area
      $width={100}
      $height={'50%'}
      $direction="column"
      $justify="flex-end"
      style={{ paddingBottom: 16 }}
    >
      <Avatar />
      <motion.div
        style={{ zIndex: 2 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 0.8 }}
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
        style={{ zIndex: 2 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 1.6 }}
      >
        <Heading
          $level={1}
          $size="xlarge"
          $textAlign="center"
          $lineHeight={'96%'}
          $letterSpacing={-2.8}
          style={{
            backgroundImage: 'linear-gradient(180deg, black 80%, #1762A6)',
            // backgroundImage: 'linear-gradient(180deg, black 80%, #b3d6e3)',
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
