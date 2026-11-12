import Document from '../../lib/document';
import { homeMetadata } from '../../lib/seo';

export const metadata = homeMetadata('en');

export default function EnLayout({ children }: React.PropsWithChildren) {
  return <Document locale="en">{children}</Document>;
}
