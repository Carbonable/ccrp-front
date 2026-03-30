'use client';

import { uploadFile } from '@/actions/admin/csvUpload';
import { AdminUploadTemplate, EMISSION_ESTIMATES, TemplateKey } from '@/types/admin';
import { downloadTemplate } from '@/utils/templates';
import { ChangeEvent, useState } from 'react';
import { GreenButton } from '../common/Button';
import { useRefetchAll } from '@/context/General';
import { useTranslations } from 'next-intl';

interface FileUploadSectionProps {
  template: AdminUploadTemplate;
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

export default function UploadCSV({ template }: FileUploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const { triggerRefetch } = useRefetchAll();
  const t = useTranslations('admin');

  const title = t(`uploads.${template.key}.title`);
  const description = t(`uploads.${template.key}.description`);
  const uploadCta = t(`uploads.${template.key}.uploadCta`);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadResult({
        success: false,
        message: t('pleaseSelectFile'),
      });
      return;
    }

    setUploadResult({ success: true, message: t('uploading') });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', template.uploadType);
    formData.append('templateKey', template.key);

    try {
      const result = await uploadFile(formData);
      setUploadResult(result);
      if (template.uploadType === EMISSION_ESTIMATES) {
        triggerRefetch();
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: `${t('errorUploading', { title })}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  };

  const handleDownloadTemplate = () => {
    downloadTemplate(template.key as TemplateKey);
  };

  return (
    <div className="mb-6 rounded-2xl border border-opacity-light-10 bg-opacity-light-5 p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-neutral-400">{description}</p>
          <p className="mt-2 text-xs text-neutral-500">
            {t('acceptedFormats')}: {template.acceptedFormats}
          </p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-1 self-start rounded border border-opacity-light-10 bg-neutral-800 px-3 py-2 text-xs text-neutral-300 transition-colors hover:border-neutral-400 hover:bg-opacity-light-10 hover:text-neutral-100"
          title={t('downloadTemplateTitle', { title })}
        >
          <DownloadIcon />
          {t('downloadTemplate')}
        </button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="file"
          accept={template.acceptedFormats}
          onChange={handleFileChange}
          className={`w-full rounded-xl border border-opacity-light-10 bg-opacity-light-5 px-3 py-3 text-left outline-0 focus:border-neutral-300 md:w-auto ${
            uploadResult !== null && uploadResult.success === false
              ? 'border-red-500 focus:border-red-500'
              : ''
          }`}
        />
        <GreenButton onClick={handleUpload}>{uploadCta}</GreenButton>
      </div>

      {file && (
        <p className="mt-3 text-xs text-neutral-500">
          {t('selectedFile')}: {file.name}
        </p>
      )}

      {uploadResult && (
        <p className={`mt-3 text-sm ${uploadResult.success ? 'text-green-500' : 'text-red-500'}`}>
          {uploadResult.message}
        </p>
      )}
    </div>
  );
}
