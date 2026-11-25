'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { PRICING_PLANS } from '@/data/home-experience';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PricingSection() {
  const locale = useLocale();
  const t = useTranslations('home.pricing');

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative z-20 bg-[#F8FBFF]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF7A00]/30 bg-orange-50 px-4 py-1.5 text-xs font-bold text-[#FF7A00]">
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

        {/* 2 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isPro = plan.highlighted;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'flex flex-col justify-between rounded-3xl p-8 sm:p-12 relative transition-all duration-300',
                  isPro
                    ? 'bg-white border-2 border-[#FF7A00] shadow-xl ice-glow-orange'
                    : 'bg-white border border-[#D8E9F8] shadow-md hover:shadow-lg'
                )}
              >
                {/* Pro Badge */}
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF7A00] text-white text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-sm">
                    Khuyên Dùng Cho Giáo Viên
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-[#1B2A38] font-heading">
                      {t(`${plan.id}.name` as any)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {t(`${plan.id}.desc` as any)}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 pt-2 border-b border-[#D8E9F8] pb-6">
                    <span className="text-4xl sm:text-5xl font-black text-[#1B2A38] font-heading">
                      {t(`${plan.id}.price` as any)}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-medium">
                      {t(`${plan.id}.period` as any)}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3.5 text-sm text-slate-700">
                    {plan.featuresKeys.map((featKey, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className={cn(
                            'mt-0.5 rounded-full p-1 border',
                            isPro
                              ? 'bg-orange-50 text-[#FF7A00] border-orange-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          )}
                        >
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm">
                          {t(featKey.replace(/^home\.pricing\./, '') as any)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={`/${locale}${plan.ctaHref}`}
                    className={cn(
                      'w-full inline-flex items-center justify-center gap-2 rounded-2xl py-4 px-6 text-sm font-bold font-heading shadow-md transition-all hover:scale-[1.02] active:scale-95',
                      isPro
                        ? 'bg-[#FF7A00] hover:bg-[#E56E00] text-white shadow-[#FF7A00]/25'
                        : 'bg-[#1B2A38] hover:bg-slate-800 text-white'
                    )}
                  >
                    <span>{t(`${plan.id}.cta` as any)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Assurance Box */}
        <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>
            Dữ liệu học tập được bảo lưu 12 tháng theo quy định PRD • Không tự ý trừ phí ngầm
          </span>
        </div>
      </div>
    </section>
  );
}
