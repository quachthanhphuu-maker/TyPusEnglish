import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '@/app/globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'TyPusEnglish — Lớp Học Mở & Tự Học Tiếng Anh Song Ngữ',
  description:
    'Nền tảng giáo dục song ngữ toàn diện: Quản lý lớp học cho gia sư và giáo viên, cùng không gian tự học tiếng Anh thông minh miễn phí.',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-[#F8FBFF] text-[#1B2A38] font-body antialiased selection:bg-[#FF7A00] selection:text-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
