export interface Experience {
  company: string;
  role: string;
  period: string;
  // Rótulo de vínculo e nota que explicam datas sobrepostas (ex.: freelance).
  kind?: string;
  note?: string;
  // Responsabilidade em destaque, antes das realizações.
  highlight?: string;
  achievements: string[];
  techs: string[];
  // Projeto relacionado, para as duas pontas se referenciarem.
  projectTitle?: string;
}

const ROLE = 'Desenvolvedor Full Stack';

// Da mais recente para a mais antiga. A Torcida Imperial é um Projeto, não uma Experiência.
const experiences: Experience[] = [
  {
    company: 'Kempetro',
    role: `${ROLE} (estágio)`,
    period: 'Jul 2026 – atual',
    achievements: [
      'Desenvolvo funcionalidades de ponta a ponta, da interface à API, em sistemas internos da empresa.',
      'Trabalho em equipe com metodologias ágeis e acompanho as entregas em ferramentas de gestão.'
    ],
    techs: ['React', 'Next.js', 'Node.js', 'TypeScript']
  },
  {
    company: 'Agricompany',
    role: ROLE,
    period: 'Jan 2024 – Dez 2025',
    achievements: [
      'Construí dashboards analíticos que transformaram dados de campo em decisões para o agronegócio.',
      'Integrei APIs e otimizei os fluxos de dados dos sistemas web da empresa.',
      'Criei a calculadora de diagnóstico de fazendas, porta de entrada para novos clientes.'
    ],
    techs: ['Next.js', 'Node.js', 'TypeScript', 'PostgreSQL']
  },
  {
    company: 'IASOS',
    role: ROLE,
    period: 'Jun 2022 – Jul 2023',
    kind: 'Freelance',
    note: 'em paralelo à Eattasty',
    highlight:
      'Liderança técnica de todo o ecossistema digital da empresa, do planejamento à entrega.',
    achievements: [
      'Conduzi a plataforma e os sistemas de apoio, definindo prioridades e arquitetura.',
      'Migrei mais de 500 usuários para a nova plataforma sem perda de dados.'
    ],
    techs: ['React', 'Next.js', 'Node.js', 'MongoDB'],
    projectTitle: 'Iasos'
  },
  {
    company: 'Eattasty',
    role: ROLE,
    period: 'Mar 2022 – Jan 2024',
    kind: 'Portugal',
    achievements: [
      'Migrei a plataforma de delivery para React e Next.js, com mais performance e manutenção simples.',
      'Corrigi uma falha crítica em cupons e pagamentos que afetava os pedidos.'
    ],
    techs: ['React', 'Next.js', 'JavaScript', 'Express']
  }
];

export default experiences;
