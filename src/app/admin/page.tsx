import UploadCSV from '@/components/admin/UploadCSV';
import { supportedFileTypes } from '@/types/admin';

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Data upload</h1>
      {supportedFileTypes.map((type) => (
        <UploadCSV key={type} type={type} />
      ))}
    </div>
  );
}
