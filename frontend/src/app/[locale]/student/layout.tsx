import { getTranslations } from 'next-intl/server';
import { requireWorkspaceAccess } from '@/modules/accounts/server/access';
import { StudentShell } from '@/modules/dashboards/components/student-shell';
import { getStudentDisplayName } from '@/modules/dashboards/lib/student-helpers';

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const user = await requireWorkspaceAccess('student', locale);
  const t = await getTranslations('student');

  return (
    <StudentShell
      locale={locale}
      user={{
        displayName: getStudentDisplayName(user, t('userMenu.studentRole')),
        email: user.email,
        hasMultipleRoles: user.roles.length > 1,
      }}
    >
      {children}
    </StudentShell>
  );
}
