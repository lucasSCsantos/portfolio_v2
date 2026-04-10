'use client';

import { Content } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import {
  Container,
  LeftSection,
  TopicList,
  TopicItem,
  RightSection,
  ContactButton
} from './styles';
import content from '@/meta/content';
import profile from '@/meta/profile';

const WHATSAPP_URL = `https://wa.me/${profile.whatsappNumber}?text=${profile.whatsappMessage}`;

function Contact() {
  return (
    <Container id="contato">
      <Content
        style={{
          justifyContent: 'flex-start',
          maxWidth: 1120,
          zIndex: 3,
          gap: 64
        }}
      >
        <LeftSection>
          <div>
            <Heading
              $level={3}
              $size="small"
              $fontWeight={500}
              $color="quaternary"
            >
              {content.contact.label}
            </Heading>
            <Heading $level={1} $color="text" $letterSpacing={-1.92}>
              {content.contact.heading}
            </Heading>
          </div>
          <Text
            $size="xxsmall"
            $color="text"
            $fontWeight={400}
            $lineHeight={1.6}
          >
            {content.contact.description}
          </Text>
          <TopicList>
            {content.contact.topics.map(topic => (
              <TopicItem key={topic}>{topic}</TopicItem>
            ))}
          </TopicList>
        </LeftSection>

        <RightSection>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Heading
              $level={2}
              $size="xsmall"
              $fontWeight={700}
              $color="text"
              $textAlign="center"
            >
              {content.contact.cardHeading}
            </Heading>
            <Text
              $size="xxsmall"
              $color="text"
              $fontWeight={400}
              $lineHeight={1.5}
              $textAlign="center"
            >
              {content.contact.cardSubtext}
            </Text>
          </div>
          <ContactButton onClick={() => window.open(WHATSAPP_URL, '_blank')}>
            {content.contact.buttonText}
          </ContactButton>
        </RightSection>
      </Content>
    </Container>
  );
}

export default Contact;
