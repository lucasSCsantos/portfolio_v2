// A Cena: o céu e as ondas do Hero (ver CONTEXT.md e docs/adr/0003).
// Módulo puro: a hora e o clima entram como argumentos, nada aqui lê relógio nem DOM.

export type SceneMode = 'dia';

// Três cores, de cima para baixo no céu ou de trás para a frente nas ondas.
export type ColorTrio = [string, string, string];

export type ScenePhase = 'dia';

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
  // Tom dos textos que ficam sobre a Cena e o Mar.
  tone: 'light' | 'dark';
  phase: ScenePhase;
};

type SceneInput = { mode: SceneMode };

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
  phase: 'dia'
};

export function sceneFor({ mode }: SceneInput): SceneParams {
  switch (mode) {
    case 'dia':
      return DAY;
  }
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
