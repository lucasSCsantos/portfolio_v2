'use client';

import { Area, Box, Content } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import AboutImage from './AboutImage';
import Bubble from './Bubble';
import { Container, Icon, SocialMediaButton } from './styles';
import Image from 'next/image';
import profile from '@/meta/profile';
import content from '@/meta/content';

const socialButtons = [
  { key: 'whatsapp', alt: 'Whatsapp icon', href: profile.social.whatsapp },
  { key: 'linkedin', alt: 'Linkedin Icon', href: profile.social.linkedin },
  { key: 'instagram', alt: 'Instagram Icon', href: profile.social.instagram },
  { key: 'github', alt: 'Github Icon', href: profile.social.github }
] as const;

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
              {content.about.label}
            </Heading>
            <Heading
              $level={2}
              $color="text"
              $size="normal"
              $letterSpacing={-1.92}
            >
              {profile.fullName}
            </Heading>
          </Box>
          <Text
            $size="xsmall"
            style={{ textAlign: 'justify' }}
            $color="textLight"
            $fontWeight={600}
          >
            {content.about.bio}
          </Text>
          <Box $height={'64px'} $justify="flex-start" style={{ gap: 32 }}>
            {socialButtons.map(({ key, alt, href }) => (
              <SocialMediaButton
                key={key}
                as="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  alt={alt}
                  src={profile.icons[key]}
                  style={
                    key === 'github' ? { height: 32, width: 28 } : undefined
                  }
                />
              </SocialMediaButton>
            ))}
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
        rotate={10}
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
        rotate={180}
        alt="Another small size bubble floating"
      />
    </Container>
  );
}

export default About;
