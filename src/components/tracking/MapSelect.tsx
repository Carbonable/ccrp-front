import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ValueProps } from '@/types/select';

export default function MapSelect({
  values,
  selectedValue,
  setSelectedValue,
}: {
  values: ValueProps[];
  selectedValue: ValueProps | undefined;
  setSelectedValue: (v: ValueProps) => void;
}) {
  function handleSelect(event: any) {
    setSelectedValue(event);
  }

  return (
    <Listbox value={selectedValue} onChange={handleSelect}>
      <div className="font-inter relative mt-1">
        <Listbox.Button
          className={({ open: boolean }) =>
            `flex w-full min-w-max cursor-pointer items-center justify-start rounded-lg border border-neutral-500 bg-opacityDark-70 py-2 pl-4 pr-10 text-left text-neutral-50 hover:bg-opacityDark-60 focus:outline-none`
          }
        >
          <span className="block truncate">{selectedValue?.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="font-inter top-100 absolute mt-1 max-h-60 w-[120px] overflow-auto rounded-md border border-neutral-500 bg-opacityDark-70 p-6 px-0 text-sm shadow-lg focus:outline-none">
            {values.map((value: ValueProps) => (
              <Listbox.Option
                key={value.id}
                value={value}
                className={({ active }) =>
                  `relative ml-0 cursor-pointer select-none list-none px-4 py-2 ${
                    active ? 'bg-opacityLight-5 text-neutral-50' : 'text-neutral-50'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={selected ? 'block truncate font-bold' : 'block truncate'}>
                      {value.name}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
