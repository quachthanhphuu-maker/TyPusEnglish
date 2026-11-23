'use client';

import * as React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

interface ScrollTextOverlaysProps {
  scrollYProgress: MotionValue<number>;
}

export function ScrollTextOverlays({
  scrollYProgress,
}: ScrollTextOverlaysProps) {
  const t = useTranslations();

  // Subtle bottom hint that fades away as soon as user starts scrolling
  const hintOpacity = useTransform(scrollYProgress, [0.0, 0.05], [1, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end p-4 sm:p-8 lg:p-14 overflow-hidden">
      {/* Bottom Scroll Indicator */}
      <motion.div
        style={{ opacity: hintOpacity }}
        className="relative pb-2 text-center pointer-events-none select-none"
      >
        <div className="inline-flex flex-col items-center gap-1 text-[11px] font-bold text-slate-500 drop-shadow-sm">
          <span>{t('home.chapters.scrollHint')}</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-[#FF7A00]" />
        </div>
      </motion.div>
    </div>
  );
}
