import { Poppins } from 'next/font/google';
import { Inter } from 'next/font/google';

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins'
});

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
