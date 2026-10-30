import { Heading, Text } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
import {
  Achievements,
  ExperienceItem,
  Kind,
  Meta,
  TechList
} from './styles';
import type { Experience as ExperienceData } from '@/meta/experiences';

interface ExperienceProps extends ExperienceData {
  order: number;
}

export default function Experience({
  order,
  company,
  role,
  period,
  kind,
  note,
  highlight,
  achievements,
  techs,
  projectTitle
}: ExperienceProps) {
  return (
    <WaterPiece as={ExperienceItem} order={order} solid>
      <Heading $level={3} $size="small" $color="textLight">
        {company}
        {kind && <Kind>{kind}</Kind>}
      </Heading>
      <Meta>
        {role} · {period}
        {note && ` · ${note}`}
      </Meta>
      {highlight && (
        <Text $size="xxxsmall" $fontWeight={600} $color="primary">
          {highlight}
        </Text>
      )}
      <Achievements aria-label="Realizações">
        {achievements.map(item => (
          <li key={item}>{item}</li>
        ))}
      </Achievements>
      <TechList aria-label="Tecnologias">
        {techs.map(tech => (
          <li key={tech}>{tech}</li>
        ))}
      </TechList>
      {projectTitle && (
        <Text $size="xxxsmall" $color="textLight">
          Veja o projeto <a href="#projetos">{projectTitle}</a>.
        </Text>
      )}
    </WaterPiece>
  );
}
