import Document from '../lib/document';
import { homeMetadata } from '../lib/seo';

export const metadata = homeMetadata('pt');

export default function PtLayout({ children }: React.PropsWithChildren) {
  return <Document locale="pt">{children}</Document>;
}
