'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/logo';
import { Globe, LogIn } from 'lucide-react';

export function HomeNavbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi';
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  };

  const loginLabel = locale === 'en' ? 'Sign In' : 'Đăng nhập';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#D8E9F8] bg-white/85 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Logo href={`/${locale}`} size="md" />
        </div>

        {/* Right: Language Switcher + Đăng Nhập (Sign In) Button */}
        <div className="flex items-center gap-3">
          {/* Language Switch */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-[#D8E9F8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1B2A38] hover:bg-[#EAF4FC] hover:border-[#0EA5E9]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9]"
            title="Đổi ngôn ngữ / Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span className="uppercase font-heading">{locale === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          {/* Đăng nhập button -> links to /[locale]/preview/auth */}
          <Link
            href={`/${locale}/preview/auth`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FF7A00] hover:bg-[#E56E00] text-white px-5 py-2 text-xs font-bold font-heading shadow-md shadow-[#FF7A00]/25 transition-all hover:scale-105 active:scale-95"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>{loginLabel}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
