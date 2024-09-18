import { Area } from '../ui/default';
import NavLink from './NavLink';
import { Container } from './styles';

function Header() {
  return (
    <Container>
      <Area backgroundColor="transparent" width={60} height="100%">
        <ul className="navLinks">
          <NavLink text="Lucas Santana" />
        </ul>
      </Area>
      <Area backgroundColor="transparent" width={40} height="100%">
        <ul className="navLinks">
          <NavLink text="Sobre Mim" path="#sobre" />
          <NavLink text="Projetos" path="#projetos" />
          <NavLink text="Contato" path="#contato" />
        </ul>
      </Area>
    </Container>
  );
}

export default Header;
