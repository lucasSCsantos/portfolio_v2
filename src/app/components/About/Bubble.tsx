import Image from 'next/image';
import { BubbleContainer } from './styles';
import { ComponentProps } from 'react';

interface BubbleProps extends ComponentProps<'div'> {
  height: number;
  width: number;
  alt: string;
  src: string;
  left?: string;
  right?: string;
  bottom?: string;
  top?: string;
  rotate?: number;
}

export default function Bubble({
  height,
  width,
  alt,
  src,
  left,
  right,
  bottom,
  top,
  rotate,
  ...props
}: BubbleProps) {
  const x = width * 0.1 * Math.random() > 0.5 ? -1 : 1;
  return (
    <BubbleContainer
      style={{
        left,
        right,
        bottom,
        top
        // ...props.style
      }}
      initial={{ y: -(height * 0.05), x }}
      animate={{ y: height * 0.05, x: -x, rotate: rotate || 0 }}
      transition={{
        x: {
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatType: 'reverse'
        },
        y: {
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatType: 'reverse'
        },
        rotate: rotate
          ? {
              repeat: Infinity,
              duration: 10,
              ease: 'easeInOut',
              repeatType: 'reverse'
            }
          : {}
      }}
      id={props.id}
    >
      <Image
        src={src}
        height={height}
        width={width}
        alt={alt}
        style={props.style}
      />
    </BubbleContainer>
  );
}
