import { Area, Content } from '../ui/default';
import NavLink from './NavLink';
import { Container } from './styles';

function Header() {
  return (
    <Container>
      <Content>
        <Area $width={60} $height="100%">
          <ul className="navLinks">
            <NavLink text="Lucas Santana" />
          </ul>
        </Area>
        <Area $width={30} $height="100%">
          <ul className="navLinks">
            <NavLink text="Sobre Mim" path="#sobre" />
            <NavLink text="Projetos" path="#projetos" />
            <NavLink text="Contato" path="#contato" />
          </ul>
        </Area>
      </Content>
    </Container>
  );
}

export default Header;
