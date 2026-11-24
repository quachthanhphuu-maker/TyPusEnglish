import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function RegisterPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale === 'en' ? 'en' : 'vi';
  const t = await getTranslations('auth');

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{t('registerTitle')}</CardTitle>
          <CardDescription>{t('registerDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Link
            className="rounded-md border p-4 font-medium transition-colors hover:border-primary"
            href={`/${locale}/login?intent=tutor`}
          >
            {t('registerTutor')}
          </Link>
          <Link
            className="rounded-md border p-4 font-medium transition-colors hover:border-primary"
            href={`/${locale}/login?intent=independent_learner`}
          >
            {t('registerLearner')}
          </Link>
          <Link className="text-sm text-primary underline-offset-4 hover:underline" href={`/${locale}/login`}>
            {t('backToLogin')}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
