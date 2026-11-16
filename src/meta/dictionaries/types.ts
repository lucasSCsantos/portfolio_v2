import type content from '../content';
import type { Education } from '../education';
import type { Experience } from '../experiences';
import type { LinkItem } from '../links';
import type { Project, ProjectRelation } from '../projects';
import type { Service } from '../services';
import type { SceneMode } from '@/app/lib/scene';

export type Locale = 'pt' | 'en';

export const locales: Locale[] = ['pt', 'en'];
export const defaultLocale: Locale = 'pt';

// Caminho da home em cada idioma. O português é o padrão e não tem prefixo.
export const localePaths: Record<Locale, string> = { pt: '/', en: '/en' };

export const htmlLang: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };
export const ogLocale: Record<Locale, string> = { pt: 'pt_BR', en: 'en_US' };

// Textos da interface que não pertencem a uma seção. Os que levam variável
// usam `{nome}`: dicionário é dado puro, passa do servidor para o cliente.
export interface Ui {
  skipLink: string;
  nextSection: string;
  // Versão para celular: o nome da Tela do Hero e o da navegação pelos pontos da lateral.
  home: string;
  screens: string;
  openMenu: string;
  closeMenu: string;
  stats: string;
  achievements: string;
  technologies: string;
  relation: string;
  role: string;
  viewDemo: string;
  viewDemoLabel: string;
  viewSite: string;
  viewSiteLabel: string;
  offline: string;
  videoLabel: string;
  closeVideo: string;
  seeProject: string;
  level: string;
  rights: string;
  photoAlt: string;
  tagFullStack: string;
  tagFrontEnd: string;
  languageSwitch: string;
  sceneSwitch: string;
  sceneModes: Record<SceneMode, string>;
}

// Palavras decorativas de fundo das seções: têm o texto dentro da imagem.
export interface BackgroundWords {
  about: string;
  projects: string;
  services: string;
  skills: string;
}

export interface Seo {
  title: string;
  description: string;
  keywords: string[];
  siteName: string;
}

export interface Dictionary {
  locale: Locale;
  // Campos de identidade que mudam com o idioma; o resto fica em `profile`.
  profile: {
    role: string;
    availability: string;
    location: string;
    resumePath: string;
    whatsappMessage: string;
    emailSubject: string;
  };
  seo: Seo;
  ui: Ui;
  backgroundWords: BackgroundWords;
  content: typeof content;
  navLinks: { text: string; path: string }[];
  experiences: Experience[];
  projects: Project[];
  relationLabels: Record<ProjectRelation, string>;
  services: Service[];
  education: Education[];
  languages: { name: string; level: string }[];
  educationLabels: { title: string; languages: string };
  // O que cada item de um grupo de habilidades é, indexado pelo rótulo em português.
  skillKinds: Record<string, string>;
  links: LinkItem[];
}

/** Troca `{nome}` pelos valores dados. */
export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}
