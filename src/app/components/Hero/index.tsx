'use client';

import { Container } from './styles';
import Waves from './Waves';
import TopSection from './TopSection';
import BottomSection from './BottomSection';
import { Content } from '../ui/default';

function Hero() {
  return (
    <Container>
      <Content $direction="column">
        <TopSection />
        <BottomSection />
      </Content>
      <Waves />
    </Container>
  );
}

export default Hero;
