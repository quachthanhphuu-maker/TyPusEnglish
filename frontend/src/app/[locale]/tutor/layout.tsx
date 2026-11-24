import { requireWorkspaceAccess } from '@/modules/accounts/server/access';

export default async function TutorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  await requireWorkspaceAccess('tutor', params.locale === 'en' ? 'en' : 'vi');
  return children;
}
