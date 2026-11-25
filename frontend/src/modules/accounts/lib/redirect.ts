export function getSafeReturnTo(
  value: string | null | undefined,
  locale: 'vi' | 'en',
): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  if (value.includes('\\') || /[\u0000-\u001f\u007f]/.test(value)) return null;

  try {
    const url = new URL(value, 'https://typusenglish.invalid');
    if (url.origin !== 'https://typusenglish.invalid') return null;
    if (url.pathname !== `/${locale}` && !url.pathname.startsWith(`/${locale}/`)) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
