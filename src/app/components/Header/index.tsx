import { Area, Content } from '../ui/default';
import { Text } from '../ui/typography';
import NavLink from './NavLink';
import { Container } from './styles';
import navLinks from '@/meta/navigation';
import profile from '@/meta/profile';

function Header() {
  return (
    <Container>
      <Content>
        <Area $width={40} $height="100%">
          <ul className="navLinks">
            <Text $size="xxsmall">
              {profile.firstName}{' '}
              <Text
                as="span"
                $size="xxsmall"
                $color="secondary"
                $fontWeight={700}
              >
                {profile.lastName}
              </Text>
            </Text>
          </ul>
        </Area>
        <Area $width={70} $height="100%">
          <ul className="navLinks">
            {navLinks.map(({ text, path }) => (
              <NavLink key={path} text={text} path={path} />
            ))}
          </ul>
        </Area>
      </Content>
    </Container>
  );
}

export default Header;
