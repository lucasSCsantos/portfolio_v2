export type ProjectType = 'desktop' | 'phone';

export interface Project {
  title: string;
  year: string;
  color: string;
  gradient?: string;
  src: string | string[];
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
      'Portal para a torcida organizada Torcida Imperial, com informações sobre eventos, notícias e comunicados aos torcedores. Além de um sistema de recompensas, pontos e rankings, aumentando engajamento e participação dos membros da torcida. Projeto idealizado e desenvolvido do zero, chegando a alcançar um pico de 30.000 usuários únicos, com uma comunidade ativa e engajada.'
  },
  {
    title: 'Calculadora Agricompany',
    year: '2024',
    color: '#01579B',
    src: 'agricompany.png',
    href: 'https://agricompany-landing-page.vercel.app/',
    description:
      'Landing page com calculadora interativa para a Agricompany, permitindo diagnóstico da sua fazenda/empresa. A calculadora oferece insights personalizados para otimizar operações agrícolas, melhorar a produtividade e reduzir custos, ajudando os clientes a tomarem decisões informadas sobre suas atividades agrícolas.'
  },
  {
    title: 'Iasos',
    year: '2023',
    color: '#F14444',
    src: 'iasos.png',
    href: 'https://iasos.com.br',
    description:
      'Plataforma digital para a Iasos, com foco em experiência do usuário e performance, entregando conteúdo de forma clara e acessível. A Iasos é uma empresa inovadora na área de saúde, oferecendo um qrcode para rápido acesso emergencial a informações médicas, histórico de saúde e contatos de emergência, garantindo que os usuários tenham acesso rápido e fácil a informações vitais em situações críticas.'
  },
  {
    title: 'Biblio',
    year: '2024',
    color: '#5C3817',
    type: 'phone',
    src: ['biblio-mobile.png', 'biblio-mobile.png'],
    href: 'https://biblioteste.netlify.app/',
    description:
      'Jogo diário de adivinhação de livros da Bíblia. O jogador tem 6 tentativas para adivinhar o livro do dia, recebendo feedback sobre quais letras estão corretas e em suas posições corretas, quais estão presentes mas em posições incorretas, e quais não estão presentes no título. O jogo é projetado para ser divertido e educativo, incentivando os jogadores a aprenderem mais sobre os livros da Bíblia enquanto se divertem.'
  },
  {
    title: 'Jogo Passa',
    year: '2026',
    color: '#000612',
    gradient: 'linear-gradient(135deg, #facc15 0%, #a855f7 50%, #3b82f6 100%)',
    type: 'phone',
    src: ['jogopassa.png', 'jogopassa-sala2.png'],
    href: 'https://www.jogopassa.com.br',
    description:
      'Jogo temporizador online para jogos de festa, onde cada jogador tem um tempo limitado para realizar uma ação ou responder a uma pergunta. O jogo funciona online permitindo que os jogadores conectem seus dispositivos e participem de forma interativa, tornando-o ideal para eventos sociais, festas e encontros, promovendo diversão e engajamento entre os participantes.'
  }
];

export default projects;
