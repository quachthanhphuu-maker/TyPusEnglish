import { getTranslations } from 'next-intl/server';
import { parentService } from '@/services/api-client';
import { ParentDashboardView } from '@/modules/dashboards/components/parent-dashboard-view';

export default async function ParentDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const t = await getTranslations('parent');
  const children = await parentService.getChildren().catch(() => []);

  return (
    <ParentDashboardView
      students={children}
      locale={locale}
      labels={{
        title: t('title'),
        description: t('description'),
        notice: t('notice'),
        selectChild: t('selectChild'),
        selectedChild: t('selectedChild'),
        classLabel: t('classLabel'),
        gradeLabel: t('gradeLabel'),
        tutorLabel: t('tutorLabel'),
        nextLesson: t('nextLesson'),
        scheduleTitle: t('scheduleTitle'),
        learningProgress: t('learningProgress'),
        attendance: t('attendance'),
        averageScore: t('averageScore'),
        publishedFeedback: t('publishedFeedback'),
        skillNames: {
          listening: t('skillListening'),
          speaking: t('skillSpeaking'),
          writing: t('skillWriting'),
          grammar: t('skillGrammar'),
          problemSolving: t('skillProblemSolving'),
          algebra: t('skillAlgebra'),
        },
        noChildren: t('noChildren'),
      }}
    />
  );
}
