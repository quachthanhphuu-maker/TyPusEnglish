'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorDisplay({
  title = 'Đã có lỗi xảy ra',
  message = 'Không thể tải dữ liệu vào lúc này. Vui lòng thử lại sau.',
  onRetry,
  retryLabel = 'Thử lại',
}: ErrorDisplayProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-destructive">{title}</h3>
      <p className="mb-4 mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
