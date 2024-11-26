'use client';

import { OrderData, PageInfo } from '@/graphql/__generated__/graphql';
import { GET_STOCKS } from '@/graphql/queries/stock';
import { CARBONABLE_COMPANY_ID, RESULT_PER_PAGE } from '@/utils/constant';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import Title from '../../common/Title';
import { ErrorReloadTable, NoDataTable } from '../../common/ErrorReload';
import TableLoading from '@/components/table/TableLoading';
import PaginationComponent from '../../common/Pagination';
import { GET_ORDERS } from '@/graphql/queries/orders';
import { format } from 'date-fns';


export default function OrdersAnnualTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { loading, error, data, refetch } = useQuery(GET_ORDERS, {
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
console.log("Dat" ,data)

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

  const orders: OrderData[] = data?.getOrder?.data!;
  const pagination: PageInfo = data?.getStock?.page_info;

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
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">For Year</th>
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">Vintage</th>
              <th className="px-4">Quantity</th>
              <th className="px-4">Deficit</th>
              <th className="px-4">Created at</th>
              <th className="px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoading resultsPerPage={RESULT_PER_PAGE} numberOfColumns={5} />}
            {!loading && !error && <TableLoaded orders={orders} />}
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

function TableLoaded({ orders }: { orders: OrderData[] }) {
  if (!orders || orders.length === 0) {
    return <NoDataTable />;
  }

  return (
    <>
      {orders.map((data: OrderData, idx: number) => {
        const {   created_at,
          order_for_year,
          vintage,
          quantity,
          deficit,
          status,} = data;

        if (!vintage) {
          return null;
        }
        const formattedWithDateFns = format(created_at, 'yyyy-MM-dd');
        return (
          <tr
            key={`projection_${idx}`}
            className={`h-12 border-b border-neutral-600 bg-neutral-800 last:border-b-0 hover:brightness-110 ${vintage < new Date().getFullYear() ? 'text-neutral-50' : 'text-neutral-200'}`}
          >
            <td className="sticky left-0 z-10 bg-neutral-800 px-4">{order_for_year}</td>
            <td className="px-4">{vintage}</td>
            <td className="px-4">{quantity}</td>
            <td className="px-4">{deficit}</td>
            <td className="px-4">{formattedWithDateFns}</td>
            <td className="px-4">{status}</td>
          </tr>
        );
      })}
    </>
  );
}
