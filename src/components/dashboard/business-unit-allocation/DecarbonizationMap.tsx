'use client';
import { BUSINESS_UNITS } from '@/graphql/queries/business-units';
import Block from './Block';
import { useQuery } from '@apollo/client';
import { BusinessUnit } from '@/graphql/__generated__/graphql';
import ErrorReload from '@/components/common/ErrorReload';

export default function DecarbonizationMap() {
  const { loading, error, data, refetch } = useQuery(BUSINESS_UNITS);

  const businessUnits: BusinessUnit[] = data?.businessUnits;

  if (loading)
    return (
      <BusinessUnitWrapper>
        <div className="w-full animate-pulse cursor-pointer rounded-3xl border border-neutral-700 bg-opacityLight-5 p-4 xl:p-8"></div>
      </BusinessUnitWrapper>
    );

  if (error)
    return (
      <BusinessUnitWrapper>
        <ErrorReload refetchData={refetch} />
      </BusinessUnitWrapper>
    );

  if (businessUnits.length === 0)
    return <BusinessUnitWrapper>No business unit found</BusinessUnitWrapper>;

  return (
    <BusinessUnitWrapper>
      {businessUnits.map((businessUnit: BusinessUnit, idx: number) => (
        <a
          key={`block_${businessUnit.id}`}
          href={`/dashboard/business-units-allocation/${businessUnit.id}`}
          className="outline-none"
        >
          <Block block={businessUnit} />
        </a>
      ))}
    </BusinessUnitWrapper>
  );
}

function BusinessUnitWrapper({ children }: { children?: any }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <div className="w-full text-lg font-extrabold uppercase text-neutral-100 md:w-fit">
          Decarbonization map
        </div>
      </div>
      <div className="mt-12">
        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">{children}</div>
      </div>
    </>
  );
}
