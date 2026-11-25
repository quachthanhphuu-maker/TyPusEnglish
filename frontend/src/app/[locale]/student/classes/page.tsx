import { StudentClassesView } from '@/modules/dashboards/components/student-classes-view';
import { studentService } from '@/services/api-client';

export default async function StudentClassesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const classes = await studentService.getMyClasses().catch(() => []);

  return (
    <StudentClassesView
      locale={locale}
      basePath={`/${locale}/student`}
      classes={classes}
    />
  );
}
