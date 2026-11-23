import { getTranslations } from 'next-intl/server';
import { parentService } from '@/services/api-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Users, FileCheck } from 'lucide-react';

export default async function ParentDashboard() {
  const t = await getTranslations('parent');
  const reports = await parentService.getReports();

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded border border-amber-200 dark:border-amber-900">
          {t('notice')}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-emerald-600" />
          <span>{t('latestReport')}</span>
        </h2>

        {reports.length === 0 ? (
          <EmptyState
            title="Chưa có báo cáo học tập"
            description="Giáo viên phụ trách chưa xuất bản báo cáo học tập mới cho con."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reports.map((rpt) => (
              <Card key={rpt.id} className="border-emerald-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="success">Đã xuất bản</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(rpt.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-base">{rpt.studentName}</CardTitle>
                  <CardDescription className="text-xs">{rpt.className}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2 text-xs bg-muted/50 p-2.5 rounded">
                    <div>
                      <span className="text-muted-foreground">Chuyên cần: </span>
                      <span className="font-semibold">{rpt.attendancePresent}/{rpt.attendanceTotal} buổi</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Điểm TB: </span>
                      <span className="font-semibold text-emerald-600">{rpt.averageScore}/10</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic border-l-2 border-primary/40 pl-2">
                    &ldquo;{rpt.tutorFeedback}&rdquo;
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
