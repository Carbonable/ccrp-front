'use client';

import { BusinessUnit } from "@/graphql/__generated__/graphql";
import { BUSINESS_UNITS_DETAILS } from "@/graphql/queries/business-units";
import { useQuery } from "@apollo/client";
import BUAllocationButton from "../../allocation/BUAllocationModal";

export default function BusinessUnitInfo({id}: { id: string }) {

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
        <BUAllocationButton businessUnitId={id} />
      </div>
    </div>
  )
}