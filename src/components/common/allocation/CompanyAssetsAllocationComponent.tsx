'use client';

import TableLoading from '@/components/table/TableLoading';
import { CompanyCarbonAssetAllocationData, PageInfo } from '@/graphql/__generated__/graphql';
import { RESULT_PER_PAGE } from '@/utils/constant';
import { use, useEffect, useState } from 'react';
import { ErrorReloadTable, NoDataTable } from '../ErrorReload';
import { Pagination } from '@nextui-org/react';
import SquaredInitials from '../SquaredInitials';
import { getNumericPercentage } from '@/utils/utils';
import { SecondaryButton } from '../Button';
import PaginationComponent from '../Pagination';

interface CompanyAssetsAllocationProps {
  data: any;
  loading: boolean;
  error: any;
  refetchData: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function CompanyAssetsAllocationComponent({
  data,
  loading,
  error,
  refetchData,
  currentPage,
  setCurrentPage,
}: CompanyAssetsAllocationProps) {
  const [filteredCarbonAssetAllocation, setFilteredCarbonAssetAllocation] = useState<
    CompanyCarbonAssetAllocationData[]
  >([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  if (error) {
    console.error(error);
  }

  const carbonAssetAllocation: CompanyCarbonAssetAllocationData[] =
    data?.companyCarbonAssetAllocation.data;
  const pagination: PageInfo = data?.companyCarbonAssetAllocation.page_info;

  useEffect(() => {
    if (!carbonAssetAllocation) {
      return;
    }

    const filteredResult: CompanyCarbonAssetAllocationData[] = carbonAssetAllocation.filter(
      (allocation: CompanyCarbonAssetAllocationData) => {
        return allocation.total_allocated_to_date && allocation.total_allocated_to_date > 0;
      },
    );
    setFilteredCarbonAssetAllocation(filteredResult);
  }, [carbonAssetAllocation]);

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
              <th className="px-4">Type</th>
              <th className="px-4">Total Potential (t)</th>
              <th className="px-4">Ex-post to date (t)</th>
              <th className="px-4">Ex-ante to date (t)</th>
              <th className="px-4">Project completion (%)</th>
              <th className="px-4"></th>
              <th className="px-4">Total Allocated to date (t)</th>
              <th className="px-4">Total Available to date (t)</th>
              <th className="px-4">Allocation Rate (%)</th>
              <th className="px-4">Price/t ($)</th>
              <th className="px-4">Total amount (%)</th>
              <th className="px-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoading resultsPerPage={RESULT_PER_PAGE} numberOfColumns={13} />}
            {!loading && !error && (
              <ProjectFundingAllocationLoaded
                carbonAssetAllocation={filteredCarbonAssetAllocation}
              />
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
  carbonAssetAllocation: CompanyCarbonAssetAllocationData[];
}) {
  if (carbonAssetAllocation.length === 0) {
    return <NoDataTable />;
  }

  return (
    <>
      {carbonAssetAllocation.map((allocation: CompanyCarbonAssetAllocationData, idx: number) => {
        return (
          <tr
            key={`projection_${idx}`}
            className="group h-12 items-center whitespace-nowrap border-b border-neutral-600 bg-neutral-800 text-neutral-200 last:border-b-0 hover:brightness-110"
          >
            <td className="sticky left-0 z-10 bg-neutral-800 px-4">
              <div className="flex w-max items-center justify-start text-neutral-100">
                <div className="p-2">
                  <SquaredInitials text={allocation.project_name} color="random" />
                </div>
                <div className="ml-2 font-bold">{allocation.project_name}</div>
              </div>
            </td>
            <td className="px-4">{allocation.type}</td>
            <td className="px-4">{allocation.total_potential}</td>
            <td className="px-4">{allocation.ex_post_to_date}</td>
            <td className="px-4">{allocation.ex_ante_to_date}</td>
            <td className="px-4">
              <AllocationBar percentage={allocation.project_completion} />
            </td>
            <td className="px-4">{allocation.project_completion}</td>
            <td className="px-4">{allocation.total_allocated_to_date}</td>
            <td className="px-4">{allocation.total_available_to_date}</td>
            <td className="px-4">{allocation.allocation_rate}</td>
            <td className="px-4">{allocation.price}</td>
            <td className="px-4">{allocation.total_amount}</td>
            <td className="px-4">
              <SecondaryButton className="border-0">...</SecondaryButton>
            </td>
          </tr>
        );
      })}
    </>
  );
}

function AllocationBar({ percentage }: { percentage: string | any }) {
  const percentageInt = getNumericPercentage(percentage);
  return (
    <div className="h-2 w-full rounded-lg bg-neutral-100">
      <div
        className="h-full rounded-lg bg-greenish-500"
        style={{ width: `${percentageInt}%` }}
      ></div>
    </div>
  );
}
