import { motionValue } from 'framer-motion';

/**
 * Intensidade do mergulho em curso (0 parado, 1 no auge da descida).
 * O mar (Sea) lê este valor para escurecer e "pressionar" a tela durante o trajeto.
 */
export const dive = motionValue(0);

/**
 * Fase do mergulho, para as peças (WaterPiece) saberem quando se formar:
 * `diving` segura as peças submersas; `arrived` as forma em sequência;
 * `released` as solta de uma vez quando o usuário interrompe.
 */
export type DiveStage = 'idle' | 'diving' | 'arrived' | 'released';
export const diveStage = motionValue<DiveStage>('idle');

let frame = 0;
let stopDive: (() => void) | undefined;

// Começa devagar, ganha velocidade na queda e amortece ao chegar, como afundar na água.
const sink = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function cancelDive(stage: DiveStage) {
  cancelAnimationFrame(frame);
  stopDive?.();
  stopDive = undefined;
  dive.set(0);
  if (diveStage.get() === 'diving') diveStage.set(stage);
}

/**
 * Rola até a seção como um mergulho: duração proporcional à distância e
 * curva de afundar. Para quem pediu "reduzir movimento", pula direto.
 */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  cancelDive('released');

  const from = window.scrollY;
  // Medido de novo a cada quadro: seções que crescem ao carregar não deixam o mergulho parar antes.
  const destination = () =>
    Math.max(
      0,
      Math.min(
        window.scrollY + target.getBoundingClientRect().top,
        document.documentElement.scrollHeight - window.innerHeight
      )
    );
  const distance = destination() - from;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || Math.abs(distance) < 4) {
    window.scrollTo({ top: from + distance, behavior: 'instant' });
    return;
  }

  const duration = Math.min(2600, Math.max(900, 700 + Math.abs(distance) * 0.45));

  // O usuário assume o controle assim que mexer na página.
  const interrupt = () => cancelDive('released');
  const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
  events.forEach(e =>
    window.addEventListener(e, interrupt, { passive: true, once: true })
  );
  stopDive = () =>
    events.forEach(e => window.removeEventListener(e, interrupt));

  diveStage.set('diving');
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo({ top: from + (destination() - from) * sink(t), behavior: 'instant' });
    dive.set(Math.sin(Math.PI * t));

    if (t < 1) {
      frame = requestAnimationFrame(step);
    } else {
      cancelDive('arrived');
    }
  };
  frame = requestAnimationFrame(step);
}
