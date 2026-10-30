import { Poppins } from 'next/font/google';
import { Inter } from 'next/font/google';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins'
});

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
