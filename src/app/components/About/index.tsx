'use client';

import { Area, Box, Content } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import AboutImage from './AboutImage';
import Bubble from './Bubble';
import { Container, Icon, SocialMediaButton } from './styles';
import Image from 'next/image';

function About() {
  return (
    <Container id="sobre">
      <Content
        style={{
          justifyContent: 'space-between',
          maxHeight: 484,
          width: 1120,
          zIndex: 3
        }}
      >
        <Area
          $width={50}
          $height={'100%'}
          $align="flex-start"
          $justify="flex-start"
          $direction="column"
          style={{ gap: 32 }}
        >
          <Box $direction="column" $align="flex-start">
            <Heading
              $level={3}
              $size="small"
              $fontWeight={500}
              $color="tertiary"
            >
              Sobre mim
            </Heading>
            <Heading
              $level={2}
              $color="text"
              $size="normal"
              $letterSpacing={-1.92}
            >
              Lucas Santana
            </Heading>
          </Box>
          <Text $size="xsmall" $color="textLight" $fontWeight={600}>
            Im a passionate full stack developer with 5 years of experience in
            creating robust and scalable web applications. My expertise spans
            across front-end technologies like React and Vue.js, as well as
            back-end frameworks such as Node.js and Django. I love solving
            complex problems and turning ideas into reality through clean,
            efficient code.
          </Text>
          <Box $height={'64px'} $justify="flex-start" style={{ gap: 32 }}>
            <SocialMediaButton>
              <Icon alt="Whatsapp icon" src="whatsapp-icon.png" />
            </SocialMediaButton>
            <SocialMediaButton>
              <Icon alt="Linkedin Icon" src="linkedin-icon.png" />
            </SocialMediaButton>
            <SocialMediaButton>
              <Icon alt="Instagram Icon" src="instagram-icon.png" />
            </SocialMediaButton>
            <SocialMediaButton>
              <Icon
                alt="Github Icon"
                src="github-icon.png"
                style={{ height: 32, width: 28 }}
              />
            </SocialMediaButton>
          </Box>
        </Area>
        <AboutImage />
      </Content>
      <Image
        style={{
          position: 'absolute',
          opacity: 0.5,
          bottom: 20,
          right: -10,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        src="/about-bg-text.png"
        alt="Texto escrito 'sobre'"
        width={1453}
        height={424}
      />
      <Bubble
        bottom="42%"
        left="1%"
        width={337}
        height={349}
        src="/bubble7.png"
        alt="A medium size bubble floating"
      />
      <Bubble
        bottom="25%"
        left="11%"
        src="/bubble2.png"
        height={138}
        width={135}
        alt="A small size bubble floating"
      />
      <Bubble
        bottom="65%"
        right="12%"
        src="/bubble.png"
        height={265}
        width={256}
        style={{ transform: 'scaleX(-1)' }}
        alt="A medium size bubble floating"
      />
      <Bubble
        bottom="50%"
        right="17%"
        src="/bubble3.png"
        height={143}
        width={141}
        rotate
        alt="Another small size bubble floating"
      />
    </Container>
  );
}

export default About;
