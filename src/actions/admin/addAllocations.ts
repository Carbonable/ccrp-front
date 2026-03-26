'use server';

import { getJwtToken } from '@/utils/auth';

interface UploadResult {
  success: boolean;
  message: string;
}

export async function uploadAllocation(
  amount: number,
  projectId: string,
  buId: string,
): Promise<UploadResult> {
  const token = await getJwtToken();
  if (!token) {
    return { success: false, message: 'Authentication failed — could not get backend token' };
  }

  const endpoint = `${process.env.API_URL}/allocation/add`;

  const allocationRequestItem = {
    project_id: projectId,
    business_unit_id: buId,
    amount: amount,
    allow_over_allocation: false,
    allow_vintage_homogeneisation: false,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify([allocationRequestItem]),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }

    const responseData = await response.json();

    if (responseData.errors && responseData.errors.length > 0) {
      throw new Error(responseData.errors.join(', '));
    }

    return { success: true, message: 'Allocation added successfully' };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: `Error adding allocation: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
