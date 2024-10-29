'use client';

import { SecondaryButton } from '@/components/common/Button';
import { BusinessUnit, Project } from '@/graphql/__generated__/graphql';
import { BUSINESS_UNITS_DETAILS } from '@/graphql/queries/business-units';
import { useQuery } from '@apollo/client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';
import { useState } from 'react';
import BusinessUnitsData from './BusinessUnitsData';
import ProjectsList from './ProjectsList';
import Available from './Available';
import AllocateButton from './AllocateButton';
import { onlyPositiveInteger } from './utils';


export default function BUAllocationButton({ businessUnitId }: { businessUnitId: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);

  const [availableObject, setAvailableObject] = useState<{
    available_percent: number;
    available_units: number;
  }>();

  const [amount, setAmount] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  const { loading, error, data, refetch } = useQuery(BUSINESS_UNITS_DETAILS, {
    variables: {
      id: businessUnitId,
    },
  });

  const businessUnit: BusinessUnit = data?.businessUnitDetails;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let available = availableObject?.available_units ?? 0;

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
    } else if (parsedValue < 0) {
      setAmount('0');
      return;
    }
    setAmount(parsedValue.toString());
    setHasError(false);
  };
  useEffect(() => {
    refetch();
  }, [isOpen]);
  if (loading) {
    return (
      <>
        <SecondaryButton onClick={onOpen}>Add allocation</SecondaryButton>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          classNames={{
            body: 'py-6',
            backdrop: 'bg-opacityLight-5 backdrop-opacity-40',
            base: 'bg-neutral-900 text-neutral-100',
          }}
        >
          <ModalContent>
            <ModalHeader>Loading...</ModalHeader>
          </ModalContent>
        </Modal>
      </>
    );
  }

  if (error) {
    console.error(error);

    return (
      <>
        <SecondaryButton onClick={onOpen}>Add allocation</SecondaryButton>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          classNames={{
            body: 'py-6',
            backdrop: 'bg-opacityLight-5 backdrop-opacity-40',
            base: 'bg-neutral-900 text-neutral-100',
          }}
        >
          <ModalContent>
            <ModalHeader>Error: {error.message}</ModalHeader>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <>
      <SecondaryButton onClick={onOpen}>Add allocation</SecondaryButton>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          body: 'py-6',
          backdrop: 'bg-opacityLight-5 backdrop-opacity-40',
          base: 'bg-neutral-900 text-neutral-100',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="px-6">
                  <div className="mx-auto mt-8 w-full text-center">
                    <div className="relative w-full">
                      <div
                        className={`font-inter bg-allocation-bu relative w-full rounded-2xl border border-opacityLight-10 px-6 py-4 text-left`}
                      >
                        <div className="text-lg uppercase text-neutral-200">
                          {businessUnit.name}
                        </div>
                        <BusinessUnitsData businessUnitId={businessUnitId} loadingBU={loading} />
                      </div>
                      <div className="mt-8">
                        <ProjectsList
                          selectedProject={selectedProject}
                          setSelectedProject={setSelectedProject}
                        />
                      </div>
                      <div className="mt-8 font-light">
                        <div className="text-left uppercase text-neutral-200">
                          Amount to allocate
                        </div>
                      </div>
                      <div className="relative mt-1 w-full">
                        <input
                          className={`w-full rounded-xl border border-opacityLight-10 bg-opacityLight-5 px-3 py-3 text-left outline-0 focus:border-neutral-300 ${
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
                        <div className="">
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
                      <div className="mt-8 rounded-xl border border-opacityLight-10 bg-neutral-800 px-8 py-6 text-left text-sm">
                        Carbon units will be allocated to this business unit on a fifo basis, based
                        on target and other business units allocations.
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="my-8 w-full text-right">
                  <AllocateButton
                    amount={parseInt(amount)}
                    businessUnitId={businessUnitId}
                    projectId={selectedProject?.id}
                    hasError={hasError}
                    onClose={onClose}
                  />
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
