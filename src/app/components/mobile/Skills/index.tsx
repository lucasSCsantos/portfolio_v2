'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import skillGroups from '@/meta/skills';
import { CardFront } from '../../Work/styles';
import { useDict } from '@/app/lib/locale';
import Jellyfish from './Jellyfish';
import {
  Competencies,
  CompetenciesTitle,
  Container,
  Description,
  Grid,
  Header,
  Label,
  MotionToggle,
  Rail,
  Row,
  SkillButton,
  SkillBack,
  SkillInner,
  Track,
  Title
} from './styles';

const skills = skillGroups.flatMap(group =>
  group.skills.map(skill => ({ skill, kind: group.kind }))
);

/** Habilidades fixas em quatro faixas contínuas, com viradas aleatórias. */
export default function Skills() {
  const { content, skillKinds, ui } = useDict();
  const reducedMotion = useReducedMotion();
  const rail = useRef<HTMLDivElement>(null);
  const inView = useInView(rail);
  const [paused, setPaused] = useState(false);
  const [flipped, setFlipped] = useState<string | null>(null);
  const [autoFlipped, setAutoFlipped] = useState<string | null>(null);
  const reading = paused || flipped !== null;
  const activeFlip = flipped ?? autoFlipped;

  useEffect(() => {
    if (reducedMotion || reading || !inView) return;
    const id = setInterval(() => {
      const hover = window.matchMedia(
        '(hover: hover) and (pointer: fine)'
      ).matches;
      if (
        rail.current?.matches(':focus-within') ||
        (hover && rail.current?.matches(':hover'))
      )
        return;
      const name = skills[Math.floor(Math.random() * skills.length)].skill.name;
      setAutoFlipped(current => (current === name ? null : name));
    }, 2500);
    return () => clearInterval(id);
  }, [reducedMotion, reading, inView]);
  const rows = Array.from({ length: 4 }, (_, row) =>
    skills.filter((_, index) => index % 4 === row)
  );
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
        <Rail ref={rail}>
          {rows.map((row, rowIndex) => (
            <Row key={rowIndex} $offset={rowIndex % 2 === 1}>
              <Track $paused={reading || !inView} $duration={row.length * 2.5}>
                {[false, true].map(copy => (
                  <Grid
                    key={String(copy)}
                    aria-labelledby={copy ? undefined : 'habilidades-titulo'}
                    aria-hidden={copy || undefined}
                  >
                    {row.map(({ skill, kind }) => {
                      const Icon = skill.icon;
                      return (
                        <li key={skill.name}>
                          <SkillButton
                            type="button"
                            data-skill={skill.name}
                            aria-label={`${skill.name} · ${skillKinds[kind] ?? kind}`}
                            aria-pressed={activeFlip === skill.name}
                            tabIndex={copy ? -1 : 0}
                            onMouseDown={
                              copy ? event => event.preventDefault() : undefined
                            }
                            onClick={event => {
                              setFlipped(
                                activeFlip === skill.name ? null : skill.name
                              );
                              setAutoFlipped(null);
                              if (event.detail > 0) event.currentTarget.blur();
                            }}
                          >
                            <SkillInner $flipped={activeFlip === skill.name}>
                              <CardFront>
                                <Icon size={28} aria-hidden />
                              </CardFront>
                              <SkillBack>
                                <strong>{skill.name}</strong>
                                <span>{skillKinds[kind] ?? kind}</span>
                              </SkillBack>
                            </SkillInner>
                          </SkillButton>
                        </li>
                      );
                    })}
                  </Grid>
                ))}
              </Track>
            </Row>
          ))}
        </Rail>
        {!reducedMotion && (
          <MotionToggle
            type="button"
            aria-pressed={reading}
            onClick={() => {
              setPaused(!reading);
              setFlipped(null);
              setAutoFlipped(null);
            }}
          >
            {reading ? ui.resumeSkills : ui.pauseSkills}
          </MotionToggle>
        )}
      </motion.div>
      <motion.div {...rise(3)}>
        <CompetenciesTitle id="habilidades-competencias">
          {content.work.competenciesLabel}
        </CompetenciesTitle>
        <Competencies aria-labelledby="habilidades-competencias">
          {content.work.competencies.map(({ title, text }) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </Competencies>
      </motion.div>
    </Container>
  );
}
