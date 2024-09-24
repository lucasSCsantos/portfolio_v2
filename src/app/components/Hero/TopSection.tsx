import { Area } from '../ui/default';
import { motion } from 'framer-motion';
import { Heading, Text } from '../ui/typography';

export default function TopSection() {
  return (
    <Area
      $width={100}
      $height={'50%'}
      $direction="column"
      $justify="flex-end"
      style={{ paddingBottom: 32 }}
    >
      <motion.div
        style={{ zIndex: 2 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8 }}
      >
        <Text
          $size="xsmall"
          $textAlign="center"
          $lineHeight={1}
          style={{ marginBottom: 16 }}
        >
          Oi, eu sou Lucas!
        </Text>
      </motion.div>
      <motion.div
        style={{ zIndex: 2 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 1 }}
      >
        <Heading $level={1} $size="large" $textAlign="center" $lineHeight={1}>
          Desenvolvedor
          <br />
          de Software
        </Heading>
      </motion.div>
    </Area>
  );
}
