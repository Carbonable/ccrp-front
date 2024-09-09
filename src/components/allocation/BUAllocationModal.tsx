"use client";

import { SecondaryButton } from "@/components/common/Button";
import { BusinessUnit, Project } from "@/graphql/__generated__/graphql";
import { BUSINESS_UNITS_DETAILS } from "@/graphql/queries/business-units";
import { useQuery } from "@apollo/client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import BusinessUnitsData from "./BusinessUnitsData";
import ProjectsList from "./ProjectsList";
import Available from "./Available";
import AllocateButton from "./AllocateButton";
import { onlyPositiveInteger } from "./utils";

export default function BUAllocationButton({
  businessUnitId,
}: {
  businessUnitId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );

  const [availableObject, setAvailableObject] = useState<{
    available_percent: number;
    available_units: number;
  }>();

  const [amountPerc, setAmountPerc] = useState(0);
  const [hasError, setHasError] = useState(false);

  const { loading, error, data } = useQuery(BUSINESS_UNITS_DETAILS, {
    variables: {
      id: businessUnitId,
    },
  });

  const businessUnit: BusinessUnit = data?.businessUnitDetails;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const isValidInteger = /^[0-9]*$/.test(value);

    if (!isValidInteger) {
      setHasError(true);
      return;
    }

    const parsedValue = parseInt(value, 10);

    if (parsedValue > 100) {
      setAmountPerc(100);
      return;
    } else if (parsedValue < 0) {
      setAmountPerc(0);
      return;
    }

    setAmountPerc(parsedValue);
    setHasError(false);
  };
  if (loading) {
    return (
      <>
        <SecondaryButton onClick={onOpen}>Add allocation</SecondaryButton>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          classNames={{
            body: "py-6",
            backdrop: "bg-opacityLight-5 backdrop-opacity-40",
            base: "bg-neutral-900 text-neutral-100",
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
            body: "py-6",
            backdrop: "bg-opacityLight-5 backdrop-opacity-40",
            base: "bg-neutral-900 text-neutral-100",
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
          body: "py-6",
          backdrop: "bg-opacityLight-5 backdrop-opacity-40",
          base: "bg-neutral-900 text-neutral-100",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="px-6">
                  <div className="text-center w-full mx-auto mt-8">
                    <div className="relative w-full">
                      <div
                        className={`relative w-full rounded-2xl py-4 px-6 text-left font-inter border border-opacityLight-10 bg-allocation-bu`}
                      >
                        <div className="text-lg uppercase text-neutral-200">
                          {businessUnit.name}
                        </div>
                        <BusinessUnitsData
                          businessUnitId={businessUnitId}
                          loadingBU={loading}
                        />
                      </div>
                      <div className="mt-8">
                        <ProjectsList
                          selectedProject={selectedProject}
                          setSelectedProject={setSelectedProject}
                        />
                      </div>
                      <div className="mt-8 font-light">
                        <div className="text-left text-neutral-200 uppercase">
                          Percentage to allocate
                        </div>
                      </div>
                      <div className="mt-1 w-full relative">
                        <input
                          className={`bg-opacityLight-5 text-left outline-0 border border-opacityLight-10 px-3 py-3 rounded-xl w-full focus:border-neutral-300 ${
                            hasError
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          type="number"
                          value={amountPerc}
                          max={100}
                          name="amount"
                          aria-label="Amount"
                          onChange={handleAmountChange}
                          onKeyDown={onlyPositiveInteger}
                        />
                      </div>
                      <div className="flex items-center mt-1 ml-1 uppercase text-left text-neutral-200 text-xs">
                        <div className="">
                          Available
                          <span className="text-neutral-50 font-bold ml-1">
                            <Available
                              businessUnitId={businessUnitId}
                              projectId={selectedProject?.id}
                              setAvailableObject={setAvailableObject}
                            />{" "}
                            Units
                          </span>
                        </div>
                        <div className="ml-4">
                          To allocate
                          <span className="text-neutral-50 font-bold ml-1">
                            {(amountPerc * availableObject?.available_units!) /
                              100}{" "}
                            Units
                          </span>
                        </div>
                      </div>
                      <div className="mt-8 px-8 py-6 bg-neutral-800 rounded-xl border border-opacityLight-10 text-left text-sm">
                        Carbon units will be allocated to this business unit on
                        a fifo basis, based on target and other business units
                        allocations.
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="w-full text-right my-8">
                  <AllocateButton
                    amount={amountPerc}
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
