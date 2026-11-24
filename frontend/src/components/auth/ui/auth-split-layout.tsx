'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { InteractivePenguin } from './interactive-penguin';
import type { AuthSplitLayoutProps } from './auth-types';

export function AuthSplitLayout({
  children,
  penguinState = 'idle',
  locale = 'vi',
  onLanguageToggle,
}: AuthSplitLayoutProps) {
  return (
    <main className="relative flex min-h-screen w-full flex-col lg:flex-row bg-[#F8FBFF] overflow-x-hidden">
      {/* LEFT PANEL: Authentication Form (45% on lg) */}
      <section
        aria-label="Khu vực đăng nhập và đăng ký"
        className="flex w-full flex-col justify-between px-6 py-8 sm:px-10 md:px-14 lg:w-[45%] lg:min-h-screen lg:px-16 lg:py-12 z-10 bg-white shadow-xl shadow-slate-200/40"
      >
        {/* Top bar inside Left Panel: Brand Logo + Compact Language Switcher */}
        <div className="flex items-center justify-between w-full mb-8">
          <Logo href={`/${locale}`} size="md" />

          {/* Compact language switcher */}
          {onLanguageToggle && (
            <button
              type="button"
              onClick={onLanguageToggle}
              aria-label="Chuyển đổi ngôn ngữ / Switch Language"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D8E9F8] bg-[#F8FBFF] px-3 py-1.5 text-xs font-semibold font-heading text-[#1B2A38] hover:bg-[#EAF4FC] hover:border-[#0EA5E9]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9]"
            >
              <Globe className="h-3.5 w-3.5 text-[#0EA5E9]" />
              <span className="uppercase">{locale === 'vi' ? 'EN' : 'VI'}</span>
            </button>
          )}
        </div>

        {/* Center Container for Auth Form */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          {children}
        </div>

        {/* Bottom micro-footer inside Left Panel */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} TyPusEnglish. Nền tảng giáo dục song ngữ toàn diện.</p>
        </div>
      </section>

      {/* RIGHT PANEL: Interactive Penguin Mascot Experience (55% on lg) */}
      <section
        aria-label="Trải nghiệm biểu tượng chim cánh cụt tương tác"
        className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#EAF4FC] via-[#F1F7FD] to-[#D8E9F8] px-6 py-12 lg:w-[55%] lg:min-h-screen lg:px-12"
      >
        {/* Subtle Decorative Arctic Background Glow & Rings */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#0EA5E9]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-[#FF7A00]/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#0EA5E9_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

        {/* Interactive Penguin Mascot with State Sync */}
        <div className="w-full max-w-lg z-10">
          <InteractivePenguin state={penguinState} showDecorations={true} />
        </div>
      </section>
    </main>
  );
}
