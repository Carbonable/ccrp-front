'use client';

import Pagination from '../../common/Pagination';
import { ErrorReloadTable, NoDataTable } from '../../common/ErrorReload';
import { AnnualData, PageInfo } from '@/graphql/__generated__/graphql';
import Title from '@/components/common/Title';
import TableLoading from '@/components/table/TableLoading';
import { RESULT_PER_PAGE } from '@/utils/constant';
import { useEffect, useState } from 'react';
import PaginationComponent from '../../common/Pagination';

export default function ProjectDecarbonationTableComponent({
  loading,
  error,
  data,
  refetchData,
  currentPage,
  setCurrentPage,
}: {
  loading: boolean;
  error: any;
  data: any;
  refetchData: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  if (error) {
    console.error(error);
  }

  const [totalPages, setTotalPages] = useState<number>(1);
  const annual: AnnualData[] = data?.annual.data;
  const pagination: PageInfo = data?.annual.page_info;

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
    <div className="mt-12 w-full">
      <Title title="Stock - Annual" />
      <div className="font-inter mt-4 w-full overflow-x-auto border border-neutral-600 text-sm">
        <table className="min-w-full table-auto text-left">
          <thead className="h-10 whitespace-nowrap bg-neutral-500 text-neutral-100">
            <tr>
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">Time Period</th>
              <th className="px-4">Ex-Post Issued (t)</th>
              <th className="px-4">Ex-Post Purchased (t)</th>
              <th className="px-4">Total Ex-Post (t)</th>
              <th className="px-4">Total Ex-Ante (t)</th>
              <th className="px-4">Ex-Post Retired (t)</th>
              <th className="px-4">Ex-Post Stock (t)</th>
              <th className="px-4">Ex-ante Stock (t)</th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoading resultsPerPage={RESULT_PER_PAGE} numberOfColumns={11} />}
            {!loading && !error && <ProjectedDecarbonationLoaded annual={annual} />}
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

function ProjectedDecarbonationLoaded({ annual }: { annual: AnnualData[] }) {
  if (annual.length === 0) {
    return <NoDataTable />;
  }

  return (
    <>
      {annual.map((data: AnnualData, idx: number) => {
        const {
          time_period,
          ex_post_issued,
          ex_post_purchased,
          ex_post_retired,
          ex_post_stock,
          ex_ante_stock,
          total_ex_ante,
          total_ex_post,
        } = data;

        if (!time_period) {
          return null;
        }

        return (
          <tr
            key={`projection_${idx}`}
            className={`h-12 border-b border-neutral-600 bg-neutral-800 last:border-b-0 hover:brightness-110 ${parseInt(time_period) < new Date().getFullYear() ? 'text-neutral-50' : 'text-neutral-200'}`}
          >
            <td className="sticky left-0 z-10 bg-neutral-800 px-4">{time_period}</td>
            <td className="px-4">{ex_post_issued}</td>
            <td className="px-4">{ex_post_purchased}</td>
            <td className="px-4">{total_ex_post}</td>
            <td className="px-4">{total_ex_ante}</td>
            <td className="px-4">{ex_post_retired}</td>
            <td className="px-4">{ex_post_stock}</td>
            <td className="px-4">{ex_ante_stock}</td>
          </tr>
        );
      })}
    </>
  );
}
