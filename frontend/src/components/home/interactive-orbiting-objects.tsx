'use client';

import * as React from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Compass, FlaskConical, BookOpen, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HotspotItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descKey: string;
  actionKey: string;
  targetHref: string;
  isExternalSection?: boolean;
  // Normalized percentage position relative to the 16:9 video frame
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  widthPercent: number;
  heightPercent: number;
  glowColor: string;
  badgePosition: 'bottom' | 'top' | 'left' | 'right';
}

const VIDEO_HOTSPOTS: HotspotItem[] = [
  {
    id: 'pyramid-math',
    icon: Compass,
    titleKey: 'home.orbitObjects.geometry.title',
    descKey: 'home.orbitObjects.geometry.desc',
    actionKey: 'home.orbitObjects.geometry.action',
    targetHref: '#ai-lab',
    isExternalSection: true,
    // Top-left pyramid in the video
    xPercent: 19,
    yPercent: 19,
    widthPercent: 20,
    heightPercent: 28,
    glowColor: 'rgba(56, 189, 248, 0.65)',
    badgePosition: 'bottom',
  },
  {
    id: 'flask-science',
    icon: FlaskConical,
    titleKey: 'home.orbitObjects.chemistry.title',
    descKey: 'home.orbitObjects.chemistry.desc',
    actionKey: 'home.orbitObjects.chemistry.action',
    targetHref: '#ai-lab',
    isExternalSection: true,
    // Top-right chemistry flask in the video
    xPercent: 81,
    yPercent: 19,
    widthPercent: 18,
    heightPercent: 30,
    glowColor: 'rgba(14, 165, 233, 0.65)',
    badgePosition: 'bottom',
  },
  {
    id: 'tile-book',
    icon: BookOpen,
    titleKey: 'home.orbitObjects.curriculum.title',
    descKey: 'home.orbitObjects.curriculum.desc',
    actionKey: 'home.orbitObjects.curriculum.action',
    targetHref: '/tutor',
    isExternalSection: false,
    // Bottom-left book tile in the video
    xPercent: 11,
    yPercent: 61,
    widthPercent: 17,
    heightPercent: 26,
    glowColor: 'rgba(59, 130, 246, 0.65)',
    badgePosition: 'top',
  },
  {
    id: 'tile-letter-a',
    icon: Languages,
    titleKey: 'home.orbitObjects.english.title',
    descKey: 'home.orbitObjects.english.desc',
    actionKey: 'home.orbitObjects.english.action',
    targetHref: '/self-study',
    isExternalSection: false,
    // Bottom-right 'A' tile in the video
    xPercent: 88,
    yPercent: 68,
    widthPercent: 17,
    heightPercent: 26,
    glowColor: 'rgba(37, 99, 235, 0.65)',
    badgePosition: 'top',
  },
];

interface InteractiveOrbitingObjectsProps {
  scrollYProgress: MotionValue<number>;
  className?: string;
}

export function InteractiveOrbitingObjects({
  scrollYProgress,
  className,
}: InteractiveOrbitingObjectsProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  // Fade out smoothly as user scrolls deep into the classroom
  const layerOpacity = useTransform(scrollYProgress, [0.0, 0.45, 0.7], [1, 0.85, 0.1]);

  const handleClick = (item: HotspotItem) => {
    if (item.isExternalSection) {
      const el = document.querySelector(item.targetHref);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push(`/${locale}${item.targetHref}`);
  };

  return (
    <motion.div
      style={{ opacity: layerOpacity }}
      className={cn(
        'absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden select-none',
        className
      )}
    >
      {/* 
        This container matches the exact object-cover aspect-ratio geometry of the video canvas.
        Using a 16:9 container that covers the viewport ensures hotspot percentage coordinates
        map precisely onto the 3D objects in the video!
      */}
      <div className="relative w-full h-full max-w-[100vw] max-h-[100vh] flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full pointer-events-none">
          {VIDEO_HOTSPOTS.map((item) => {
            const isHovered = hoveredId === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                style={{
                  left: `${item.xPercent}%`,
                  top: `${item.yPercent}%`,
                  width: `${item.widthPercent}%`,
                  height: `${item.heightPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleClick(item)}
                className="absolute pointer-events-auto cursor-pointer group flex items-center justify-center"
                role="button"
                tabIndex={0}
                aria-label={t(item.titleKey)}
              >
                {/* 1. Subtle Ambient Glowing Target Ring on the Object */}
                <div
                  className={cn(
                    'absolute inset-1 sm:inset-2 rounded-3xl transition-all duration-300 pointer-events-none',
                    isHovered
                      ? 'border-2 border-sky-400/90 shadow-[0_0_35px_rgba(56,189,248,0.7),_inset_0_0_20px_rgba(56,189,248,0.3)] bg-sky-400/15 scale-105'
                      : 'border border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.4)] bg-white/5 hover:border-sky-300 hover:bg-sky-400/10'
                  )}
                />

                {/* 2. Shimmering Interactive Indicator Tag */}
                <div
                  className={cn(
                    'absolute -top-3.5 px-2.5 py-0.5 rounded-full backdrop-blur-md border text-[11px] font-bold tracking-wide transition-all duration-300 flex items-center gap-1 shadow-md pointer-events-none select-none',
                    isHovered
                      ? 'bg-sky-500 text-white border-sky-300 scale-110 shadow-sky-500/30'
                      : 'bg-white/85 dark:bg-slate-900/85 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-700/60 opacity-90 group-hover:opacity-100'
                  )}
                >
                  <Sparkles className="h-2.5 w-2.5 text-[#FF7A00] animate-pulse" />
                  <span>{t(item.titleKey)}</span>
                </div>

                {/* 3. Detailed Interactive Glassmorphic Card on Hover */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: item.badgePosition === 'top' ? -8 : 8, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      'absolute z-50 w-60 sm:w-68 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-sky-200 dark:border-sky-700 shadow-2xl shadow-sky-500/20 text-left pointer-events-auto',
                      item.badgePosition === 'bottom'
                        ? 'top-full mt-3 left-1/2 -translate-x-1/2'
                        : 'bottom-full mb-3 left-1/2 -translate-x-1/2'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-7 w-7 rounded-lg bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                        {t(item.titleKey)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3 font-medium">
                      {t(item.descKey)}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(item);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold shadow-md shadow-sky-500/25 transition-all"
                    >
                      <span>{t(item.actionKey)}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
