import { Link } from '@/i18n/navigation';
import Title from '@/components/common/Title';
import { GreenButton } from '@/components/common/Button';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('common');

  return (
    <div className="2xl:max-w-8xl max-w-full p-4 lg:mx-auto lg:max-w-6xl lg:p-8 xl:max-w-7xl">
      <Title title={t('notFound')} />
      <div className="mt-6">
        <p className="text-lg">{t('notFoundMessage')}</p>
        <p className="mt-4">
          <GreenButton>
            <Link href="/dashboard">{t('returnHome')}</Link>
          </GreenButton>
        </p>
      </div>
    </div>
  );
}
