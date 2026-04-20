'use client';

import CompanyAssetsAllocationComponent from '@/components/common/allocation/CompanyAssetsAllocationComponent';
import { GET_COMPANY_ALLOCATIONS } from '@/graphql/queries/allocation';
import { RESULT_PER_PAGE } from '@/utils/constant';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { useCompanyId } from '@/hooks/useCompanyId';

export default function ProjectFundingAllocation() {
  const [currentPage, setCurrentPage] = useState(1);
  const companyId = useCompanyId();
  const { loading, error, data, refetch } = useQuery<any>(GET_COMPANY_ALLOCATIONS, {
    variables: {
      id: companyId,
      pagination: {
        page: currentPage,
        count: RESULT_PER_PAGE,
      },
    },
  });
  console.table(data);

  const refetchData = () => {
    refetch({
      id: companyId,
      pagination: {
        page: currentPage,
        count: RESULT_PER_PAGE,
      },
    });
  };

  useEffect(() => {
    refetchData();
  }, [currentPage]);

  return (
    <CompanyAssetsAllocationComponent
      loading={loading}
      error={error}
      data={data}
      refetchData={refetchData}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
}
