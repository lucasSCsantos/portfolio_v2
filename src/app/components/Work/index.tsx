'use client';
import Image from 'next/image';
import { Content } from '../ui/default';
import { Heading, Text } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
import {
  CardBack,
  CardFront,
  CardInner,
  Competencies,
  Container,
  LeftSection,
  MainRow,
  SkillCard,
  SkillGrid
} from './styles';
import { useRef } from 'react';
import useSkillRotation from './useSkillRotation';
import { useDict } from '@/app/lib/locale';
import dynamic from 'next/dynamic';

const Animation = dynamic(() => import('./Animation'), { ssr: false });

function Work() {
  const { content, skillKinds, backgroundWords } = useDict();
  const gridRef = useRef<HTMLUListElement>(null);
  const { shown } = useSkillRotation(gridRef, false);

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
            <WaterPiece
              as={Competencies}
              order={3}
              from="right"
              aria-label={content.work.competenciesLabel}
            >
              {content.work.competencies.map(({ title, text }) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
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
                      <span>{skillKinds[kind] ?? kind}</span>
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
        src={backgroundWords.skills}
        alt=""
        aria-hidden
        width={3212 / 2.5}
        height={422 / 2.5}
      />
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
