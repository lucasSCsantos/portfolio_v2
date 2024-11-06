'use client';
import Image from 'next/image';
import { Area, Content } from '../ui/default';
import { Heading } from '../ui/typography';
import { Container } from './styles';
import Corals from './Corals';
import Service from './Service';

function Services() {
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
            Contato
          </Heading>
          <Heading
            $level={1}
            $color="text"
            $size="normal"
            $letterSpacing={-1.92}
          >
            Meus serviços
          </Heading>
        </Area>
        <Area
          $width={100}
          $align="flex-start"
          $justify="space-between"
          $direction="row"
          style={{ flexWrap: 'wrap', rowGap: 38 }}
        >
          <Service />
          <Service />
          <Service />
          <Service />
        </Area>
      </Content>
      <Image
        style={{
          position: 'absolute',
          opacity: 0.5,
          bottom: '40%',
          left: -40,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 2
        }}
        src="/services-bg-text.png"
        alt="Texto escrito 'serviços'"
        width={1212}
        height={312}
      />
      <Corals />
    </Container>
  );
}

export default Services;
