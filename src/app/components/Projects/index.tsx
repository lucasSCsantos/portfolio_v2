'use client';

import { Area, Content } from '../ui/default';
import { useDict } from '@/app/lib/locale';
import { Heading } from '../ui/typography';
import WaterPiece from '../ui/WaterPiece';
import dynamic from 'next/dynamic';

const Carrousel = dynamic(() => import('./Carrousel'), { ssr: false });
import { Container } from './styles';
import Image from 'next/image';

const Animation = dynamic(() => import('./Animation'), { ssr: false });

function Projects() {
  const { content, backgroundWords } = useDict();

  return (
    <Container id="projetos">
      <Content
        style={{
          justifyContent: 'flex-start',
          maxWidth: 1120,
          zIndex: 3
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
            {content.projects.label}
          </WaterPiece>
          <WaterPiece
            as={Heading}
            order={1}
            from="left"
            $level={2}
            $color="onSea"
            $size="normal"
          >
            {content.projects.title}
          </WaterPiece>
        </Area>
        <WaterPiece order={3} from="right" calm>
          <Carrousel />
        </WaterPiece>
      </Content>
      <Animation />
      <Image
        style={{
          position: 'absolute',
          opacity: 0.5,
          bottom: 0,
          right: 0,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        src={backgroundWords.projects}
        alt=""
        aria-hidden
        width={1067}
        height={258}
      />
      <Image
        style={{
          position: 'absolute',
          opacity: 1,
          top: 150,
          right: -789 / 2 + 70,
          userSelect: 'none',
          pointerEvents: 'none'
        }}
        src="/bg-bubble.png"
        alt=""
        aria-hidden
        width={789}
        height={789}
      />
    </Container>
  );
}

export default Projects;
