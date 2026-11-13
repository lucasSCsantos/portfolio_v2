'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import {
  mixScenes,
  salvadorMinutes,
  sceneFor,
  SCENE_MODES,
  type SceneMode,
  type SceneParams
} from './scene';
import { SCENE_MODE_KEY } from './scene-prepaint';
import { isSceneWeather, type SceneWeather } from './scene-weather';

// A escolha só é gravada quando o visitante escolhe: sem escolha, nada no armazenamento e a Cena é `dia`.
const DEFAULT_MODE = 'dia' satisfies SceneMode;

let current: SceneMode | undefined;
const listeners = new Set<() => void>();

function stored(): SceneMode {
  try {
    const saved = localStorage.getItem(SCENE_MODE_KEY);
    return SCENE_MODES.find(mode => mode === saved) ?? DEFAULT_MODE;
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

// O relógio de Salvador: um só para a página, que avança na virada de cada minuto
// e para com a aba oculta (ao voltar, recalcula na hora).
let minutes: number | undefined;
let tick: ReturnType<typeof setTimeout> | undefined;
const clockListeners = new Set<() => void>();

function readClock() {
  minutes = salvadorMinutes(new Date());
  clockListeners.forEach(listener => listener());
}

function scheduleTick() {
  clearTimeout(tick);
  if (document.hidden) return;
  const now = new Date();
  const untilNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds());
  tick = setTimeout(() => {
    readClock();
    scheduleTick();
  }, untilNextMinute);
}

function onVisibilityChange() {
  if (document.hidden) {
    clearTimeout(tick);
    return;
  }
  readClock();
  scheduleTick();
}

function subscribeClock(listener: () => void) {
  clockListeners.add(listener);
  if (clockListeners.size === 1) {
    minutes = salvadorMinutes(new Date());
    scheduleTick();
    document.addEventListener('visibilitychange', onVisibilityChange);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size > 0) return;
    clearTimeout(tick);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}

const noSubscribe = () => () => {};
const getClock = () => (minutes ??= salvadorMinutes(new Date()));
const noMinutes = () => null;

/**
 * Minutos desde a meia-noite em Salvador, avançando sozinhos. Nulo no HTML estático e na
 * hidratação, e quando `running` é falso (assim só quem precisa da hora acorda a cada minuto).
 */
export function useSalvadorMinutes(running = true): number | null {
  return useSyncExternalStore(
    running ? subscribeClock : noSubscribe,
    running ? getClock : noMinutes,
    noMinutes
  );
}

// O clima de Salvador (`/api/cena`), só em `ao vivo`: um pedido a cada entrada no modo, refeito no
// ritmo do cache da rota enquanto a aba está visível. Fica só em memória; se um novo pedido falha,
// segue o último que chegou nesta entrada (ou nenhum, e o céu segue só pela hora).
const WEATHER_REFRESH_MS = 20 * 60_000;
let weather: SceneWeather | null = null;
let weatherAt = 0;
let weatherTimer: ReturnType<typeof setTimeout> | undefined;
let weatherRequest: AbortController | undefined;
const weatherListeners = new Set<() => void>();

async function loadWeather() {
  clearTimeout(weatherTimer);
  weatherRequest?.abort();
  const request = (weatherRequest = new AbortController());
  weatherAt = Date.now();
  try {
    const response = await fetch('/api/cena', { signal: request.signal });
    const body: unknown = response.ok ? await response.json() : null;
    if (isSceneWeather(body)) {
      weather = body;
      weatherListeners.forEach(listener => listener());
    }
  } catch {
    // Sem rede ou pedido cancelado: a Cena continua com o que já tem.
  }
  if (request === weatherRequest) scheduleWeather();
}

function scheduleWeather() {
  clearTimeout(weatherTimer);
  if (document.hidden || weatherListeners.size === 0) return;
  weatherTimer = setTimeout(loadWeather, Math.max(0, weatherAt + WEATHER_REFRESH_MS - Date.now()));
}

// Ao voltar para a aba, o pedido atrasado sai na hora; ao sair, nada é pedido.
function onWeatherVisibility() {
  if (document.hidden) clearTimeout(weatherTimer);
  else scheduleWeather();
}

function subscribeWeather(listener: () => void) {
  weatherListeners.add(listener);
  if (weatherListeners.size === 1) {
    document.addEventListener('visibilitychange', onWeatherVisibility);
    loadWeather();
  }
  return () => {
    weatherListeners.delete(listener);
    if (weatherListeners.size > 0) return;
    clearTimeout(weatherTimer);
    weatherRequest?.abort();
    weatherRequest = undefined;
    // Na próxima entrada, o céu segue pela hora até o clima novo chegar.
    weather = null;
    document.removeEventListener('visibilitychange', onWeatherVisibility);
  };
}

const getWeather = () => weather;
const noWeather = () => null;

/** O clima de Salvador quando `running` (o modo `ao vivo`); nulo enquanto não chega, se a rota falha e fora do modo. */
export function useSceneWeather(running: boolean): SceneWeather | null {
  return useSyncExternalStore(running ? subscribeWeather : noSubscribe, running ? getWeather : noWeather, noWeather);
}

/** O Modo da Cena e a Cena que ele pede agora: o que o Hero, o Header e o Mar leem. */
export function useScene(): { mode: SceneMode; scene: SceneParams } {
  const mode = useSceneMode();
  const live = mode === 'ao-vivo';
  const minutes = useSalvadorMinutes(live);
  const weather = useSceneWeather(live);
  // A mesma Cena enquanto a hora e o clima não mudam: a troca animada só recomeça quando o alvo muda de fato.
  const scene = useMemo(() => {
    if (mode !== 'ao-vivo') return sceneFor({ mode });
    // Sem a hora (HTML estático e hidratação), a Cena é a de quem não escolheu nada.
    if (minutes === null) return sceneFor({ mode: DEFAULT_MODE });
    return sceneFor({ mode, minutes, weather });
  }, [mode, minutes, weather]);
  return { mode, scene };
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
