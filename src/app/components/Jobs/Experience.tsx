import { Heading, Text } from '../ui/typography';
import {
  ExperienceContainer,
  ExperienceContent,
  ExperienceIcon
} from './styles';

interface ExperienceProps {
  backgroundSrc: string;
  iconSrc: string;
  color: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export default function Experience({
  backgroundSrc,
  iconSrc,
  company,
  role,
  period,
  description
}: ExperienceProps) {
  return (
    <ExperienceContainer
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
        <Heading $level={6} $size="small">
          {company}
        </Heading>
        <Text $size="xxsmall" $fontWeight={600} style={{ opacity: 0.8 }}>
          {role} · {period}
        </Text>
        <Text $size="xsmall" style={{ marginTop: 8 }}>
          {description}
        </Text>
      </ExperienceContent>
    </ExperienceContainer>
  );
}
