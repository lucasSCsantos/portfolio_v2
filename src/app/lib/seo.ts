import type { Metadata } from 'next';
import profile from '@/meta/profile';
import {
  getDictionary,
  htmlLang,
  localePaths,
  ogLocale,
  type Locale
} from '@/meta/dictionaries';

const pageUrl = (locale: Locale) =>
  locale === 'pt' ? profile.siteUrl : `${profile.siteUrl}${localePaths[locale]}`;

/** Metadados da home em um idioma, com `hreflang` para o outro. */
export function homeMetadata(locale: Locale): Metadata {
  const { seo } = getDictionary(locale);
  const other: Locale = locale === 'pt' ? 'en' : 'pt';

  return {
    metadataBase: new URL(profile.siteUrl),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: profile.name, url: profile.siteUrl }],
    alternates: {
      canonical: localePaths[locale],
      languages: {
        [htmlLang.pt]: localePaths.pt,
        [htmlLang.en]: localePaths.en,
        'x-default': localePaths.pt
      }
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: pageUrl(locale),
      siteName: seo.siteName,
      locale: ogLocale[locale],
      alternateLocale: [ogLocale[other]],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description
    },
    robots: { index: true, follow: true }
  };
}

export function personJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.fullName,
    jobTitle: getDictionary(locale).profile.role,
    url: profile.siteUrl,
    address: { '@type': 'PostalAddress', addressLocality: profile.location },
    sameAs: [
      profile.social.github,
      profile.social.linkedin,
      profile.social.instagram
    ]
  };
}
