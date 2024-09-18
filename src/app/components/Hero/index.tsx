import { Heading, Text } from '@/app/components/ui/typography';
import { Container } from './styles';
import Waves from './Waves';

function Hero() {
  return (
    <Container>
      <Text
        size="xsmall"
        textAlign="center"
        lineHeight={1}
        style={{ marginBottom: 16 }}
      >
        Oi, eu sou Lucas!
      </Text>
      <Heading level={1} size="large" textAlign="center" lineHeight={1}>
        Desenvolvedor
        <br />
        de Software
      </Heading>
      <Waves />
    </Container>
  );
}

export default Hero;
