"use client";
import BUAssetsAllocationComponent from "@/components/common/allocation/BUAssetsAllocationComponent";
import { GET_BU_ALLOCATIONS } from "@/graphql/queries/allocation";
import { RESULT_PER_PAGE } from "@/utils/constant";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export default function ProjectFundingAllocation({
  businessUnitId,
}: {
  businessUnitId: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, data, refetch } = useQuery(GET_BU_ALLOCATIONS, {
    variables: {
      id: businessUnitId,
      pagination: {
        page: currentPage,
        count: RESULT_PER_PAGE,
      },
    },
  });
  const refetchData = () => {
    refetch({
      id: businessUnitId,
      pagination: {
        page: currentPage,
        count: RESULT_PER_PAGE,
      },
    });
  };

  useEffect(() => {
    console.log("DATA");
    console.table(data);
    refetchData();
  }, [currentPage]);

  return (
    <BUAssetsAllocationComponent
      loading={loading}
      error={error}
      data={data}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      refetchData={refetchData}
    />
  );
}
