import type { Metadata } from 'next';
import { Noto_Sans_KR, Outfit } from 'next/font/google';
import { Providers } from '@/providers';
import '@/styles/globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'QMS - Quality Management System',
  description: '자동차 부품 제조사를 위한 품질경영시스템',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.variable} ${outfit.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
