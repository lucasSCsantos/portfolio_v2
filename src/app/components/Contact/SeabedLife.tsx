import { BRANCH_CORAL, FAN_CORAL } from '../Work/Corals';
import { Anchor, Growth, Starfish } from './styles';

// As formas também servem ao fundo do mar da Versão para celular.
export type Shape = {
  viewBox: string;
  // Largura ÷ altura do desenho e posição da base (fração da largura, a partir da esquerda).
  ratio: number;
  baseX: number;
  paths: string[];
};

export const KELP: Shape = {
  viewBox: '0 0 60 160',
  ratio: 0.375,
  baseX: 0.5,
  paths: [
    'M30 160C22 126 38 98 26 62 20 42 24 20 30 2c8 18 10 38 10 58 2 36-8 64-6 100Z',
    'M28 160C14 140 4 116 8 88 10 70 4 56 0 44c12 8 18 22 18 40 0 30 6 52 14 76Z',
    'M32 160c10-22 22-40 20-66-1-18 2-32 8-44-2 18-4 30-2 46 2 28-10 46-20 64Z'
  ]
};

// O galhudo é cortado no pé do tronco (658 de 758), como no desenho original.
export const BRANCH: Shape = {
  viewBox: '0 0 758 658',
  ratio: 758 / 658,
  baseX: 0.435,
  paths: [BRANCH_CORAL]
};

export const FAN: Shape = { viewBox: '0 0 354 294', ratio: 354 / 294, baseX: 0.56, paths: [FAN_CORAL] };

// Cada planta nasce na camada da própria cor. `base` é a altura da superfície
// naquele ponto e `h` a altura da planta, as duas em fração da altura dos corais.
// z 1 fica atrás das camadas do meio e da frente; z 2, só atrás da frente. As do
// centro ficam atrás do conteúdo da seção (z 3).
const GROWTHS = [
  // Atrás do conteúdo, na colina azul-escura do fundo.
  { shape: BRANCH, x: 38, h: 0.85, base: 0.52, color: '#0062a36e', z: 1 },
  { shape: KELP, x: 44, h: 0.45, base: 0.374, color: '#298DBC', z: 2, flip: true },
  { shape: KELP, x: 54, h: 0.8, base: 0.494, color: '#0062a35c', z: 1 },
  { shape: FAN, x: 69.5, h: 0.4, base: 0.400, color: '#298DBC', z: 3, rotate: -25 },
  // Laterais.
  { shape: KELP, x: 23, h: 0.45, base: 0.784, color: '#0063A3', z: 1 },
  { shape: KELP, x: 84, h: 0.5, base: 0.401, color: '#0063A3', z: 1, flip: true },
  { shape: KELP, x: 93, h: 0.42, base: 0.396, color: '#0063A3', z: 1 },
  { shape: KELP, x: 30, h: 0.2, base: 0.414, color: '#298DBC', z: 2, flip: true },
  { shape: KELP, x: 40, h: 0.18, base: 0.294, color: '#F2F2F2', z: 5 }
];

export const ANCHOR_VIEWBOX = '0 0 100 120';

export function AnchorDrawing() {
  return (
    <>
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <circle cx="50" cy="12" r="8" strokeWidth="5" />
        <path d="M50 20v88" strokeWidth="9" />
        <path d="M28 32h44" strokeWidth="7" />
        <path d="M14 76c4 26 22 36 36 36s32-10 36-36" strokeWidth="8" />
      </g>
      <path d="M4 84 14 64l12 18Z M96 84 86 64 74 82Z" fill="currentColor" />
    </>
  );
}

export const STARFISH_VIEWBOX = '0 0 100 100';

export function StarfishDrawing() {
  return (
    <path
      d="M50 4c5 0 8 22 12 28 4 5 30 4 32 9s-20 17-22 23 9 28 5 31-23-13-27-13-23 16-27 13 7-25 5-31S4 46 6 41s28-4 32-9S45 4 50 4Z"
      fill="currentColor"
    />
  );
}

// Vida no fundo do mar: algas e corais, uma âncora velha meio enterrada e uma estrela-do-mar.
function SeabedLife() {
  return (
    <>
      {GROWTHS.map(({ shape, x, h, base, color, z, flip, rotate }) => (
        <Growth
          key={`${x}-${color}`}
          viewBox={shape.viewBox}
          aria-hidden
          $x={x}
          $h={h}
          $base={base}
          $z={z}
          $ratio={shape.ratio}
          $baseX={shape.baseX}
          $flip={flip}
          $rotate={rotate}
          style={{ color }}
        >
          {shape.paths.map(d => (
            <path key={d} d={d} fill="currentColor" fillRule="evenodd" />
          ))}
        </Growth>
      ))}

      <Anchor viewBox={ANCHOR_VIEWBOX} aria-hidden>
        <AnchorDrawing />
      </Anchor>

      <Starfish viewBox={STARFISH_VIEWBOX} aria-hidden>
        <StarfishDrawing />
      </Starfish>
    </>
  );
}

export default SeabedLife;
