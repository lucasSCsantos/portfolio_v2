'use client';
import { Area, Content } from '../ui/default';
import { Heading } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
import {
  Container,
  EducationGrid,
  EducationList,
  Timeline
} from './styles';
import Experience from './Experience';
import { fill } from '@/meta/dictionaries';
import { useDict } from '@/app/lib/locale';

function Jobs() {
  const { content, experiences, education, educationLabels, languages, ui } =
    useDict();

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
        <Timeline>
          {experiences.map((exp, index) => (
            <Experience key={exp.company} order={index + 2} {...exp} />
          ))}
        </Timeline>
        <WaterPiece
          as={Heading}
          order={2}
          from="left"
          $level={3}
          $size="small"
          $role="subtitle"
          $color="textLight"
        >
          {educationLabels.title}
        </WaterPiece>
        <EducationGrid>
          <WaterPiece as={EducationList} order={3} solid>
            {education.map(item => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                {item.institution} · {item.period}
              </li>
            ))}
          </WaterPiece>
          <WaterPiece
            as={EducationList}
            order={4}
            solid
            aria-label={educationLabels.languages}
          >
            {languages.map(lang => (
              <li key={lang.name}>
                <strong>{educationLabels.languages}</strong>
                {lang.name} · {fill(ui.level, { level: lang.level })}
              </li>
            ))}
          </WaterPiece>
        </EducationGrid>
      </Content>
    </Container>
  );
}

export default Jobs;
