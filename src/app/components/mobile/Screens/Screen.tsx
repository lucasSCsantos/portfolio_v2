'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useScene } from '@/app/lib/scene-mode';
import { seaSpan } from '@/app/lib/sea';
import { SCREENS, type ScreenId } from './screens';
import { Container, Content } from './styles';

// A profundidade do Mar no pé de cada Tela: o Hero fica na superfície e o Contato, no fundo.
const depthOf = (index: number) => index / (SCREENS.length - 1);

/** O Mar atrás de uma Tela: as cores e o tom do texto sobre ele. O Hero pinta o próprio céu. */
export function useScreenSea(id: ScreenId) {
  const { scene } = useScene();
  const index = SCREENS.indexOf(id);
  return index > 0 ? seaSpan(depthOf(index - 1), depthOf(index), scene) : undefined;
}

/**
 * Uma Tela do mergulho: ao menos uma tela de altura, com o fundo em degradê do Mar da profundidade
 * da Tela anterior até a sua. O id fica na seção dentro dela, como no desktop.
 */
export default function Screen({ id, children }: { id: ScreenId; children: ReactNode }) {
  const { scene } = useScene();
  const sea = useScreenSea(id);

  return (
    <Container
      data-tela={id}
      style={
        sea &&
        ({
          backgroundImage: `linear-gradient(180deg, ${sea.top} 0%, ${sea.bottom} 100%)`,
          '--sea-top': scene.waves[2],
          '--sea-ink': sea.ink,
          '--sea-accent': sea.accent,
          '--sea-glass': sea.glass,
          '--sea-color': sea.bottom
        } as CSSProperties)
      }
    >
      <Content>{children}</Content>
    </Container>
  );
}
