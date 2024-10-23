import { Area, Button } from '../ui/default';
import { motion } from 'framer-motion';

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
          marginTop: 64
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
