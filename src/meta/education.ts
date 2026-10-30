export interface Education {
  title: string;
  institution: string;
  period: string;
}

const education: Education[] = [
  {
    title: 'Engenharia de Computação',
    institution: 'Centro Universitário SENAI CIMATEC',
    period: 'Em andamento'
  },
  {
    title: 'Desenvolvimento Web Full-Stack',
    institution: 'Trybe',
    period: '2021 – 2022'
  }
];

export const languages = [{ name: 'Inglês', level: 'Avançado' }];

export default education;

export const educationLabels = {
  title: 'Formação',
  languages: 'Idiomas'
};
