import { ReactNode } from 'react';
import { IconLinkContainer } from './styles';
import Link from 'next/link';

interface IconLinkProps {
  path: string;
  children: ReactNode;
}

function IconLink({ path = '/', children }: IconLinkProps) {
  return (
    <IconLinkContainer>
      <Link href={path} target="_blank" rel="noreferrer">
        {children}
      </Link>
    </IconLinkContainer>
  );
}

export default IconLink;
