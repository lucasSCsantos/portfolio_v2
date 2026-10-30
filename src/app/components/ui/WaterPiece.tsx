'use client';

import { ComponentType, ElementType, ReactNode, useId, useRef } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform
} from 'framer-motion';
import useFloat from './useFloat';

// Fração da viewport em que a peça termina de se formar / começa a se desfazer.
const FORMED_AT = 0.88;
const FADING_AT = 0.1;
// Quanto cada posição na fila atrasa a formação (peças seguintes se formam depois).
const STAGGER = 0.02;
const MAX_STAGGER_STEPS = 5;

const ENTER_DEPTH = 130;
const EXIT_DEPTH = 90;
const DRIFT = 90;
const SWAY = 10;
const MAX_DISTORTION = 28;
const MAX_BLUR = 8;
// Fração do deslocamento da peça quando `solid`.
const SOLID_REACH = 0.35;

type Origin = 'left' | 'right' | 'auto';

type WaterPieceOwnProps = {
  /** Posição na fila de formação da seção: quanto maior, mais tarde se forma. */
  order?: number;
  /** De que lado a peça vem ao se juntar. `auto` alterna pela ordem. */
  from?: Origin;
  /** Desliga o filtro de ondulação (só desfoque), para peças pequenas e numerosas. */
  calm?: boolean;
  /** Para fora d'água: sem desfoque, ondulação, balanço ou escala; só desliza e aparece. */
  solid?: boolean;
  /** Flutua em repouso (amplitude vertical em px), como vidro sobre a água. */
  float?: number;
  children?: ReactNode;
};

// Props da base (`as`) passam adiante; tipá-las aqui exigiria genéricos sobre styled-components.
type WaterPieceProps = WaterPieceOwnProps & {
  as?: ElementType;
  style?: object;
  [prop: string]: unknown;
};

// motion(Component) cria um componente novo a cada chamada: guarda um por base.
type AnyProps = Record<string, unknown>;

const motionComponents = new WeakMap<object, ComponentType<AnyProps>>();

function motionOf(base: ElementType): ComponentType<AnyProps> {
  if (typeof base === 'string') {
    return motion[base as 'div'] as unknown as ComponentType<AnyProps>;
  }
  let wrapped = motionComponents.get(base);
  if (!wrapped) {
    wrapped = motion(base as never) as unknown as ComponentType<AnyProps>;
    motionComponents.set(base, wrapped);
  }
  return wrapped;
}

/**
 * Elemento que se forma "debaixo da água" ao entrar na viewport e se dissolve
 * ao sair. Cada peça tem seu próprio tempo e sua própria direção, então os
 * elementos de uma seção se juntam em vez de aparecerem como um bloco só. O
 * fundo rola 1:1 com a página, o que dá o parallax em relação às peças.
 */
function WaterPiece({
  as,
  order = 0,
  from = 'auto',
  calm = false,
  solid = false,
  float = 0,
  style,
  ...rest
}: WaterPieceProps) {
  const Component = motionOf(as ?? 'div');
  const ref = useRef<HTMLElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const filterId = `water-${useId().replace(/:/g, '')}`;
  const reducedMotion = useReducedMotion();

  const step = Math.min(order, MAX_STAGGER_STEPS);
  const formedAt = FORMED_AT - step * STAGGER;
  const side = from === 'auto' ? (order % 2 === 0 ? 'left' : 'right') : from;
  const reach = solid ? SOLID_REACH : 1;
  const drift = (side === 'left' ? -1 : 1) * (DRIFT - (step % 3) * 20) * reach;
  const depth = (ENTER_DEPTH + (step % 3) * 30) * reach;

  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ['start end', `start ${formedAt}`]
  });
  const { scrollYProgress: exit } = useScroll({
    target: ref,
    offset: [`end ${FADING_AT}`, 'end start']
  });

  // 1 = totalmente visível, 0 = totalmente submersa.
  const clarity = useTransform([enter, exit], ([e, o]: number[]) =>
    Math.min(e, 1 - o)
  );
  const distortion = useTransform(clarity, c => (1 - c) * MAX_DISTORTION);

  const opacity = useTransform(
    clarity,
    solid ? [0, 1] : [0, 0.6, 1],
    solid ? [0, 1] : [0, 0.8, 1]
  );
  const { floatX, floatY, floatRotate } = useFloat(ref, float);
  const y = useTransform(
    [enter, exit, floatY],
    ([e, o, f]: number[]) => Math.round((1 - e) * depth - o * EXIT_DEPTH) + f
  );
  // Vem de lado e se acalma num balanço conforme se encaixa; ao sair, deriva para o lado oposto.
  const x = useTransform(
    [enter, exit, floatX],
    ([e, o, f]: number[]) =>
      Math.round(
        (1 - e) * drift +
          (solid ? 0 : Math.sin((1 - e) * Math.PI * 3) * SWAY * (1 - e)) -
          o * drift * 0.5
      ) + f
  );
  const scale = useTransform(clarity, [0, 1], [solid ? 1 : 0.94, 1]);
  const filter = useTransform(clarity, c => {
    if (solid || c >= 0.995) return 'none';
    const blur = `blur(${((1 - c) * MAX_BLUR).toFixed(1)}px)`;
    return calm ? blur : `url(#${filterId}) ${blur}`;
  });

  useMotionValueEvent(distortion, 'change', d =>
    displacementRef.current?.setAttribute('scale', d.toFixed(1))
  );

  if (reducedMotion) {
    return <Component ref={ref} style={style} {...rest} />;
  }

  const motionStyle = {
    ...style,
    opacity,
    x,
    y,
    scale,
    filter,
    rotate: floatRotate,
    // Os botões têm `transition: all` no CSS, que atrasaria o movimento a cada frame.
    transitionProperty: 'background-color, color, border-color, box-shadow'
  };

  // Sem o filtro svg, os filhos seguem direto em props (next/image é um elemento void).
  if (calm || solid)
    return <Component ref={ref} style={motionStyle} {...rest} />;

  const { children, ...props } = rest as { children?: ReactNode };

  return (
    <Component ref={ref} style={motionStyle} {...props}>
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <filter
          id={filterId}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.02"
            numOctaves={1}
            seed={3 + step}
            result="noise"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale={MAX_DISTORTION}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      {children}
    </Component>
  );
}

export default WaterPiece;
