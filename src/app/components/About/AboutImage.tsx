import profile from '@/meta/profile';
import { Area } from '../ui/default';
import WaterPiece from '../ui/WaterPiece';
import { Tag } from './styles';
import Image from 'next/image';

export default function AboutImage() {
  return (
    <Area
      id="right-about-area"
      $width={45}
      $height={'100%'}
      $align="flex-end"
      $justify="flex-end"
      $direction="column"
      style={{ position: 'relative' }}
    >
      <WaterPiece
        as={Tag}
        className="tag"
        order={5}
        from="right"
        float={8}
        calm
        style={{ bottom: '24%', right: 468 - 280 }}
      >
        👉 Desenvolvedor Full-stack
      </WaterPiece>
      <WaterPiece
        as={Tag}
        className="tag"
        order={6}
        from="right"
        float={8}
        calm
        style={{ bottom: '12%', right: 468 - 280 }}
      >
        👉 Desenvolvedor Front-end
      </WaterPiece>
      <WaterPiece
        as={Image}
        order={1}
        from="right"
        calm
        src={profile.photos.about}
        width={468}
        height={468}
        quality={65}
        sizes="(max-width: 834px) 100vw, 468px"
        style={{ borderRadius: 20 }}
        alt={`Foto de ${profile.name}`}
      />
    </Area>
  );
}
