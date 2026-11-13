// O clima e o mar de Salvador para o modo `ao vivo` (ADR 0002). O navegador só conhece
// `SceneWeather`; o formato da Open-Meteo fica preso aqui.

export type SceneWeather = {
  sunrise: string; // ISO, com o fuso de Salvador
  sunset: string;
  cloudCover: number; // 0..100
  precipitation: number; // mm/h
  windSpeed: number; // m/s
  waveHeight: number | null; // metros; null quando o ponto da costa não tem dado
  fetchedAt: string; // ISO, instante em que os dados foram obtidos
};

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

// O navegador confere o que recebe da rota: qualquer coisa fora do contrato vale como clima indisponível.
export function isSceneWeather(value: unknown): value is SceneWeather {
  if (!isRecord(value)) return false;
  return (
    typeof value.sunrise === 'string' &&
    typeof value.sunset === 'string' &&
    typeof value.fetchedAt === 'string' &&
    isFiniteNumber(value.cloudCover) &&
    isFiniteNumber(value.precipitation) &&
    isFiniteNumber(value.windSpeed) &&
    (value.waveHeight === null || isFiniteNumber(value.waveHeight))
  );
}

export type NormalizeResult = { ok: true; weather: SceneWeather } | { ok: false; reason: string };

const SALVADOR = { latitude: '-12.97', longitude: '-38.5' };
const TIMEZONE = 'America/Bahia';

const FORECAST_URL =
  'https://api.open-meteo.com/v1/forecast?' +
  new URLSearchParams({
    ...SALVADOR,
    current: 'cloud_cover,precipitation,wind_speed_10m',
    daily: 'sunrise,sunset',
    timezone: TIMEZONE,
    forecast_days: '1'
  });

// `cell_selection=sea`: a célula de mar mais próxima, não a de terra onde fica a cidade.
const MARINE_URL =
  'https://marine-api.open-meteo.com/v1/marine?' +
  new URLSearchParams({ ...SALVADOR, current: 'wave_height', cell_selection: 'sea', timezone: TIMEZONE });

const TO_METERS_PER_SECOND: Record<string, number> = { 'km/h': 1 / 3.6, 'm/s': 1 };
const LOCAL_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

class Malformed extends Error {}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function requireRecord(value: unknown, name: string) {
  if (!isRecord(value)) throw new Malformed(`${name} ausente`);
  return value;
}

function requireFinite(value: unknown, name: string) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Malformed(`${name} inválido`);
  return value;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number) => Math.round(value * 100) / 100;

// A Open-Meteo devolve a hora local sem offset ("2026-11-12T04:57"); o contrato leva o offset.
function salvadorInstant(daily: Record<string, unknown>, key: string, offsetSeconds: number) {
  const values = daily[key];
  const local = Array.isArray(values) ? values[0] : undefined;
  if (typeof local !== 'string' || !LOCAL_TIME.test(local)) throw new Malformed(`${key} inválido`);
  const offsetMinutes = Math.abs(offsetSeconds) / 60;
  const sign = offsetSeconds < 0 ? '-' : '+';
  const hh = String(Math.floor(offsetMinutes / 60)).padStart(2, '0');
  const mm = String(offsetMinutes % 60).padStart(2, '0');
  return `${local}:00${sign}${hh}:${mm}`;
}

// Respostas da Forecast e da Marine API → contrato da Cena. Pura: o instante da obtenção entra como argumento.
export function normalizeOpenMeteo(forecast: unknown, marine: unknown, fetchedAt: Date): NormalizeResult {
  try {
    const forecastBody = requireRecord(forecast, 'previsão');
    const offset = requireFinite(forecastBody.utc_offset_seconds, 'fuso');
    const current = requireRecord(forecastBody.current, 'condições atuais');
    const units = requireRecord(forecastBody.current_units, 'unidades');
    const daily = requireRecord(forecastBody.daily, 'dados do dia');

    const windFactor = TO_METERS_PER_SECOND[String(units.wind_speed_10m)];
    if (windFactor === undefined) throw new Malformed('unidade do vento desconhecida');
    if (units.precipitation !== 'mm') throw new Malformed('unidade da chuva desconhecida');
    // A chuva "atual" é a soma do intervalo anterior (15 min); o contrato é por hora.
    const interval = requireFinite(current.interval, 'intervalo');
    if (interval <= 0) throw new Malformed('intervalo inválido');

    const marineBody = requireRecord(marine, 'mar');
    const wave = requireRecord(marineBody.current, 'mar atual').wave_height;
    if (wave != null && requireRecord(marineBody.current_units, 'unidades do mar').wave_height !== 'm')
      throw new Malformed('unidade da onda desconhecida');

    return {
      ok: true,
      weather: {
        sunrise: salvadorInstant(daily, 'sunrise', offset),
        sunset: salvadorInstant(daily, 'sunset', offset),
        cloudCover: clamp(requireFinite(current.cloud_cover, 'nuvens'), 0, 100),
        precipitation: round(Math.max(0, requireFinite(current.precipitation, 'chuva') * (3600 / interval))),
        windSpeed: round(Math.max(0, requireFinite(current.wind_speed_10m, 'vento') * windFactor)),
        waveHeight: wave == null ? null : Math.max(0, requireFinite(wave, 'onda')),
        fetchedAt: fetchedAt.toISOString()
      }
    };
  } catch (error) {
    if (error instanceof Malformed) return { ok: false, reason: error.message };
    throw error;
  }
}

const FRESH_MS = 20 * 60_000;
const FAILURE_MS = 60_000;

type HandlerDeps = { fetchJson: (url: string) => Promise<unknown>; now: () => Date };
type CachedResponse = { body: string; status: number; until: number };

// O corpo de `GET /api/cena`, com as dependências externas injetadas. Guarda a última resposta
// (sucesso por 20 min, falha por 1 min) para todos os visitantes da instância, e diz o mesmo à CDN.
export function createSceneWeatherHandler({ fetchJson, now }: HandlerDeps) {
  let cached: CachedResponse | undefined;
  // Visitantes que chegam enquanto a Open-Meteo responde esperam a mesma ida, em vez de abrir outra.
  let pending: Promise<CachedResponse> | undefined;

  async function load(): Promise<CachedResponse> {
    try {
      const [forecast, marine] = await Promise.all([fetchJson(FORECAST_URL), fetchJson(MARINE_URL)]);
      const fetchedAt = now();
      const result = normalizeOpenMeteo(forecast, marine, fetchedAt);
      if (result.ok)
        return { body: JSON.stringify(result.weather), status: 200, until: fetchedAt.getTime() + FRESH_MS };
      console.error(`[api/cena] resposta inesperada da Open-Meteo: ${result.reason}`);
    } catch (error) {
      console.error(`[api/cena] falha ao buscar a Open-Meteo: ${error instanceof Error ? error.message : error}`);
    }
    return { body: JSON.stringify({ error: 'clima indisponível' }), status: 502, until: now().getTime() + FAILURE_MS };
  }

  return async function handler() {
    if (!cached || now().getTime() >= cached.until) {
      pending ??= load().finally(() => (pending = undefined));
      cached = await pending;
    }
    // A CDN guarda só o que resta da validade, para o dado nunca envelhecer além dos 20 min.
    const seconds = Math.max(1, Math.ceil((cached.until - now().getTime()) / 1000));
    return new Response(cached.body, {
      status: cached.status,
      headers: {
        'content-type': 'application/json',
        'cache-control': `public, max-age=0, s-maxage=${seconds}`
      }
    });
  };
}
