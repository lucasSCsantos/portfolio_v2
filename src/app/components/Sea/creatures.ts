// Os desenhos da Vida marinha: silhuetas em SVG, todas olhando para a direita. Módulo puro.

/** Movimento próprio de uma parte: balanço (graus, para os dois lados) ou aperto num eixo (até a fração dada). */
export type PartMotion = {
  kind: 'sway' | 'squashX' | 'squashY';
  /** Ponto fixo do movimento, nas coordenadas do desenho. */
  origin: [number, number];
  amount: number;
  /** Duração de uma ida, em segundos. */
  seconds: number;
  delay?: number;
};

export type Part = {
  d: string;
  /** Traço (px do desenho) em vez de preenchimento: tentáculos e antenas. */
  stroke?: number;
  /** Parte que brilha no escuro, na cor de brilho do animal. */
  glow?: boolean;
  /** Transformação SVG fixa da parte (posição de cada peixe num cardume). */
  move?: string;
  motion?: PartMotion;
};

export type Shape = { width: number; height: number; parts: Part[] };

const dot = (x: number, y: number, r: number) =>
  `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`;

// Um peixe pequeno (60×30), a peça dos cardumes: a cauda abana apertando para o lado.
const FISH_BODY = `M58 15C50 4 30 3 14 13L14 17C30 27 50 26 58 15Z${dot(47, 13, 1.7)}`;
const FISH_TAIL = 'M18 15L2 3C5 11 5 19 2 27Z';

function school(spots: [x: number, y: number, scale: number][], glow = false): Part[] {
  return spots.flatMap(([x, y, scale], i): Part[] => {
    const move = `translate(${x} ${y}) scale(${scale})`;
    return [
      {
        d: FISH_TAIL,
        move,
        motion: { kind: 'squashX', origin: [18, 15], amount: 0.55, seconds: 0.32 + (i % 3) * 0.05, delay: -i * 0.13 }
      },
      { d: FISH_BODY, move },
      ...(glow ? [{ d: dot(34, 19, 2.6), move, glow: true }, { d: dot(24, 17, 1.8), move, glow: true }] : [])
    ];
  });
}

