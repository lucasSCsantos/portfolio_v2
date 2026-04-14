'use client';

import { Area, Content } from '../ui/default';
import { Heading } from '../ui/typography';
import dynamic from 'next/dynamic';

const Carrousel = dynamic(() => import('./Carrousel'), { ssr: false });
import { Container } from './styles';
import Image from 'next/image';

const Animation = dynamic(() => import('./Animation'), { ssr: false });

function Projects() {
  return (
    <Container id="projetos">
      <Content
        style={{
          justifyContent: 'flex-start',
          maxWidth: 1120,
          zIndex: 3,
          gap: 32
        }}
        $direction="column"
      >
        <Area
          $width={100}
          $align="flex-start"
          $justify="flex-start"
          $direction="column"
        >
          <Heading
            $level={3}
            $size="small"
            $fontWeight={500}
            $color="textLight"
          >
            Projetos
          </Heading>
          <Heading
            $level={1}
            $color="text"
            $size="normal"
            $letterSpacing={-1.92}
          >
            Meus projetos individuais
          </Heading>
        </Area>
        <Carrousel />
      </Content>
      <Animation />
      <Image
        style={{
          position: 'absolute',
          opacity: 0.5,
          bottom: 0,
          right: 0,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        src="/projects-bg-text.png"
        alt="Texto escrito 'sobre'"
        width={1067}
        height={258}
      />
      <Image
        style={{
          position: 'absolute',
          opacity: 1,
          top: 150,
          right: -789 / 2 + 70,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        src="/bg-bubble.png"
        alt="Texto escrito 'sobre'"
        width={789}
        height={789}
      />
    </Container>
  );
}

export default Projects;
