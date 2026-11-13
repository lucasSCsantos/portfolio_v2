import { test, expect } from '@playwright/test';
import { createSceneWeatherHandler, isSceneWeather, normalizeOpenMeteo } from '../src/app/lib/scene-weather';

// Respostas da Open-Meteo para Salvador capturadas em 12/11/2026, 16h15, nos parâmetros que a rota pede;
// só a chuva e o vento foram trocados por valores de conta redonda.
const FORECAST = {
  latitude: -12.970122,
  longitude: -38.45456,
  generationtime_ms: 0.058,
  utc_offset_seconds: -10800,
  timezone: 'America/Bahia',
  timezone_abbreviation: 'GMT-3',
  elevation: 36.0,
  current_units: { time: 'iso8601', interval: 'seconds', cloud_cover: '%', precipitation: 'mm', wind_speed_10m: 'km/h' },
  current: { time: '2026-11-12T16:15', interval: 900, cloud_cover: 6, precipitation: 0.5, wind_speed_10m: 22.5 },
  daily_units: { time: 'iso8601', sunrise: 'iso8601', sunset: 'iso8601' },
  daily: { time: ['2026-11-12'], sunrise: ['2026-11-12T04:57'], sunset: ['2026-11-12T17:38'] }
};

const MARINE = {
  latitude: -12.958336,
  longitude: -38.541656,
  generationtime_ms: 0.062,
  utc_offset_seconds: -10800,
  timezone: 'America/Bahia',
  timezone_abbreviation: 'GMT-3',
  elevation: 36.0,
  current_units: { time: 'iso8601', interval: 'seconds', wave_height: 'm' },
  current: { time: '2026-11-12T16:15', interval: 900, wave_height: 1.34 }
};

const FETCHED_AT = new Date('2026-11-12T19:15:30.000Z');

const withCurrent = <T extends { current: object }>(body: T, current: Record<string, unknown>) => ({
  ...body,
  current: { ...body.current, ...current }
});

test.describe('normalização da Open-Meteo', () => {
  test('transforma a previsão e o mar no contrato da Cena, com vento em m/s e chuva em mm/h', () => {
    const result = normalizeOpenMeteo(FORECAST, MARINE, FETCHED_AT);

    expect(result).toEqual({
      ok: true,
      weather: {
        sunrise: '2026-11-12T04:57:00-03:00',
        sunset: '2026-11-12T17:38:00-03:00',
        cloudCover: 6,
        precipitation: 2, // 0,5 mm em 15 min
        windSpeed: 6.25, // 22,5 km/h
        waveHeight: 1.34,
        fetchedAt: '2026-11-12T19:15:30.000Z'
      }
    });
  });

  test('aceita o vento já em m/s', () => {
    const forecast = {
      ...withCurrent(FORECAST, { wind_speed_10m: 4.2 }),
      current_units: { ...FORECAST.current_units, wind_speed_10m: 'm/s' }
    };
    const result = normalizeOpenMeteo(forecast, MARINE, FETCHED_AT);

    expect(result.ok && result.weather.windSpeed).toBe(4.2);
  });

  test('o nascer e o pôr do sol do contrato são instantes válidos no fuso de Salvador', () => {
    const result = normalizeOpenMeteo(FORECAST, MARINE, FETCHED_AT);
    if (!result.ok) throw new Error('esperava sucesso');

    expect(new Date(result.weather.sunrise).toISOString()).toBe('2026-11-12T07:57:00.000Z');
    expect(new Date(result.weather.sunset).toISOString()).toBe('2026-11-12T20:38:00.000Z');
  });

  test('altura de onda nula (célula sem mar) vira waveHeight null, sem erro', () => {
    const result = normalizeOpenMeteo(FORECAST, withCurrent(MARINE, { wave_height: null }), FETCHED_AT);

    expect(result.ok && result.weather.waveHeight).toBeNull();
  });

  test('altura de onda ausente vira waveHeight null, sem erro', () => {
    const { wave_height: _, ...current } = MARINE.current;
    const result = normalizeOpenMeteo(FORECAST, { ...MARINE, current }, FETCHED_AT);

    expect(result.ok && result.weather.waveHeight).toBeNull();
  });

  const broken: [string, unknown, unknown][] = [
    ['previsão vazia', {}, MARINE],
    ['previsão nula', null, MARINE],
    ['erro da Open-Meteo', { error: true, reason: 'Cannot initialize WeatherVariable' }, MARINE],
    ['previsão sem o bloco daily', { ...FORECAST, daily: undefined }, MARINE],
    ['previsão sem nascer do sol', { ...FORECAST, daily: { ...FORECAST.daily, sunrise: [] } }, MARINE],
    ['pôr do sol fora do formato', { ...FORECAST, daily: { ...FORECAST.daily, sunset: ['amanhã'] } }, MARINE],
    ['nuvens como texto', withCurrent(FORECAST, { cloud_cover: '6' }), MARINE],
    ['chuva ausente', withCurrent(FORECAST, { precipitation: undefined }), MARINE],
    ['vento em unidade desconhecida', { ...FORECAST, current_units: { ...FORECAST.current_units, wind_speed_10m: 'bft' } }, MARINE],
    ['mar nulo', FORECAST, null],
    ['mar sem o bloco current', FORECAST, { ...MARINE, current: undefined }],
    ['altura de onda como texto', FORECAST, withCurrent(MARINE, { wave_height: 'alta' })]
  ];

  for (const [name, forecast, marine] of broken) {
    test(`resposta parcial ou malformada gera erro tratado: ${name}`, () => {
      const result = normalizeOpenMeteo(forecast, marine, FETCHED_AT);

      expect(result.ok).toBe(false);
    });
  }
});

