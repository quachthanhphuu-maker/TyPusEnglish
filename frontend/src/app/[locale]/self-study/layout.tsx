import { requireWorkspaceAccess } from '@/modules/accounts/server/access';

export default async function SelfStudyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  await requireWorkspaceAccess(
    'independent_learner',
    params.locale === 'en' ? 'en' : 'vi',
  );
  return children;
}
