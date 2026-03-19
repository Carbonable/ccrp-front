'use client';

import { uploadFile } from '@/actions/admin/csvUpload';
import { CURVE_POINTS, DEMAND, FileType } from '@/types/admin';
import { downloadTemplate } from '@/utils/templates';
import { ChangeEvent, useState } from 'react';
import { GreenButton } from '../common/Button';
import { useRefetchAll } from '@/context/General';

interface FileUploadSectionProps {
  type: FileType;
}

interface UploadResult {
  success: boolean;
  message: string;
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
      />
    </svg>
  );
}

export default function UploadCSV({ type }: FileUploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const { triggerRefetch } = useRefetchAll();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadResult({
        success: false,
        message: 'Please select a file first',
      });
      return;
    }

    setUploadResult({ success: true, message: 'Uploading...' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const result = await uploadFile(formData);
      setUploadResult(result);
      if (type === DEMAND || type === CURVE_POINTS) {
        triggerRefetch();
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: `Error uploading ${type} file: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplate(type);
  };

  return (
    <div className="mb-6 rounded border border-opacityLight-10 p-4">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-semibold capitalize">{type}</h2>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-1 rounded border border-opacityLight-10 bg-opacityLight-5 px-2 py-1 text-xs text-neutral-300 transition-colors hover:border-neutral-400 hover:bg-opacityLight-10 hover:text-neutral-100"
          title={`Download ${type} template`}
        >
          <DownloadIcon />
          Template
        </button>
      </div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className={`w-fit rounded-xl border border-opacityLight-10 bg-opacityLight-5 px-3 py-3 text-left outline-0 focus:border-neutral-300 ${
          uploadResult !== null && uploadResult.success === false
            ? 'border-red-500 focus:border-red-500'
            : ''
        }`}
      />
      <GreenButton onClick={handleUpload} className="ml-2">
        Upload {type}
      </GreenButton>
      {uploadResult && (
        <p className={`mt-2 ${uploadResult.success ? 'text-green-600' : 'text-red-600'}`}>
          {uploadResult.message}
        </p>
      )}
    </div>
  );
}
