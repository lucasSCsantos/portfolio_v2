export interface Experience {
  iconSrc: string;
  backgroundSrc: string;
  color: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

const experiences: Experience[] = [
  {
    iconSrc: 'eattasty.png',
    backgroundSrc: 'eattasty-bg.png',
    color: '#FFBD1B',
    company: 'Eattasty',
    role: 'Desenvolvedor Front-end',
    period: '2022 – 2023',
    description:
      'Desenvolvimento de interfaces web para o app de delivery Eattasty, focando em performance, responsividade e experiência do usuário com React e TypeScript.'
  },
  {
    iconSrc: 'agricompany-logo.png',
    backgroundSrc: 'agricompany-bg2.png',
    color: '#0B1E60',
    company: 'Agricompany',
    role: 'Desenvolvedor Full Stack',
    period: '2023 – Presente',
    description:
      'Criação e manutenção de sistemas web para o agronegócio, integrando APIs, otimizando fluxos de dados e construindo dashboards analíticos com Next.js e Node.js.'
  }
];

export default experiences;
