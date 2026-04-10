'use client';
import Image from 'next/image';
import { Content } from '../ui/default';
import { Heading, Text } from '../ui/typography';
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
import skills from '@/meta/skills';
import content from '@/meta/content';

function Work() {
  return (
    <Container id="servicos">
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
              <Heading
                $level={3}
                $size="small"
                $fontWeight={500}
                $color="textLight"
              >
                {content.work.label}
              </Heading>
              <Heading
                $level={1}
                $color="text"
                $size="normal"
                $letterSpacing={-1.92}
              >
                {content.work.title}
              </Heading>
            </div>
            <Text
              $size="xxsmall"
              $color="textLight"
              $fontWeight={400}
              $lineHeight={1.6}
            >
              {content.work.description}
            </Text>
          </LeftSection>

          <SkillGrid>
            {skills.map(skill => {
              const Icon = skill.icon;
              return (
                <SkillCard key={skill.name}>
                  <CardInner>
                    <CardFront>
                      <Icon size={64} color={skill.color} />
                    </CardFront>
                    <CardBack>
                      <span className="skill-name">{skill.name}</span>
                      <div className="divider" />
                    </CardBack>
                  </CardInner>
                </SkillCard>
              );
            })}
          </SkillGrid>
        </MainRow>
      </Content>
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
        alt="Texto escrito 'habilidades'"
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
        alt="Texto escrito 'sobre'"
        width={669}
        height={669}
      />
    </Container>
  );
}

export default Work;
