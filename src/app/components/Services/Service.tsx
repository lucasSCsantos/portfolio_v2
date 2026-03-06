import { Heading, HoverLink, Text } from '../ui/typography';
import { ServiceBottom, ServiceContainer, ServiceTop } from './styles';

export default function Service({
  title,
  text,
  message
}: {
  title?: string;
  text?: string;
  message?: string;
}) {
  return (
    <ServiceContainer>
      <ServiceTop>
        <Heading $level={6} $size="small">
          {title}
        </Heading>
        <Text $size="small">{text}</Text>
      </ServiceTop>
      <a
        style={{ width: '100%' }}
        target="_blank"
        href={`https://wa.me//5571981849630?text=${message}`}
      >
        <ServiceBottom $backgroundColor="primary">
          <Text $size="small">Entre em Contato!</Text>
        </ServiceBottom>
      </a>
    </ServiceContainer>
  );
}
