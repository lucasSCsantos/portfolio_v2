// A Cena: o céu e as ondas do Hero (ver CONTEXT.md e docs/adr/0003).
// Módulo puro: a hora e o clima entram como argumentos, nada aqui lê relógio nem DOM.

import { isFiniteNumber, type SceneWeather } from './scene-weather';

export const SCENE_MODES = ['dia', 'noite', 'ao-vivo'] as const;
export type SceneMode = (typeof SCENE_MODES)[number];

// Três cores, de cima para baixo no céu ou de trás para a frente nas ondas.
export type ColorTrio = [string, string, string];

// Os presets são `dia` e `noite`; em `ao vivo` o dia também passa por amanhecer, pôr do sol e crepúsculo.
export type ScenePhase = 'dia' | 'noite' | 'amanhecer' | 'por-do-sol' | 'crepusculo';

export type SceneParams = {
  // Topo, meio e base do gradiente do céu.
  sky: ColorTrio;
  stars: number; // 0..1
  cloud: number; // 0..1
  rain: number; // 0..1
  // Multiplicador da altura das ondas (1 = as ondas de sempre).
  amp: number;
  // Multiplicador da duração do deslize (1 = a velocidade de sempre; menor = mais rápido).
  speed: number;
  // Onda de trás, do meio e da frente.
  waves: ColorTrio;
  // 0 dia .. 1 noite.
  dark: number;
  // Tom dos textos que ficam sobre o céu (o Hero e o Header) e sobre o Mar, que começa na onda da frente.
  tone: 'light' | 'dark';
  seaTone: 'light' | 'dark';
  phase: ScenePhase;
};

// Em `ao vivo`, a hora de Salvador em minutos desde a meia-noite e, quando já chegou, o clima.
type SceneInput =
  | { mode: 'dia' | 'noite' }
  | { mode: 'ao-vivo'; minutes: number; weather?: SceneWeather | null };

const DAY_SKY = '#f2f2f2';

const DAY: SceneParams = {
  sky: [DAY_SKY, DAY_SKY, DAY_SKY],
  stars: 0,
  cloud: 0,
  rain: 0,
  amp: 1,
  speed: 1,
  waves: ['#1462A6', '#398CBF', '#79BED9'],
  dark: 0,
  tone: 'light',
  seaTone: 'light',
  phase: 'dia'
};

// Azul-marinho a quase preto, com ondas escuras e mais agitadas.
const NIGHT: SceneParams = {
  sky: ['#02050f', '#07142e', '#0d2a52'],
  stars: 1,
  cloud: 0,
  rain: 0,
  amp: 1.6,
  speed: 0.65,
  waves: ['#031a33', '#07294d', '#0e3a66'],
  dark: 1,
  tone: 'dark',
  seaTone: 'dark',
  phase: 'noite'
};

export function sceneFor(input: SceneInput): SceneParams {
  switch (input.mode) {
    case 'dia':
      return DAY;
    case 'noite':
      return NIGHT;
    case 'ao-vivo':
      return liveScene(input.minutes, input.weather ?? null);
  }
}

const mix = (from: number, to: number, t: number) => from + (to - from) * t;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Os canais (0..255) de uma cor `#rrggbb`.
const channels = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

export const mixColor = (from: string, to: string, t: number) => {
  const target = channels(to);
  return (
    '#' +
    channels(from)
      .map((channel, i) => Math.round(mix(channel, target[i], t)).toString(16).padStart(2, '0'))
      .join('')
  );
};

// Mistura no espaço linear (a raiz da média dos quadrados), como o Framer Motion mistura cores: o meio não fica acinzentado.
export const mixColorLinear = (from: string, to: string, t: number) => {
  const target = channels(to);
  return (
    '#' +
    channels(from)
      .map((c, i) => Math.round(Math.sqrt(Math.max(0, mix(c * c, target[i] ** 2, t)))))
      .map(c => c.toString(16).padStart(2, '0'))
      .join('')
  );
};

const mixTrio = (from: ColorTrio, to: ColorTrio, t: number): ColorTrio => [
  mixColor(from[0], to[0], t),
  mixColor(from[1], to[1], t),
  mixColor(from[2], to[2], t)
];

// O quadro `t` (0..1) da passagem de uma Cena para outra: cores e números andam juntos;
// o tom dos textos e a fase, que não têm meio-termo, trocam na metade.
export function mixScenes(from: SceneParams, to: SceneParams, t: number): SceneParams {
  if (t <= 0) return from;
  if (t >= 1) return to;
  const ending = t >= 0.5 ? to : from;
  return {
    sky: mixTrio(from.sky, to.sky, t),
    stars: mix(from.stars, to.stars, t),
    cloud: mix(from.cloud, to.cloud, t),
    rain: mix(from.rain, to.rain, t),
    amp: mix(from.amp, to.amp, t),
    speed: mix(from.speed, to.speed, t),
    waves: mixTrio(from.waves, to.waves, t),
    dark: mix(from.dark, to.dark, t),
    tone: ending.tone,
    seaTone: ending.seaTone,
    phase: ending.phase
  };
}

