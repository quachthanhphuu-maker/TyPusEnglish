'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function StudentError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('student');

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-[#131E2B] p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h1 className="mt-4 text-lg font-bold text-white">{t('errorTitle')}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">{t('errorMessage')}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#243244] bg-[#0E1722] px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-[#334155]"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        <span>{t('retry')}</span>
      </button>
    </div>
  );
}
