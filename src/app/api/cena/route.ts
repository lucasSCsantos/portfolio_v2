import { createSceneWeatherHandler } from '@/app/lib/scene-weather';

// Sem isto o Next pré-renderiza a rota no build e congela o clima daquele momento.
export const dynamic = 'force-dynamic';

const TIMEOUT_MS = 5000;

async function fetchJson(url: string) {
  // O cache é o do handler (20 min no sucesso, 1 min na falha), não o do `fetch` do Next.
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`${new URL(url).host} respondeu ${response.status}`);
  return response.json();
}

export const GET = createSceneWeatherHandler({ fetchJson, now: () => new Date() });
