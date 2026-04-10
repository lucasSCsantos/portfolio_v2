import {
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiTailwindcss,
  SiAmazonwebservices,
  SiReact,
  SiNextdotjs,
  SiExpress,
  SiMysql,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiAngular,
  SiCss3,
  SiGithub,
  SiPrisma
} from 'react-icons/si';
import { IconType } from 'react-icons';

export interface Skill {
  icon: IconType;
  name: string;
  color: string;
  expertDesc: string;
  beginnerDesc: string;
}

const skills: Skill[] = [
  {
    icon: SiTypescript,
    name: 'TypeScript',
    color: '#ffffff',
    expertDesc:
      'Tipagem estática, generics, decorators e tipos utilitários sobre JavaScript.',
    beginnerDesc: 'JavaScript que avisa seus erros antes do código rodar.'
  },
  {
    icon: SiJavascript,
    name: 'JavaScript',
    color: '#ffffff',
    expertDesc: 'ES2023+, closures, event loop, prototypes e async/await.',
    beginnerDesc: 'A linguagem que torna páginas web interativas.'
  },
  {
    icon: SiHtml5,
    name: 'HTML',
    color: '#ffffff',
    expertDesc: 'Semântica, acessibilidade, CSS Grid, Flexbox e animações.',
    beginnerDesc: 'A estrutura e aparência de toda página na web.'
  },
  {
    icon: SiCss3,
    name: 'CSS',
    color: '#ffffff',
    expertDesc: 'Semântica, acessibilidade, CSS Grid, Flexbox e animações.',
    beginnerDesc:
      'A linguagem de estilo que deixa as páginas web bonitas e organizadas.'
  },
  {
    icon: SiTailwindcss,
    name: 'Tailwind',
    color: '#ffffff',
    expertDesc:
      'Utility-first CSS com JIT compiler e customização de design tokens.',
    beginnerDesc: 'Classes prontas pra estilizar sem escrever CSS do zero.'
  },
  {
    icon: SiReact,
    name: 'React',
    color: '#ffffff',
    expertDesc: 'Hooks, Context, reconciliação e renderização otimizada.',
    beginnerDesc: 'Biblioteca para criar interfaces em partes reutilizáveis.'
  },
  {
    icon: SiAngular,
    name: 'Angular',
    color: '#ffffff',
    expertDesc: 'Componentes, diretivas, injeção de dependência e RxJS.',
    beginnerDesc:
      'Framework completo para construir aplicações web robustas e escaláveis.'
  },
  {
    icon: SiNextdotjs,
    name: 'Next.js',
    color: '#ffffff',
    expertDesc: 'SSR, SSG, ISR, App Router e otimizações de performance.',
    beginnerDesc: 'Framework React para sites mais rápidos e indexáveis.'
  },
  {
    icon: SiExpress,
    name: 'Express',
    color: '#ffffff',
    expertDesc: 'Middleware, roteamento REST e integração com bancos de dados.',
    beginnerDesc: 'Ferramenta Node.js para criar o lado servidor das apps.'
  },
  {
    icon: SiPrisma,
    name: 'Prisma',
    color: '#ffffff',
    expertDesc:
      'ORM moderno para Node.js com geração de tipos, migrações e query builder.',
    beginnerDesc:
      'Ferramenta para facilitar o acesso e manipulação de bancos de dados em Node.js.'
  },
  {
    icon: SiAmazonwebservices,
    name: 'AWS',
    color: '#ffffff',
    expertDesc: 'EC2, S3, Lambda, RDS e arquitetura de cloud computing.',
    beginnerDesc: 'Computadores da Amazon na nuvem que hospedam aplicações.'
  },
  {
    icon: SiGithub,
    name: 'GitHub',
    color: '#ffffff',
    expertDesc: 'Controle de versão, pull requests, CI/CD e GitHub Actions.',
    beginnerDesc: 'Plataforma para guardar código e colaborar com outros devs.'
  },
  {
    icon: SiMysql,
    name: 'MySQL',
    color: '#ffffff',
    expertDesc: 'ACID, joins complexos, índices e otimização de queries.',
    beginnerDesc: 'Banco que guarda dados em tabelas, como uma planilha.'
  },
  {
    icon: SiMongodb,
    name: 'MongoDB',
    color: '#ffffff',
    expertDesc: 'Documentos BSON, aggregation pipeline e índices compostos.',
    beginnerDesc: 'Banco que guarda dados como arquivos JSON flexíveis.'
  },
  {
    icon: SiPostgresql,
    name: 'PostgreSQL',
    color: '#ffffff',
    expertDesc: 'JSONB, CTEs, window functions e extensões avançadas.',
    beginnerDesc: 'Banco de dados poderoso, gratuito e muito confiável.'
  },
  {
    icon: SiRedis,
    name: 'Redis',
    color: '#ffffff',
    expertDesc: 'Estruturas in-memory, pub/sub e estratégias de caching.',
    beginnerDesc: 'Memória ultrarrápida para dados temporários e cache.'
  }
];

export default skills;
