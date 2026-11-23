import { LoadingSkeleton } from '@/components/shared/loading-skeleton';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 rounded bg-muted animate-pulse" />
      <LoadingSkeleton count={3} />
    </div>
  );
}
