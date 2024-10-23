import Link from 'next/link';
import { Text } from '../ui/typography';
import { NavLinkContainer } from './styles';

interface NavLinkProps {
  text: string;
  path?: string;
  bold?: boolean;
}

function NavLink({ text, path = '/', bold = false }: NavLinkProps) {
  return (
    <NavLinkContainer>
      <Link href={path}>
        <Text $size="xxsmall" $fontWeight={bold ? 700 : 400}>{text}</Text>
      </Link>
    </NavLinkContainer>
  );
}

export default NavLink;
