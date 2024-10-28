'use server';

import { getJwtToken } from "@/utils/auth";

interface UploadResult {
  success: boolean;
  message: string;
}

export async function uploadAllocation(
  amount: number,
  projectId: string,
  buId: string
): Promise<UploadResult> {
  const token = await getJwtToken();

  const endpoint = `${process.env.API_URL}/allocation/add`;

  // Construct the allocation request item
  const allocationRequestItem = {
    project_id: projectId,
    business_unit_id: buId,
    amount: amount,
    allow_over_allocation: false, // Set to true if needed
    allow_vintage_homogeneisation: false, // Set to true if needed
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      // Send the data as an array of allocation items
      body: JSON.stringify([allocationRequestItem]),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData.message}`
      );
    }

    const responseData = await response.json();
    return { success: true, message: 'Allocation added successfully' };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: `Error adding allocation: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}