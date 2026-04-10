export type ProjectType = 'desktop' | 'phone';

export interface Project {
  title: string;
  year: string;
  color: string;
  gradient?: string;
  src: string;
  href: string;
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
    description:
      'Site institucional para a torcida organizada Torcida Imperial, com informações sobre eventos, notícias e comunicados aos torcedores.'
  },
  {
    title: 'Calculadora Agricompany',
    year: '2024',
    color: '#01579B',
    src: 'agricompany.png',
    href: 'https://agricompany-landing-page.vercel.app/',
    description:
      'Landing page com calculadora interativa para a Agricompany, permitindo simulações e cotações de produtos agrícolas de forma rápida e intuitiva.'
  },
  {
    title: 'Iasos',
    year: '2023',
    color: '#F14444',
    src: 'iasos.png',
    href: 'https://iasos.com.br',
    description:
      'Plataforma digital para a Iasos, com foco em experiência do usuário e performance, entregando conteúdo de forma clara e acessível.'
  },
  {
    title: 'Biblio',
    year: '2024',
    color: '#5C3817',
    type: 'phone',
    src: 'biblio.png',
    href: 'https://biblioteste.netlify.app/',
    description:
      'Aplicativo mobile de gerenciamento de leituras e biblioteca pessoal, com cadastro de livros, progresso de leitura e resenhas.'
  },
  {
    title: 'Jogo Passa',
    year: '2026',
    color: '#000612',
    gradient: 'linear-gradient(135deg, #facc15 0%, #a855f7 50%, #3b82f6 100%)',
    type: 'phone',
    src: 'jogopassa.png',
    href: 'https://www.jogopassa.com.br',
    description:
      'App de quiz e jogos interativos para grupos e festas, com múltiplos modos de jogo, categorias variadas e suporte multiplayer.'
  }
];

export default projects;
