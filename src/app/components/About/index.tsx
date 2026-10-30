'use client';

import { Area, Box, Content, scrimStyle } from '../ui/default';
import WaterPiece from '../ui/WaterPiece';
import { Heading, Text } from '../ui/typography';
import AboutImage from './AboutImage';
import { Container, Icon, SocialMediaLink } from './styles';
import Image from 'next/image';
import profile from '@/meta/profile';
import content from '@/meta/content';

const socialButtons = [
  { key: 'whatsapp', label: 'WhatsApp', href: profile.social.whatsapp },
  { key: 'linkedin', label: 'LinkedIn', href: profile.social.linkedin },
  { key: 'instagram', label: 'Instagram', href: profile.social.instagram },
  { key: 'github', label: 'GitHub', href: profile.social.github }
] as const;

function About() {
  return (
    <Container id="sobre">
      <Content
        id="about-content"
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
          id="left-about-area"
        >
          <Box $direction="column" $align="flex-start">
            <WaterPiece
              as={Heading}
              order={0}
              from="left"
              $level={3}
              $size="small"
              $role="subtitle"
              $color="tertiary"
            >
              {content.about.label}
            </WaterPiece>
            <WaterPiece
              as={Heading}
              order={1}
              from="left"
              $level={2}
              $color="text"
              $size="normal"
            >
              {profile.name}
            </WaterPiece>
          </Box>
          <WaterPiece
            as={Text}
            order={2}
            from="right"
            $size="xsmall"
            $color="textLight"
            style={scrimStyle}
          >
            {content.about.bio}
          </WaterPiece>
          <Box $height={'64px'} $justify="flex-start" style={{ gap: 32 }} id="social-buttons">
            {socialButtons.map(({ key, label, href }, index) => (
              <WaterPiece
                as={SocialMediaLink}
                order={3 + index}
                float={7}
                calm
                key={key}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  alt=""
                  src={profile.icons[key]}
                  style={
                    key === 'github' ? { height: 32, width: 28 } : undefined
                  }
                />
              </WaterPiece>
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
        alt=""
        aria-hidden
        width={1453}
        height={424}
      />
    </Container>
  );
}

export default About;
