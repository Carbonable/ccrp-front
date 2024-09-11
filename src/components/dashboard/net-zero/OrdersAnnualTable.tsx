'use client';

import { PageInfo, StockData } from '@/graphql/__generated__/graphql';
import { GET_STOCKS } from '@/graphql/queries/stock';
import { CARBONABLE_COMPANY_ID, RESULT_PER_PAGE } from '@/utils/constant';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import Title from '../../common/Title';
import { ErrorReloadTable, NoDataTable } from '../../common/ErrorReload';
import TableLoading from '@/components/table/TableLoading';
import PaginationComponent from '../../common/Pagination';

export default function OrdersAnnualTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { loading, error, data, refetch } = useQuery(GET_STOCKS, {
    variables: {
      view: {
        company_id: CARBONABLE_COMPANY_ID,
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
        company_id: CARBONABLE_COMPANY_ID,
      },
      pagination: {
        page: currentPage,
        count: RESULT_PER_PAGE,
      },
    });
  };

  const stocks: StockData[] = data?.getStock.data;
  const pagination: PageInfo = data?.getStock.page_info;

  useEffect(() => {
    if (!pagination || pagination.total_page === 0) {
      return;
    }

    setTotalPages(pagination.total_page);
  }, [pagination]);

  const handlePageClick = (data: number) => {
    setCurrentPage(data);
  };

  useEffect(() => {
    refetchData();
  }, [currentPage]);

  return (
    <div className="mt-12 w-full">
      <Title title="Orders - Annual" />
      <div className="font-inter mt-4 w-full overflow-x-auto border border-neutral-600 text-sm">
        <table className="min-w-full table-auto text-left">
          <thead className="h-10 whitespace-nowrap bg-neutral-500 text-neutral-100">
            <tr>
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">Time Period</th>
              <th className="px-4">Project</th>
              <th className="px-4">Qty allocated (t)</th>
              <th className="px-4">Stock available (t)</th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoading resultsPerPage={RESULT_PER_PAGE} numberOfColumns={5} />}
            {!loading && !error && <TableLoaded stocks={stocks} />}
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

function TableLoaded({ stocks }: { stocks: StockData[] }) {
  if (stocks.length === 0) {
    return <NoDataTable />;
  }

  return (
    <>
      {stocks.map((data: StockData, idx: number) => {
        const { vintage, project, quantity, available } = data;

        if (!vintage) {
          return null;
        }

        return (
          <tr
            key={`projection_${idx}`}
            className={`h-12 border-b border-neutral-600 bg-neutral-800 last:border-b-0 hover:brightness-110 ${parseInt(vintage) < new Date().getFullYear() ? 'text-neutral-50' : 'text-neutral-200'}`}
          >
            <td className="sticky left-0 z-10 bg-neutral-800 px-4">{vintage}</td>
            <td className="px-4">{project.name}</td>
            <td className="px-4">{quantity}</td>
            <td className="px-4">{available}</td>
          </tr>
        );
      })}
    </>
  );
}
