'use client';
import { useState, useEffect } from 'react';
import { GreenButton } from '../common/Button';
import { uploadAllocation } from '@/actions/admin/addAllocations';

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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    if (amount === undefined || amount <= 0 || !businessUnitId || !projectId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the uploadAllocation function
      const result = await uploadAllocation(amount, projectId, businessUnitId);

      if (result.success) {
        setData(result.message);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Allocation error:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while adding the allocation.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      onClose(true);
    }
  }, [data, onClose]);

  if (loading) {
    return (
      <GreenButton
        className="w-fit cursor-not-allowed bg-greenish-500/50 text-neutral-300"
        disabled
      >
        Allocating...
      </GreenButton>
    );
  }

  const isDisabled =
    hasError || amount === undefined || amount <= 0 || !businessUnitId || !projectId;

  return (
    <>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <GreenButton
        className={`w-fit ${
          isDisabled
            ? 'cursor-not-allowed bg-greenish-500/50 text-neutral-300'
            : ''
        }`}
        onClick={handleAction}
        disabled={isDisabled}
      >
        Allocate
      </GreenButton>
    </>
  );
}