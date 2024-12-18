'use client';
import ProjectDecarbonationTableComponent from '@/components/common/net-zero/ProjectDecarbonationTableComponent';
import { ANNUAL } from '@/graphql/queries/net-zero';
import { RESULT_PER_PAGE } from '@/utils/constant';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

export default function ProjectDecarbonationTable({ businessUnitId }: { businessUnitId: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, data, refetch } = useQuery(ANNUAL, {
    variables: {
      view: {
        business_unit_id: businessUnitId,
      },
      pagination: {
        page: currentPage,
        count: RESULT_PER_PAGE,
      },
    },
  });

  const refetchData = () => {
    refetch({
      view: {
        business_unit_id: businessUnitId,
      },
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
    <ProjectDecarbonationTableComponent
      loading={loading}
      error={error}
      data={data}
      refetchData={refetchData}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      buView={true}
    />
  );
}
