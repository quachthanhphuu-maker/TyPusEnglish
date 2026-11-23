'use client';

import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2 } from 'lucide-react';
import * as React from 'react';

export default function LoginPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {t('sentSuccess')}
              </p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {t('sendLink')}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col border-t pt-4 text-xs text-muted-foreground text-center">
          <p className="font-semibold mb-1">{t('roleHint')}</p>
          <p className="text-[11px]">
            tutor@example.com • student@example.com • parent@example.com
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
