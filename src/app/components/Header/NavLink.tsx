'use client';

import { Text } from '../ui/typography';
import { NavLinkContainer } from './styles';

interface NavLinkProps {
  text: string;
  path?: string;
}

function NavLink({ text, path = '/' }: NavLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (path.startsWith('#')) {
      e.preventDefault();
      const id = path.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NavLinkContainer>
      <a href={path} onClick={handleClick}>
        <Text $size="xxsmall">{text}</Text>
      </a>
    </NavLinkContainer>
  );
}

export default NavLink;
