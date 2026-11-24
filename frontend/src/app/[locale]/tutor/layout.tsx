import * as React from 'react';
import { requireWorkspaceAccess } from '@/modules/accounts/server/access';
import { TutorSidebar } from '@/components/tutor/tutor-sidebar';
import { TutorTopbar } from '@/components/tutor/tutor-topbar';

export default async function TutorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  
  // Verify access for tutor workspace
  await requireWorkspaceAccess('tutor', locale);

  return (
    <div className="flex min-h-screen w-full bg-[#0B131E] text-slate-200 antialiased font-body">
      {/* Persistent Left Sidebar */}
      <TutorSidebar locale={locale} />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 flex-col min-w-0">
        <TutorTopbar locale={locale} userName="Phú Thanh" userRole={locale === 'en' ? 'Center Owner' : 'Chủ trung tâm'} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0B131E]">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
