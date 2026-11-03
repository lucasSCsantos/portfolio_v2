import type { CSSProperties } from 'react';
import Image from 'next/image';
import profile from '@/meta/profile';
import type { LinkIcon as LinkIconName } from '@/meta/links';
import { KnockoutIcon } from './styles';

const files: Record<LinkIconName, string> = {
  ...profile.icons,
  portfolio: 'portfolio-icon.svg',
  email: 'email-icon.svg'
};

// knockout: o ícone vira um furo que mostra o mar atrás; sem ele, é a imagem como está.
export default function LinkIcon({
  name,
  knockout
}: {
  name: LinkIconName;
  knockout?: boolean;
}) {
  const src = `/${files[name]}`;

  if (knockout)
    return <KnockoutIcon style={{ '--icon': `url(${src})` } as CSSProperties} />;

  return <Image src={src} width={28} height={28} alt="" />;
}
