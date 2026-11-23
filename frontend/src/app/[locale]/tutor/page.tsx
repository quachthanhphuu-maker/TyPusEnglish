import { getTranslations } from 'next-intl/server';
import { tutorService } from '@/services/api-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Users, Calendar, DollarSign, ClipboardCheck } from 'lucide-react';

export default async function TutorDashboard() {
  const t = await getTranslations('tutor');
  const classes = await tutorService.getClasses();
  const lessons = await tutorService.getLessons();

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('quickStats.activeClasses')}</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('quickStats.todayLessons')}</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('quickStats.pendingTuition')}</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.400.000 ₫</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('quickStats.ungradedAssignments')}</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">{t('classesTitle')}</h2>
        </div>

        {classes.length === 0 ? (
          <EmptyState
            title="Chưa có lớp học"
            description="Tạo lớp học 1-1 hoặc nhóm nhỏ để bắt đầu quản lý học sinh và bài tập."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card key={cls.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant={cls.classType === 'ONE_TO_ONE' ? 'secondary' : 'outline'}>
                      {cls.classType === 'ONE_TO_ONE' ? '1 - 1' : 'Nhóm nhỏ'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{cls.subject}</span>
                  </div>
                  <CardTitle className="text-base">{cls.name}</CardTitle>
                  <CardDescription className="text-xs">{cls.gradeLevel}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {t('studentsCount', { count: cls.studentCount })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