const DRAWINGS = {
  school: {
    width: 300,
    height: 150,
    parts: school([
      [228, 56, 1],
      [176, 22, 0.9],
      [168, 84, 1.05],
      [118, 50, 0.95],
      [112, 112, 0.85],
      [62, 16, 0.8],
      [58, 78, 1],
      [8, 44, 0.9],
      [4, 104, 0.8]
    ])
  },

  lanternfish: {
    width: 240,
    height: 120,
    parts: school(
      [
        [176, 44, 1],
        [120, 12, 0.85],
        [112, 76, 0.95],
        [56, 38, 0.9],
        [4, 70, 0.8]
      ],
      true
    )
  },

  angelfish: {
    width: 90,
    height: 100,
    parts: [
      {
        d: 'M26 50L4 30C9 43 9 57 4 70Z',
        motion: { kind: 'squashX', origin: [26, 50], amount: 0.6, seconds: 0.45 }
      },
      // Corpo alto, com as nadadeiras de cima e de baixo puxadas para trás.
      {
        d: `M88 50C82 34 68 24 54 22C48 10 36 2 22 0C30 10 32 20 30 30C24 36 20 44 20 50C20 56 24 64 30 70C32 80 30 90 22 100C36 98 48 90 54 78C68 76 82 66 88 50Z${dot(74, 44, 2.6)}`
      }
    ]
  },

  turtle: {
    width: 200,
    height: 130,
    parts: [
      // Nadadeiras do lado de lá, depois o casco, depois as de cá.
      {
        d: 'M128 40C146 22 142 6 120 2C126 14 120 26 112 36Z',
        motion: { kind: 'sway', origin: [122, 38], amount: 14, seconds: 1.5, delay: -0.7 }
      },
      {
        d: 'M50 52C36 42 22 40 10 44C20 52 30 58 44 62Z',
        motion: { kind: 'sway', origin: [48, 56], amount: 8, seconds: 1.5 }
      },
      {
        d: `M38 66C38 40 70 28 106 30C138 32 160 46 162 62C176 52 194 54 198 64C200 74 186 82 164 76C156 92 132 102 104 102C68 102 38 92 38 66Z${dot(186, 63, 2.2)}`
      },
      {
        d: 'M132 86C150 104 146 124 118 130C126 116 122 100 114 90Z',
        motion: { kind: 'sway', origin: [124, 88], amount: 16, seconds: 1.5 }
      },
      {
        d: 'M50 82C34 94 20 98 8 94C18 86 28 80 44 74Z',
        motion: { kind: 'sway', origin: [48, 80], amount: 8, seconds: 1.5, delay: -0.7 }
      }
    ]
  },

  dolphin: {
    width: 220,
    height: 100,
    parts: [
      {
        d: 'M40 49C28 46 14 36 4 34C8 44 12 50 16 56C10 62 6 70 6 80C16 76 28 66 40 61Z',
        motion: { kind: 'sway', origin: [40, 55], amount: 9, seconds: 0.7 }
      },
      {
        d: `M216 54C206 50 198 48 190 44C176 30 150 22 124 24C120 14 112 6 100 4C104 12 102 20 98 28C76 34 52 42 34 50L36 60C60 62 90 70 120 72C124 80 126 90 120 98C132 94 142 84 146 72C165 70 185 64 198 60C206 60 212 58 216 54Z${dot(184, 50, 2.2)}`
      }
    ]
  },

  manta: {
    width: 220,
    height: 150,
    parts: [
      // A cauda fina fica parada; as asas batem apertando na vertical.
      { d: 'M92 71L2 75L92 79Z' },
      {
        d: 'M204 75C196 64 180 58 162 54C142 24 112 6 80 2C96 26 96 48 86 64L86 86C96 102 96 124 80 148C112 144 142 126 162 96C180 92 196 86 204 75ZM200 66C206 60 212 60 218 62C212 66 208 68 204 71ZM200 84C206 90 212 90 218 88C212 84 208 82 204 79Z',
        motion: { kind: 'squashY', origin: [130, 75], amount: 0.72, seconds: 1.6 }
      }
    ]
  },

  jellyfish: {
    width: 80,
    height: 122,
    parts: [
      ...[
        'M18 40C14 60 24 74 18 92C14 104 20 110 18 118',
        'M32 40C36 62 26 78 32 98C34 106 30 110 32 114',
        'M48 40C44 60 54 80 48 100C46 108 50 114 48 120',
        'M62 40C66 58 56 74 62 90C66 100 60 108 62 114'
      ].map(
        (d, i): Part => ({
          d,
          stroke: 3,
          motion: { kind: 'sway', origin: [40, 40], amount: 5, seconds: 1.4, delay: -i * 0.35 }
        })
      ),
      {
        d: 'M6 42C6 14 24 2 40 2C56 2 74 14 74 42C66 37 58 45 50 41C44 37 36 37 30 41C22 45 14 37 6 42Z',
        motion: { kind: 'squashX', origin: [40, 42], amount: 0.84, seconds: 1.4 }
      }
    ]
  },

  shark: {
    width: 260,
    height: 110,
    parts: [
      {
        d: 'M58 51C46 40 34 20 22 4C20 24 24 40 30 54C26 64 20 76 14 86C28 80 44 68 58 63Z',
        motion: { kind: 'squashX', origin: [58, 57], amount: 0.6, seconds: 0.8 }
      },
      {
        d: `M256 58C240 46 215 40 185 38L172 38C168 22 160 8 146 2C150 16 146 28 138 38C110 40 80 46 52 52L52 62C70 64 85 66 100 68L96 80C106 78 114 74 118 70C135 72 150 72 165 72C160 86 150 98 138 104C158 102 178 92 190 72C215 70 240 66 256 58Z${dot(232, 53, 2.2)}`
      }
    ]
  },

  whale: {
    width: 400,
    height: 152,
    parts: [
      {
        d: 'M66 71C46 60 26 46 4 44C10 56 20 66 30 76C22 86 14 98 10 112C30 106 50 94 68 85Z',
        motion: { kind: 'sway', origin: [66, 78], amount: 7, seconds: 2.6 }
      },
      // A nadadeira comprida da jubarte.
      {
        d: 'M246 108C236 124 214 140 186 148C216 152 252 138 274 108Z',
        motion: { kind: 'sway', origin: [258, 108], amount: 6, seconds: 3.2 }
      },
      {
        d: `M396 78C385 60 350 44 300 40C250 36 200 40 160 50C152 44 146 44 140 52C110 58 80 66 56 72L60 84C100 96 150 108 200 112C250 114 300 112 340 104C366 98 386 90 396 78Z${dot(346, 80, 2.6)}`
      }
    ]
  },

  squid: {
    width: 200,
    height: 70,
    parts: [
      // Nada de costas: o manto vai na frente e os braços ficam para trás.
      ...[
        'M92 29C62 22 40 26 10 16',
        'M92 33C60 32 36 36 4 32',
        'M92 37C60 40 38 38 6 42',
        'M92 41C64 48 40 46 12 56'
      ].map(
        (d, i): Part => ({
          d,
          stroke: 4,
          motion: { kind: 'squashX', origin: [92, 35], amount: 0.8, seconds: 0.9, delay: -i * 0.1 }
        })
      ),
      {
        d: `M198 35C190 16 174 6 158 10C166 16 170 20 172 24C152 18 134 17 118 18C102 20 90 26 86 35C90 44 102 50 118 52C134 53 152 52 172 46C170 50 166 54 158 60C174 64 190 54 198 35Z${dot(100, 35, 3)}`
      }
    ]
  },

  octopus: {
    width: 140,
    height: 150,
    parts: [
      ...[
        'M48 74C30 98 10 94 6 118C4 132 16 138 22 130',
        'M58 76C50 106 38 118 44 142',
        'M70 76C70 102 66 118 72 138',
        'M82 76C90 106 102 120 96 144',
        'M92 74C112 96 132 94 134 118C136 130 124 136 120 128'
      ].map(
        (d, i): Part => ({
          d,
          stroke: 9,
          motion: { kind: 'sway', origin: [70, 74], amount: 6, seconds: 1.8, delay: -i * 0.4 }
        })
      ),
      {
        d: `M30 58C20 20 48 2 70 2C92 2 120 20 110 58C108 70 100 78 94 82L46 82C40 78 32 70 30 58Z${dot(56, 54, 4)}${dot(84, 54, 4)}`
      }
    ]
  },

  anglerfish: {
    width: 180,
    height: 140,
    parts: [
      {
        d: 'M40 86L10 62C17 78 17 96 10 112Z',
        motion: { kind: 'squashX', origin: [40, 86], amount: 0.6, seconds: 0.9 }
      },
      // A boca aberta, com os dentes em zigue-zague.
      {
        d: `M168 68C152 44 112 34 80 40C50 46 34 66 34 86C36 112 68 132 104 130C136 128 158 116 172 100L152 97L147 106L139 95L132 104L125 93L112 87L126 82L132 73L140 82L146 71L154 80Z${dot(128, 60, 4)}`
      },
      { d: 'M86 122C80 134 70 138 58 138C66 132 68 124 68 116Z' },
      {
        d: 'M108 40C108 14 136 2 158 16',
        stroke: 3,
        motion: { kind: 'sway', origin: [108, 40], amount: 5, seconds: 2 }
      },
      { d: dot(160, 19, 6.5), glow: true, motion: { kind: 'sway', origin: [108, 40], amount: 5, seconds: 2 } }
    ]
  }
} satisfies Record<string, Shape>;

export type CreatureKind = keyof typeof DRAWINGS;

export const SHAPES: Record<CreatureKind, Shape> = DRAWINGS;
