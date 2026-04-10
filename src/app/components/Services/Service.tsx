import { Heading, Text } from '../ui/typography';
import { ServiceButton, ServiceContainer, ServiceTop } from './styles';
import profile from '@/meta/profile';
import content from '@/meta/content';

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
        <Text $size="xsmall">{text}</Text>
        <ServiceButton
          $size="small"
          as="a"
          href={`https://wa.me/${profile.whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener"
        >
          {content.services.buttonText}
        </ServiceButton>
      </ServiceTop>
    </ServiceContainer>
  );
}
