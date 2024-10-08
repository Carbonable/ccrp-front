'use client';
import { BusinessUnit } from '@/graphql/__generated__/graphql';
import { BUSINESS_UNITS } from '@/graphql/queries/business-units';
import { useQuery } from '@apollo/client';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect } from 'react';

export default function BUList({
  selectedBU,
  setSelectedBU,
}: {
  selectedBU: BusinessUnit | undefined;
  setSelectedBU: (project: BusinessUnit) => void;
}) {
  const { loading, error, data } = useQuery(BUSINESS_UNITS);

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
      <Listbox value={selectedBU} onChange={setSelectedBU}>
        <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-opacityLight-5 py-3 pl-3 pr-10 text-left shadow-md focus:outline-none sm:text-sm">
          <span className="block truncate">{selectedBU.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-600 py-2 text-base shadow-lg ring-1 ring-neutral-700 focus:outline-none sm:text-sm">
            {businessUnits.map((bu: BusinessUnit) => (
              <ListboxOption
                key={bu.id}
                className={({ focus }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 text-left ${
                    focus ? 'bg-neutral-500 text-neutral-300' : 'text-neutral-300'
                  }`
                }
                value={bu}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {bu.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-300">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </Listbox>
    </>
  );
}
