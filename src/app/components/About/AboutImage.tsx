import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Area } from '../ui/default';
import { Tag } from './styles';
import Image from 'next/image';

export default function AboutImage() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0], {
    clamp: false
  });

  const x = useTransform(scrollYProgress, [0, 0.5], [0, -20], {
    clamp: false
  });

  return (
    <Area
      $width={45}
      $height={'100%'}
      $align="flex-end"
      $justify="flex-end"
      $direction="column"
      style={{ position: 'relative' }}
      ref={ref}
    >
      <Tag
        style={{ bottom: '24%', right: 468 - 280, x, opacity }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ ease: 'easeInOut', duration: 0.4, delay: 0.2 }}
      >
        👉 Desenvolvedor Full-stack
      </Tag>
      <Tag
        style={{ bottom: '12%', right: 468 - 280, x, opacity }}
        viewport={{ once: true }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.4, delay: 0.2 }}
      >
        👉 Desenvolvedor Front-end
      </Tag>
      <Image
        src="/about-image.jpeg"
        width={468}
        height={468}
        style={{ borderRadius: 20 }}
        alt="Imagem de lucas trabalhando em seu escritório"
      />
    </Area>
  );
}
