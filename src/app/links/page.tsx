import type { Metadata } from 'next';
import Links from '../components/Links';

const description =
  'Encontre Lucas Cristovam: portfólio, WhatsApp, LinkedIn, GitHub, Instagram e e-mail.';

export const metadata: Metadata = {
  title: 'Lucas Cristovam - Links',
  description,
  openGraph: {
    title: 'Lucas Cristovam - Links',
    description,
    url: 'https://lucascristovam.com/links',
    locale: 'pt_BR',
    type: 'website'
  }
};

export default function LinksPage() {
  return <Links />;
}
