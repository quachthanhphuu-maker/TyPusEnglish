import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'vi';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Load base messages
  const baseMessages = (await import(`../messages/${locale}.json`)).default;

  // Load home namespace messages if present
  let homeMessages = {};
  try {
    homeMessages = (await import(`../messages/${locale}/home.json`)).default;
  } catch {
    // optional home namespace
  }

  return {
    messages: {
      ...baseMessages,
      home: homeMessages,
    },
  };
});
