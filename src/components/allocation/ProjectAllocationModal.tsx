'use client';

import { GreenButton, SecondaryButton } from "@/components/common/Button";
import { BusinessUnit, Project } from "@/graphql/__generated__/graphql";
import { useQuery } from "@apollo/client";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { useState } from "react";
import Available from "./Available";
import AllocateButton from "./AllocateButton";
import { GET_PROJECT_WITHOUT_VINTAGES } from "@/graphql/queries/projects";
import BUList from "./BUList";

export default function ProjectAllocationButton({projectId}: { projectId: string }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [selectedBU, setSelectedBU] = useState<BusinessUnit|undefined>(undefined);
  const [availableUnits, setAvailableUnits] = useState(0);
  const [amount, setAmount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const { loading, error, data } = useQuery(GET_PROJECT_WITHOUT_VINTAGES, {
    variables: {
        field: "id",
        value: projectId
    }
});

const project: Project = data?.projectBy;

  const handleAmountChange = (e: any) => {
    if (e.target.value > 100) {
        setAmount(100);
        return;
    }

    if (e.target.value < 0) {
        setAmount(0);
        return;
    }
    
    setAmount(e.target.value);
    setHasError(false);
  }

  if (loading) {
    return (
      <>
        <SecondaryButton onClick={onOpen}>Add allocation</SecondaryButton>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{
          body: "py-6",
          backdrop: "bg-opacityLight-5 backdrop-opacity-40",
          base: "bg-neutral-900 text-neutral-100",
        }}>
          <ModalContent>
            <ModalHeader>Loading...</ModalHeader>
          </ModalContent>
        </Modal>
      </>
    )
  }

  if (error) {
    console.error(error);

    return (
      <>
        <SecondaryButton onClick={onOpen}>Add allocation</SecondaryButton>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{
          body: "py-6",
          backdrop: "bg-opacityLight-5 backdrop-opacity-40",
          base: "bg-neutral-900 text-neutral-100",
        }}>
          <ModalContent>
            <ModalHeader>Error: {error.message}</ModalHeader>
          </ModalContent>
        </Modal>
      </>
    )
  }

  return (
    <>
      <GreenButton className="w-full" onClick={onOpen}>Add allocation</GreenButton>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{
          body: "py-6",
          backdrop: "bg-opacityLight-5 backdrop-opacity-40",
          base: "bg-neutral-900 text-neutral-100",
        }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="px-6">
                  <div className="text-center w-full mx-auto mt-8">
                    <div className="relative w-full">
                      <div className={`relative w-full rounded-2xl py-4 px-6 text-left font-inter border border-opacityLight-10 bg-allocation-bu`}>
                        <div className="text-lg uppercase text-neutral-200">{project.name}</div>
                      </div>
                      <div className="mt-8">
                        <BUList selectedBU={selectedBU} setSelectedBU={setSelectedBU} />
                    </div>
                      <div className="mt-8 font-light">
                        <div className="text-left text-neutral-200 uppercase">Percentage to allocate</div>
                      </div>
                      <div className="mt-1 w-full relative">
                        <input className={`bg-opacityLight-5 text-left outline-0 border border-opacityLight-10 px-3 py-3 rounded-xl w-full focus:border-neutral-300 ${hasError ? "border-red-500 focus:border-red-500" : ""}`} type="number" value={amount} max={100} name="amount" aria-label="Amount" onChange={handleAmountChange} />
                      </div>
                      <div className="flex items-center mt-1 ml-1 uppercase text-left text-neutral-200 text-xs">
                        <div className="">
                          Available 
                          <span className="text-neutral-50 font-bold ml-1">
                            <Available
                              businessUnitId={selectedBU?.id}
                              projectId={project.id}
                              setAvailableUnits={setAvailableUnits}
                            /> Units
                          </span>
                        </div>
                        <div className="ml-4">
                          To allocate 
                          <span className="text-neutral-50 font-bold ml-1">
                              {amount * availableUnits / 100} Units
                          </span>
                        </div>
                      </div>
                      <div className="mt-8 px-8 py-6 bg-neutral-800 rounded-xl border border-opacityLight-10 text-left text-sm">
                        Carbon units will be allocated to this business unit on a fifo basis, based on target and other business units allocations.
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full text-right my-8">
                  <AllocateButton amount={amount} businessUnitId={selectedBU?.id} projectId={project.id} hasError={hasError} onClose={onClose} />
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
