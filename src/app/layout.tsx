import type { Metadata } from 'next';
import Providers from './providers';
import ClientLoader from './components/ClientLoader';
import { inter, poppins } from './lib/fonts';

export const metadata: Metadata = {
  title: 'Lucas Cristovam - Desenvolvedor Full Stack',
  description: 'Portfólio de Lucas Cristovam, desenvolvedor full stack especializado em React, Node.js e TypeScript.',
  keywords: [
    'Lucas Cristovam',
    'desenvolvedor full stack',
    'React',
    'Node.js',
    'TypeScript',
    'portfólio',
    'freelancer',
    'projetos',
    'tecnologias',
    'contato'
  ],
  authors: [{ name: 'Lucas Cristovam', url: 'https://lucascristovam.com' }],
  openGraph: {
    title: 'Lucas Cristovam - Desenvolvedor Full Stack',
    description: 'Portfólio de Lucas Cristovam, desenvolvedor full stack especializado em React, Node.js e TypeScript.',
    url: 'https://lucascristovam.com',
    siteName: 'Lucas Cristovam Portfolio',
    locale: 'pt_BR',
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Lucas Cristovam - Desenvolvedor Full Stack',
    description: 'Portfólio de Lucas Cristovam, desenvolvedor full stack especializado em React, Node.js e TypeScript.'
  },
  robots: { index: true, follow: true }
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
      <body className={`${inter.variable} ${poppins.variable}`} style={{ overflow: 'hidden' }}>
        <Providers>
          <ClientLoader>{children}</ClientLoader>
        </Providers>
      </body>
    </html>
  );
}
