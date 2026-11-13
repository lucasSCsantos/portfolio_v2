import { test, expect } from '@playwright/test';
import { mixScenes, sceneFor, salvadorMinutes, textOnScene, type SceneParams } from '../src/app/lib/scene';
import type { SceneWeather } from '../src/app/lib/scene-weather';

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

test.describe('modelo da Cena em ao vivo com clima', () => {
  // O dia de 13/11/2026 em Salvador, com o nascer e o pôr do sol da tabela de reserva (5h30, 17h30).
  const clear: SceneWeather = {
    sunrise: '2026-11-13T05:30:00-03:00',
    sunset: '2026-11-13T17:30:00-03:00',
    cloudCover: 0,
    precipitation: 0,
    windSpeed: 0,
    waveHeight: null,
    fetchedAt: '2026-11-13T15:00:00.000Z'
  };
  const at = (hours: number, weather: Partial<SceneWeather> = {}, minutes = 0) =>
    sceneFor({ mode: 'ao-vivo', minutes: hours * 60 + minutes, weather: { ...clear, ...weather } });
  const byHour = (hours: number, minutes = 0) => sceneFor({ mode: 'ao-vivo', minutes: hours * 60 + minutes });
  const channels = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const luminance = (hex: string) =>
    channels(hex).reduce((sum, channel, k) => sum + channel * [0.2126, 0.7152, 0.0722][k], 0);
  // Quanto a cor foge do cinza: a diferença entre o canal mais forte e o mais fraco.
  const saturation = (hex: string) => Math.max(...channels(hex)) - Math.min(...channels(hex));

  // O céu e as cores, sem as ondas, que dependem do mar e do vento.
  const skyOf = ({ amp, speed, ...rest }: SceneParams) => rest;

  test('céu limpo é a mesma Cena da hora, sem nuvens nem chuva', () => {
    for (const hours of [3, 12, 17, 21]) expect(skyOf(at(hours))).toEqual(skyOf(byHour(hours)));
    expect(skyOf(at(12))).toEqual(skyOf(sceneFor({ mode: 'dia' })));
  });

  test('a cobertura de nuvens vira nuvens, na mesma proporção e sem chuva', () => {
    expect(at(12, { cloudCover: 40 })).toMatchObject({ cloud: 0.4, rain: 0 });
    expect(at(12, { cloudCover: 100 }).cloud).toBe(1);
  });

  test('a chuva liga com qualquer precipitação, cresce com os mm/h e satura em cerca de 4 mm/h', () => {
    expect(at(12, { precipitation: 0 }).rain).toBe(0);
    const drizzle = at(12, { precipitation: 0.2 }).rain;
    const moderate = at(12, { precipitation: 2 }).rain;
    expect(drizzle).toBeGreaterThan(0);
    expect(moderate).toBeGreaterThan(drizzle);
    expect(at(12, { precipitation: 4 }).rain).toBe(1);
    expect(at(12, { precipitation: 40 }).rain).toBe(1);
  });

  test('valores fora do intervalo ficam presos aos limites', () => {
    const wild = at(12, { cloudCover: 250, precipitation: -3 });
    expect(wild.cloud).toBe(1);
    expect(wild.rain).toBe(0);
    expect(at(12, { cloudCover: -10 }).cloud).toBe(0);
  });

  test('nuvens e chuva deixam o céu mais cinza e mais escuro, mais com chuva do que só com nuvens', () => {
    const sunset = at(17, {}, 30);
    const cloudy = at(17, { cloudCover: 100 }, 30);
    const rainy = at(17, { cloudCover: 100, precipitation: 4 }, 30);
    expect(saturation(cloudy.sky[1])).toBeLessThan(saturation(sunset.sky[1]));
    expect(saturation(rainy.sky[1])).toBeLessThan(saturation(cloudy.sky[1]));

    const noon = at(12);
    const noonRain = at(12, { cloudCover: 100, precipitation: 4 });
    noonRain.sky.forEach((color, i) => expect(luminance(color)).toBeLessThan(luminance(noon.sky[i])));
    noonRain.waves.forEach((color, i) => expect(saturation(color)).toBeLessThan(saturation(noon.waves[i])));
  });

  test('o tom dos textos continua o de melhor leitura sob o céu nublado e chuvoso', () => {
    expect(at(12, { cloudCover: 100, precipitation: 4 }).tone).toBe('light');
    expect(at(3, { cloudCover: 100, precipitation: 4 }).tone).toBe('dark');
  });

  test('as estrelas diminuem com a cobertura de nuvens, sem sumir de todo', () => {
    const covered = at(3, { cloudCover: 100 }).stars;
    expect(at(3).stars).toBe(1);
    expect(at(3, { cloudCover: 50 }).stars).toBeLessThan(1);
    expect(covered).toBeLessThan(at(3, { cloudCover: 50 }).stars);
    expect(covered).toBeGreaterThan(0);
    expect(at(12, { cloudCover: 100 }).stars).toBe(0);
  });

  test('o nascer e o pôr do sol do dia substituem a tabela fixa nas fases', () => {
    // Em novembro o sol nasce perto das 5h e se põe perto das 17h40.
    const november = { sunrise: '2026-11-13T04:57:00-03:00', sunset: '2026-11-13T17:38:00-03:00' };
    expect(at(4, november, 40).phase).toBe('amanhecer');
    expect(byHour(4, 40).phase).toBe('noite');
    expect(at(16, november, 50).phase).toBe('dia');
    expect(byHour(16, 50).phase).toBe('por-do-sol');
  });

  test('um nascer ou pôr do sol fora do razoável cai na tabela fixa', () => {
    const backwards = { sunrise: '2026-11-13T19:00:00-03:00', sunset: '2026-11-13T06:00:00-03:00' };
    for (const hours of [3, 6, 12, 17, 21]) expect(at(hours, backwards).phase).toBe(byHour(hours).phase);
    const garbage = { sunrise: 'ontem', sunset: '' };
    for (const hours of [3, 6, 12, 17, 21]) expect(at(hours, garbage).phase).toBe(byHour(hours).phase);
  });

  test('todas as cores continuam válidas com qualquer clima', () => {
    for (let minute = 0; minute < 1440; minute += 37)
      for (const weather of [{ cloudCover: 100 }, { precipitation: 4 }, { cloudCover: 70, precipitation: 1.5 }]) {
        const scene = at(0, weather, minute);
        [...scene.sky, ...scene.waves].forEach(color => expect(color).toMatch(/^#[0-9a-f]{6}$/i));
      }
  });

  test('a passagem continua gradual sob chuva', () => {
    let jump = 0;
    for (let minute = 0; minute < 1440; minute++) {
      const a = at(0, { cloudCover: 80, precipitation: 2 }, minute);
      const b = at(0, { cloudCover: 80, precipitation: 2 }, (minute + 1) % 1440);
      a.sky.forEach((color, i) =>
        channels(color).forEach((channel, k) => (jump = Math.max(jump, Math.abs(channel - channels(b.sky[i])[k]))))
      );
    }
    expect(jump).toBeLessThanOrEqual(8);
  });
});

test.describe('ondas em ao vivo, pelo mar e pelo vento', () => {
  const calm: SceneWeather = {
    sunrise: '2026-11-13T05:30:00-03:00',
    sunset: '2026-11-13T17:30:00-03:00',
    cloudCover: 0,
    precipitation: 0,
    windSpeed: 2,
    waveHeight: 0.5,
    fetchedAt: '2026-11-13T15:00:00.000Z'
  };
  const waves = (weather: Partial<SceneWeather>, hours = 12) => {
    const { amp, speed } = sceneFor({ mode: 'ao-vivo', minutes: hours * 60, weather: { ...calm, ...weather } });
    return { amp, speed };
  };
  // Mais agitado: ondas mais altas e deslize mais rápido (duração menor).
  type SeaMotion = Pick<SceneParams, 'amp' | 'speed'>;
  const rougher = (a: SeaMotion, b: SeaMotion) => {
    expect(a.amp).toBeGreaterThan(b.amp);
    expect(a.speed).toBeLessThan(b.speed);
  };

  test('mar calmo e pouco vento ficam perto das ondas de sempre', () => {
    const { amp, speed } = waves({});
    expect(Math.abs(amp - 1)).toBeLessThan(0.15);
    expect(Math.abs(speed - 1)).toBeLessThan(0.2);
  });

  test('ondas altas e vento forte deixam as ondas mais altas e mais rápidas que o mar calmo', () => {
    rougher(waves({ waveHeight: 2.5, windSpeed: 12 }), waves({}));
  });

  test('cada um agita o mar sozinho: a altura da onda, o vento e a chuva', () => {
    rougher(waves({ waveHeight: 2 }), waves({}));
    rougher(waves({ windSpeed: 10 }), waves({}));
    rougher(waves({ precipitation: 4 }), waves({}));
  });

  test('a agitação cresce aos poucos, sem saltos', () => {
    let jump = 0;
    for (let wind = 0; wind < 20; wind += 0.1) {
      const [a, b] = [waves({ windSpeed: wind }), waves({ windSpeed: wind + 0.1 })];
      jump = Math.max(jump, Math.abs(a.amp - b.amp), Math.abs(a.speed - b.speed));
    }
    expect(jump).toBeLessThan(0.01);
  });

  test('a altura fica entre 0,75 e 2 e a duração entre 0,55 e 1,25, com qualquer entrada', () => {
    const extremes: Partial<SceneWeather>[] = [
      { waveHeight: 0, windSpeed: 0, precipitation: 0 },
      { waveHeight: 40, windSpeed: 90, precipitation: 300 },
      { waveHeight: -5, windSpeed: -20, precipitation: -3 },
      { waveHeight: null, windSpeed: 1e9 },
      { waveHeight: NaN, windSpeed: Infinity, precipitation: NaN }
    ];
    for (const weather of extremes) {
      const { amp, speed } = waves(weather);
      expect(amp).toBeGreaterThanOrEqual(0.75);
      expect(amp).toBeLessThanOrEqual(2);
      expect(speed).toBeGreaterThanOrEqual(0.55);
      expect(speed).toBeLessThanOrEqual(1.25);
    }
    expect(waves({ waveHeight: 0, windSpeed: 0 })).toEqual({ amp: 0.75, speed: 1.25 });
    expect(waves({ waveHeight: 40, windSpeed: 90, precipitation: 300 })).toEqual({ amp: 2, speed: 0.55 });
  });

  test('sem altura de onda, as ondas respondem só ao vento', () => {
    rougher(waves({ waveHeight: null, windSpeed: 10 }), waves({ waveHeight: null, windSpeed: 1 }));
    expect(waves({ waveHeight: null, windSpeed: 6 })).toEqual(waves({ waveHeight: 0, windSpeed: 6 }));
  });

  test('a hora não mexe nas ondas: o mesmo mar dá as mesmas ondas de dia e de noite', () => {
    const rough = { waveHeight: 2, windSpeed: 9 };
    expect(waves(rough, 3)).toEqual(waves(rough, 12));
  });

  test('sem clima, as ondas calmas de sempre', () => {
    const { amp, speed } = sceneFor({ mode: 'ao-vivo', minutes: 3 * 60 });
    expect({ amp, speed }).toEqual({ amp: 1, speed: 1 });
  });

  test('dia e noite não dependem do clima: as ondas dos presets continuam as mesmas', () => {
    expect(sceneFor({ mode: 'dia' })).toMatchObject({ amp: 1, speed: 1 });
    expect(sceneFor({ mode: 'noite' })).toMatchObject({ amp: 1.6, speed: 0.65 });
  });
});
