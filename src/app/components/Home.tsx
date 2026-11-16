import { headers } from 'next/headers';
import { versionFor } from '../lib/version';
import DesktopHome from './DesktopHome';
import MobileHome from './mobile';

// A mesma URL nas duas versões: o servidor escolhe pelo aparelho, a cada requisição (ADR 0004).
export default function Home() {
  return versionFor(headers().get('user-agent')) === 'celular' ? (
    <MobileHome />
  ) : (
    <DesktopHome />
  );
}
