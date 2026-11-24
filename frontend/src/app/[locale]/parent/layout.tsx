import { requireWorkspaceAccess } from '@/modules/accounts/server/access';

export default async function ParentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  await requireWorkspaceAccess('parent', params.locale === 'en' ? 'en' : 'vi');
  return children;
}
