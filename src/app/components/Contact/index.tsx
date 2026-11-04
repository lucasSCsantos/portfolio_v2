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
  CenterSection,
  CoralLayer,
  GlassStack,
  GlassButton,
  GlassIcon,
  GlassLabel,
  Status,
  StatusItem,
} from './styles';
import content from '@/meta/content';
import profile from '@/meta/profile';
import LinkIcon from '../Links/LinkIcon';
import Corals from '../Work/Corals';
import SeabedLife from './SeabedLife';

const WHATSAPP_URL = `https://wa.me/${profile.whatsappNumber}?text=${profile.whatsappMessage}`;
const EMAIL_URL = `mailto:${profile.email}?subject=${encodeURIComponent(profile.emailSubject)}`;
const COPIED_FEEDBACK_MS = 2000;

function Contact() {
  const [copied, setCopied] = useState(false);
  // Protótipo: `?contato=a` mostra só o vidro no mar; o padrão (C) usa a coluna de botões de vidro.
  const [variant, setVariant] = useState<'a' | 'c'>('c');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('contato') === 'a')
      setVariant('a');
  }, []);

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

  if (variant === 'c') {
    return (
      <Container id="contato">
        <Content style={{ maxWidth: 800, zIndex: 3, justifyContent: 'center' }}>
          <CenterSection>
            <WaterPiece
                            as={Heading}
              order={0}
              $level={3}
              $size="small"
              $role="subtitle"
              $color="primary"
              $textAlign="center"
            >
              {content.contact.label}
            </WaterPiece>
            <WaterPiece
                            as={Heading}
              order={1}
              $level={2}
              $color="textLight"
              $textAlign="center"
            >
              {content.contact.heading}
            </WaterPiece>
            <WaterPiece
                            as={Text}
              order={2}
              $size="xxsmall"
              $color="textLight"
              $fontWeight={400}
              $lineHeight={1.6}
              $textAlign="center"
            >
              {content.contact.description}
            </WaterPiece>
            <WaterPiece
              as={Status}
              order={3}
              calm
              style={{ justifyContent: 'center' }}
            >
              <StatusItem $available>{profile.availability}</StatusItem>
              <StatusItem>{profile.location}</StatusItem>
            </WaterPiece>
            <WaterPiece solid as={GlassStack} order={4}>
              <GlassButton
                as="button"
                type="button"
                $principal
                onClick={() => window.open(WHATSAPP_URL, '_blank')}
              >
                <GlassIcon>
                  <LinkIcon name="whatsapp" />
                </GlassIcon>
                <GlassLabel>{content.contact.buttonText}</GlassLabel>
              </GlassButton>
              <GlassButton href={EMAIL_URL}>
                <GlassIcon>
                  <LinkIcon name="email" />
                </GlassIcon>
                <GlassLabel>{content.contact.emailButtonText}</GlassLabel>
              </GlassButton>
              <GlassButton
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlassIcon>
                  <LinkIcon name="linkedin" />
                </GlassIcon>
                <GlassLabel>{content.contact.linkedinButtonText}</GlassLabel>
              </GlassButton>
              <GlassButton href={profile.resumePath} download>
                <GlassIcon>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16" />
                  </svg>
                </GlassIcon>
                <GlassLabel>{content.contact.resumeButtonText}</GlassLabel>
              </GlassButton>
            </WaterPiece>
            <WaterPiece
              as={CopyEmailButton}
              order={5}
              calm
              type="button"
              onClick={copyEmail}
              aria-live="polite"
            >
              {copied
                ? content.contact.copiedEmailText
                : content.contact.copyEmailText}
            </WaterPiece>
          </CenterSection>
        </Content>
        <CoralLayer>
          <Corals />
          <SeabedLife />
        </CoralLayer>
      </Container>
    );
  }

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
            <WaterPiece
                            as={Heading}
              order={0}
              from="left"
              $level={3}
              $size="small"
              $role="subtitle"
              $color="primary"
            >
              {content.contact.label}
            </WaterPiece>
            <WaterPiece
                            as={Heading}
              order={1}
              from="left"
              $level={2}
              $color="textLight"
            >
              {content.contact.heading}
            </WaterPiece>
          </div>
          <WaterPiece
                        as={Text}
            order={2}
            from="right"
            $size="xxsmall"
            $color="textLight"
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
            <CopyEmailButton $onGlass type="button" onClick={copyEmail} aria-live="polite">
              {copied
                ? content.contact.copiedEmailText
                : content.contact.copyEmailText}
            </CopyEmailButton>
          </WaterPiece>
        </RightSection>
      </Content>
        <CoralLayer>
          <Corals />
          <SeabedLife />
        </CoralLayer>
    </Container>
  );
}

export default Contact;
