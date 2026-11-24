import { requireWorkspaceAccess } from '@/modules/accounts/server/access';

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  await requireWorkspaceAccess('student', params.locale === 'en' ? 'en' : 'vi');
  return children;
}
