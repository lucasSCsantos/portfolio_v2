import type { Metadata } from 'next';
import Links from '../../components/Links';
import profile from '@/meta/profile';

const title = `${profile.name} - ${profile.role}`;
const description = `Encontre ${profile.name}: portfólio, WhatsApp, LinkedIn, GitHub, Instagram e e-mail.`;

export const metadata: Metadata = {
  title: `${title} | Links`,
  description,
  alternates: { canonical: '/links' },
  twitter: { card: 'summary_large_image' },
  openGraph: {
    title: `${title} | Links`,
    description,
    url: `${profile.siteUrl}/links`,
    locale: 'pt_BR',
    type: 'website'
  }
};

export default function LinksPage() {
  return <Links />;
}
