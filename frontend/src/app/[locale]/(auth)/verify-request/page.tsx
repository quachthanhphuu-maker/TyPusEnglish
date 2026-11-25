import { redirect } from 'next/navigation';

export default async function VerifyRequestPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale === 'en' ? 'en' : 'vi'}/login`);
}
