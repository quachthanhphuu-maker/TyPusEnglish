'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { WORKFLOW_STEPS, AI_SUBJECTS } from '@/data/home-experience';
import { Box, FlaskConical, Atom, Languages, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AiLabWorkflow() {
  const locale = useLocale();
  const t = useTranslations('home');

  const [activeSubject, setActiveSubject] = React.useState('math');

  const iconMap: Record<string, React.ElementType> = {
    Box,
    FlaskConical,
    Atom,
    Languages,
  };

  const currentSubjectData = AI_SUBJECTS.find((s) => s.id === activeSubject)!;

  return (
    <section id="ai-lab" className="py-24 px-4 sm:px-6 lg:px-8 relative z-20 bg-white border-y border-[#D8E9F8]">
      <div className="container mx-auto max-w-7xl space-y-24">
        {/* PART 1: 4 Standardized Teaching Workflow Steps */}
        <div className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t('workflow.sectionBadge')}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#1B2A38] font-heading tracking-tight">
              {t('workflow.sectionTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              {t('workflow.sectionSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-2xl p-6 bg-[#F8FBFF] border border-[#D8E9F8] hover:border-[#0EA5E9] hover:bg-white transition-all shadow-sm"
              >
                <div className="text-3xl font-black text-[#0EA5E9] font-heading mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-[#1B2A38] font-heading mb-2">
                  {t(step.titleKey as any)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {t(step.descKey as any)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PART 2: 4-Subject AI Interactive Simulation Lab */}
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#1B2A38] via-slate-900 to-[#1B2A38] text-white shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#0EA5E9]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#FF7A00]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/60 px-4 py-1.5 text-xs font-bold text-purple-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t('aiSubjects.sectionBadge')}</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black font-heading tracking-tight">
                {t('aiSubjects.sectionTitle')}
              </h3>
              <p className="text-sm sm:text-base text-slate-300">
                {t('aiSubjects.sectionSubtitle')}
              </p>
            </div>

            {/* Subject Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {AI_SUBJECTS.map((sub) => {
                const Icon = iconMap[sub.iconName] || Box;
                const isActive = activeSubject === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubject(sub.id)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold font-heading transition-all duration-200 focus:outline-none',
                      isActive
                        ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/30 scale-105'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t(sub.nameKey as any)}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Preview Panel */}
            <motion.div
              key={currentSubjectData.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-2xl bg-slate-800/60 border border-slate-700/80 p-6 sm:p-10 backdrop-blur-xl"
            >
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30 uppercase tracking-wider">
                  {t(currentSubjectData.badgeKey as any)}
                </span>
                <h4 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
                  {t(currentSubjectData.demoTitleKey as any)}
                </h4>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  {t(currentSubjectData.demoDescKey as any)}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/${locale}/student`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FF7A00] hover:text-amber-300 transition-colors"
                  >
                    <span>Trải nghiệm mô phỏng này trong lớp học</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Graphic Simulation Mockup Box */}
              <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-700 p-6 flex flex-col justify-between overflow-hidden group">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono">Engine: WebGL 3D Interactive Viewport</span>
                  </div>
                  <span className="font-mono text-[#0EA5E9]">FPS: 60.0</span>
                </div>

                <div className="my-auto text-center space-y-2">
                  <div className="text-4xl font-mono text-[#0EA5E9] font-extrabold tracking-wider">
                    {activeSubject === 'math' && 'V = ⅓·S·h'}
                    {activeSubject === 'chemistry' && '2H₂ + O₂ ➔ 2H₂O'}
                    {activeSubject === 'physics' && 'T = 2π√(l/g)'}
                    {activeSubject === 'english' && 'CEFR B2 ➔ C1'}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Parameter Snapshot verified • Interactive manipulation enabled
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                  <span>P1 & P2 Interactive Specification</span>
                  <span className="text-emerald-400">Status: Educator Ready</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
