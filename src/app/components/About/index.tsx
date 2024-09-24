'use client';

import { Area, Content } from '../ui/default';
import { Text } from '../ui/typography';
import { Bubble, Container } from './styles';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaLinkedinIn } from 'react-icons/fa6';
import Image from 'next/image';

function About() {
  return (
    <Container id="sobre">
      <Content style={{ justifyContent: 'center' }}>
        <Bubble
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 250,
            height: 250
          }}
        >
          <Image
            src="/avatar.png"
            width={250}
            height={250}
            alt="wdasdas"
            style={{
              cursor: 'none',
              pointerEvents: 'none'
            }}
          />
        </Bubble>
        <Bubble
          style={{ left: 120, bottom: 150, width: 200, height: 200 }}
        ></Bubble>
        <Bubble
          style={{ left: 320, bottom: 100, width: 100, height: 100 }}
        ></Bubble>
        <Bubble
          style={{ right: 120, bottom: 80, width: 160, height: 160 }}
        ></Bubble>
        <Bubble style={{ width: 56, height: 56, left: 90, top: 150 }}>
          <FaWhatsapp size={28} color="white" />
        </Bubble>
        <Bubble style={{ width: 64, height: 64, left: 160, top: 210 }}>
          <FaInstagram size={32} color="white" />
        </Bubble>
        <Bubble style={{ width: 72, height: 72, left: 180, top: 110 }}>
          <FaLinkedinIn size={32} color="white" />
        </Bubble>
        <Area
          $width={50}
          $height={'100%'}
          $align="flex-start"
          $justify="flex-start"
          $direction="column"
          style={{ padding: 32 }}
        >
          <Text $size="normal" $color="quaternary" $fontWeight={700}>
            Lucas Santana
          </Text>
          <Text $size="xxsmall" $color="text">
            Desenvolvedor de software, freelancer
          </Text>
          <Text $size="xxsmall" $color="textLight">
            Im a passionate full stack developer with 5 years of experience in
            creating robust and scalable web applications. My expertise spans
            across front-end technologies like React and Vue.js, as well as
            back-end frameworks such as Node.js and Django. I love solving
            complex problems and turning ideas into reality through clean,
            efficient code.
          </Text>
        </Area>
      </Content>
    </Container>
  );
}

export default About;
