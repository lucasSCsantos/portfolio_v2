'use client';
import { Area, Content } from '../ui/default';
import { Heading } from '../ui/typography';
import { Container } from './styles';

function Services() {
  return (
    <Container id="sobre">
      <Content
        style={{
          justifyContent: 'flex-start',
          width: 1120,
          zIndex: 3,
          gap: 32
        }}
        $direction="column"
      >
        <Area
          $width={100}
          $align="flex-start"
          $justify="flex-start"
          $direction="column"
        >
          <Heading
            $level={3}
            $size="small"
            $fontWeight={500}
            $color="textLight"
          >
            Contato
          </Heading>
          <Heading
            $level={1}
            $color="text"
            $size="normal"
            $letterSpacing={-1.92}
          >
            Meus serviços
          </Heading>
        </Area>
        <Area
          $width={100}
          $align="flex-start"
          $justify="space-between"
          $direction="row"
        ></Area>
      </Content>
    </Container>
  );
}

export default Services;
