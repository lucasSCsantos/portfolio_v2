import {
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiPrisma,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiAmazonwebservices,
  SiDocker,
  SiPm2,
  SiJest,
  SiCypress,
  SiGit,
  SiGithub,
  SiGitlab,
  SiJira,
  SiLinear,
  SiAirtable
} from 'react-icons/si';
import { IconType } from 'react-icons';

export interface Skill {
  name: string;
  // Metodologias (Scrum, Kanban) não têm logotipo.
  icon?: IconType;
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

// Somente o que aparece nos currículos.
const skillGroups: SkillGroup[] = [
  {
    title: 'Linguagens',
    skills: [
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'HTML', icon: SiHtml5 },
      { name: 'CSS', icon: SiCss3 }
    ]
  },
  {
    title: 'Frameworks',
    skills: [
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express', icon: SiExpress },
      { name: 'NestJS', icon: SiNestjs }
    ]
  },
  { title: 'ORM', skills: [{ name: 'Prisma', icon: SiPrisma }] },
  {
    title: 'Bancos de dados',
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MySQL', icon: SiMysql },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'Redis', icon: SiRedis }
    ]
  },
  {
    title: 'Infra e DevOps',
    skills: [
      { name: 'AWS', icon: SiAmazonwebservices },
      { name: 'Docker', icon: SiDocker },
      { name: 'PM2', icon: SiPm2 }
    ]
  },
  {
    title: 'Testes',
    skills: [
      { name: 'Jest', icon: SiJest },
      { name: 'Cypress', icon: SiCypress }
    ]
  },
  {
    title: 'Gestão e metodologias',
    skills: [
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
      { name: 'GitLab', icon: SiGitlab },
      { name: 'Scrum' },
      { name: 'Kanban' },
      { name: 'Jira', icon: SiJira },
      { name: 'Linear', icon: SiLinear },
      { name: 'Airtable', icon: SiAirtable }
    ]
  }
];

export default skillGroups;
