'use client';

import {
  htmlLang,
  localePaths,
  locales,
  type Locale
} from '@/meta/dictionaries';
import { useDict } from '@/app/lib/locale';
import { LanguageSwitchContainer } from './styles';

// Cada idioma aparece pelo próprio nome.
const LANGUAGES: Record<Locale, { code: string; name: string }> = {
  pt: { code: 'PT', name: 'Português' },
  en: { code: 'EN', name: 'English' }
};

interface LanguageSwitchProps {
  onSea?: boolean;
  // Seção em que a pessoa está: a troca de idioma a mantém.
  activeId?: string | null;
}

/** Links reais para a mesma página nos dois idiomas. */
export default function LanguageSwitch({ onSea, activeId }: LanguageSwitchProps) {
  const { locale, ui } = useDict();

  return (
    <LanguageSwitchContainer
      $onSea={onSea}
      role="group"
      aria-label={ui.languageSwitch}
    >
      {locales.map(target => {
        const { code, name } = LANGUAGES[target];
        const lang = htmlLang[target];
        return (
          <a
            key={target}
            href={`${localePaths[target]}${activeId ? `#${activeId}` : ''}`}
            lang={lang}
            hrefLang={lang}
            aria-label={name}
            aria-current={target === locale ? 'true' : undefined}
          >
            {code}
          </a>
        );
      })}
    </LanguageSwitchContainer>
  );
}
