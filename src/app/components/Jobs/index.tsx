'use client';
import { Area, Content } from '../ui/default';
import { Heading } from '../ui/typography';
import { Container, ExperiencesRow } from './styles';
import Experience from './Experience';
import experiences from '@/meta/experiences';
import content from '@/meta/content';

function Jobs() {
  return (
    <Container id="">
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
        >
          <Heading
            $level={3}
            $size="small"
            $fontWeight={500}
            $color="textLight"
          >
            {content.jobs.label}
          </Heading>
          <Heading
            $level={1}
            $color="text"
            $size="normal"
            $letterSpacing={-1.92}
          >
            {content.jobs.title}
          </Heading>
        </Area>
        <ExperiencesRow>
          {experiences.map(exp => (
            <Experience key={exp.company} {...exp} />
          ))}
        </ExperiencesRow>
      </Content>
    </Container>
  );
}

export default Jobs;
