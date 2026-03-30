'use client';

import { GreenButton } from '@/components/common/Button';
import SimpleModal from '@/components/common/SimpleModal';
import { BusinessUnit, Project } from '@/graphql/__generated__/graphql';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import Available from './Available';
import AllocateButton from './AllocateButton';
import { GET_PROJECT_WITHOUT_VINTAGES } from '@/graphql/queries/projects';
import BUList from './BUList';
import { onlyPositiveInteger } from './utils';

export default function ProjectAllocationButton({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBU, setSelectedBU] = useState<BusinessUnit | undefined>(undefined);
  const [availableObject, setAvailableObject] = useState<{
    available_percent: number;
    available_units: number;
  }>();
  const [amount, setAmount] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  const { loading, error, data, refetch } = useQuery<any>(GET_PROJECT_WITHOUT_VINTAGES, {
    variables: {
      field: 'id',
      value: projectId,
    },
  });

  const project: Project = data?.projectBy;

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const available = availableObject?.available_units ?? 0;
    const isValidInteger = /^[0-9]*$/.test(value);

    if (!isValidInteger || value === '') {
      setHasError(true);
      setAmount('');
      return;
    }

    const parsedValue = parseInt(value, 10);
    if (parsedValue > available) {
      setAmount(available.toString());
      return;
    }
    if (parsedValue < 0) {
      setAmount('0');
      return;
    }

    setAmount(parsedValue.toString());
    setHasError(false);
  };

  return (
    <>
      <GreenButton className="w-full" onClick={() => setIsOpen(true)}>
        Add allocation
      </GreenButton>
      <SimpleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={loading ? 'Loading...' : error ? `Error: ${error.message}` : project?.name || 'Add allocation'}
        footer={
          !loading && !error ? (
            <div className="text-right">
              <AllocateButton
                amount={parseInt(amount)}
                businessUnitId={selectedBU?.id}
                projectId={project.id}
                hasError={hasError}
                onClose={() => setIsOpen(false)}
              />
            </div>
          ) : null
        }
      >
        {loading ? null : error ? null : (
          <div className="mx-auto w-full text-center">
            <div className="relative w-full">
              <div className="font-inter bg-allocation-bu relative w-full rounded-2xl border border-opacity-light-10 px-6 py-4 text-left">
                <div className="text-lg uppercase text-neutral-200">{project.name}</div>
              </div>
              <div className="mt-8">
                <BUList selectedBU={selectedBU} setSelectedBU={setSelectedBU} />
              </div>
              <div className="mt-8 font-light">
                <div className="text-left uppercase text-neutral-200">Amount to allocate</div>
              </div>
              <div className="relative mt-1 w-full">
                <input
                  className={`w-full rounded-xl border border-opacity-light-10 bg-opacity-light-5 px-3 py-3 text-left outline-0 focus:border-neutral-300 ${
                    hasError ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  type="number"
                  value={amount}
                  max={availableObject?.available_units}
                  name="amount"
                  aria-label="Amount"
                  onChange={handleAmountChange}
                  onKeyDown={onlyPositiveInteger}
                />
              </div>
              <div className="ml-1 mt-1 flex items-center text-left text-xs uppercase text-neutral-200">
                <div>
                  Available
                  <span className="ml-1 font-bold text-neutral-50">
                    <Available
                      businessUnitId={selectedBU?.id}
                      projectId={project.id}
                      setAvailableObject={setAvailableObject}
                    />{' '}
                    Units
                  </span>
                </div>
                <div className="ml-4">
                  To allocate
                  <span className="ml-1 font-bold text-neutral-50">
                    {amount !== '' ? parseInt(amount) : 0} Units
                  </span>
                </div>
              </div>
              <div className="mt-8 rounded-xl border border-opacity-light-10 bg-neutral-800 px-8 py-6 text-left text-sm">
                Carbon units will be allocated to this business unit on a fifo basis, based on target and other business units allocations.
              </div>
            </div>
          </div>
        )}
      </SimpleModal>
    </>
  );
}
