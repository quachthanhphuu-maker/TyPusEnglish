'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Logo } from '@/components/brand/logo';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function HomeFooter() {
  const locale = useLocale();
  const t = useTranslations('home.footer');

  return (
    <footer className="bg-[#1B2A38] text-slate-300 pt-20 pb-12 border-t border-slate-800 relative z-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Logo href={`/${locale}`} size="lg" className="[&_span]:text-white" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 border border-slate-700 px-3 py-1 text-xs text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Tiêu chuẩn bảo mật 2026</span>
            </div>
          </div>

          {/* Col 2: Teaching & Classroom Hub */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              {t('classroomCol.title')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={`/${locale}/tutor`} className="hover:text-[#FF7A00] transition-colors">
                  {t('classroomCol.link1')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tutor`} className="hover:text-[#FF7A00] transition-colors">
                  {t('classroomCol.link2')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tutor`} className="hover:text-[#FF7A00] transition-colors">
                  {t('classroomCol.link3')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/parent`} className="hover:text-[#FF7A00] transition-colors">
                  {t('classroomCol.link4')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Open English Learning Hub */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              {t('englishCol.title')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={`/${locale}/self-study`} className="hover:text-[#0EA5E9] transition-colors">
                  {t('englishCol.link1')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/self-study`} className="hover:text-[#0EA5E9] transition-colors">
                  {t('englishCol.link2')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/self-study`} className="hover:text-[#0EA5E9] transition-colors">
                  {t('englishCol.link3')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/self-study`} className="hover:text-[#0EA5E9] transition-colors">
                  {t('englishCol.link4')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Privacy & Standards */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              {t('trustCol.title')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#privacy" className="hover:text-emerald-400 transition-colors">
                  {t('trustCol.link1')}
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-emerald-400 transition-colors">
                  {t('trustCol.link2')}
                </a>
              </li>
              <li>
                <a href="#encryption" className="hover:text-emerald-400 transition-colors">
                  {t('trustCol.link3')}
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-emerald-400 transition-colors">
                  {t('trustCol.link4')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t('copyright')}</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with Arctic Penguin Precision</span>
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A00]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
