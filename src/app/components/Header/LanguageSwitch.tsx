'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  htmlLang,
  localePaths,
  locales,
  type Locale
} from '@/meta/dictionaries';
import { useDict } from '@/app/lib/locale';
import { SwitchContainer, SwitchThumb } from './styles';

// Cada idioma aparece pelo próprio nome.
const LANGUAGES: Record<Locale, { code: string; name: string }> = {
  pt: { code: 'PT', name: 'Português' },
  en: { code: 'EN', name: 'English' }
};

// Tempo para o seletor terminar de deslizar antes de a página trocar.
const SLIDE_MS = 320;

interface LanguageSwitchProps {
  onSea?: boolean;
  // Seção em que a pessoa está: a troca de idioma a mantém.
  activeId?: string | null;
}

/**
 * Links reais para a mesma página nos dois idiomas. No clique, o seletor
 * desliza e só então a página troca (cada idioma é um documento próprio).
 */
export default function LanguageSwitch({ onSea, activeId }: LanguageSwitchProps) {
  const { locale, ui } = useDict();
  // O idioma mostrado como ativo: muda antes da navegação, para a animação rodar.
  const [selected, setSelected] = useState<Locale>(locale);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, target: Locale) => {
    const withModifier =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    // Nova aba, clique do meio etc. seguem o comportamento normal do link.
    if (event.button !== 0 || withModifier) return;

    event.preventDefault();
    const href = event.currentTarget.href;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      window.location.assign(href);
      return;
    }
    setSelected(target);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => window.location.assign(href), SLIDE_MS);
  };

  return (
    <SwitchContainer
      $onSea={onSea}
      role="group"
      aria-label={ui.languageSwitch}
    >
      <SwitchThumb
        aria-hidden
        $onSea={onSea}
        $index={locales.indexOf(selected)}
      />
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
            data-selected={target === selected}
            onClick={event => handleClick(event, target)}
          >
            {code}
          </a>
        );
      })}
    </SwitchContainer>
  );
}
