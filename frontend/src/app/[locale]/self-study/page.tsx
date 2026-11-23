import { getTranslations } from 'next-intl/server';
import { selfStudyService } from '@/services/api-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Flame, BrainCircuit, Target, BookOpen } from 'lucide-react';

export default async function SelfStudyDashboard() {
  const t = await getTranslations('selfStudy');
  const sets = await selfStudyService.getVocabularySets();
  const streak = await selfStudyService.getStreak();

  return (
    <div className="space-y-8 animate-in fade-in-50">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chuỗi ngày học tập (Streak)</CardTitle>
            <Flame className="h-5 w-5 text-amber-500 animate-bounce" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-600">
              {t('streakDays', { count: streak.currentStreak })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Kỷ lục: {streak.longestStreak} ngày liên tục
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dailyGoal')}</CardTitle>
            <Target className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-purple-600">
              {streak.dailyGoalProgress} / {streak.dailyGoalTarget} từ
            </div>
            <div className="w-full bg-purple-200 dark:bg-purple-950 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all"
                style={{ width: `${(streak.dailyGoalProgress / streak.dailyGoalTarget) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>{t('mySets')}</span>
          </h2>
          <Button size="sm" variant="outline">{t('createSet')}</Button>
        </div>

        {sets.length === 0 ? (
          <EmptyState
            title="Chưa có bộ từ vựng"
            description="Tạo bộ từ vựng đầu tiên hoặc nhận chia sẻ từ giáo viên để bắt đầu ôn tập."
            actionLabel={t('createSet')}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sets.map((set) => (
              <Card key={set.id} className="hover:shadow-sm transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline">{set.cardCount} thẻ từ</Badge>
                    <span className="text-xs font-semibold text-emerald-600">{set.masteryPercentage}% thuần thục</span>
                  </div>
                  <CardTitle className="text-base">{set.title}</CardTitle>
                  <CardDescription className="text-xs">
                    Ôn lần cuối: {set.lastReviewedAt ? new Date(set.lastReviewedAt).toLocaleDateString() : 'Chưa ôn'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" className="w-full">{t('startReview')}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
