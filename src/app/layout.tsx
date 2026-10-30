import type { Metadata } from 'next';
import Providers from './providers';
import SkipLink from './components/SkipLink';
import { inter, poppins } from './lib/fonts';
import profile from '@/meta/profile';

const title = `${profile.name} - ${profile.role}`;
const description = `Portfólio de ${profile.name}, ${profile.role.toLowerCase()} especializado em React, Node.js e TypeScript.`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description,
  keywords: [
    profile.name,
    profile.role.toLowerCase(),
    'React',
    'Node.js',
    'TypeScript',
    'portfólio',
    'freelancer',
    'projetos',
    'tecnologias',
    'contato'
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: profile.siteUrl,
    siteName: `${profile.name} - Portfólio`,
    locale: 'pt_BR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description
  },
  robots: { index: true, follow: true }
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  alternateName: profile.fullName,
  jobTitle: profile.role,
  url: profile.siteUrl,
  address: { '@type': 'PostalAddress', addressLocality: profile.location },
  sameAs: [
    profile.social.github,
    profile.social.linkedin,
    profile.social.instagram
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  types: any;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${poppins.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <SkipLink />
          {children}
        </Providers>
      </body>
    </html>
  );
}
