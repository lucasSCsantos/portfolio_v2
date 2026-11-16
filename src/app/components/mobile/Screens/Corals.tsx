import { BRANCH_CORAL, FAN_CORAL } from '../../Work/Corals';
import { Coral, Reef } from './styles';

// Os corais do desktop, com o galhudo cortado no pé do tronco (658 de 758), como no desenho original.
const BRANCH = { viewBox: '0 0 758 658', ratio: 758 / 658, d: BRANCH_CORAL };
const FAN = { viewBox: '0 0 354 294', ratio: 354 / 294, d: FAN_CORAL };

// Da esquerda para a direita: `x` é o centro (em % da largura), `h` a altura (px) e `delay`
// desencontra o balanço de cada um.
const GROWTHS = [
  { shape: FAN, x: 8, h: 56, color: '#0063A3', delay: 0 },
  { shape: BRANCH, x: 24, h: 96, color: '#298DBC', delay: -1.6 },
  { shape: FAN, x: 46, h: 44, color: '#F2F2F2', delay: -0.8 },
  { shape: BRANCH, x: 70, h: 72, color: '#0063A3', delay: -2.4, flip: true },
  { shape: FAN, x: 90, h: 64, color: '#298DBC', delay: -1.2, flip: true }
];

/** Corais no pé de uma Tela, balançando devagar; parados com movimento reduzido. */
export default function Corals() {
  return (
    <Reef data-corais aria-hidden>
      {GROWTHS.map(({ shape, x, h, color, delay, flip }) => (
        <Coral
          key={x}
          viewBox={shape.viewBox}
          $x={x}
          $h={h}
          $ratio={shape.ratio}
          $flip={flip}
          style={{ color, animationDelay: `${delay}s` }}
        >
          <path d={shape.d} fill="currentColor" fillRule="evenodd" />
        </Coral>
      ))}
    </Reef>
  );
}
