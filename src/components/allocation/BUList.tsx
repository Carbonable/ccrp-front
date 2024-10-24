'use client';
import { BusinessUnit } from '@/graphql/__generated__/graphql';
import { BUSINESS_UNITS } from '@/graphql/queries/business-units';
import { useQuery } from '@apollo/client';
import { Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';

export default function BUList({
  selectedBU,
  setSelectedBU,
}: {
  selectedBU: BusinessUnit | undefined;
  setSelectedBU: (project: BusinessUnit) => void;
}) {
  const { loading, error, data } = useQuery(BUSINESS_UNITS);
  const [value, setValue] = useState<string>('');

  const handleSelectionChange = (e: any) => {
    if (!e.target.value || businessUnits === undefined || businessUnits.length === 0) {
      return;
    }

    setValue(e.target.value);
    const selectBu = businessUnits.find((bu) => bu.id === e.target.value);
    if (selectBu) {
      setSelectedBU(selectBu);
    }
  };

  if (error) {
    console.error(error);
  }

  const businessUnits: BusinessUnit[] = data?.businessUnits;

  useEffect(() => {
    if (businessUnits && businessUnits.length > 0) {
      setSelectedBU(businessUnits[0]);
    }
  }, [businessUnits]);

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
      <Select
        variant="flat"
        className="w-full select-component"
        classNames={{popoverContent: 'bg-neutral-800', value: '!text-neutral-200'}}
        selectedKeys={[value]}
        onChange={handleSelectionChange}
      >
        {businessUnits.map((bu, index) => (
          <SelectItem key={`bu_${index}`}>{bu.name}</SelectItem>
        ))}
      </Select>
    </>
  );
}
