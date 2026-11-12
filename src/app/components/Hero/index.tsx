'use client';

import { sceneFor } from '@/app/lib/scene';
import { useSceneMode, useSceneReady } from '@/app/lib/scene-mode';
import { Container, Stack } from './styles';
import Sky from './Sky';
import Waves from './Waves';
import TopSection from './TopSection';
import BottomSection from './BottomSection';

function Hero() {
  const mode = useSceneMode();
  const ready = useSceneReady();
  const scene = sceneFor({ mode });

  return (
    <Container
      id="inicio"
      $sky={scene.sky}
      $tone={scene.tone}
      data-cena-modo={mode}
      data-cena-fase={scene.phase}
      data-cena-pronta={ready ? '' : undefined}
    >
      <Sky scene={scene} />
      <Stack>
        <TopSection />
        <BottomSection />
      </Stack>
      <Waves colors={scene.waves} amplitude={scene.amp} speed={scene.speed} />
    </Container>
  );
}

export default Hero;