test.describe('rota /api/cena', () => {
  const OPEN_METEO_FIELDS = /latitude|current_units|utc_offset|wave_height|wind_speed_10m|cloud_cover|generationtime/;

  // Simula as duas APIs da Open-Meteo, contando as chamadas; nada vai à rede.
  function fakeSource(answers: { forecast?: unknown; marine?: unknown; fail?: boolean }) {
    const calls: string[] = [];
    const fetchJson = async (url: string) => {
      calls.push(url);
      if (answers.fail) throw new Error('rede indisponível');
      return url.includes('marine') ? (answers.marine ?? MARINE) : (answers.forecast ?? FORECAST);
    };
    return { calls, fetchJson };
  }

  const clockAt = (start: Date) => {
    let now = start.getTime();
    return { now: () => new Date(now), advance: (minutes: number) => (now += minutes * 60_000) };
  };

  test('responde o contrato, sem nenhum campo da Open-Meteo, com cache compartilhado de 20 min', async () => {
    const source = fakeSource({});
    const handler = createSceneWeatherHandler({ fetchJson: source.fetchJson, now: () => FETCHED_AT });

    const response = await handler();
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('s-maxage=1200');
    expect(response.headers.get('cache-control')).toContain('public');
    expect(Object.keys(JSON.parse(text)).sort()).toEqual(
      ['cloudCover', 'fetchedAt', 'precipitation', 'sunrise', 'sunset', 'waveHeight', 'windSpeed'].sort()
    );
    expect(text).not.toMatch(OPEN_METEO_FIELDS);
  });

  test('pede a previsão e o mar de Salvador, na célula de mar mais próxima', async () => {
    const source = fakeSource({});
    await createSceneWeatherHandler({ fetchJson: source.fetchJson, now: () => FETCHED_AT })();

    const forecast = new URL(source.calls.find((url) => !url.includes('marine'))!);
    const marine = new URL(source.calls.find((url) => url.includes('marine'))!);
    for (const url of [forecast, marine]) {
      expect(Number(url.searchParams.get('latitude'))).toBeCloseTo(-12.97, 1);
      expect(Number(url.searchParams.get('longitude'))).toBeCloseTo(-38.5, 1);
      expect(url.searchParams.get('timezone')).toBe('America/Bahia');
    }
    expect(marine.searchParams.get('cell_selection')).toBe('sea');
  });

  test('visitantes dentro de 20 min recebem o mesmo dado sem nova ida à Open-Meteo', async () => {
    const source = fakeSource({});
    const clock = clockAt(FETCHED_AT);
    const handler = createSceneWeatherHandler({ fetchJson: source.fetchJson, now: clock.now });

    const first = await (await handler()).json();
    clock.advance(19);
    const second = await (await handler()).json();
    expect(second).toEqual(first);
    expect(source.calls).toHaveLength(2);

    clock.advance(2);
    await handler();
    expect(source.calls).toHaveLength(4);
  });

  test('visitantes simultâneos com o cache vazio compartilham uma só ida à Open-Meteo', async () => {
    const source = fakeSource({});
    const handler = createSceneWeatherHandler({ fetchJson: source.fetchJson, now: () => FETCHED_AT });

    const responses = await Promise.all([handler(), handler(), handler()]);

    expect(responses.map((response) => response.status)).toEqual([200, 200, 200]);
    expect(source.calls).toHaveLength(2);
  });

  test('se uma API falha, responde erro com cache curto de 1 min, e tenta de novo depois', async () => {
    const source = fakeSource({ fail: true });
    const clock = clockAt(FETCHED_AT);
    const handler = createSceneWeatherHandler({ fetchJson: source.fetchJson, now: clock.now });

    const response = await handler();
    const text = await response.text();
    expect(response.status).toBe(502);
    expect(response.headers.get('cache-control')).toContain('s-maxage=60');
    expect(text).not.toMatch(/rede indisponível/);

    const callsAfterFailure = source.calls.length;
    clock.advance(0.5);
    expect((await handler()).status).toBe(502);
    expect(source.calls).toHaveLength(callsAfterFailure);

    clock.advance(1);
    await handler();
    expect(source.calls.length).toBeGreaterThan(callsAfterFailure);
  });

  test('resposta malformada da Open-Meteo também vira erro com cache curto', async () => {
    const source = fakeSource({ marine: { error: true, reason: 'Invalid cell selection' } });
    const response = await createSceneWeatherHandler({ fetchJson: source.fetchJson, now: () => FETCHED_AT })();

    expect(response.status).toBe(502);
    expect(response.headers.get('cache-control')).toContain('s-maxage=60');
  });
});

