import profile, { experienceYears } from '../profile';
import ptContent from '../content';
import navLinks from '../navigation';
import experiences from '../experiences';
import projects from '../projects';
import services from '../services';
import education from '../education';
import links from '../links';
import type { Dictionary } from './types';

const role = 'Software Developer';
const stackRole = 'Full Stack Developer';
const whatsappMessage = encodeURIComponent(
  'Hi, I found you through your portfolio and would like to talk!'
);
const emailSubject = 'Contact via portfolio';

const navText: Record<string, string> = {
  '#sobre': 'About me',
  '#projetos': 'Projects',
  '#experiencias': 'Experience',
  '#servicos': 'Services',
  '#habilidades': 'Skills',
  '#contato': 'Contact'
};

const experienceCopy: Record<
  string,
  {
    role: string;
    period: string;
    kind?: string;
    note?: string;
    highlight?: string;
    achievements: string[];
  }
> = {
  Kempetro: {
    role: `${stackRole} (internship)`,
    period: 'Jul 2026 – present',
    achievements: [
      'I build end-to-end features, from the interface to the API, in the company’s internal systems.',
      'I work in a team with agile methods and follow deliveries in management tools.'
    ]
  },
  Agricompany: {
    role: stackRole,
    period: 'Jan 2024 – Dec 2025',
    achievements: [
      'Built analytics dashboards that turned field data into decisions for agribusiness.',
      'Integrated APIs and optimized the data flows of the company’s web systems.',
      'Created the farm diagnostic calculator, a gateway for new customers.'
    ]
  },
  IASOS: {
    role: stackRole,
    period: 'Jun 2022 – Jul 2023',
    kind: 'Freelance',
    note: 'alongside Eattasty',
    highlight:
      'Technical leadership of the company’s whole digital ecosystem, from planning to delivery.',
    achievements: [
      'Led the platform and its supporting systems, setting priorities and architecture.',
      'Migrated over 500 users to the new platform with no data loss.'
    ]
  },
  Eattasty: {
    role: stackRole,
    period: 'Mar 2022 – Jan 2024',
    kind: 'Portugal',
    achievements: [
      'Migrated the delivery platform to React and Next.js, with better performance and simpler maintenance.',
      'Fixed a critical coupon and payment bug that was affecting orders.'
    ]
  }
};

const projectCopy: Record<
  string,
  { role: string; result?: string; description: string }
> = {
  'Torcida Imperial': {
    role: 'Conceived, built from scratch and launched',
    result: '+30k users',
    description:
      'Portal for a fan club, with events, news and announcements. It has gamification (badges, levels and skins) and automated campaigns. It started as my own initiative, while I worked at Eattasty.'
  },
  'Sistema de Gestão de Voluntários': {
    role: 'Conceived and built',
    result: '+530 volunteers across 15 areas',
    description:
      'System for the Children’s Ministry to organize its volunteers. It cross-references form answers with the coordinators’ lists and delivers lists by area, charts and a metrics dashboard for the leadership.'
  },
  'Calculadora Agricompany': {
    role: stackRole,
    description:
      'Landing page with an interactive calculator that diagnoses a farm or company and shows where to optimize operations, gain productivity and cut costs.'
  },
  Iasos: {
    role: 'Technical lead of the digital ecosystem (freelance)',
    result: '+500 users migrated with no loss',
    description:
      'Platform of Iasos, a health company whose QR code gives quick access to medical information and emergency contacts. I handled the website, performance and the user migration.'
  },
  Biblio: {
    role: 'Created and developed',
    description:
      'Daily game of guessing books of the Bible. There are 6 attempts, with hints about letters that are right, in the right place, or absent.'
  },
  'Jogo Passa': {
    role: 'Created and developed',
    description:
      'Online timer for party games: each player has limited time to act or answer, and everyone connects their own phone to the same room.'
  },
  'Mural ONDA': {
    role: 'Conceived and developed',
    description:
      'Event calendar for the leadership of ONDA, a teen ministry. Recurring events generate their own occurrences and the Google Drive folders are created automatically.'
  }
};

