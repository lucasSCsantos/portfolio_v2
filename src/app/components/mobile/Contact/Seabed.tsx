import theme from '@/app/styles/theme';
import {
  ANCHOR_VIEWBOX,
  AnchorDrawing,
  BRANCH,
  FAN,
  KELP,
  STARFISH_VIEWBOX,
  StarfishDrawing
} from '../../Contact/SeabedLife';
import { Hill, Piece, SeabedBand } from './styles';

// As plantas do fundo do mar do desktop, em tamanho de celular. `x` em % da faixa; `h` e `bottom` em
// px. O pé fica atrás da colina do meio (z 2), que nasce a uns 36px do fim da faixa.
const GROWTHS = [
  { shape: KELP, x: 7, h: 120, color: '#0063A3', delay: 0 },
  { shape: BRANCH, x: 27, h: 104, color: '#298DBC', delay: -1.4 },
  { shape: KELP, x: 47, h: 92, color: '#5FA9CF', delay: -2.6, flip: true },
  { shape: FAN, x: 73, h: 84, bottom: 32, color: '#298DBC', delay: -0.7 },
  { shape: KELP, x: 92, h: 128, color: '#0063A3', delay: -3.3, flip: true }
];

/** A vida no fundo do mar no pé da Tela de Contato: algas e corais balançando, a âncora e a estrela-do-mar. */
export default function Seabed() {
  return (
    <SeabedBand data-fundo-do-mar aria-hidden>
      <Hill $z={0} viewBox="0 0 400 140" preserveAspectRatio="none">
        <path d="M0 70C60 50 120 80 200 66S330 40 400 60V140H0Z" fill="#0a3a66" />
      </Hill>
      {GROWTHS.map(({ shape, x, h, color, delay, flip, bottom = 44 }) => (
        <Piece
          key={x}
          viewBox={shape.viewBox}
          $x={x}
          $h={h}
          $ratio={shape.ratio}
          $baseX={shape.baseX}
          $bottom={bottom}
          $z={1}
          $flip={flip}
          $sway
          style={{ color, animationDelay: `${delay}s` }}
        >
          {shape.paths.map(d => (
            <path key={d} d={d} fill="currentColor" fillRule="evenodd" />
          ))}
        </Piece>
      ))}
      <Piece
        viewBox={ANCHOR_VIEWBOX}
        $x={60}
        $h={270}
        $ratio={100 / 120}
        $baseX={0.5}
        $bottom={14}
        $z={1}
        $rotate={12}
        style={{ color: theme.colors.background, opacity: 0.22 }}
      >
        <AnchorDrawing />
      </Piece>
      <Hill $z={2} viewBox="0 0 400 140" preserveAspectRatio="none">
        <path d="M0 100C80 84 150 104 230 92S340 78 400 90V140H0Z" fill="#0063A3" />
      </Hill>
      <Hill $z={3} viewBox="0 0 400 140" preserveAspectRatio="none">
        <path d="M0 118C90 108 170 122 260 114S360 106 400 112V140H0Z" fill={theme.colors.background} />
      </Hill>
      <Piece
        viewBox={STARFISH_VIEWBOX}
        $x={33}
        $h={16}
        $ratio={1}
        $baseX={0.5}
        $bottom={6}
        $z={4}
        $rotate={18}
        style={{ color: '#d9826a' }}
      >
        <StarfishDrawing />
      </Piece>
    </SeabedBand>
  );
}
