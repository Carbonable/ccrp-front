'use server';

interface UploadResult {
  success: boolean;
  message: string;
}

export async function uploadAllocation(
  amount: number,
  projectId: string,
  buId: string,
): Promise<UploadResult> {
  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || `${process.env.API_URL}/graphql`;

  const mutation = `
    mutation AddAllocations($request: [AddAllocationRequestItem]!) {
      addAllocations(request: $request) {
        allocationIds
        errors
      }
    }
  `;

  const variables = {
    request: [
      {
        project_id: projectId,
        business_unit_id: buId,
        amount: amount,
      },
    ],
  };

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors.map((e: { message: string }) => e.message).join(', '));
    }

    const data = result.data?.addAllocations;
    if (data?.errors && data.errors.length > 0) {
      throw new Error(data.errors.join(', '));
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
