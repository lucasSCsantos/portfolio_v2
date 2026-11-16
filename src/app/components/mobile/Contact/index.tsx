'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaCopy, FaEnvelope, FaLinkedin, FaWhatsapp } from 'react-icons/fa6';
import profile from '@/meta/profile';
import { useDict } from '@/app/lib/locale';
import LanguageSwitch from '../../Header/LanguageSwitch';
import SceneSwitch from '../../Header/SceneSwitch';
import { useScreenSea } from '../Screens/Screen';
import Footer from './Footer';
import Seabed from './Seabed';
import {
  Action,
  Actions,
  Container,
  CopyEmail,
  Description,
  Label,
  Switches,
  Title,
  Topics
} from './styles';

const COPIED_FEEDBACK_MS = 2000;

/**
 * A Tela de Contato, a mais funda do mergulho: o convite para falar com Lucas, os botões grandes de
 * WhatsApp, e-mail e LinkedIn, os seletores de Modo e de Idioma de novo, o fundo do mar e o Rodapé.
 */
export default function Contact() {
  const { content, profile: text } = useDict();
  const copy = content.contact;
  // Claro sobre a água escura, como os seletores do Hero sobre a Cena escura.
  const light = useScreenSea('contato')?.tone === 'dark';
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reducedMotion = useReducedMotion();

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

  // Cada bloco sobe da água ao chegar na Tela, um depois do outro; com movimento reduzido, já está lá.
  const rise = (order: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.5, delay: order * 0.08, ease: 'easeOut' }
        };

  return (
    <>
      <Container id="contato">
        <motion.div {...rise(0)}>
          <Label>{copy.label}</Label>
          <Title id="contato-titulo">{copy.heading}</Title>
        </motion.div>
        <motion.div {...rise(1)}>
          <Description>{copy.description}</Description>
          <Topics aria-labelledby="contato-titulo">
            {copy.topics.map(topic => (
              <li key={topic}>{topic}</li>
            ))}
          </Topics>
        </motion.div>
        <motion.div {...rise(2)}>
          <Actions>
            <Action
              $principal
              href={`${profile.social.whatsapp}?text=${text.whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden size={22} />
              <span>{copy.buttonText}</span>
            </Action>
            <Action href={`mailto:${profile.email}?subject=${encodeURIComponent(text.emailSubject)}`}>
              <FaEnvelope aria-hidden size={20} />
              <span>{copy.emailButtonText}</span>
            </Action>
            <Action href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin aria-hidden size={22} />
              <span>{copy.linkedinButtonText}</span>
            </Action>
            <CopyEmail type="button" onClick={copyEmail} aria-live="polite">
              <FaCopy aria-hidden size={14} />
              <span>{copied ? copy.copiedEmailText : copy.copyEmailText}</span>
            </CopyEmail>
          </Actions>
        </motion.div>
        <motion.div {...rise(3)}>
          <Switches>
            <SceneSwitch light={light} />
            <LanguageSwitch light={light} activeId="contato" />
          </Switches>
        </motion.div>
        <Seabed />
      </Container>
      <Footer />
    </>
  );
}
