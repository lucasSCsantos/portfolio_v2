import { Heading, Text } from '../ui/typography';
import { ServiceBottom, ServiceContainer, ServiceTop } from './styles';

export default function Service() {
  return (
    <ServiceContainer>
      <ServiceTop>
        <Heading $level={6} $size="small">
          Desenvolvimento Web
        </Heading>
        <Text $size="small">
          Crio toda a parte de desenvolvimento web para sites institucionais
          e...
        </Text>
      </ServiceTop>
      <ServiceBottom $backgroundColor="primary">
        <Text $size="small">Entre em Contato!</Text>
      </ServiceBottom>
    </ServiceContainer>
  );
}
