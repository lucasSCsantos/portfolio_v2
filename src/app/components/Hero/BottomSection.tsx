import { Area, Button } from '../ui/default';
import { motion } from 'framer-motion';
import { Text } from '../ui/typography';

export default function BottomSection() {
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
          width: '20%'
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 1.8 }}
      >
        <Text
          $size="xsmall"
          $textAlign="center"
          $lineHeight={1.2}
          $color={'textLight'}
        >
          Crio e projeto sites, aplicações e sistemas. Focado em tirar ideias do
          papel com eficiência. 👇
        </Text>
      </motion.div>
      <motion.div
        style={{
          zIndex: 2,
          marginTop: 64
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.8, delay: 2.4 }}
      >
        <Button>Saiba mais</Button>
      </motion.div>
    </Area>
  );
}
