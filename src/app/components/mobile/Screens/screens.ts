// As Telas da Versão para celular, na ordem do mergulho: os mesmos ids das seções do desktop.
export const SCREENS = [
  'inicio',
  'sobre',
  'projetos',
  'experiencias',
  'servicos',
  'habilidades',
  'contato'
] as const;

export type ScreenId = (typeof SCREENS)[number];
