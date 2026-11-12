import pt from './pt';
import en from './en';
import type { Dictionary, Locale } from './types';

export * from './types';

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
