"use client";

import { uploadFile } from "@/actions/admin/csvUpload";
import { FileType } from "@/types/admin";
import { ChangeEvent, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { GreenButton } from "../common/Button";

interface FileUploadSectionProps {
  type: FileType;
}

interface UploadResult {
  success: boolean;
  message: string;
}

export default function UploadCSV({ type }: FileUploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const { getToken } = useAuth();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const token = await getToken();
    if (!file) {
      setUploadResult({
        success: false,
        message: "Please select a file first",
      });
      return;
    }

    if (!token) {
      setUploadResult({
        success: false,
        message: "You must be logged in to upload a file",
      });
      return;
    }

    setUploadResult({ success: true, message: "Uploading..." });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const result = await uploadFile(formData, token);
      setUploadResult(result);
    } catch (error) {
      setUploadResult({
        success: false,
        message: `Error uploading ${type} file: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  };

  return (
    <div className="mb-6 p-4 border rounded border-opacityLight-10">
      <h2 className="font-semibold mb-2 capitalize">{type}</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className={`bg-opacityLight-5 text-left outline-0 border border-opacityLight-10 px-3 py-3 rounded-xl w-fit focus:border-neutral-300 ${
          uploadResult !== null && uploadResult.success === false
            ? "border-red-500 focus:border-red-500"
            : ""
        }`}
      />
      <GreenButton onClick={handleUpload} className="ml-2">
        Upload {type}
      </GreenButton>
      {uploadResult && (
        <p
          className={`mt-2 ${
            uploadResult.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {uploadResult.message}
        </p>
      )}
    </div>
  );
}
