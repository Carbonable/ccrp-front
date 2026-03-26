
import UploadCSV from '@/components/admin/UploadCSV';
import DangerButton from '@/components/admin/BigRedButton';
import { supportedFileTypes } from '@/types/admin';

export default function AdminPage() {
  
  let env = process.env.NODE_ENV;
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Data upload</h1>
      {supportedFileTypes.map((type) => (
        <UploadCSV key={type} type={type} />
      ))}
      { env !== 'production' && <DangerButton />}
    </div>
  );
}
