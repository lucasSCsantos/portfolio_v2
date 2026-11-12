'use client';

import { useSyncExternalStore } from 'react';
import type { SceneMode } from './scene';
import { SCENE_MODE_KEY } from './scene-prepaint';

// A escolha só é gravada quando o visitante escolhe: sem escolha, nada no armazenamento e a Cena é `dia`.
const DEFAULT_MODE: SceneMode = 'dia';

let current: SceneMode | undefined;
const listeners = new Set<() => void>();

function stored(): SceneMode {
  try {
    return localStorage.getItem(SCENE_MODE_KEY) === 'noite' ? 'noite' : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

function emit() {
  listeners.forEach(listener => listener());
}

export function setSceneMode(mode: SceneMode) {
  current = mode;
  try {
    localStorage.setItem(SCENE_MODE_KEY, mode);
  } catch {}
  document.documentElement.dataset.cena = mode;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Outra aba mudou a escolha.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SCENE_MODE_KEY) return;
    current = stored();
    emit();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): SceneMode {
  current ??= stored();
  return current;
}

/** Modo da Cena escolhido; no HTML estático (e na hidratação) é sempre `dia`. */
export function useSceneMode(): SceneMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_MODE);
}

/** Falso no HTML estático e na hidratação, verdadeiro quando o cliente assumiu. */
export function useSceneReady(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
