'use client';

import { BusinessUnitCarbonAssetAllocationData, PageInfo } from '@/graphql/__generated__/graphql';
import { ErrorReloadTable, NoDataTable } from '../ErrorReload';
import SquaredInitials from '../SquaredInitials';
import { useEffect, useState } from 'react';
import PaginationComponent from '../Pagination';
import TableLoading from '@/components/table/TableLoading';
import { RESULT_PER_PAGE } from '@/utils/constant';
import { SecondaryButton } from '../Button';
import Link from 'next/link';

interface TableLoadingProps {
  data: any;
  loading: boolean;
  error: any;
  refetchData: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function BUAssetsAllocationComponent({
  data,
  loading,
  error,
  refetchData,
  currentPage,
  setCurrentPage,
}: TableLoadingProps) {
  if (error) {
    console.error(error);
  }

  const carbonAssetAllocation: BusinessUnitCarbonAssetAllocationData[] =
    data?.businessUnitCarbonAssetAllocation.data;
  const pagination: PageInfo = data?.businessUnitCarbonAssetAllocation.page_info;
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (!pagination || pagination.total_page === 0) {
      return;
    }

    setTotalPages(pagination.total_page);
  }, [pagination]);

  const handlePageClick = (data: number) => {
    setCurrentPage(data);
  };

  return (
    <div className="w-full">
      <div className="font-inter mt-4 w-full overflow-x-scroll border border-neutral-600 text-sm">
        <table className="min-w-full table-auto text-left">
          <thead className="h-10 whitespace-nowrap bg-neutral-500 text-neutral-100">
            <tr className="table-style">
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">Project Name</th>
              <th className="px-4">Total Carbon Unit (t)</th>
              <th className="px-4">Allocated (t)</th>
              <th className="px-4">Generated (t)</th>
              <th className="px-4">Forward (t)</th>
              <th className="px-4">Retired (t)</th>
              <th className="px-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoading resultsPerPage={RESULT_PER_PAGE} numberOfColumns={6} />}
            {!loading && !error && (
              <ProjectFundingAllocationLoaded carbonAssetAllocation={carbonAssetAllocation} />
            )}
            {error && <ErrorReloadTable refetchData={refetchData} />}
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex items-center justify-center">
        <PaginationComponent
          initialPage={currentPage}
          totalPages={totalPages}
          handlePageClick={handlePageClick}
        />
      </div>
    </div>
  );
}

function ProjectFundingAllocationLoaded({
  carbonAssetAllocation,
}: {
  carbonAssetAllocation: BusinessUnitCarbonAssetAllocationData[];
}) {
  if (carbonAssetAllocation.length === 0) {
    return <NoDataTable />;
  }

  return (
    <>
      {carbonAssetAllocation.map(
        (allocation: BusinessUnitCarbonAssetAllocationData, idx: number) => {
          return (
            <tr
              key={`projection_${idx}`}
              className="group h-12 items-center whitespace-nowrap border-b border-neutral-600 bg-neutral-800 text-neutral-200 last:border-b-0 hover:brightness-110"
            >
              <td className="sticky left-0 z-10 bg-neutral-800 px-4">
                <div className="flex w-max items-center justify-start text-neutral-100">
                  <div className="p-2">
                    <SquaredInitials text={allocation.project.name} color="random" />
                  </div>
                  <div className="ml-2 font-bold"><Link href={`/projects/${allocation.project.slug}`}>
                  {allocation.project.name}
                  </Link>
                  </div>
                </div>
              </td>
              <td className="px-4">{allocation.total_cu}</td>
              <td className="px-4">{allocation.allocated}</td>
              <td className="px-4">{allocation.generated}</td>
              <td className="px-4">{allocation.forward}</td>
              <td className="px-4">{allocation.retired}</td>
              <td className="px-4">
                <SecondaryButton className="border-0">...</SecondaryButton>
              </td>
            </tr>
          );
        },
      )}
    </>
  );
}
