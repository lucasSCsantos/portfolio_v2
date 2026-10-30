'use client';
import { Area, Content, scrimStyle } from '../ui/default';
import { Heading } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
import { Container, ExperiencesRow } from './styles';
import Experience from './Experience';
import experiences from '@/meta/experiences';
import content from '@/meta/content';

function Jobs() {
  return (
    <Container id="experiencias">
      <Content
        style={{
          justifyContent: 'flex-start',
          maxWidth: 1120,
          zIndex: 3,
          gap: 32
        }}
        $direction="column"
      >
        <Area
          $width={100}
          $align="flex-start"
          $justify="flex-start"
          $direction="column"
          style={scrimStyle}
        >
          <WaterPiece
            as={Heading}
            order={0}
            from="left"
            $level={3}
            $size="small"
            $role="subtitle"
            $color="textLight"
          >
            {content.jobs.label}
          </WaterPiece>
          <WaterPiece
            as={Heading}
            order={1}
            from="left"
            $level={2}
            $color="textLight"
            $size="normal"
          >
            {content.jobs.title}
          </WaterPiece>
        </Area>
        <ExperiencesRow>
          {experiences.map((exp, index) => (
            <Experience key={exp.company} order={index + 2} {...exp} />
          ))}
        </ExperiencesRow>
      </Content>
    </Container>
  );
}

export default Jobs;