const educationCopy: Record<string, { title: string; period: string }> = {
  'Engenharia de Computação': {
    title: 'Computer Engineering',
    period: 'In progress'
  },
  'Desenvolvimento Web Full-Stack': {
    title: 'Full-Stack Web Development',
    period: '2021 – 2022'
  }
};

const serviceCopy = [
  {
    title: 'Web development and custom systems',
    text: 'Websites and systems built from scratch for your business, from understanding the need to real use.',
    buttonLabel: 'Request a website quote',
    message: 'Hi, I would like to request a quote for a custom website or system!'
  },
  {
    title: 'Software project planning and management',
    text: 'I organize scope, priorities and deliveries with Scrum and Kanban so your project leaves the drawing board on time.',
    buttonLabel: 'Plan my project',
    message: 'Hi, I would like to plan a software project with you!'
  },
  {
    title: 'Technical leadership and consulting',
    text: 'I define architecture and priorities and lead the technical team, or guide yours, throughout the project.',
    buttonLabel: 'Talk about technical leadership',
    message: 'Hi, I would like to talk about technical leadership or consulting!'
  },
  {
    title: 'Maintenance and support',
    text: 'I look after your system after launch: fixes, improvements and continuous evolution.',
    buttonLabel: 'Hire support for my system',
    message: 'Hi, I would like to hire maintenance and support for my system!'
  }
];

const linkLabels: Record<string, string> = { 'Meu portfólio': 'My portfolio' };

