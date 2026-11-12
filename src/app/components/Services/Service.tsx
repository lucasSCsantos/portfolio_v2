import { Heading, Text } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
import {
  ServiceButton,
  ServiceContainer,
  ServiceProof,
  ServiceTop
} from './styles';
import profile from '@/meta/profile';
import { useDict } from '@/app/lib/locale';
import type { Service as ServiceData } from '@/meta/services';

export default function Service({
  title,
  text,
  proof,
  buttonLabel,
  message,
  order
}: ServiceData & { order: number }) {
  const { content } = useDict();

  return (
    <WaterPiece as={ServiceContainer} order={order} float={5}>
      <ServiceTop>
        <Heading $level={3} $size="xsmall">
          {title}
        </Heading>
        <Text $size="xxsmall">{text}</Text>
        <ServiceProof>
          {content.services.proofLabel}:{' '}
          <a href={proof.href}>{proof.name}</a>
        </ServiceProof>
        <ServiceButton
          $size="small"
          as="a"
          href={`https://wa.me/${profile.whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener"
        >
          {buttonLabel}
        </ServiceButton>
      </ServiceTop>
    </WaterPiece>
  );
}
