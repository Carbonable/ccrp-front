'use server';

import { getJwtToken } from "@/utils/auth";

interface UploadResult {
  success: boolean;
  message: string;
}

export async function uploadFile(formData: FormData): Promise<UploadResult> {
  const token = getJwtToken();
  const file = formData.get('file') as File | null;
  const type = formData.get('type') as string | null;

  if (!file || !type) {
    return { success: false, message: 'No file or type provided' };
  }

  const endpoint = `${process.env.API_URL}/${type.toLowerCase()}/upload`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await response.json();
    return { success: true, message: `${type} file uploaded successfully` };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: `Error uploading ${type} file: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
