import { Heading, Text } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
import { ServiceButton, ServiceContainer, ServiceTop } from './styles';
import profile from '@/meta/profile';
import content from '@/meta/content';

export default function Service({
  title,
  text,
  message,
  order
}: {
  title?: string;
  text?: string;
  message?: string;
  order: number;
}) {
  return (
    <WaterPiece as={ServiceContainer} order={order} float={5}>
      <ServiceTop>
        <Heading $level={3} $size="small">
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
    </WaterPiece>
  );
}
