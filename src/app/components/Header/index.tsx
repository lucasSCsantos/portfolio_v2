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
  HeaderActions,
  DesktopOnly,
  MobileSceneItem,
  MobileMenu,
  MobileMenuButton
} from './styles';
import { scrollToId } from '@/app/lib/scroll';
import navLinks from '@/meta/navigation';
import profile from '@/meta/profile';
import { useDict } from '@/app/lib/locale';
import LanguageSwitch from './LanguageSwitch';
import SceneSwitch from './SceneSwitch';
import { useScene, useSceneReady } from '@/app/lib/scene-mode';
import {
  FaBars,
} from 'react-icons/fa6';

const [firstName, ...lastNameParts] = profile.name.split(' ');
const lastName = lastNameParts.join(' ');

const HEADER_HEIGHT = 72;

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
  const dict = useDict();
  const { content, ui } = dict;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [onSea, setOnSea] = useState(false);
  const { scene } = useScene();
  const ready = useSceneReady();
  // Claro sobre escuro: sobre o Mar ou sobre a Cena escura.
  const light = onSea || scene.tone === 'dark';

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setActiveId(findActiveSection());
      // Depois do Hero o Header passa a combinar com o mar.
      const hero = document.getElementById('inicio');
      setOnSea(hero ? hero.getBoundingClientRect().bottom < HEADER_HEIGHT : false);
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
    <Container
      $onSea={onSea}
      $light={light}
      data-cena-pronta={ready ? '' : undefined}
    >
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

        <HeaderActions>
          <DesktopNav>
            <ul>
              {dict.navLinks.map(({ text, path }) => (
                <NavLink
                  key={path}
                  text={text}
                  path={path}
                  active={activeId === path.slice(1)}
                />
              ))}
            </ul>
            <HeaderCta $light={light} href={dict.profile.resumePath} download>
              {content.header.cta}
            </HeaderCta>
          </DesktopNav>

          <DesktopOnly>
            <SceneSwitch light={light} />
          </DesktopOnly>
          <LanguageSwitch light={light} activeId={activeId} />

          <MobileMenuButton
            type="button"
            aria-label={isMenuOpen ? ui.closeMenu : ui.openMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            $isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen((prevState) => !prevState)}
          >
            <FaBars size={20} color="#398CBF" />
          </MobileMenuButton>
        </HeaderActions>
      </Content>

      <MobileMenu id="mobile-navigation" $isOpen={isMenuOpen}>
        <ul>
          {dict.navLinks.map(({ text, path }) => (
            <NavLink
              key={`mobile-${path}`}
              text={text}
              path={path}
              active={activeId === path.slice(1)}
              onNavigate={closeMobileMenu}
            />
          ))}
          {/* O menu móvel tem fundo claro próprio: não acompanha o tom da Cena. */}
          <MobileSceneItem>
            <SceneSwitch light={onSea} />
          </MobileSceneItem>
          <li>
            <HeaderCta $light={onSea} href={dict.profile.resumePath} download>
              {content.header.cta}
            </HeaderCta>
          </li>
        </ul>
      </MobileMenu>
    </Container>
  );
}

export default Header;
