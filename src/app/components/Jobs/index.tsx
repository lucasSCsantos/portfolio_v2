'use client';

import Image from 'next/image';
import { Area, Content } from '../ui/default';
import { Heading } from '../ui/typography';
import { Container } from './styles';

function Jobs() {
  return (
    <Container id="sobre">
      <Content
        style={{
          justifyContent: 'flex-start',
          width: 1120,
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
      </Content>
      <Image
        style={{
          position: 'absolute',
          opacity: 1,
          top: -748,
          left: -1352 / 2 + 270,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        src="/bg-bubble2.png"
        alt="Texto escrito 'sobre'"
        width={1352}
        height={1352}
      />
    </Container>
  );
}

export default Jobs;
