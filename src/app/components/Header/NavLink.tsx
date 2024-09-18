import Link from 'next/link';
import { Text } from '../ui/typography';
import { NavLinkContainer } from './styles';

interface NavLinkProps {
  text: string;
  path?: string;
}

function NavLink({ text, path = '/' }: NavLinkProps) {
  return (
    <NavLinkContainer>
      <Link href={path}>
        <Text $size="xxsmall">{text}</Text>
      </Link>
    </NavLinkContainer>
  );
}

export default NavLink;
