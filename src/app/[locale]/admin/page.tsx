import UploadCSV from '@/components/admin/UploadCSV';
import DangerButton from '@/components/admin/BigRedButton';
import { adminUploadTemplates } from '@/types/admin';
import { getTranslations } from 'next-intl/server';

export default async function AdminPage() {
  const env = process.env.NODE_ENV;
  const t = await getTranslations('admin');

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold">{t('dataUpload')}</h1>
        <p className="text-neutral-400">{t('uploadsDescription')}</p>
      </div>

      {adminUploadTemplates.map((template) => (
        <UploadCSV key={template.key} template={template} />
      ))}

      {env !== 'production' && <DangerButton />}
    </div>
  );
}