test.describe('o contrato lido pelo navegador', () => {
  const weather = {
    sunrise: '2026-11-12T04:57:00-03:00',
    sunset: '2026-11-12T17:38:00-03:00',
    cloudCover: 6,
    precipitation: 2,
    windSpeed: 6.25,
    waveHeight: 1.34,
    fetchedAt: '2026-11-12T19:15:30.000Z'
  };

  test('aceita o que a rota devolve, inclusive sem altura de onda', () => {
    const result = normalizeOpenMeteo(FORECAST, MARINE, FETCHED_AT);
    expect(result.ok && isSceneWeather(result.weather)).toBe(true);
    expect(isSceneWeather(weather)).toBe(true);
    expect(isSceneWeather({ ...weather, waveHeight: null })).toBe(true);
  });

  const invalid: [string, unknown][] = [
    ['nulo', null],
    ['a resposta de erro da rota', { error: 'clima indisponível' }],
    ['lista', [weather]],
    ['nuvens como texto', { ...weather, cloudCover: '6' }],
    ['chuva infinita', { ...weather, precipitation: Infinity }],
    ['sem vento', { ...weather, windSpeed: undefined }],
    ['nascer do sol como número', { ...weather, sunrise: 5 }],
    ['onda como texto', { ...weather, waveHeight: 'alta' }]
  ];
  for (const [name, value] of invalid) {
    test(`recusa o que não é o contrato: ${name}`, () => {
      expect(isSceneWeather(value)).toBe(false);
    });
  }
});
