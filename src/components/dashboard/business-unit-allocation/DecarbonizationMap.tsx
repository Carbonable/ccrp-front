'use client';
import { BUSINESS_UNITS } from "@/graphql/queries/business-units";
import Block from "./Block";
import { useQuery } from "@apollo/client";
import { BusinessUnit } from "@/graphql/__generated__/graphql";
import ErrorReload from "@/components/common/ErrorReload";

export default function DecarbonizationMap() {
    const { loading, error, data, refetch } = useQuery(BUSINESS_UNITS);

    const businessUnits: BusinessUnit[] = data?.businessUnits;

    console.log(error);

    if (loading) return (
        <BusinessUnitWrapper>
            <div className="border border-neutral-700 w-full p-4 xl:p-8 rounded-3xl cursor-pointer animate-pulse bg-opacityLight-5"></div>
        </BusinessUnitWrapper>
    )

    if (error) return (
        <BusinessUnitWrapper>
            <ErrorReload refetchData={refetch} />
        </BusinessUnitWrapper>
    )

    if (businessUnits.length === 0) return (
        <BusinessUnitWrapper>
            No business unit found
        </BusinessUnitWrapper>
    )

    return (
        <BusinessUnitWrapper>
            {businessUnits.map((businessUnit: BusinessUnit, idx: number) => (
                <a key={`block_${businessUnit.id}`} href={`/dashboard/business-units-allocation/${businessUnit.id}`} className="outline-none">
                    <Block block={businessUnit} />
                </a>
            ))}
        </BusinessUnitWrapper>
    )
}

function BusinessUnitWrapper({ children }: { children?: any }) {

    return (
        <>
            <div className="flex justify-between items-center flex-wrap">
                <div className="font-extrabold text-neutral-100 text-lg uppercase w-full md:w-fit">
                    Decarbonization map
                </div>
            </div>
            <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                    {children}
                </div>
            </div>
        </>
    )
}