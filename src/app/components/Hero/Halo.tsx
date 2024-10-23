import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function Halo({
  children,
  rotate = 360,
  duration = 5,
  width = '150px'
}: {
  children: ReactNode;
  rotate?: number;
  duration?: number;
  width?: string;
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
        width={width}
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
