'use client';

import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import { fill } from '@/meta/dictionaries';
import { useDict } from '@/app/lib/locale';
import {
  Achievements,
  Body,
  Container,
  Education,
  Highlight,
  Item,
  Label,
  List,
  Panel,
  Project,
  Subtitle,
  Summary,
  Techs,
  Title
} from './styles';

/** A Tela de Experiências: uma lista que abre e fecha (uma aberta por vez), e depois a formação e os idiomas. */
export default function Jobs() {
  const { content, experiences, education, educationLabels, languages, ui } = useDict();
  const reducedMotion = useReducedMotion();
  const id = useId();
  // A primeira começa aberta; tocar na aberta fecha todas.
  const [open, setOpen] = useState<number | null>(0);
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
    <Container id="experiencias">
      <motion.div {...rise(0)}>
        <Label>{content.jobs.label}</Label>
        <Title>{content.jobs.title}</Title>
      </motion.div>
      <motion.div {...rise(1)}>
        <List>
          {experiences.map((job, index) => {
            const expanded = open === index;
            const panel = `${id}-${index}`;
            return (
              <Item key={job.company} $open={expanded}>
                <h3>
                  <Summary
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panel}
                    onClick={() => setOpen(expanded ? null : index)}
                  >
                    <span>
                      <strong>
                        <span>{job.company}</span>
                        {job.kind && <small>{job.kind}</small>}
                      </strong>
                      <span>
                        {job.role} · {job.period}
                        {job.note && ` · ${job.note}`}
                      </span>
                    </span>
                    <FaChevronDown aria-hidden />
                  </Summary>
                </h3>
                {/* Fechada, a Experiência continua na página (para busca), só escondida da tela e do leitor. */}
                <Panel id={panel} $open={expanded} $animate={!reducedMotion}>
                  <Body>
                    {job.highlight && <Highlight>{job.highlight}</Highlight>}
                    <Achievements aria-label={ui.achievements}>
                      {job.achievements.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </Achievements>
                    <Techs aria-label={ui.technologies}>
                      {job.techs.map(tech => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </Techs>
                    {job.projectTitle && (
                      <Project>
                        {ui.seeProject} <a href="#projetos">{job.projectTitle}</a>.
                      </Project>
                    )}
                  </Body>
                </Panel>
              </Item>
            );
          })}
        </List>
      </motion.div>
      <motion.div {...rise(2)}>
        <Education>
          <div>
            <Subtitle id="experiencias-formacao">{educationLabels.title}</Subtitle>
            <ul aria-labelledby="experiencias-formacao">
              {education.map(item => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>
                    {item.institution} · {item.period}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Subtitle id="experiencias-idiomas">{educationLabels.languages}</Subtitle>
            <ul aria-labelledby="experiencias-idiomas">
              {languages.map(lang => (
                <li key={lang.name}>
                  <strong>{lang.name}</strong>
                  <span>{fill(ui.level, { level: lang.level })}</span>
                </li>
              ))}
            </ul>
          </div>
        </Education>
      </motion.div>
    </Container>
  );
}
