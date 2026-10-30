'use client';
import Image from 'next/image';
import { Content } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
import {
  CardBack,
  CardFront,
  CardInner,
  Container,
  LeftSection,
  MainRow,
  SkillCard,
  SkillGrid
} from './styles';
import Corals from './Corals';
import skillGroups from '@/meta/skills';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const allSkills = skillGroups.flatMap(group =>
  group.skills.map(skill => ({ skill, kind: group.kind }))
);
const SWAP_EVERY_MS = 2500;

// Vitrine inicial: tudo que não é de revezamento; o resto espera fora da grade.
function initialSlots() {
  const shown = allSkills.filter(item => !item.skill.rotating);
  const waiting = allSkills.filter(item => item.skill.rotating);
  return { shown, waiting };
}
import content from '@/meta/content';
import dynamic from 'next/dynamic';

const Animation = dynamic(() => import('./Animation'), { ssr: false });

function Work() {
  const [{ shown }, setSlots] = useState(initialSlots);
  const reducedMotion = useReducedMotion();
  const gridRef = useRef<HTMLUListElement>(null);

  // De tempos em tempos, uma habilidade visível troca de lugar com uma que está de fora.
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      // Não troca o card que o visitante está lendo.
      if (gridRef.current?.matches(':hover, :focus-within')) return;
      setSlots(({ shown, waiting }) => {
        const out = Math.floor(Math.random() * shown.length);
        const into = Math.floor(Math.random() * waiting.length);
        const nextShown = shown.slice();
        const nextWaiting = waiting.slice();
        nextShown[out] = waiting[into];
        nextWaiting[into] = shown[out];
        return { shown: nextShown, waiting: nextWaiting };
      });
    }, SWAP_EVERY_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <Container id="habilidades">
      <Content
        style={{
          justifyContent: 'flex-start',
          maxWidth: 1120,
          zIndex: 3,
          gap: 32
        }}
        $direction="column"
      >
        <MainRow>
          <LeftSection>
            <div>
              <WaterPiece
                as={Heading}
                order={0}
                from="left"
                $level={3}
                $size="small"
                $role="subtitle"
                $color="textLight"
              >
                {content.work.label}
              </WaterPiece>
              <WaterPiece
                as={Heading}
                order={1}
                from="left"
                $level={2}
                $color="textLight"
                $size="normal"
              >
                {content.work.title}
              </WaterPiece>
            </div>
            <WaterPiece
              as={Text}
              order={2}
              from="right"
              $size="xxsmall"
              $color="textLight"
             
            >
              {content.work.description}
            </WaterPiece>
          </LeftSection>

          <SkillGrid ref={gridRef}>
            {shown.map(({ skill, kind }, index) => {
              const Icon = skill.icon;
              return (
                <WaterPiece
                  as={SkillCard}
                  key={skill.name}
                  order={2 + (index % 4)}
                  tabIndex={0}
                  calm
                >
                  <CardInner>
                    <CardFront>
                      <Icon size={32} aria-hidden />
                    </CardFront>
                    <CardBack>
                      <strong>{skill.name}</strong>
                      <span>{kind}</span>
                    </CardBack>
                  </CardInner>
                </WaterPiece>
              );
            })}
          </SkillGrid>
        </MainRow>
      </Content>
      <Animation />
      <Image
        style={{
          position: 'absolute',
          opacity: 0.5,
          bottom: '52%',
          left: 240,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 1
        }}
        src="/habilidades.png"
        alt=""
        aria-hidden
        width={3212 / 2.5}
        height={422 / 2.5}
      />
      <Corals />
      <Image
        style={{
          position: 'absolute',
          opacity: 1,
          top: 0,
          right: 50,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        src="/bg-bubble3.png"
        alt=""
        aria-hidden
        width={669}
        height={669}
      />
    </Container>
  );
}

export default Work;
