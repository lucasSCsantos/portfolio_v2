import { BRANCH_CORAL, FAN_CORAL } from '../../Work/Corals';
import { Coral, ReefBand } from './styles';

// Os mesmos corais do desktop, em tamanho de celular. `x` e `h` em % da faixa; `delay` desencontra o balanço.
const CORALS = [
  { d: FAN_CORAL, viewBox: '0 0 354 294', x: -4, h: 62, color: '#0063A3', delay: 0 },
  { d: BRANCH_CORAL, viewBox: '0 0 758 658', x: 22, h: 100, color: '#298DBC', delay: -1.6 },
  { d: FAN_CORAL, viewBox: '0 0 354 294', x: 58, h: 48, color: '#5FA9CF', delay: -0.8, flip: true },
  { d: BRANCH_CORAL, viewBox: '0 0 758 658', x: 76, h: 74, color: '#0063A3', delay: -2.4 }
];

/** Os corais no pé da Tela de Habilidades, balançando devagar com a água. */
export default function Reef() {
  return (
    <ReefBand data-corais aria-hidden>
      {CORALS.map(({ d, viewBox, x, h, color, delay, flip }) => (
        <Coral
          key={`${x}`}
          viewBox={viewBox}
          $x={x}
          $h={h}
          $flip={flip}
          style={{ color, animationDelay: `${delay}s` }}
        >
          <path d={d} fill="currentColor" fillRule="evenodd" />
        </Coral>
      ))}
    </ReefBand>
  );
}
