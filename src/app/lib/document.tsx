import Providers from '../providers';
import SkipLink from '../components/SkipLink';
import { LocaleProvider } from './locale';
import { personJsonLd } from './seo';
import { sceneModeScript, sceneModeStyle } from './scene-prepaint';
import { inter, poppins } from './fonts';
import { getDictionary, htmlLang, type Locale } from '@/meta/dictionaries';

/** Documento HTML de uma página em um idioma: cada idioma é um layout raiz. */
export default function Document({
  locale,
  children
}: React.PropsWithChildren<{ locale: Locale }>) {
  return (
    // `data-cena` é posto no <html> por um script antes da hidratação.
    <html lang={htmlLang[locale]} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: sceneModeScript }} />
        <style dangerouslySetInnerHTML={{ __html: sceneModeStyle }} />
      </head>
      <body className={`${inter.variable} ${poppins.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd(locale))
          }}
        />
        <Providers>
          <LocaleProvider dictionary={getDictionary(locale)}>
            <SkipLink />
            {children}
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
