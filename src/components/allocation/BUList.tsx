'use client';

import { BusinessUnit } from '@/graphql/__generated__/graphql';
import { BUSINESS_UNITS } from '@/graphql/queries/business-units';
import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';

export default function BUList({
  selectedBU,
  setSelectedBU,
}: {
  selectedBU: BusinessUnit | undefined;
  setSelectedBU: (project: BusinessUnit) => void;
}) {
  const { loading, error, data } = useQuery<any>(BUSINESS_UNITS);

  if (error) {
    console.error(error);
  }

  const businessUnits: BusinessUnit[] = data?.businessUnits ?? [];

  useEffect(() => {
    if (businessUnits.length > 0 && !selectedBU) {
      setSelectedBU(businessUnits[0]);
    }
  }, [businessUnits, selectedBU, setSelectedBU]);

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value;
    const nextBusinessUnit = businessUnits.find((bu) => bu.id === nextId);
    if (nextBusinessUnit) {
      setSelectedBU(nextBusinessUnit);
    }
  };

  if (loading || !selectedBU) {
    return (
      <div className="flex flex-wrap items-center justify-between">
        <div className="w-full text-lg font-extrabold uppercase text-neutral-100 md:w-fit">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 text-left font-light uppercase text-neutral-200">
        Select business unit
      </div>
      <select
        className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-neutral-200 outline-none transition focus:border-primary"
        value={selectedBU.id || ''}
        onChange={handleSelectionChange}
      >
        {businessUnits.map((bu) => (
          <option key={bu.id || bu.name} value={bu.id || ''} className="bg-neutral-900 text-neutral-100">
            {bu.name}
          </option>
        ))}
      </select>
    </>
  );
}
