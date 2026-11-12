import profile, { experienceYears } from './profile';
import projects from './projects';

const content = {
  hero: {
    greeting: 'Oi, eu sou Lucas!',
    // O cargo vem da identidade; a quebra de linha é só do layout do Hero.
    title: profile.role.replace(' ', '\n'),
    valueProp:
      'Conduzo projetos do início ao fim: da ideia à solução funcionando.',
    cta: 'Entrar em contato',
    secondaryCta: 'Ver projetos',
    resumeCta: 'Baixar currículo',
    sleepNotice: 'provavelmente dormindo... 😴',
    // Números genéricos, cada um com uma fonte única: o ano de início da
    // carreira, a lista de Projetos e os resultados dos currículos.
    highlights: [
      { value: `Desde ${profile.careerStartYear}`, label: 'desenvolvendo software' },
      { value: `${projects.length}`, label: 'projetos lançados' },
      { value: '+30 mil', label: 'usuários em um único sistema' },
      { value: '+530', label: 'voluntários organizados' }
    ]
  },
  header: {
    cta: 'Currículo'
  },
  about: {
    label: 'Sobre mim',
    bio: `Desde ${profile.careerStartYear} planejo, lidero e entrego projetos completos, do zero até o uso real: são +${experienceYears()} anos criando sites e sistemas web, da ideia ao acompanhamento dos resultados. Fora do trabalho técnico, também lidero o Ministério de Adolescentes da minha igreja.`,
    method: [
      'Levantar a necessidade',
      'Planejar',
      'Construir',
      'Entregar',
      'Acompanhar os resultados'
    ],
    methodLabel: 'Como conduzo um projeto'
  },
  projects: {
    label: 'Projetos',
    title: 'O que criei e entreguei'
  },
  jobs: {
    label: 'Experiências',
    title: 'Onde já trabalhei'
  },
  services: {
    label: 'Serviços',
    title: 'Como posso ajudar',
    proofLabel: 'Prova'
  },
  work: {
    label: 'Habilidades',
    title: 'O que uso para entregar',
    description:
      'Tecnologias que uso no dia a dia, de JavaScript e TypeScript a React, Next.js e bancos de dados, e o que me permite conduzir um projeto inteiro.',
    competenciesLabel: 'Competências',
    competencies: [
      {
        title: 'Gestão de projetos',
        text: 'Do levantamento à entrega, com Scrum e Kanban.'
      },
      {
        title: 'Liderança',
        text: 'Da equipe técnica e do Ministério de Adolescentes, definindo prioridades.'
      },
      {
        title: 'Organização e processos',
        text: 'Transformo rotinas manuais em processos simples.'
      },
      {
        title: 'Soluções digitais completas',
        text: 'Sistemas completos, da ideia ao uso real.'
      }
    ]
  },
  contact: {
    label: 'Contato',
    heading: 'Tem uma ideia? Vamos tirar do papel.',
    description:
      'Sou desenvolvedor full stack e crio sites, sistemas e jogos do zero. Me conte o que você precisa e eu te ajudo a transformar isso em produto.',
    topics: ['Freelance', 'Vaga ou parceria', 'Tirar uma dúvida'],
    cardHeading: 'Me manda uma mensagem',
    cardSubtext:
      'Em uma ou duas frases, me diga o que você tem em mente. Eu respondo em até 24h.',
    buttonText: 'Chamar no WhatsApp',
    emailButtonText: 'Enviar e-mail',
    copyEmailText: 'Copiar endereço de e-mail',
    copiedEmailText: 'E-mail copiado!',
    linkedinButtonText: 'LinkedIn',
    resumeButtonText: 'Baixar currículo'
  },
  footer: {
    copyrightName: profile.name
  }
};

export default content;
