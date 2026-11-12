'use client';

import { useEffect, useState } from 'react';
import { scrollToId } from '@/app/lib/scroll';
import { useDict } from '@/app/lib/locale';
import { HERO_READY_MS } from '../Hero/BottomSection';
import { Button } from './styles';

// Ordem das seções na página.
const SECTIONS = [
  'inicio',
  'sobre',
  'projetos',
  'experiencias',
  'servicos',
  'habilidades',
  'contato'
];

// Margem para não contar como "próxima" a seção em que já se está.
const TOLERANCE = 40;

function findNext(): string | undefined {
  // No fim da página o scroll não deixa o topo de Contato chegar à tela: já é a última seção.
  const atBottom =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 4;
  if (atBottom) return undefined;

  return SECTIONS.find(id => {
    const el = document.getElementById(id);
    if (!el) return false;
    const { top } = el.getBoundingClientRect();
    // Contato já ocupando metade da tela conta como chegada.
    return id === 'contato' ? top > window.innerHeight / 2 : top > TOLERANCE;
  });
}

/** Botão fixo, no centro e perto do fim da tela, que chama para descer à próxima seção. */
export default function NextSection() {
  const { ui } = useDict();
  const [next, setNext] = useState<string | undefined>('sobre');
  const [heroReady, setHeroReady] = useState(false);

  // Só aparece depois que o Hero terminou de se formar.
  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), HERO_READY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setNext(findNext()));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const visible = heroReady && !!next;

  return (
    <Button
      type="button"
      $visible={visible}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label={ui.nextSection}
      onClick={() => next && scrollToId(next)}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  );
}
