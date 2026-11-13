'use client';

import { useRef, type KeyboardEvent } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import { useDict } from '@/app/lib/locale';
import type { SceneMode } from '@/app/lib/scene';
import { setSceneMode, useSceneMode } from '@/app/lib/scene-mode';
import { SwitchContainer, SwitchThumb } from './styles';

const MODES: { mode: SceneMode; Icon: IconType }[] = [
  { mode: 'dia', Icon: FaSun },
  { mode: 'noite', Icon: FaMoon }
];

/** Seletor do Modo da Cena: um grupo de opções que desliza como o de Idioma. */
export default function SceneSwitch({ light }: { light?: boolean }) {
  const { ui } = useDict();
  const selected = useSceneMode();
  const options = useRef<(HTMLButtonElement | null)[]>([]);

  const choose = (index: number) => {
    const next = (index + MODES.length) % MODES.length;
    setSceneMode(MODES[next].mode);
    options.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
      event.key
    ];
    if (!step) return;
    event.preventDefault();
    choose(index + step);
  };

  return (
    <SwitchContainer
      $light={light}
      $count={MODES.length}
      role="radiogroup"
      aria-label={ui.sceneSwitch}
    >
      <SwitchThumb
        aria-hidden
        $light={light}
        $count={MODES.length}
        $index={MODES.findIndex(({ mode }) => mode === selected)}
      />
      {MODES.map(({ mode, Icon }, index) => (
        <button
          key={mode}
          ref={element => {
            options.current[index] = element;
          }}
          type="button"
          role="radio"
          aria-checked={mode === selected}
          aria-label={ui.sceneModes[mode]}
          tabIndex={mode === selected ? 0 : -1}
          data-selected={mode === selected}
          onClick={() => setSceneMode(mode)}
          onKeyDown={event => handleKeyDown(event, index)}
        >
          <Icon aria-hidden size={14} />
        </button>
      ))}
    </SwitchContainer>
  );
}
