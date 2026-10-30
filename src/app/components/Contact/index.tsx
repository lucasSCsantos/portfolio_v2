'use client';

import { useEffect, useRef, useState } from 'react';
import { Content } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
import {
  Container,
  LeftSection,
  TopicList,
  TopicItem,
  RightSection,
  ContactCard,
  ContactButton,
  SecondaryActions,
  SecondaryLink,
  CopyEmailButton,
  Status,
  StatusItem,
  SurfaceTransition
} from './styles';
import content from '@/meta/content';
import profile from '@/meta/profile';

const WHATSAPP_URL = `https://wa.me/${profile.whatsappNumber}?text=${profile.whatsappMessage}`;
const EMAIL_URL = `mailto:${profile.email}?subject=${encodeURIComponent(profile.emailSubject)}`;
const COPIED_FEEDBACK_MS = 2000;

function Contact() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  }

  return (
    <Container id="contato">
      <SurfaceTransition
        aria-hidden
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,72 C240,40 480,48 720,76 C960,104 1200,92 1440,56 L1440,121 L0,121 Z"
        />
      </SurfaceTransition>
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
            <WaterPiece
              solid
              as={Heading}
              order={0}
              from="left"
              $level={3}
              $size="small"
              $role="subtitle"
              $color="quaternary"
            >
              {content.contact.label}
            </WaterPiece>
            <WaterPiece
              solid
              as={Heading}
              order={1}
              from="left"
              $level={2}
              $color="text"
            >
              {content.contact.heading}
            </WaterPiece>
          </div>
          <WaterPiece
            solid
            as={Text}
            order={2}
            from="right"
            $size="xxsmall"
            $color="text"
            $fontWeight={400}
            $lineHeight={1.6}
          >
            {content.contact.description}
          </WaterPiece>
          <Status>
            <StatusItem $available>{profile.availability}</StatusItem>
            <StatusItem>{profile.location}</StatusItem>
          </Status>
          <TopicList>
            {content.contact.topics.map((topic, index) => (
              <WaterPiece
                solid
                as={TopicItem}
                key={topic}
                order={3 + index}
                calm
              >
                {topic}
              </WaterPiece>
            ))}
          </TopicList>
        </LeftSection>

        <RightSection>
          <WaterPiece solid as={ContactCard} order={2} from="right">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Heading
                $level={3}
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
            <SecondaryActions>
              <SecondaryLink href={EMAIL_URL}>
                {content.contact.emailButtonText}
              </SecondaryLink>
              <SecondaryLink
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.contact.linkedinButtonText}
              </SecondaryLink>
            </SecondaryActions>
            <SecondaryLink $full href={profile.resumePath} download>
              {content.contact.resumeButtonText}
            </SecondaryLink>
            <CopyEmailButton type="button" onClick={copyEmail} aria-live="polite">
              {copied
                ? content.contact.copiedEmailText
                : content.contact.copyEmailText}
            </CopyEmailButton>
          </WaterPiece>
        </RightSection>
      </Content>
    </Container>
  );
}

export default Contact;