const en: Dictionary = {
  locale: 'en',
  profile: {
    role,
    availability: 'Available for new projects',
    location: 'Salvador, BA, Brazil',
    resumePath: '/resume-lucas-cristovam.pdf',
    whatsappMessage,
    emailSubject
  },
  seo: {
    title: `${profile.name} - ${role}`,
    description: `Portfolio of ${profile.name}, a ${role.toLowerCase()} specialized in React, Node.js and TypeScript.`,
    keywords: [
      profile.name,
      role.toLowerCase(),
      'React',
      'Node.js',
      'TypeScript',
      'portfolio',
      'freelancer',
      'projects',
      'technologies',
      'contact'
    ],
    siteName: `${profile.name} - Portfolio`
  },
  backgroundWords: {
    about: '/about-bg-text-en.png',
    projects: '/projects-bg-text-en.png',
    services: '/services-bg-text-en.png',
    skills: '/habilidades-en.png'
  },
  ui: {
    skipLink: 'Skip to content',
    nextSection: 'Scroll to the next section',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    stats: 'Numbers',
    achievements: 'Achievements',
    technologies: 'Technologies',
    relation: 'Relationship',
    role: 'Role',
    viewDemo: 'View demo',
    viewDemoLabel: 'View demo of the {title} project',
    viewSite: 'View site →',
    viewSiteLabel: 'View site of the {title} project',
    offline: 'Site offline',
    videoLabel: 'Video of the {title} project',
    closeVideo: 'Close video',
    seeProject: 'See the project',
    level: '{level} level',
    rights: 'All rights reserved.',
    photoAlt: 'Photo of {name}',
    tagFullStack: '👉 Full stack developer',
    tagFrontEnd: '👉 Front-end developer',
    languageSwitch: 'Language'
  },
  content: {
    hero: {
      greeting: 'Hi, I’m Lucas!',
      title: role.replace(' ', '\n'),
      valueProp:
        'I run projects from start to finish: from the idea to a working solution.',
      cta: 'Get in touch',
      secondaryCta: 'See projects',
      resumeCta: 'Download resume',
      highlights: [
        {
          value: `Since ${profile.careerStartYear}`,
          label: 'building software'
        },
        { value: `${projects.length}`, label: 'projects launched' },
        { value: '+30k', label: 'users on systems I built' },
        { value: '+530', label: 'volunteers organized' }
      ]
    },
    header: { cta: 'Resume' },
    about: {
      label: 'About me',
      bio: `Since ${profile.careerStartYear} I have planned, led and delivered complete projects, from scratch to real use: that is +${experienceYears()} years building websites and web systems, from the idea to tracking the results. Outside technical work, I also lead my church’s Teen Ministry.`,
      method: [
        'Understand the need',
        'Plan',
        'Build',
        'Deliver',
        'Track the results'
      ],
      methodLabel: 'How I run a project'
    },
    projects: { label: 'Projects', title: 'What I built and delivered' },
    jobs: { label: 'Experience', title: 'Where I have worked' },
    services: { label: 'Services', title: 'How I can help', proofLabel: 'Proof' },
    work: {
      label: 'Skills',
      title: 'What I use to deliver',
      description:
        'Technologies I use every day, from JavaScript and TypeScript to React, Next.js and databases, and what lets me run a whole project.',
      competenciesLabel: 'Competencies',
      competencies: [
        {
          title: 'Project management',
          text: 'From requirements to delivery, with Scrum and Kanban.'
        },
        {
          title: 'Leadership',
          text: 'Of the technical team and the Teen Ministry, setting priorities.'
        },
        {
          title: 'Organization and processes',
          text: 'I turn manual routines into simple processes.'
        },
        {
          title: 'Complete digital solutions',
          text: 'Complete systems, from the idea to real use.'
        }
      ]
    },
    contact: {
      label: 'Contact',
      heading: 'Got an idea? Let’s make it happen.',
      description:
        'I’m a full stack developer and I build websites, systems and games from scratch. Tell me what you need and I’ll help you turn it into a product.',
      topics: ['Freelance', 'Job or partnership', 'Ask a question'],
      cardHeading: 'Send me a message',
      cardSubtext:
        'In a sentence or two, tell me what you have in mind. I reply within 24h.',
      buttonText: 'Message me on WhatsApp',
      emailButtonText: 'Send email',
      copyEmailText: 'Copy email address',
      copiedEmailText: 'Email copied!',
      linkedinButtonText: 'LinkedIn',
      resumeButtonText: 'Download resume'
    },
    footer: ptContent.footer
  },
  navLinks: navLinks.map(({ path }) => ({ text: navText[path], path })),
  experiences: experiences.map(exp => ({
    ...exp,
    ...experienceCopy[exp.company]
  })),
  projects: projects.map(project => ({
    ...project,
    ...projectCopy[project.title]
  })),
  relationLabels: {
    cliente: 'For a client',
    empregador: 'For an employer',
    'iniciativa própria': 'Own initiative',
    voluntário: 'Volunteer'
  },
  services: services.map((service, index) => ({
    ...service,
    title: serviceCopy[index].title,
    text: serviceCopy[index].text,
    buttonLabel: serviceCopy[index].buttonLabel,
    message: encodeURIComponent(serviceCopy[index].message)
  })),
  education: education.map(item => ({
    ...item,
    ...educationCopy[item.title]
  })),
  languages: [{ name: 'English', level: 'Advanced' }],
  educationLabels: { title: 'Education', languages: 'Languages' },
  skillKinds: {
    Linguagem: 'Language',
    Framework: 'Framework',
    ORM: 'ORM',
    'Banco de dados': 'Database',
    'Infra e DevOps': 'Infra and DevOps',
    Testes: 'Testing',
    Gestão: 'Management'
  },
  links: links.map(link => {
    if (link.icon === 'whatsapp') {
      return { ...link, href: `${profile.social.whatsapp}?text=${whatsappMessage}` };
    }
    if (link.icon === 'email') {
      return {
        ...link,
        href: `mailto:${profile.email}?subject=${encodeURIComponent(emailSubject)}`
      };
    }
    if (link.icon === 'portfolio') return { ...link, href: '/en' };
    return link;
  }).map(link => ({ ...link, label: linkLabels[link.label] ?? link.label }))
};

export default en;
