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
    // Números genéricos, cada um com uma fonte única: o ano de início da
    // carreira, a lista de Projetos e os resultados dos currículos.
    highlights: [
      { value: `+${experienceYears()} anos`, label: 'construindo software' },
      { value: `${projects.length}`, label: 'projetos lançados' },
      { value: '+30 mil', label: 'usuários em sistemas que criei' },
      { value: '+530', label: 'voluntários organizados' }
    ]
  },
  header: {
    cta: 'Currículo'
  },
  about: {
    label: 'Sobre mim',
    bio: `${profile.role} com +${experienceYears()} anos de experiência no desenvolvimento de aplicações web e APIs, atuando em empresas de diversos setores. Experiência sólida em desenvolvimento de projetos, desde o planejamento, até a implementação, testes e manutenção, utilizando as tecnologias mais modernas do mercado.`
  },
  projects: {
    label: 'Projetos',
    title: 'Meus projetos individuais'
  },
  jobs: {
    label: 'Experiências',
    title: 'Experiências profissionais'
  },
  services: {
    label: 'Serviços',
    title: 'Meus serviços',
    buttonText: 'Enviar Mensagem'
  },
  work: {
    label: 'Habilidades',
    title: 'Habilidades Técnicas',
    description:
      'Com experiência prática em uma variedade de tecnologias, desde linguagens de programação como JavaScript e TypeScript, até frameworks como React e Next.js, além de bancos de dados relacionais e NoSQL. Estou sempre buscando aprender novas ferramentas e aprimorar minhas habilidades para entregar soluções eficientes e inovadoras.'
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
    linkedinButtonText: 'LinkedIn'
  },
  footer: {
    copyrightName: profile.name
  }
};

export default content;
