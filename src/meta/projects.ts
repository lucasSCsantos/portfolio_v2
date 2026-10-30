export type ProjectType = 'desktop' | 'phone';

export interface ProjectVideo {
  horizontal?: string;
  vertical?: string;
}

export type ProjectRelation =
  | 'cliente'
  | 'empregador'
  | 'iniciativa própria'
  | 'voluntário';

export type ProjectLinkKind = 'production' | 'demo' | 'none';

export const relationLabels: Record<ProjectRelation, string> = {
  cliente: 'Para cliente',
  empregador: 'Para empregador',
  'iniciativa própria': 'Iniciativa própria',
  voluntário: 'Voluntário'
};

export interface Project {
  title: string;
  year: string;
  role: string;
  technologies: string[];
  result?: string;
  relation: ProjectRelation;
  linkKind: ProjectLinkKind;
  color: string;
  gradient?: string;
  src: string | string[];
  href?: string;
  video?: ProjectVideo;
  type?: ProjectType;
  description: string;
}

const projects: Project[] = [
  {
    title: 'Torcida Imperial',
    year: '2022',
    color: '#00D84F',
    src: 'imperial.png',
    href: 'https://torcidaimperial.com.br',
    linkKind: 'production',
    relation: 'iniciativa própria',
    role: 'Idealizei, criei do zero e lancei',
    technologies: ['Next.js', 'React'],
    result: '+30 mil usuários',
    description:
      'Portal da torcida organizada, com eventos, notícias e comunicados. Tem gamificação (medalhas, níveis e skins) e campanhas automatizadas. Nasceu como iniciativa minha, enquanto eu trabalhava na Eattasty.'
  },
  {
    title: 'Sistema de Gestão de Voluntários',
    year: '2026',
    color: '#E8710A',
    src: 'voluntarios-provisorio.svg',
    linkKind: 'none',
    relation: 'voluntário',
    role: 'Idealizei e construí',
    technologies: ['Airtable'],
    result: '+530 voluntários em 15 áreas',
    description:
      'Sistema do Ministério Infantil para organizar os voluntários. Cruza as respostas dos formulários com as listas da coordenação e entrega listas por área, gráficos e um painel de métricas para a liderança.'
  },
  {
    title: 'Calculadora Agricompany',
    year: '2024',
    color: '#01579B',
    src: 'agricompany.png',
    href: 'https://agricompany-landing-page.vercel.app/',
    linkKind: 'demo',
    relation: 'empregador',
    role: 'Desenvolvedor Full Stack',
    technologies: ['Next.js', 'TypeScript'],
    description:
      'Landing page com calculadora interativa que faz o diagnóstico da fazenda ou da empresa e mostra onde otimizar a operação, ganhar produtividade e reduzir custos.'
  },
  {
    title: 'Iasos',
    year: '2023',
    color: '#F14444',
    src: 'iasos.png',
    href: 'https://iasos.com.br',
    linkKind: 'production',
    relation: 'cliente',
    role: 'Liderança técnica do ecossistema digital (freelance)',
    technologies: ['React', 'Next.js', 'Node.js'],
    result: '+500 usuários migrados sem perda',
    description:
      'Plataforma da Iasos, empresa de saúde cujo QR code dá acesso rápido a informações médicas e contatos de emergência. Cuidei do site, da performance e da migração dos usuários.'
  },
  {
    title: 'Biblio',
    year: '2024',
    color: '#5C3817',
    type: 'phone',
    src: ['biblio-mobile.png', 'biblio-mobile.png'],
    href: 'https://biblioteste.netlify.app/',
    linkKind: 'demo',
    relation: 'iniciativa própria',
    role: 'Criei e desenvolvi',
    technologies: ['React', 'TypeScript'],
    description:
      'Jogo diário de adivinhar livros da Bíblia. São 6 tentativas, com dicas sobre as letras certas, nas posições certas e ausentes.'
  },
  {
    title: 'Jogo Passa',
    year: '2026',
    color: '#000612',
    gradient: 'linear-gradient(135deg, #facc15 0%, #a855f7 50%, #3b82f6 100%)',
    type: 'phone',
    src: ['jogopassa.png', 'jogopassa-sala2.png'],
    href: 'https://www.jogopassa.com.br',
    linkKind: 'production',
    relation: 'iniciativa própria',
    role: 'Criei e desenvolvi',
    technologies: ['React', 'TypeScript'],
    description:
      'Temporizador online para jogos de festa: cada jogador tem um tempo limitado para agir ou responder, e todos conectam o próprio celular na mesma sala.'
  },
  {
    title: 'Mural ONDA',
    year: '2026',
    color: '#459AC8',
    src: 'mural-onda.png',
    href: 'https://onda-gules-zeta.vercel.app/sobre',
    linkKind: 'demo',
    relation: 'voluntário',
    role: 'Idealizei e desenvolvi',
    technologies: ['Next.js', 'TypeScript'],
    video: {
      horizontal: '/mural-onda.mp4',
      vertical: '/mural-onda-9x16.mp4'
    },
    description:
      'Calendário de eventos da liderança do ONDA, ministério de adolescentes. Eventos recorrentes geram as ocorrências sozinhos e as pastas no Google Drive são criadas automaticamente.'
  }
];

export default projects;
