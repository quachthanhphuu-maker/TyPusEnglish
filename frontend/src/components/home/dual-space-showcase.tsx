'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { FEATURE_SPACES } from '@/data/home-experience';
import { Check, ArrowRight, GraduationCap, Flame, Sparkles } from 'lucide-react';

export function DualSpaceShowcase() {
  const locale = useLocale();
  const t = useTranslations('home.spaces');

  const classroom = FEATURE_SPACES.find((s) => s.id === 'classroom')!;
  const english = FEATURE_SPACES.find((s) => s.id === 'english')!;

  return (
    <section id="spaces" className="py-24 px-4 sm:px-6 lg:px-8 relative z-20 bg-[#F8FBFF]">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0EA5E9]/30 bg-[#EAF4FC] px-4 py-1.5 text-xs font-bold text-[#0EA5E9]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('sectionBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#1B2A38] font-heading tracking-tight">
            {t('sectionTitle')}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            {t('sectionSubtitle')}
          </p>
        </div>

        {/* 2 Symmetric High-Impact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Teaching & Classroom Hub */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between rounded-3xl p-8 sm:p-12 bg-white border border-[#D8E9F8] shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0EA5E9] to-cyan-400" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF4FC] flex items-center justify-center text-[#0EA5E9]">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0EA5E9] bg-[#EAF4FC] px-3.5 py-1 rounded-full">
                  {t('classroom.tag')}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1B2A38] font-heading">
                  {t('classroom.title')}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
                  {t('classroom.subtitle')}
                </p>
              </div>

              {/* 4 Core Value Points */}
              <ul className="space-y-3.5 pt-2">
                {[
                  t('classroom.point1'),
                  t('classroom.point2'),
                  t('classroom.point3'),
                  t('classroom.point4'),
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="mt-0.5 rounded-full p-1 bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href={`/${locale}${classroom.ctaHref}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1B2A38] hover:bg-slate-800 text-white py-4 px-6 text-sm font-bold font-heading shadow-md transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{t('classroom.cta')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Open English Learning Hub */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col justify-between rounded-3xl p-8 sm:p-12 bg-white border border-[#D8E9F8] shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF7A00] to-amber-400" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF7A00]">
                  <Flame className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF7A00] bg-orange-50 px-3.5 py-1 rounded-full">
                  {t('english.tag')}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1B2A38] font-heading">
                  {t('english.title')}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
                  {t('english.subtitle')}
                </p>
              </div>

              {/* 4 Core Value Points */}
              <ul className="space-y-3.5 pt-2">
                {[
                  t('english.point1'),
                  t('english.point2'),
                  t('english.point3'),
                  t('english.point4'),
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="mt-0.5 rounded-full p-1 bg-orange-50 text-[#FF7A00] border border-orange-200">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href={`/${locale}${english.ctaHref}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] hover:bg-[#E56E00] text-white py-4 px-6 text-sm font-bold font-heading shadow-md shadow-[#FF7A00]/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{t('english.cta')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
