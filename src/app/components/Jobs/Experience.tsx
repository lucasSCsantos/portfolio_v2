import { Heading, Text } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
import {
  ExperienceContainer,
  ExperienceContent,
  ExperienceIcon
} from './styles';

interface ExperienceProps {
  order: number;
  backgroundSrc: string;
  iconSrc: string;
  color: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export default function Experience({
  order,
  backgroundSrc,
  iconSrc,
  company,
  role,
  period,
  description
}: ExperienceProps) {
  return (
    <WaterPiece
      as={ExperienceContainer}
      order={order}
      style={{
        backgroundImage: `url(${backgroundSrc})`
      }}
    >
      <ExperienceIcon
        style={{
          backgroundImage: `url(${iconSrc})`
        }}
      />
      <ExperienceContent>
        <Heading $level={3} $size="small">
          {company}
        </Heading>
        <Text $size="xxsmall" $fontWeight={600} style={{ opacity: 0.8 }}>
          {role} · {period}
        </Text>
        <Text $size="xsmall" style={{ marginTop: 8 }}>
          {description}
        </Text>
      </ExperienceContent>
    </WaterPiece>
  );
}
