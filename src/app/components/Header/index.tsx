'use client';

import { useEffect, useState } from 'react';
import { Content } from '../ui/default';
import { Text } from '../ui/typography';
import NavLink from './NavLink';
import { Brand, Container, DesktopNav, MobileMenu, MobileMenuButton } from './styles';
import navLinks from '@/meta/navigation';
import profile from '@/meta/profile';
import {
  FaBars,
} from 'react-icons/fa6';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <Container>
      <Content>
        <Brand>
          <ul>
            <Text $size="xxsmall">
              {profile.firstName}{' '}
              <Text
                as="span"
                $size="xxsmall"
                $color="secondary"
                $fontWeight={700}
              >
                {profile.lastName}
              </Text>
            </Text>
          </ul>
        </Brand>

        <DesktopNav>
          <ul>
            {navLinks.map(({ text, path }) => (
              <NavLink key={path} text={text} path={path} />
            ))}
          </ul>
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
              onNavigate={closeMobileMenu}
            />
          ))}
        </ul>
      </MobileMenu>
    </Container>
  );
}

export default Header;
