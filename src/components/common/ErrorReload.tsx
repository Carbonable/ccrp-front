'use client';

import { useTranslations } from 'next-intl';

export default function ErrorReload({ refetchData }: { refetchData?: () => void }) {
  const t = useTranslations('common');
  return (
    <div
      className="m-2 w-fit cursor-pointer rounded-xl border border-neutral-600 bg-opacityLight-5 px-4 py-2 text-xl font-bold text-neutral-100 hover:brightness-105"
      onClick={refetchData}
    >
      {t('reload')}
    </div>
  );
}

export function ErrorReloadTable({ refetchData }: { refetchData?: () => void }) {
  const t = useTranslations('common');
  return (
    <tr>
      <td>
        <div
          className="m-2 cursor-pointer rounded-xl border border-neutral-600 bg-opacityLight-5 px-4 py-2 text-xl font-bold text-neutral-100 hover:brightness-105"
          onClick={refetchData}
        >
          {t('reload')}
        </div>
      </td>
    </tr>
  );
}

export function NoDataTable() {
  const t = useTranslations('common');
  return (
    <tr>
      <td className="p-4 text-lg">{t('noData')}</td>
    </tr>
  );
}
