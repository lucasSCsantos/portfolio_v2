'use client';

import Image from 'next/image';
import { Area, Content } from '../ui/default';
import { Text } from '../ui/typography';
import { Bubble, Container } from './styles';
import { MouseEvent, useState } from 'react';
import { InstagramIcon, Linkedin01Icon, WhatsappIcon } from 'hugeicons-react';
// import { useTransform } from 'framer-motion';

interface CustomMouseEvent extends MouseEvent<HTMLDivElement> {
  offsetX: number;
  offsetY: number;
}

function About() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [divPosition, setDivPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: CustomMouseEvent) => {
    const { offsetX, offsetY } =
      event.nativeEvent as unknown as CustomMouseEvent;

    setMousePosition({
      x: offsetX > offsetY ? 0 : offsetX + 100,
      y: offsetY > offsetX ? 0 : offsetY + 100
    });

    setDivPosition(prevPosition => ({
      x: prevPosition.x + (offsetX - prevPosition.x),
      y: prevPosition.y + (offsetY - prevPosition.y)
    }));

    console.log(mousePosition);
  };

  return (
    <Container id="sobre">
      <Content>
        <Area $width={50} $height={'100%'}>
          <Bubble
            onMouseMove={handleMouseMove}
            animate={{ x: divPosition.x, y: divPosition.y }}
            style={{ width: 500, height: 500 }}
          >
            <Image
              src="/avatar.jpeg"
              width={480}
              height={480}
              alt="wdasdas"
              style={{
                cursor: 'none',
                pointerEvents: 'none',
                borderRadius: 40
              }}
            />
          </Bubble>
        </Area>
        <Area
          $width={50}
          $height={'100%'}
          $align="flex-start"
          $direction="column"
        >
          <Text $color="textLight" $size="xsmall">
            Sobre mim
          </Text>
          <Text $size="normal">Lucas Santana</Text>
          <Text $size="xxsmall" $color="quaternary">
            Desenvolvedor de software, freelancer
          </Text>
          <Text $size="xxsmall">
            Im a passionate full stack developer with 5 years of experience in
            creating robust and scalable web applications. My expertise spans
            across front-end technologies like React and Vue.js, as well as
            back-end frameworks such as Node.js and Django. I love solving
            complex problems and turning ideas into reality through clean,
            efficient code.
          </Text>
          <div
            style={{
              width: '100%',
              height: 54,
              marginTop: 32,
              display: 'flex',
              gap: 32
            }}
          >
            <Bubble style={{ width: 64, height: 64 }} animate={{ y: 2 }}>
              <WhatsappIcon size={32} color="white" />
            </Bubble>
            <Bubble style={{ width: 64, height: 64 }} animate={{ y: 2 }}>
              <InstagramIcon size={32} color="white" />
            </Bubble>
            <Bubble style={{ width: 64, height: 64 }} animate={{ y: 2 }}>
              <Linkedin01Icon size={32} color="white" />
            </Bubble>
          </div>
        </Area>
      </Content>
    </Container>
  );
}

export default About;
