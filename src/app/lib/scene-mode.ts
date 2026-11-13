'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { mixScenes, type SceneMode, type SceneParams } from './scene';
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

export const CROSSFADE_SECONDS = 0.6;

/**
 * A Cena que está na tela: quando o alvo muda, passa até ele em cerca de 600 ms.
 * Antes de o cliente assumir e com movimento reduzido, a troca é imediata.
 */
export function useSceneCrossfade(target: SceneParams, ready: boolean): SceneParams {
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);
  // A troca que a hidratação faz (de `dia` para o modo salvo) não anima: o CSS prévio já pintou o alvo.
  const wasReady = useRef(false);
  const fades = wasReady.current && !reducedMotion;

  useEffect(() => {
    wasReady.current = ready;
  }, [ready]);

  useEffect(() => {
    const show = (scene: SceneParams) => {
      shownRef.current = scene;
      setShown(scene);
    };
    if (!fades) {
      show(target);
      return;
    }
    const from = shownRef.current;
    if (from === target) return;
    const controls = animate(0, 1, {
      duration: CROSSFADE_SECONDS,
      ease: 'easeInOut',
      onUpdate: t => show(mixScenes(from, target, t))
    });
    return () => controls.stop();
  }, [target, fades]);

  return fades ? shown : target;
}
