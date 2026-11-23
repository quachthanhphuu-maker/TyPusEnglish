'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/logo';
import { Globe, ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HomeNavbar() {
  const locale = useLocale();
  const t = useTranslations('home.navbar');
  const pathname = usePathname();
  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'home', label: t('home'), href: `/${locale}` },
    { id: 'classroom', label: t('classroom'), href: `/${locale}/tutor` },
    { id: 'englishHub', label: t('englishHub'), href: `/${locale}/self-study` },
    { id: 'aiLab', label: t('aiLab'), href: `/${locale}#ai-lab` },
    { id: 'pricing', label: t('pricing'), href: `/${locale}#pricing` },
  ];

  const toggleLanguage = () => {
    const nextLocale = locale === 'vi' ? 'en' : 'vi';
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#D8E9F8] bg-white/85 backdrop-blur-xl transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Logo href={`/${locale}`} size="md" />
        </div>

        {/* Center: Owly-inspired Pill Navigation (Desktop) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center rounded-full border border-[#D8E9F8] bg-[#F8FBFF]/90 p-1.5 shadow-sm"
        >
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-xs font-semibold font-heading transition-all duration-200',
                  isActive
                    ? 'bg-white text-[#1B2A38] shadow-sm'
                    : 'text-slate-500 hover:text-[#1B2A38]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Language switch + Glowing Penguin Orange CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-full border border-[#D8E9F8] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1B2A38] hover:bg-[#EAF4FC] hover:border-[#0EA5E9]/50 transition-colors"
            title="Đổi ngôn ngữ / Switch Language"
          >
            <Globe className="h-3.5 w-3.5 text-[#0EA5E9]" />
            <span>{t('switchLang')}</span>
          </button>

          <Link
            href={`/${locale}/tutor`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FF7A00] hover:bg-[#E56E00] text-white px-5 py-2 text-xs font-bold font-heading shadow-md shadow-[#FF7A00]/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>{t('cta')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center rounded-full border border-[#D8E9F8] bg-white p-2 text-xs font-medium text-[#1B2A38]"
          >
            <Globe className="h-4 w-4 text-[#0EA5E9]" />
          </button>

          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#1B2A38] hover:bg-[#EAF4FC] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#D8E9F8] bg-white/98 px-6 pb-6 pt-3 backdrop-blur-2xl md:hidden animate-in slide-in-from-top-2">
          <div className="space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  'block rounded-xl px-4 py-2.5 text-sm font-semibold font-heading transition-colors',
                  activeTab === item.id
                    ? 'bg-[#EAF4FC] text-[#1B2A38]'
                    : 'text-slate-600 hover:bg-[#F8FBFF]'
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href={`/${locale}/tutor`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-full bg-[#FF7A00] hover:bg-[#E56E00] text-white py-3 text-sm font-bold font-heading shadow-md"
              >
                <span>{t('cta')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
