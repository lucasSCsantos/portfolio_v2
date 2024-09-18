// import Link from 'next/link';
import { ReactNode } from 'react';
import { IconLinkContainer } from './styles';

interface IconLinkProps {
  path: string;
  children: ReactNode;
}

function IconLink({ path = '/', children }: IconLinkProps) {
  return (
    <IconLinkContainer>
      <a href={path} target="_blank" rel="noreferrer">
        {children}
      </a>
    </IconLinkContainer>
  );
}

export default IconLink;