const luminance = (hex: string) => {
  const linear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = channels(hex).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
};

// O tom que lê melhor no pior ponto de um fundo.
export function toneOver(background: string[]): SceneParams['tone'] {
  const worst = (tone: SceneParams['tone']) => {
    const { ink } = textOnScene(tone);
    return Math.min(...background.map(color => contrast(ink, color)));
  };
  return worst('light') >= worst('dark') ? 'light' : 'dark';
}

// Nascer e pôr do sol em Salvador, em minutos: a tabela de reserva, quando o clima não informa os do dia.
const SUNRISE = 5 * 60 + 30;
const SUNSET = 17 * 60 + 30;
const DAY_MINUTES = 24 * 60;

// Um ponto da curva do dia: o céu, quanta luz há (0 noite .. 1 dia), quanto do laranja do sol e
// quão perto as ondas estão das de dia. O mar não segue a luz do céu ao pé da letra: no amanhecer e
// no pôr do sol ele já está escuro, para os textos sobre o Mar terem uma tinta que leia bem
// (um azul médio não deixa nem o texto claro nem o escuro passar no contraste).
type SkyKey = { at: number; sky: ColorTrio; light: number; warm: number; sea: number };

const NIGHT_KEY = { sky: NIGHT.sky, light: 0, warm: 0, sea: 0 };
const DAY_KEY = { sky: DAY.sky, light: 1, warm: 0, sea: 1 };

// A curva do protótipo (branch prototype/cena-viva), presa ao nascer e ao pôr do sol. No amanhecer
// e no pôr do sol o meio do céu é um coral escuro, para o texto claro do Hero ler bem; o laranja vivo fica na base.
const skyKeys = (sunrise: number, sunset: number): SkyKey[] => [
  { at: 0, ...NIGHT_KEY },
  { at: sunrise - 30, ...NIGHT_KEY },
  { at: sunrise + 15, sky: ['#3b4a78', '#a5504f', '#f7c690'], light: 0.45, warm: 1, sea: 0.2 },
  { at: sunrise + 100, sky: ['#dfe3ea', '#f2f2f2', '#f2f2f2'], light: 1, warm: 0.25, sea: 1 },
  { at: sunrise + 170, ...DAY_KEY },
  { at: sunset - 90, ...DAY_KEY },
  { at: sunset, sky: ['#5a4a86', '#9c4f52', '#f6b064'], light: 0.5, warm: 1, sea: 0.2 },
  { at: sunset + 60, sky: ['#161c45', '#3a2c5e', '#b25a5e'], light: 0.15, warm: 0.6, sea: 0.05 },
  { at: sunset + 120, ...NIGHT_KEY },
  { at: DAY_MINUTES, ...NIGHT_KEY }
];

// Onde termina cada fase; depois do crepúsculo, noite até o outro amanhecer.
const phaseUntil = (sunrise: number, sunset: number): [number, ScenePhase][] => [
  [sunrise - 30, 'noite'],
  [sunrise + 100, 'amanhecer'],
  [sunset - 45, 'dia'],
  [sunset + 30, 'por-do-sol'],
  [sunset + 90, 'crepusculo'],
  [DAY_MINUTES, 'noite']
];

// O nascer e o pôr do sol do dia, se o clima os trouxe e eles cabem na curva; senão, a tabela.
function sunTimes(weather: SceneWeather | null): { sunrise: number; sunset: number } {
  const minutesOf = (iso: string | undefined) => {
    const instant = new Date(iso ?? '');
    return Number.isNaN(instant.getTime()) ? NaN : salvadorMinutes(instant);
  };
  const sunrise = minutesOf(weather?.sunrise);
  const sunset = minutesOf(weather?.sunset);
  // As paradas da curva precisam ficar em ordem dentro do dia.
  const fits = sunrise - 30 > 0 && sunrise + 170 < sunset - 90 && sunset + 120 < DAY_MINUTES;
  return fits ? { sunrise, sunset } : { sunrise: SUNRISE, sunset: SUNSET };
}

// O laranja que o sol baixo deixa nas ondas do meio e da frente.
const SUN_GLOW = '#e0735a';

// O cinza do tempo fechado, da noite ao dia, e o que ele deixa nas ondas.
const STORM_GRAY = { night: '#0b1220', day: '#8d98a5' };
const STORM_SEA = '#4f6577';

// A chuva chega à intensidade máxima por volta de 4 mm/h.
const HEAVY_RAIN = 4;

