export interface ServiceProof {
  kind: 'projeto' | 'experiência';
  // Título do Projeto ou empresa da Experiência que comprova o serviço.
  name: string;
  href: '#projetos' | '#experiencias';
}

export interface Service {
  title: string;
  text: string;
  proof: ServiceProof;
  buttonLabel: string;
  message: string;
}

const services: Service[] = [
  {
    title: 'Desenvolvimento web e sistemas sob medida',
    text: 'Sites e sistemas feitos do zero para o seu negócio, do levantamento da necessidade ao uso real.',
    proof: { kind: 'projeto', name: 'Torcida Imperial', href: '#projetos' },
    buttonLabel: 'Pedir orçamento de site',
    message:
      'Ol%C3%A1%2C%20gostaria%20de%20pedir%20um%20or%C3%A7amento%20de%20site%20ou%20sistema%20sob%20medida%21'
  },
  {
    title: 'Planejamento e gestão de projetos de software',
    text: 'Organizo escopo, prioridades e entregas com Scrum e Kanban para o projeto sair do papel no prazo.',
    proof: { kind: 'projeto', name: 'Sistema de Gestão de Voluntários', href: '#projetos' },
    buttonLabel: 'Planejar meu projeto',
    message:
      'Ol%C3%A1%2C%20gostaria%20de%20planejar%20um%20projeto%20de%20software%20com%20voc%C3%AA%21'
  },
  {
    title: 'Liderança técnica e consultoria',
    text: 'Defino arquitetura e prioridades e conduzo a equipe técnica, ou oriento a sua, ao longo do projeto.',
    proof: { kind: 'experiência', name: 'IASOS', href: '#experiencias' },
    buttonLabel: 'Conversar sobre liderança técnica',
    message:
      'Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20lideran%C3%A7a%20t%C3%A9cnica%20ou%20consultoria%21'
  },
  {
    title: 'Manutenção e suporte',
    text: 'Acompanho seu sistema depois do lançamento: correções, melhorias e evolução contínua.',
    proof: { kind: 'experiência', name: 'Eattasty', href: '#experiencias' },
    buttonLabel: 'Contratar suporte para meu sistema',
    message:
      'Ol%C3%A1%2C%20gostaria%20de%20contratar%20manuten%C3%A7%C3%A3o%20e%20suporte%20para%20o%20meu%20sistema%21'
  }
];

export default services;
