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
  GroupTitle,
  LeftSection,
  MainRow,
  SkillCard,
  SkillGroupList,
  SkillGroups
} from './styles';
import Corals from './Corals';
import skillGroups from '@/meta/skills';
import content from '@/meta/content';
import dynamic from 'next/dynamic';

const Animation = dynamic(() => import('./Animation'), { ssr: false });

function Work() {
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

          <SkillGroups>
            {skillGroups.map((group, index) => (
              <WaterPiece
                as="div"
                key={group.title}
                order={2 + (index % 4)}
                calm
              >
                <GroupTitle>{group.title}</GroupTitle>
                <SkillGroupList aria-label={group.title}>
                  {group.skills.map(skill => {
                    const Icon = skill.icon;
                    return (
                      <SkillCard key={skill.name} tabIndex={0}>
                        <CardInner>
                          <CardFront>
                            <Icon size={32} aria-hidden />
                          </CardFront>
                          <CardBack>{skill.name}</CardBack>
                        </CardInner>
                      </SkillCard>
                    );
                  })}
                </SkillGroupList>
              </WaterPiece>
            ))}
          </SkillGroups>
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
