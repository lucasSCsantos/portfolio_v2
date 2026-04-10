'use client';
import Image from 'next/image';
import { Area, Content } from '../ui/default';
import { Heading } from '../ui/typography';
import { Container } from './styles';
import Service from './Service';
import dynamic from 'next/dynamic';
import services from '@/meta/services';
import content from '@/meta/content';

const Animation = dynamic(() => import('./Animation'), { ssr: false });

function Services() {
  return (
    <Container id="servicos">
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
            {content.services.label}
          </Heading>
          <Heading
            $level={1}
            $color="text"
            $size="normal"
            $letterSpacing={-1.92}
          >
            {content.services.title}
          </Heading>
        </Area>
        <Area
          $width={100}
          $align="flex-start"
          $justify="space-between"
          $direction="row"
          style={{ flexWrap: 'wrap', rowGap: 38 }}
        >
          {services.map(({ text, title, message }) => (
            <Service text={text} title={title} key={title} message={message} />
          ))}
        </Area>
      </Content>
      <Animation />
      <Image
        style={{
          position: 'absolute',
          opacity: 0.5,
          bottom: '0%',
          left: -40,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 1
        }}
        src="/services-bg-text.png"
        alt="Texto escrito 'serviços'"
        width={1212}
        height={312}
      />
      <Image
        style={{
          position: 'absolute',
          opacity: 1,
          top: 0,
          right: 50,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        src="/bg-bubble3.png"
        alt="Texto escrito 'sobre'"
        width={669}
        height={669}
      />
    </Container>
  );
}

export default Services;
