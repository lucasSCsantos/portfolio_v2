import profile from './profile';

export type LinkIcon =
  | 'portfolio'
  | 'whatsapp'
  | 'linkedin'
  | 'github'
  | 'instagram'
  | 'email';

export type LinkItem = {
  label: string;
  href: string;
  icon: LinkIcon;
  featured?: boolean;
  external?: boolean;
};

const links: LinkItem[] = [
  { label: 'Meu portfólio', href: '/', icon: 'portfolio', featured: true },
  {
    label: 'WhatsApp',
    href: `${profile.social.whatsapp}?text=${profile.whatsappMessage}`,
    icon: 'whatsapp',
    external: true
  },
  {
    label: 'LinkedIn',
    href: profile.social.linkedin,
    icon: 'linkedin',
    external: true
  },
  {
    label: 'GitHub',
    href: profile.social.github,
    icon: 'github',
    external: true
  },
  {
    label: 'Instagram',
    href: profile.social.instagram,
    icon: 'instagram',
    external: true
  },
  {
    label: 'E-mail',
    href: `mailto:${profile.email}?subject=${encodeURIComponent(profile.emailSubject)}`,
    icon: 'email'
  }
];

export default links;
