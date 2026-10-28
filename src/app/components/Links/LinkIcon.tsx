import Image from 'next/image';
import profile from '@/meta/profile';
import type { LinkIcon as LinkIconName } from '@/meta/links';

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true
};

export default function LinkIcon({ name }: { name: LinkIconName }) {
  if (name === 'portfolio') {
    return (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
      </svg>
    );
  }

  if (name === 'email') {
    return (
      <svg {...svgProps}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    );
  }

  return <Image src={`/${profile.icons[name]}`} width={28} height={28} alt="" />;
}
