'use client';
import { AllocationAvailability } from "@/graphql/__generated__/graphql";
import { AVAILABLE_ALLOCATION } from "@/graphql/queries/allocation";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

interface AvailableProps {
    projectId: string | undefined;
    businessUnitId: string | undefined | any;
    setAvailableUnits: (n: number) => void;
}

export default function Available({ projectId, businessUnitId, setAvailableUnits }: AvailableProps) {
    const { loading, error, data } = useQuery(AVAILABLE_ALLOCATION, {
        variables: {
            project_id: projectId,
            business_unit_id: businessUnitId
        }
    });

    const available: AllocationAvailability = data?.availableToAllocate;

    useEffect(() => {
        if (available && typeof available.available_units === "number") {
            setAvailableUnits(available.available_units);
        }
    }, [available]);

    if (!projectId || !businessUnitId || loading) {
        return (
            <>-</>
        )
    }

    if (error) {
        console.error(error);

        return (
            <>n/a</>
        )
    }

    return (
        <>{available.available_units}</>
    )
}