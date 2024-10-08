'use client';
import { CREATE_ALLOCATION } from '@/graphql/queries/allocation';
import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { GreenButton } from '../common/Button';

interface AllocateButtonProps {
  businessUnitId: string | undefined | any;
  projectId: string | undefined;
  amount: number | undefined;
  onClose: (b: boolean) => void;
  hasError: boolean;
}

export default function AllocateButton({
  businessUnitId,
  projectId,
  amount,
  onClose,
  hasError,
}: AllocateButtonProps) {
  const [createAllocation, { loading, data }] = useMutation(CREATE_ALLOCATION);

  const handleAction = async () => {
    try {
      if (amount === undefined || amount <= 0 || !businessUnitId || !projectId) {
        return;
      }
      // Execute the mutation function with the input variable
      const result = await createAllocation({
        variables: {
          request: {
            project_id: projectId,
            business_unit_id: businessUnitId,
            percentage: parseInt(amount.toString()),
          },
        },
        refetchQueries: 'active',
      });

      // Handle the result as needed
      console.log('Mutation result:', result);
    } catch (error) {
      // Handle any errors
      console.error('Mutation error:', error);
    }
  };

  useEffect(() => {
    if (data) {
      onClose(true);
    }
  }, [data]);

  if (loading) {
    return (
      <GreenButton
        className="w-fit cursor-not-allowed bg-greenish-500/50 text-neutral-300 hover:bg-greenish-500/50"
        disabled
      >
        Allocating...
      </GreenButton>
    );
  }

  if (hasError || amount === undefined || amount <= 0 || !businessUnitId || !projectId) {
    return (
      <GreenButton
        className="w-fit cursor-not-allowed bg-greenish-500/50 text-neutral-300 hover:bg-greenish-500/50"
        disabled
      >
        Allocate
      </GreenButton>
    );
  }

  return (
    <GreenButton
      className={`w-fit ${hasError || !businessUnitId || !projectId ? 'cursor-not-allowed bg-greenish-500/50 text-neutral-300 hover:bg-greenish-500/50' : ''}`}
      onClick={handleAction}
    >
      Allocate
    </GreenButton>
  );
}