// O mar pelas ondas e pelo vento reais, contínuo e preso aos limites (nunca parado, nunca frenético).
// Os pesos são os do protótipo, ajustáveis a olho. Sem a altura da onda, só o vento (e a chuva) mexem no mar.
const ROUGH_WAVE = 3; // m
const STRONG_WIND = 15; // m/s

function seaMotion(weather: SceneWeather | null, rain: number): Pick<SceneParams, 'amp' | 'speed'> {
  // Sem clima, as ondas calmas de sempre.
  if (!weather) return { amp: 1, speed: 1 };
  // Um valor inválido ou negativo vale como mar parado.
  const nonNegative = (value: number | null) => (isFiniteNumber(value) ? Math.max(0, value) : 0);
  const wave = nonNegative(weather.waveHeight) / ROUGH_WAVE;
  const wind = nonNegative(weather.windSpeed) / STRONG_WIND;
  return {
    amp: clamp(0.75 + wave * 0.95 + wind * 0.4 + rain * 0.2, 0.75, 2),
    speed: clamp(1.25 - wind * 0.5 - wave * 0.2 - rain * 0.1, 0.55, 1.25)
  };
}

function liveScene(minutes: number, weather: SceneWeather | null): SceneParams {
  const m = ((minutes % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  const { sunrise, sunset } = sunTimes(weather);
  const keys = skyKeys(sunrise, sunset);
  const next = keys.findIndex(key => key.at > m);
  const [a, b] = [keys[next - 1], keys[next]];
  const t = (m - a.at) / (b.at - a.at);
  const light = mix(a.light, b.light, t);
  const warm = mix(a.warm, b.warm, t);
  const sea = mix(a.sea, b.sea, t);

  // O clima, contínuo e preso aos limites: nuvens pela cobertura, chuva pelos mm/h.
  const cloud = clamp((weather?.cloudCover ?? 0) / 100, 0, 1) || 0;
  const rain = clamp((weather?.precipitation ?? 0) / HEAVY_RAIN, 0, 1) || 0;
  // Nuvens e chuva empurram o céu para um cinza que depende da luz do momento.
  const grayness = Math.min(1, cloud * 0.2 + rain * 0.3);
  const gray = mixColor(STORM_GRAY.night, STORM_GRAY.day, light);
  const seaGray = grayness * 0.3 * light + rain * 0.1;

  const clearSky = mixTrio(a.sky, b.sky, t);
  const sky = grayness > 0 ? (clearSky.map(color => mixColor(color, gray, grayness)) as ColorTrio) : clearSky;
  // Em pleno dia, as ondas são exatamente as do preset `dia` (a mistura não guarda a grafia das cores).
  const clearWaves =
    sea === 1 && warm === 0
      ? DAY.waves
      : (DAY.waves.map((day, i) => {
          const color = mixColor(NIGHT.waves[i], day, sea);
          return i > 0 ? mixColor(color, SUN_GLOW, warm * 0.16) : color;
        }) as ColorTrio);
  const waves =
    seaGray > 0 ? (clearWaves.map(color => mixColor(color, STORM_SEA, seaGray)) as ColorTrio) : clearWaves;

  return {
    sky,
    // As estrelas só aparecem quando o céu já escureceu de fato, e as nuvens escondem boa parte delas.
    stars: clamp((0.4 - light) / 0.4, 0, 1) * (1 - cloud * 0.85),
    cloud,
    rain,
    ...seaMotion(weather, rain),
    waves,
    dark: 1 - light,
    tone: toneOver([sky[0], sky[1]]),
    seaTone: toneOver([waves[2]]),
    phase: phaseUntil(sunrise, sunset).find(([until]) => m < until)![1]
  };
}

// Cores dos textos do Hero sobre a Cena: escuros sobre céu claro, claros sobre céu escuro.
export function textOnScene(tone: SceneParams['tone']) {
  return tone === 'light'
    ? { ink: '#000000', titleGradient: 'linear-gradient(180deg, black 80%, #1762A6)' }
    : { ink: '#f2f2f2', titleGradient: 'linear-gradient(180deg, #f2f2f2 80%, #79BED9)' };
}

const SALVADOR_CLOCK = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Bahia',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23'
});

// Minutos desde a meia-noite em Salvador, qualquer que seja o fuso de quem visita.
export function salvadorMinutes(now: Date): number {
  const part = (type: 'hour' | 'minute') =>
    Number(SALVADOR_CLOCK.formatToParts(now).find((p) => p.type === type)?.value);
  return part('hour') * 60 + part('minute');
}

// O Aviso de sono: das 22h às 5h em Salvador, em qualquer Modo da Cena.
const SLEEP_FROM = 22 * 60;
const SLEEP_UNTIL = 5 * 60;

export function isSleepTime(minutes: number): boolean {
  return minutes >= SLEEP_FROM || minutes < SLEEP_UNTIL;
}
