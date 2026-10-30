'use client';

import { useEffect, useState } from 'react';
import { Content } from '../ui/default';
import { Text } from '../ui/typography';
import NavLink from './NavLink';
import {
  Brand,
  Container,
  DesktopNav,
  HeaderCta,
  MobileMenu,
  MobileMenuButton
} from './styles';
import { scrollToId } from '@/app/lib/scroll';
import content from '@/meta/content';
import navLinks from '@/meta/navigation';
import profile from '@/meta/profile';
import {
  FaBars,
} from 'react-icons/fa6';

const [firstName, ...lastNameParts] = profile.name.split(' ');
const lastName = lastNameParts.join(' ');

const sectionIds = navLinks.map(({ path }) => path.slice(1));

// A seção ativa é a última cujo topo já passou de um terço da tela.
function findActiveSection() {
  const line = window.innerHeight * 0.35;
  let active: string | null = null;
  for (const id of sectionIds) {
    const rect = document.getElementById(id)?.getBoundingClientRect();
    if (rect && rect.top <= line && rect.bottom > line) active = id;
  }
  return active;
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setActiveId(findActiveSection());
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1025px)');

    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleBreakpointChange);

    return () => {
      mediaQuery.removeEventListener('change', handleBreakpointChange);
    };
  }, []);

  const closeMobileMenu = () => setIsMenuOpen(false);

  return (
    <Container $scrolled={scrolled}>
      <Content>
        <Brand>
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('inicio');
            }}
          >
            <Text as="span" $size="xxsmall" $fontWeight={600}>
              {firstName}{' '}
              <Text
                as="span"
                $size="xxsmall"
                $color="tertiary"
                $fontWeight={700}
              >
                {lastName}
              </Text>
            </Text>
          </a>
        </Brand>

        <DesktopNav>
          <ul>
            {navLinks.map(({ text, path }) => (
              <NavLink
                key={path}
                text={text}
                path={path}
                active={activeId === path.slice(1)}
              />
            ))}
          </ul>
          <HeaderCta href={profile.resumePath} download>
            {content.header.cta}
          </HeaderCta>
        </DesktopNav>

        <MobileMenuButton
          type="button"
          aria-label={isMenuOpen ? 'Fechar menu de navegacao' : 'Abrir menu de navegacao'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          $isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen((prevState) => !prevState)}
        >
          <FaBars size={20} color="#398CBF" />
        </MobileMenuButton>
      </Content>

      <MobileMenu id="mobile-navigation" $isOpen={isMenuOpen}>
        <ul>
          {navLinks.map(({ text, path }) => (
            <NavLink
              key={`mobile-${path}`}
              text={text}
              path={path}
              active={activeId === path.slice(1)}
              onNavigate={closeMobileMenu}
            />
          ))}
          <li>
            <HeaderCta href={profile.resumePath} download>
              {content.header.cta}
            </HeaderCta>
          </li>
        </ul>
      </MobileMenu>
    </Container>
  );
}

export default Header;
