'use client';

import { Container, Stack } from './styles';
import Waves from './Waves';
import TopSection from './TopSection';
import BottomSection from './BottomSection';

function Hero() {
  return (
    <Container id="inicio">
      <Stack>
        <TopSection />
        <BottomSection />
      </Stack>
      <Waves />
    </Container>
  );
}

export default Hero;
