import { test, expect } from '@playwright/test';
import { sceneFor, salvadorMinutes } from '../src/app/lib/scene';

// Valores do Hero como ele sempre foi (cores das três camadas de onda e o fundo do Hero).
const DAY_WAVES = ['#1462A6', '#398CBF', '#79BED9'];
const DAY_SKY = '#f2f2f2';

test.describe('modelo da Cena', () => {
  test('o modo dia reproduz o Hero de sempre: céu liso, sem estrelas, nuvens nem chuva, ondas com as cores de hoje', () => {
    const scene = sceneFor({ mode: 'dia' });

    expect(scene.sky).toEqual([DAY_SKY, DAY_SKY, DAY_SKY]);
    expect(scene.waves).toEqual(DAY_WAVES);
    expect(scene.stars).toBe(0);
    expect(scene.cloud).toBe(0);
    expect(scene.rain).toBe(0);
    expect(scene.amp).toBe(1);
    expect(scene.speed).toBe(1);
    expect(scene.dark).toBe(0);
    expect(scene.tone).toBe('light');
    expect(scene.phase).toBe('dia');
  });
});

test.describe('hora de Salvador', () => {
  // Salvador é UTC-3 o ano todo (sem horário de verão desde 2019).
  const cases: [string, string, number][] = [
    ['meia-noite', '2026-11-12T03:00:00Z', 0],
    ['22h, quando começa o Aviso de sono', '2026-11-13T01:00:00Z', 22 * 60],
    ['9h30', '2026-11-12T12:30:00Z', 9 * 60 + 30],
    ['23h59, o último minuto do dia', '2026-11-13T02:59:00Z', 23 * 60 + 59],
    ['01h UTC ainda é a noite do dia anterior em Salvador', '2026-01-01T01:00:00Z', 22 * 60],
    ['no verão do hemisfério sul, o fuso continua o mesmo', '2026-01-15T15:00:00Z', 12 * 60]
  ];

  for (const [name, iso, expected] of cases) {
    test(`devolve os minutos desde a meia-noite de Salvador: ${name}`, () => {
      expect(salvadorMinutes(new Date(iso))).toBe(expected);
    });
  }
});
