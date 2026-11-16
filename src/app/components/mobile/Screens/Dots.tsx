'use client';

import { useEffect, useRef, useState } from 'react';
import { useDict } from '@/app/lib/locale';
import { scrollToId } from '@/app/lib/scroll';
import { SCREENS, type ScreenId } from './screens';
import { Dot, Name, Nav } from './styles';

// Quanto tempo o nome da Tela fica à mostra ao chegar nela.
const NAME_MS = 1500;

/** Pontos fixos na lateral: um por Tela, marcam onde se está e levam a qualquer uma. */
export default function Dots() {
  const { ui, navLinks } = useDict();
  const labels: Record<string, string> = Object.fromEntries([
    ['inicio', ui.home],
    ...navLinks.map(({ text, path }) => [path.slice(1), text])
  ]);
  const [active, setActive] = useState<ScreenId>(SCREENS[0]);
  const [named, setNamed] = useState(false);
  const opened = useRef(false);

  // A Tela atual é a que cruza o meio da tela.
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive((entry.target as HTMLElement).dataset.tela as ScreenId);
        }
      },
      { rootMargin: '-49% 0px -50% 0px' }
    );
    document.querySelectorAll('[data-tela]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Ao chegar numa Tela (não ao abrir a página no Hero), o nome dela aparece por um instante.
  useEffect(() => {
    if (!opened.current) {
      opened.current = true;
      return;
    }
    setNamed(true);
    const timer = setTimeout(() => setNamed(false), NAME_MS);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <Nav aria-label={ui.screens}>
      <ul>
        {SCREENS.map(id => (
          <li key={id}>
            <Dot
              href={`#${id}`}
              aria-label={labels[id]}
              aria-current={id === active ? 'true' : undefined}
              $active={id === active}
              onClick={event => {
                event.preventDefault();
                scrollToId(id);
              }}
            >
              <Name aria-hidden $visible={named && id === active}>
                {labels[id]}
              </Name>
            </Dot>
          </li>
        ))}
      </ul>
    </Nav>
  );
}
