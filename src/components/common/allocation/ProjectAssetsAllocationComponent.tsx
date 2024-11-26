'use client';
import { PageInfo, ProjectCarbonAssetAllocationData } from '@/graphql/__generated__/graphql';
import { ErrorReloadTable, NoDataTable } from '../ErrorReload';
import SquaredInitials from '../SquaredInitials';
import TableLoading from '@/components/table/TableLoading';
import { RESULT_PER_PAGE } from '@/utils/constant';
import { SecondaryButton } from '../Button';
import PaginationComponent from '../Pagination';
import { useEffect, useState } from 'react';
import Link from 'next/link';

//TODO check actual and allocation_amount

export default function ProjectAssetsAllocationComponent({
  data,
  loading,
  error,
  refetchData,
  currentPage,
  setCurrentPage,
}: {
  data: any;
  loading: boolean;
  error: any;
  refetchData: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  if (error) {
    console.error(error);
  }
  const [totalPages, setTotalPages] = useState<number>(1);
  const carbonAssetAllocation: ProjectCarbonAssetAllocationData[] =
    data?.projectCarbonAssetAllocation.data;
  const pagination: PageInfo = data?.projectCarbonAssetAllocation.page_info;

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
    <div className="mt-8 w-full">
      <div className="font-inter mt-4 w-full overflow-x-scroll border border-neutral-600 text-sm">
        <table className="min-w-full table-auto text-left">
          <thead className="h-10 whitespace-nowrap bg-neutral-500 text-neutral-100">
            <tr className="table-style">
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">Business Unit</th>
              <th className="px-4">Allocated (t)</th>
              <th className="px-4">Allocation amount ($)</th>
              <th className="px-4">Target (%)</th>
              <th className="px-4">Actual (%)</th>
              <th className="px-4">Start date</th>
              <th className="px-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoading resultsPerPage={RESULT_PER_PAGE} numberOfColumns={6} />}
            {error && <ErrorReloadTable refetchData={refetchData} />}
            {!loading && !error && (
              <ProjectFundingAllocationLoaded carbonAssetAllocation={carbonAssetAllocation} />
            )}
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
  carbonAssetAllocation: ProjectCarbonAssetAllocationData[];
}) {
  if (carbonAssetAllocation.length === 0) {
    return <NoDataTable />;
  }

  return (
    <>
      {carbonAssetAllocation.map((allocation: ProjectCarbonAssetAllocationData, idx: number) => {
        return (
          <tr
            key={`projection_${idx}`}
            className="group h-12 items-center whitespace-nowrap border-b border-neutral-600 bg-neutral-800 text-neutral-200 last:border-b-0 hover:brightness-110"
          >
            <td className="sticky left-0 z-10 bg-neutral-800 px-4">
              <div className="flex w-max items-center justify-start text-neutral-100">
                <div className="p-2">
                  <SquaredInitials text={allocation.business_unit.name} color="random" />
                </div>
                <div className="ml-2 font-bold"><Link href={`/dashboard/business-units-allocation/${allocation.business_unit.id}`} >
                {allocation.business_unit.name}
                </Link>
                </div>
              </div>
            </td>
            <td className="px-4">{allocation.allocated}</td>
            <td className="px-4">{allocation.allocation_amount}</td>
            <td className="px-4">{allocation.target}</td>
            <td className="px-4">{allocation.actual}</td>
            <td className="px-4">{allocation.start_date}</td>
            <td className="px-4">
              <SecondaryButton className="border-0">...</SecondaryButton>
            </td>
          </tr>
        );
      })}
    </>
  );
}
