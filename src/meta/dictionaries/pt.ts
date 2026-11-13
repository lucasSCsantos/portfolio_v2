import profile from '../profile';
import content from '../content';
import navLinks from '../navigation';
import experiences from '../experiences';
import projects, { relationLabels } from '../projects';
import services from '../services';
import education, { educationLabels, languages } from '../education';
import skillGroups from '../skills';
import links from '../links';
import type { Dictionary } from './types';

const title = `${profile.name} - ${profile.role}`;

// O português é a fonte: os módulos de `src/meta` já têm os textos, aqui eles
// só são reunidos no formato do Dicionário.
const pt: Dictionary = {
  locale: 'pt',
  profile: {
    role: profile.role,
    availability: profile.availability,
    location: profile.location,
    resumePath: profile.resumePath,
    whatsappMessage: profile.whatsappMessage,
    emailSubject: profile.emailSubject
  },
  seo: {
    title,
    description: `Portfólio de ${profile.name}, ${profile.role.toLowerCase()} especializado em React, Node.js e TypeScript.`,
    keywords: [
      profile.name,
      profile.role.toLowerCase(),
      'React',
      'Node.js',
      'TypeScript',
      'portfólio',
      'freelancer',
      'projetos',
      'tecnologias',
      'contato'
    ],
    siteName: `${profile.name} - Portfólio`
  },
  backgroundWords: {
    about: '/about-bg-text.png',
    projects: '/projects-bg-text.png',
    services: '/services-bg-text.png',
    skills: '/habilidades.png'
  },
  ui: {
    skipLink: 'Pular para o conteúdo',
    nextSection: 'Descer para a próxima seção',
    openMenu: 'Abrir menu de navegação',
    closeMenu: 'Fechar menu de navegação',
    stats: 'Números',
    achievements: 'Realizações',
    technologies: 'Tecnologias',
    relation: 'Relação',
    role: 'Papel',
    viewDemo: 'Ver demo',
    viewDemoLabel: 'Ver demo do projeto {title}',
    viewSite: 'Ver site →',
    viewSiteLabel: 'Ver site do projeto {title}',
    offline: 'Site fora do ar',
    videoLabel: 'Vídeo do projeto {title}',
    closeVideo: 'Fechar vídeo',
    seeProject: 'Veja o projeto',
    level: 'nível {level}',
    rights: 'Todos os direitos reservados.',
    photoAlt: 'Foto de {name}',
    tagFullStack: '👉 Desenvolvedor full stack',
    tagFrontEnd: '👉 Desenvolvedor front-end',
    languageSwitch: 'Idioma',
    sceneSwitch: 'Modo da cena',
    sceneModes: { dia: 'Dia', noite: 'Noite', 'ao-vivo': 'Ao vivo' }
  },
  content,
  navLinks,
  experiences,
  projects,
  relationLabels,
  services,
  education,
  languages,
  educationLabels,
  skillKinds: Object.fromEntries(
    skillGroups.map(({ kind }) => [kind, kind])
  ),
  links
};

export default pt;
