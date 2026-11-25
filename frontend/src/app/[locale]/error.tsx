'use client';

import { useTranslations } from 'next-intl';
import { ErrorDisplay } from '@/components/shared/error-display';

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  return (
    <ErrorDisplay
      title={t('states.error')}
      retryLabel={t('states.errorRetry')}
      onRetry={() => reset()}
    />
  );
}
