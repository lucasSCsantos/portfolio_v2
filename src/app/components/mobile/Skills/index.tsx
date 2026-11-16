'use client';

import { motion, useReducedMotion } from 'framer-motion';
import skillGroups from '@/meta/skills';
import { useDict } from '@/app/lib/locale';
import Jellyfish from './Jellyfish';
import Reef from './Reef';
import {
  Competencies,
  CompetenciesTitle,
  Container,
  Description,
  Grid,
  Header,
  Label,
  Title
} from './styles';

// Todas as habilidades, inclusive as que no desktop só entram no revezamento: aqui não há revezamento.
const skills = skillGroups.flatMap(group => group.skills);

/** A Tela de Habilidades: as tecnologias numa grade de ícones com nome e as competências em lista. */
export default function Skills() {
  const { content } = useDict();
  const reducedMotion = useReducedMotion();
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
    <Container id="habilidades">
      <motion.div {...rise(0)}>
        <Header>
          <div>
            <Label>{content.work.label}</Label>
            <Title id="habilidades-titulo">{content.work.title}</Title>
          </div>
          <Jellyfish />
        </Header>
      </motion.div>
      <motion.div {...rise(1)}>
        <Description>{content.work.description}</Description>
      </motion.div>
      <motion.div {...rise(2)}>
        <Grid aria-labelledby="habilidades-titulo">
          {skills.map(({ name, icon: Icon }) => (
            <li key={name}>
              <Icon size={28} aria-hidden />
              <span>{name}</span>
            </li>
          ))}
        </Grid>
      </motion.div>
      <motion.div {...rise(3)}>
        <CompetenciesTitle id="habilidades-competencias">{content.work.competenciesLabel}</CompetenciesTitle>
        <Competencies aria-labelledby="habilidades-competencias">
          {content.work.competencies.map(({ title, text }) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </Competencies>
      </motion.div>
      <Reef />
    </Container>
  );
}
