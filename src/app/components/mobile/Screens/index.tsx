'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import MainContainer from '../../main';
import SeaLife from '../../Sea/SeaLife';
import Bubbles from './Bubbles';
import Dots from './Dots';
import { SnapScroll } from './styles';

// Por quanto tempo a Tela de uma âncora fica presa enquanto as de cima terminam de carregar.
const SETTLE_MS = 4000;

/**
 * Quem chega por uma âncora (ou pelo seletor de Idioma) cai na Tela certa, mesmo que as Telas
 * de cima cresçam ao carregar. Para assim que a pessoa mexe na página.
 */
function useHoldAnchoredScreen(main: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target || !main.current) return;

    const observer = new ResizeObserver(() => target.scrollIntoView({ behavior: 'instant' }));
    observer.observe(main.current);
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    const stop = () => {
      observer.disconnect();
      clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, stop));
    };
    const timer = setTimeout(stop, SETTLE_MS);
    events.forEach(e => window.addEventListener(e, stop, { passive: true }));
    return stop;
  }, [main]);
}

/** A casca do mergulho: as Telas em sequência, as bolhas ao fundo e os pontos na lateral. */
export default function Dive({ children }: { children: ReactNode }) {
  const main = useRef<HTMLElement>(null);
  useHoldAnchoredScreen(main);

  // O Mar começa no pé do Hero: é a casca inteira menos a primeira Tela.
  const measureSea = () => {
    const hero = main.current?.querySelector<HTMLElement>('[data-tela]');
    if (!main.current || !hero) return;
    const { top, height } = main.current.getBoundingClientRect();
    return { top: top + hero.offsetHeight, height: height - hero.offsetHeight };
  };

  return (
    <MainContainer ref={main} id="conteudo" tabIndex={-1} data-versao="celular">
      <SnapScroll />
      <Bubbles />
      <SeaLife phone measure={measureSea} />
      {children}
      <Dots />
    </MainContainer>
  );
}
