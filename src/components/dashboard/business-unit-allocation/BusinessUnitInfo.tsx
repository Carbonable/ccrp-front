'use client';

import { BusinessUnit } from '@/graphql/__generated__/graphql';
import { BUSINESS_UNITS_DETAILS } from '@/graphql/queries/business-units';
import { useQuery } from '@apollo/client';
import BUAllocationButton from '../../allocation/BUAllocationModal';

export default function BusinessUnitInfo({ id }: { id: string }) {
  const { loading, error, data } = useQuery(BUSINESS_UNITS_DETAILS, {
    variables: {
      id,
    },
  });

  const businessUnit: BusinessUnit = data?.businessUnitDetails;

  if (loading) {
    return (
      <>
        <div className="mt-12 flex items-center justify-between px-4">
          <div className="text-xl uppercase">Loading...</div>
        </div>
      </>
    );
  }

  if (error) {
    console.error(error);

    return (
      <>
        <div className="mt-12 flex items-center justify-between px-4">
          <div className="text-xl uppercase">Error: {error.message}</div>
        </div>
      </>
    );
  }

  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xl uppercase">{businessUnit.name}</div>
        <div className="font-light text-neutral-200">{businessUnit.description}</div>
      </div>
      <div className="text-right">
        <BUAllocationButton businessUnitId={id} />
      </div>
    </div>
  );
}
