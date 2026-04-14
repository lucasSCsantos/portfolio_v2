import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Halo({
  children,
  rotate = 360,
  duration = 5,
  id,
}: {
  children: ReactNode;
  rotate?: number;
  duration?: number;
  id: string;
}) {
  return (
    <motion.div
      style={{
        display: 'inline-block',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
      id={id}
      animate={{ rotate }} // Rotate 360 degrees
      transition={{
        repeat: Infinity, // Infinite loop
        duration, // Duration for one full rotation
        ease: 'linear' // Smooth rotation
      }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {children}
      </svg>
    </motion.div>
  );
}
