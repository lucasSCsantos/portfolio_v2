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
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Ou use Framer Motion para controle mais preciso do timing
      }
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
