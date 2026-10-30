'use client';
import Image from 'next/image';
import { Area, Content, scrimStyle } from '../ui/default';
import { Heading } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
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
          style={scrimStyle}
        >
          <WaterPiece
            as={Heading}
            order={0}
            from="left"
            $level={3}
            $size="small"
            $role="subtitle"
            $color="textLight"
          >
            {content.services.label}
          </WaterPiece>
          <WaterPiece
            as={Heading}
            order={1}
            from="left"
            $level={2}
            $color="textLight"
            $size="normal"
          >
            {content.services.title}
          </WaterPiece>
        </Area>
        <Area
          $width={100}
          $align="flex-start"
          $justify="space-between"
          $direction="row"
          style={{ flexWrap: 'wrap', rowGap: 38 }}
        >
          {services.map(({ text, title, message }, index) => (
            <Service
              text={text}
              title={title}
              key={title}
              message={message}
              order={index + 2}
            />
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
        alt=""
        aria-hidden
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
        alt=""
        aria-hidden
        width={669}
        height={669}
      />
    </Container>
  );
}

export default Services;
