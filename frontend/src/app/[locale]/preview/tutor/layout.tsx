import { notFound } from 'next/navigation';
import { TutorSidebar } from '@/components/tutor/tutor-sidebar';
import { TutorTopbar } from '@/components/tutor/tutor-topbar';

export const metadata = {
  title: 'TyPusEnglish Tutor Preview',
  robots: 'noindex, nofollow',
};

export default function TutorPreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const locale = params.locale === 'en' ? 'en' : 'vi';

  return (
    <div className="flex min-h-screen w-full bg-[#0B131E] font-body text-slate-200 antialiased">
      <TutorSidebar locale={locale} basePath={`/${locale}/preview/tutor`} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TutorTopbar
          locale={locale}
          userName="Phú Thanh"
          userRole={locale === 'en' ? 'Center Owner (Preview)' : 'Chủ trung tâm (Xem thử)'}
        />
        <main className="flex-1 overflow-y-auto bg-[#0B131E] p-6 md:p-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
