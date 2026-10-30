// Fonte única da identidade pública. Tudo que fala "quem é Lucas" (Header,
// Hero, Sobre, Rodapé, metadados, Página de Links) lê daqui.
const careerStartYear = 2022;

const whatsappNumber = '5571981849630';

const profile = {
  name: 'Lucas Cristovam',
  // Só para dados estruturados (nome alternativo).
  fullName: 'Lucas Santana Cristovam dos Santos',
  role: 'Desenvolvedor de Software',
  careerStartYear,
  location: 'Salvador, BA',
  availability: 'Disponível para novos projetos',
  siteUrl: 'https://lucascristovam.vercel.app',
  resumePath: '/curriculo-lucas-cristovam.pdf',
  photos: {
    // Imagens provisórias: trocar é só substituir os arquivos.
    avatar: '/photos/avatar.jpeg',
    about: '/photos/about.jpeg'
  },
  whatsappNumber,
  whatsappMessage:
    'Ol%C3%A1%2C%20vim%20pelo%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!',
  email: 'luc.cristovam10@gmail.com',
  emailSubject: 'Contato pelo portfólio',
  social: {
    github: 'https://github.com/lucasSCsantos',
    linkedin: 'https://linkedin.com/in/lucas-sc-santos',
    instagram: 'https://www.instagram.com/luc_santos/',
    whatsapp: `https://wa.me/${whatsappNumber}`
  },
  icons: {
    whatsapp: 'whatsapp-icon.png',
    linkedin: 'linkedin-icon.png',
    instagram: 'instagram-icon.png',
    github: 'github-icon.png'
  }
};

// Anos de carreira, sempre calculados a partir do ano de início.
export const experienceYears = () =>
  new Date().getFullYear() - profile.careerStartYear;

export default profile;
