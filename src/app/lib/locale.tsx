'use client';

import { createContext, useContext } from 'react';
import type { Dictionary } from '@/meta/dictionaries';

const LocaleContext = createContext<Dictionary | null>(null);

export function LocaleProvider({
  dictionary,
  children
}: React.PropsWithChildren<{ dictionary: Dictionary }>) {
  return (
    <LocaleContext.Provider value={dictionary}>{children}</LocaleContext.Provider>
  );
}

/** Dicionário do idioma da página atual. */
export function useDict(): Dictionary {
  const dictionary = useContext(LocaleContext);
  if (!dictionary) throw new Error('useDict fora do LocaleProvider');
  return dictionary;
}
