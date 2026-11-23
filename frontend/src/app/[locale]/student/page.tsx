import { getTranslations } from 'next-intl/server';
import { studentService } from '@/services/api-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { BookOpen, FileText } from 'lucide-react';

export default async function StudentDashboard() {
  const t = await getTranslations('student');
  const classes = await studentService.getMyClasses();
  const assignments = await studentService.getAssignments();

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <span>{t('myClasses')}</span>
          </h2>

          {classes.length === 0 ? (
            <EmptyState title="Chưa có lớp học" description="Bạn chưa được thêm vào lớp học nào." />
          ) : (
            <div className="space-y-3">
              {classes.map((cls) => (
                <Card key={cls.id}>
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm">{cls.name}</CardTitle>
                    <CardDescription className="text-xs">{cls.subject} • {cls.gradeLevel}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <span>{t('upcomingAssignments')}</span>
          </h2>

          {assignments.length === 0 ? (
            <EmptyState title="Không có bài tập" description="Hiện tại bạn đã hoàn thành hết bài tập." />
          ) : (
            <div className="space-y-3">
              {assignments.map((asm) => (
                <Card key={asm.id}>
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between mb-1">
                      <CardTitle className="text-sm">{asm.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Hạn: {new Date(asm.dueDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
