'use client';

import { useMemo } from 'react';
import { useScene, useSceneCrossfade, useSceneReady } from '@/app/lib/scene-mode';
import { Container, Stack } from './styles';
import Sky from './Sky';
import Waves from './Waves';
import TopSection from './TopSection';
import BottomSection from './BottomSection';

function Hero() {
  const { mode, scene: target } = useScene();
  const ready = useSceneReady();
  const scene = useSceneCrossfade(target, ready);
  // O conteúdo não muda com a Cena: não precisa renderizar de novo a cada quadro da troca.
  const content = useMemo(
    () => (
      <Stack>
        <TopSection />
        <BottomSection />
      </Stack>
    ),
    []
  );

  return (
    <Container
      id="inicio"
      $tone={scene.tone}
      style={
        {
          '--sky-top': scene.sky[0],
          '--sky-middle': scene.sky[1],
          '--sky-bottom': scene.sky[2]
        } as React.CSSProperties
      }
      data-cena-modo={mode}
      data-cena-fase={target.phase}
      data-cena-pronta={ready ? '' : undefined}
    >
      <Sky scene={scene} />
      {content}
      {/* A cor e a altura acompanham a troca; o ritmo e o balanço mudam de uma vez, para não reiniciar o balanço a cada quadro. */}
      <Waves
        colors={scene.waves}
        amplitude={scene.amp}
        bobAmplitude={target.amp}
        speed={target.speed}
      />
    </Container>
  );
}

export default Hero;
