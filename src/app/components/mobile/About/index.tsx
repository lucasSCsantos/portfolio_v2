'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import profile from '@/meta/profile';
import { fill } from '@/meta/dictionaries';
import { useDict } from '@/app/lib/locale';
import { Bio, Container, Intro, Label, Method, MethodTitle, Name, Stats } from './styles';

/** A Tela Sobre: foto, bio, números de destaque e as etapas de como Lucas conduz um projeto. */
export default function About() {
  const { content, ui } = useDict();
  const reducedMotion = useReducedMotion();
  // Cada bloco sobe da água ao chegar na Tela, um depois do outro; com movimento reduzido, já está lá.
  const rise = (order: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.5, delay: order * 0.08, ease: 'easeOut' }
        };

  return (
    <Container id="sobre">
      <motion.div {...rise(0)}>
        <Intro>
          <Image
            src={profile.photos.about}
            width={88}
            height={88}
            quality={70}
            alt={fill(ui.photoAlt, { name: profile.name })}
          />
          <div>
            <Label>{content.about.label}</Label>
            <Name>{profile.name}</Name>
          </div>
        </Intro>
      </motion.div>
      <motion.div {...rise(1)}>
        <Bio>{content.about.bio}</Bio>
      </motion.div>
      <motion.div {...rise(2)}>
        <Stats role="list" aria-label={ui.stats}>
          {content.hero.highlights.map(({ value, label }) => (
            <li key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </li>
          ))}
        </Stats>
      </motion.div>
      <motion.div {...rise(3)}>
        <MethodTitle id="sobre-metodo">{content.about.methodLabel}</MethodTitle>
        <Method role="list" aria-labelledby="sobre-metodo" tabIndex={0}>
          {content.about.method.map(step => (
            <li key={step}>{step}</li>
          ))}
        </Method>
      </motion.div>
    </Container>
  );
}
