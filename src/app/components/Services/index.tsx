'use client';
import { Area, Content } from '../ui/default';
import { Heading } from '../ui/typography';
import { Container } from './styles';
import fishes from '@/lotties/fishes-animation.json';
import { useLottie, useLottieInteractivity } from 'lottie-react';
import Experience from './Experience';
import { CSSProperties } from 'react';

const options = {
  animationData: fishes
};

const style: CSSProperties = {
  position: 'absolute',
  width: '100vw',
  height: 'auto',
  opacity: 0.2,
  top: 300
};

const Animation = () => {
  const lottieObj = useLottie(options, style);
  const Animation = useLottieInteractivity({
    lottieObj,
    mode: 'scroll',
    actions: [
      {
        visibility: [0, 1],
        type: 'seek',
        frames: [0, 100]
      }
    ]
  });

  return Animation;
};

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
            Experiências
          </Heading>
          <Heading
            $level={1}
            $color="text"
            $size="normal"
            $letterSpacing={-1.92}
          >
            Experiências profissionais
          </Heading>
        </Area>
        <Area
          $width={100}
          $align="flex-start"
          $justify="space-between"
          $direction="row"
        >
          <Experience
            iconSrc="eattasty.png"
            backgroundSrc="eattasty-bg.png"
            color="#FFBD1B"
          />
          <Experience
            iconSrc="agricompany-logo.png"
            backgroundSrc="agricompany-bg2.png"
            color="#0B1E60"
          />
        </Area>
      </Content>
      <Animation />
    </Container>
  );
}

export default Jobs;
