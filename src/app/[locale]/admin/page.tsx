import UploadCSV from '@/components/admin/UploadCSV';
import DangerButton from '@/components/admin/BigRedButton';
import { adminUploadTemplates } from '@/types/admin';

export default function AdminPage() {
  const env = process.env.NODE_ENV;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold">Data upload</h1>
        <p className="text-neutral-400">
          Client-facing onboarding templates for the CCRP demo. Only the 3 realistic import flows are exposed:
          Projects, Business Units and Emission Estimates.
        </p>
      </div>

      {adminUploadTemplates.map((template) => (
        <UploadCSV key={template.key} template={template} />
      ))}

      {env !== 'production' && <DangerButton />}
    </div>
  );
}
