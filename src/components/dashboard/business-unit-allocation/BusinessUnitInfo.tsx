'use client';

import { SecondaryButton } from "@/components/common/Button";
import { BusinessUnit } from "@/graphql/__generated__/graphql";
import { BUSINESS_UNITS_DETAILS } from "@/graphql/queries/business-units";
import { useQuery } from "@apollo/client";
import { useState } from "react";

export default function BusinessUnitInfo({id}: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const openAllocation = () => {
    setIsOpen(true);
  }
  const { loading, error, data } = useQuery(BUSINESS_UNITS_DETAILS, {
    variables: {
      id
    }
  });

  const businessUnit: BusinessUnit = data?.businessUnitDetails;

  if (loading) {
    return (
      <>
        <div className="flex justify-between items-center mt-12 px-4">
          <div className="text-xl uppercase">
            Loading...
          </div>
          <div className="text-right">
            <SecondaryButton>Add allocation</SecondaryButton>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    console.error(error);

    return (
      <>
        <div className="flex justify-between items-center mt-12 px-4">
          <div className="text-xl uppercase">
            Error: {error.message}
          </div>
          <div className="text-right">
            <SecondaryButton>Add allocation</SecondaryButton>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="text-xl uppercase">
          {businessUnit.name}
        </div>
        <div className="text-neutral-200 font-light">
          {businessUnit.description}
        </div>
      </div>
      <div className="text-right">
        <SecondaryButton onClick={openAllocation}>Add allocation</SecondaryButton>
      </div>
    </div>
  )
}