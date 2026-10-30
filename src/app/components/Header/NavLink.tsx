'use client';

import { MouseEvent } from 'react';
import { scrollToId } from '@/app/lib/scroll';
import { Text } from '../ui/typography';
import { NavLinkContainer } from './styles';

interface NavLinkProps {
  text: string;
  path?: string;
  onNavigate?: () => void;
}

function NavLink({ text, path = '/', onNavigate }: NavLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (path.startsWith('#')) {
      e.preventDefault();
      scrollToId(path.slice(1));
    }

    onNavigate?.();
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
