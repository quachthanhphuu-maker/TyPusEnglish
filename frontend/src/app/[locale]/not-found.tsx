import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-extrabold text-foreground">404</h2>
      <p className="mt-2 text-base text-muted-foreground">Không tìm thấy trang yêu cầu / Page not found</p>
      <Button asChild className="mt-6" size="sm">
        <Link href="/">Quay về trang chủ / Back to home</Link>
      </Button>
    </div>
  );
}
