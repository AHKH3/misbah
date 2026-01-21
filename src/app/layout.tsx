import type { Metadata } from 'next';
import { Inter, Amiri } from 'next/font/google';
import { I18nProvider } from '@/lib/i18n';
import { Header } from '@/components/layout';
import './globals.css';

// Typography: Inter (Latin/UI) — Section 4.1
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Typography: Amiri (Arabic) — Section 4.1
const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-amiri',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mihrab.site'),
  title: {
    default: 'مصباح — دليل معلمي القرآن والعربية',
    template: '%s | مصباح',
  },
  description:
    'دليل عام للمعلمين المستقلين المتخصصين في تعليم القرآن الكريم واللغة العربية والدراسات الإسلامية. تواصل مباشر بدون وسطاء.',
  openGraph: {
    siteName: 'مصباح',
    locale: 'ar_EG',
  },
  icons: {
    icon: [
      { url: '/logo.png', media: '(prefers-color-scheme: light)' },
      { url: '/logo-dark.png', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${amiri.variable}`}>
      <body>
        <I18nProvider>
          <Header />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}