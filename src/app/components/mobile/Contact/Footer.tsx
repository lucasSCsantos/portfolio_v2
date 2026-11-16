import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import profile from '@/meta/profile';
import { useDict } from '@/app/lib/locale';
import { Footer as Container, Social } from './styles';

/** O Rodapé, na areia do fundo do mar: copyright, links sociais e o crédito dos dados de clima. */
export default function Footer() {
  const { content, ui } = useDict();

  return (
    <Container>
      <Social>
        <a href={profile.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub aria-hidden size={22} />
        </a>
        <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin aria-hidden size={22} />
        </a>
      </Social>
      <p>
        © {new Date().getFullYear()} {content.footer.copyrightName}. {ui.rights}
      </p>
      <p>
        {content.footer.weatherCredit}{' '}
        <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">
          Open-Meteo
        </a>
      </p>
    </Container>
  );
}
