'use client';

import { sceneFor } from '@/app/lib/scene';
import { Container, Stack } from './styles';
import Waves from './Waves';
import TopSection from './TopSection';
import BottomSection from './BottomSection';

// Por enquanto a Cena é sempre `dia`: o seletor de Modo da Cena chega depois.
const MODE = 'dia';
const scene = sceneFor({ mode: MODE });

function Hero() {
  return (
    <Container
      id="inicio"
      $sky={scene.sky}
      data-cena-modo={MODE}
      data-cena-fase={scene.phase}
    >
      <Stack>
        <TopSection />
        <BottomSection />
      </Stack>
      <Waves colors={scene.waves} amplitude={scene.amp} speed={scene.speed} />
    </Container>
  );
}

export default Hero;
