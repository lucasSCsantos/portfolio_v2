import { test, expect } from '@playwright/test';
import { mixScenes, sceneFor, salvadorMinutes, textOnScene } from '../src/app/lib/scene';

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

test.describe('passagem entre duas Cenas', () => {
  const day = sceneFor({ mode: 'dia' });
  const night = sceneFor({ mode: 'noite' });
  const channels = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));

  test('no início é a Cena de partida e no fim a de chegada, sem nenhuma diferença', () => {
    expect(mixScenes(day, night, 0)).toEqual(day);
    expect(mixScenes(day, night, 1)).toEqual(night);
  });

  test('fora do intervalo fica presa às pontas', () => {
    expect(mixScenes(day, night, -0.5)).toEqual(day);
    expect(mixScenes(day, night, 1.5)).toEqual(night);
  });

  test('no meio, cores e números ficam no meio do caminho, e as cores continuam válidas', () => {
    const mid = mixScenes(day, night, 0.5);
    [...mid.sky, ...mid.waves].forEach(color => expect(color).toMatch(/^#[0-9a-f]{6}$/));

    mid.sky.forEach((color, i) =>
      channels(color).forEach((channel, k) =>
        expect(channel).toBeCloseTo((channels(day.sky[i])[k] + channels(night.sky[i])[k]) / 2, -0.5)
      )
    );
    mid.waves.forEach((color, i) =>
      channels(color).forEach((channel, k) =>
        expect(channel).toBeCloseTo((channels(day.waves[i])[k] + channels(night.waves[i])[k]) / 2, -0.5)
      )
    );
    expect(mid.stars).toBeCloseTo(0.5);
    expect(mid.amp).toBeCloseTo(1.3);
    expect(mid.speed).toBeCloseTo(0.825);
    expect(mid.dark).toBeCloseTo(0.5);
  });

  test('o tom dos textos e a fase trocam de uma vez, na metade', () => {
    expect(mixScenes(day, night, 0.49)).toMatchObject({ tone: 'light', phase: 'dia' });
    expect(mixScenes(day, night, 0.5)).toMatchObject({ tone: 'dark', phase: 'noite' });
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

test.describe('modelo da Cena em ao vivo', () => {
  const at = (hours: number, minutes = 0) => sceneFor({ mode: 'ao-vivo', minutes: hours * 60 + minutes });
  const luminance = (hex: string) =>
    [1, 3, 5].reduce((sum, i, k) => sum + parseInt(hex.slice(i, i + 2), 16) * [0.2126, 0.7152, 0.0722][k], 0);
  const channels = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const warmth = (hex: string) => channels(hex)[0] - channels(hex)[2];

  test('de madrugada é a noite estrelada, com as cores do modo noite', () => {
    const night = sceneFor({ mode: 'noite' });
    expect(at(3)).toMatchObject({ phase: 'noite', sky: night.sky, waves: night.waves, stars: 1, dark: 1, tone: 'dark' });
  });

  test('ao meio-dia é o dia de sempre, e as ondas calmas de sempre', () => {
    expect(at(12)).toEqual(sceneFor({ mode: 'dia' }));
  });

  test('o amanhecer é alaranjado, entre a noite e o dia', () => {
    const dawn = at(5, 45);
    expect(dawn.phase).toBe('amanhecer');
    expect(warmth(dawn.sky[1])).toBeGreaterThan(40);
    expect(dawn.dark).toBeGreaterThan(0);
    expect(dawn.dark).toBeLessThan(1);
  });

  test('o pôr do sol é alaranjado e o crepúsculo já escurece', () => {
    const sunset = at(17, 30);
    expect(sunset.phase).toBe('por-do-sol');
    expect(warmth(sunset.sky[1])).toBeGreaterThan(40);

    const dusk = at(18, 15);
    expect(dusk.phase).toBe('crepusculo');
    expect(dusk.dark).toBeGreaterThan(sunset.dark);
    expect(luminance(dusk.sky[0])).toBeLessThan(luminance(sunset.sky[0]));
  });

  test('às 21h já é noite de novo', () => {
    expect(at(21)).toMatchObject({ phase: 'noite', stars: 1, tone: 'dark' });
  });

  test('o tom dos textos acompanha a luz: claro de dia, escuro à noite', () => {
    expect(at(12).tone).toBe('light');
    expect(at(3).tone).toBe('dark');
    expect(at(21).tone).toBe('dark');
  });

  test('as estrelas somem com o dia', () => {
    expect(at(12).stars).toBe(0);
    expect(at(3).stars).toBe(1);
  });

  test('a passagem é gradual: minutos vizinhos dão Cenas próximas, inclusive na virada da meia-noite', () => {
    // O maior salto de um minuto para o seguinte, em canal de cor e em estrelas e escuridão.
    let colorJump = 0;
    let numberJump = 0;
    for (let minute = 0; minute < 1440; minute++) {
      const a = sceneFor({ mode: 'ao-vivo', minutes: minute });
      const b = sceneFor({ mode: 'ao-vivo', minutes: (minute + 1) % 1440 });
      const next = [...b.sky, ...b.waves];
      [...a.sky, ...a.waves].forEach((color, i) =>
        channels(color).forEach((channel, k) => {
          colorJump = Math.max(colorJump, Math.abs(channel - channels(next[i])[k]));
        })
      );
      numberJump = Math.max(numberJump, Math.abs(a.stars - b.stars), Math.abs(a.dark - b.dark));
    }
    expect(colorJump).toBeLessThanOrEqual(8);
    expect(numberJump).toBeLessThanOrEqual(0.05);
  });

  test('nas horas de referência, o tom sobre o Mar lê bem na onda da frente, onde o Mar começa', () => {
    const linear = (c: number) => (c / 255 <= 0.03928 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4);
    const relative = (hex: string) =>
      channels(hex).reduce((sum, c, k) => sum + linear(c) * [0.2126, 0.7152, 0.0722][k], 0);
    const contrast = (a: string, b: string) => {
      const [high, low] = [relative(a), relative(b)].sort((x, y) => y - x);
      return (high + 0.05) / (low + 0.05);
    };
    for (const [hours, minutes] of [[3, 0], [5, 45], [12, 0], [17, 30], [18, 15], [21, 0]]) {
      const scene = at(hours, minutes);
      expect(contrast(textOnScene(scene.seaTone).ink, scene.waves[2]), `${hours}h${minutes}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test('a hora fora do intervalo de um dia dá a volta no relógio', () => {
    expect(sceneFor({ mode: 'ao-vivo', minutes: 1440 + 12 * 60 })).toEqual(at(12));
    expect(sceneFor({ mode: 'ao-vivo', minutes: -60 })).toEqual(at(23));
  });

  test('todas as cores são válidas a qualquer hora', () => {
    for (let minute = 0; minute < 1440; minute += 7) {
      const scene = sceneFor({ mode: 'ao-vivo', minutes: minute });
      [...scene.sky, ...scene.waves].forEach(color => expect(color).toMatch(/^#[0-9a-f]{6}$/i));
    }
  });
});
