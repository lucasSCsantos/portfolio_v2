'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import profile from '@/meta/profile';
import { useDict } from '@/app/lib/locale';
import { scrollToId } from '@/app/lib/scroll';
import { Button, Container, Description, Fishes, Header, Label, List, Position, Proof, Title } from './styles';

const Animation = dynamic(() => import('../../Services/Animation'), { ssr: false });

/** A Tela de Serviços: uma lista numerada, cada Serviço com a prova que o comprova e o seu WhatsApp. */
export default function Services() {
  const { content, services } = useDict();
  const reducedMotion = useReducedMotion();
  // Cada bloco sobe da água ao chegar na Tela, um depois do outro; com movimento reduzido, já está lá.
  const rise = (order: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.5, delay: order * 0.08, ease: 'easeOut' }
        };

  return (
    <Container id="servicos">
      <Fishes data-lottie aria-hidden>
        <Animation style={{ width: '100%', height: 'auto' }} />
      </Fishes>
      <motion.div {...rise(0)}>
        <Header>
          <div>
            <Label>{content.services.label}</Label>
            <Title id="servicos-titulo">{content.services.title}</Title>
          </div>
        </Header>
      </motion.div>
      <List aria-labelledby="servicos-titulo">
        {services.map(({ title, text, proof, buttonLabel, message }, index) => (
          <motion.li key={title} {...rise(index + 1)}>
            <Position aria-hidden>{String(index + 1).padStart(2, '0')}</Position>
            <h3>{title}</h3>
            <Description>{text}</Description>
            <Proof>
              {content.services.proofLabel}:{' '}
              <a
                href={proof.href}
                onClick={event => {
                  event.preventDefault();
                  scrollToId(proof.href.slice(1));
                }}
              >
                {proof.name}
              </a>
            </Proof>
            <Button
              href={`https://wa.me/${profile.whatsappNumber}?text=${message}`}
              target="_blank"
              rel="noopener"
            >
              {buttonLabel}
            </Button>
          </motion.li>
        ))}
      </List>
    </Container>
  );
}
