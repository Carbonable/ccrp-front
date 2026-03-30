'use client';

import { SecondaryButton } from '@/components/common/Button';
import SimpleModal from '@/components/common/SimpleModal';
import { BusinessUnit, Project } from '@/graphql/__generated__/graphql';
import { BUSINESS_UNITS_DETAILS } from '@/graphql/queries/business-units';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import BusinessUnitsData from './BusinessUnitsData';
import ProjectsList from './ProjectsList';
import Available from './Available';
import AllocateButton from './AllocateButton';
import { onlyPositiveInteger } from './utils';

export default function BUAllocationButton({ businessUnitId }: { businessUnitId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
  const [availableObject, setAvailableObject] = useState<{
    available_percent: number;
    available_units: number;
  }>();
  const [amount, setAmount] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  const { loading, error, data, refetch } = useQuery<any>(BUSINESS_UNITS_DETAILS, {
    variables: {
      id: businessUnitId,
    },
  });

  const businessUnit: BusinessUnit = data?.businessUnitDetails;

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

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

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  return (
    <>
      <SecondaryButton onClick={openModal}>Add allocation</SecondaryButton>
      <SimpleModal
        isOpen={isOpen}
        onClose={closeModal}
        title={loading ? 'Loading...' : error ? `Error: ${error.message}` : businessUnit?.name || 'Add allocation'}
        footer={
          !loading && !error ? (
            <div className="text-right">
              <AllocateButton
                amount={parseInt(amount)}
                businessUnitId={businessUnitId}
                projectId={selectedProject?.id}
                hasError={hasError}
                onClose={closeModal}
              />
            </div>
          ) : null
        }
      >
        {loading ? null : error ? null : (
          <div className="mx-auto w-full text-center">
            <div className="relative w-full">
              <div className="font-inter bg-allocation-bu relative w-full rounded-2xl border border-opacity-light-10 px-6 py-4 text-left">
                <div className="text-lg uppercase text-neutral-200">{businessUnit.name}</div>
                <BusinessUnitsData businessUnitId={businessUnitId} loadingBU={loading} />
              </div>
              <div className="mt-8">
                <ProjectsList
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                />
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
                      businessUnitId={businessUnit?.id}
                      projectId={selectedProject?.id}
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
