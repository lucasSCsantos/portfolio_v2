import { test, expect } from '@playwright/test';
import { sceneFor, salvadorMinutes, textOnScene } from '../src/app/lib/scene';

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

test.describe('modelo da Cena em noite', () => {
  const night = sceneFor({ mode: 'noite' });
  const luminance = (hex: string) =>
    [1, 3, 5].reduce((sum, i, k) => sum + parseInt(hex.slice(i, i + 2), 16) * [0.2126, 0.7152, 0.0722][k], 0);

  test('o céu vai de azul-marinho a quase preto, com estrelas e sem nuvens nem chuva', () => {
    expect(night.sky.every(color => luminance(color) < 60)).toBe(true);
    expect(luminance(night.sky[0])).toBeLessThan(luminance(night.sky[2]));
    expect(night.stars).toBe(1);
    expect(night.cloud).toBe(0);
    expect(night.rain).toBe(0);
  });

  test('as ondas são mais escuras que as de dia, mais altas e mais rápidas', () => {
    const day = sceneFor({ mode: 'dia' });
    night.waves.forEach((color, i) =>
      expect(luminance(color)).toBeLessThan(luminance(day.waves[i]))
    );
    expect(night.amp).toBe(1.6);
    expect(night.speed).toBe(0.65);
  });

  test('a Cena é escura e os textos sobre ela pedem tom claro', () => {
    expect(night.dark).toBe(1);
    expect(night.tone).toBe('dark');
    expect(night.phase).toBe('noite');
    expect(textOnScene(night.tone).ink).not.toBe(textOnScene('light').ink);
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
