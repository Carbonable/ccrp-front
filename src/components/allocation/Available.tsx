"use client";
import { AllocationAvailability } from "@/graphql/__generated__/graphql";
import { AVAILABLE_ALLOCATION } from "@/graphql/queries/allocation";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

interface AvailableProps {
  projectId: string | undefined;
  businessUnitId: string | undefined | any;

  setAvailableObject: (available: {
    available_percent: number;
    available_units: number;
  }) => void;

}

export default function Available({
  projectId,
  businessUnitId,
  setAvailableObject,
}: AvailableProps) {

  const { loading, error, data } = useQuery(AVAILABLE_ALLOCATION, {
    variables: {
      project_id: projectId,
      business_unit_id: businessUnitId,
    },
  });

  const available: AllocationAvailability = data?.availableToAllocate;

  useEffect(() => {
    if (available) {
      const { available_percent, available_units } = available;
      if (
        typeof available_percent === "number" &&
        typeof available_units === "number"
      ) {
        setAvailableObject({ available_percent, available_units });
      }

    }
  }, [available]);

  if (!projectId || !businessUnitId || loading) {
    return <>-</>;
  }

  if (error) {
    console.error(error);

    return <>n/a</>;
  }

  return <>{available.available_units}</>;
}
