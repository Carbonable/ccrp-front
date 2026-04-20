'use client';

import { OrderData, PageInfo } from '@/graphql/__generated__/graphql';
import { GET_STOCKS } from '@/graphql/queries/stock';
import { RESULT_PER_PAGE } from '@/utils/constant';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useTranslations } from 'next-intl';
import Title from '../../common/Title';
import { ErrorReloadTable, NoDataTable } from '../../common/ErrorReload';
import TableLoading from '@/components/table/TableLoading';
import PaginationComponent from '../../common/Pagination';
import { GET_ORDERS } from '@/graphql/queries/orders';
import  moment  from 'moment';
import ExportButton from '@/components/common/ExportButton';


export default function OrdersAnnualTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const t = useTranslations('tables');
  const companyId = useCompanyId();

  const { loading, error, data, refetch } = useQuery<any>(GET_ORDERS, {
    variables: {
      view: {
        company_id: companyId,
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
        company_id: companyId,
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

  const exportColumns = [
    { header: t('forYear'), key: 'order_for_year' },
    { header: t('vintage'), key: 'vintage' },
    { header: t('quantity'), key: 'quantity' },
    { header: t('deficit'), key: 'deficit' },
    { header: t('createdAt'), key: 'created_at' },
    { header: t('status'), key: 'status' },
  ];
  const exportData: Record<string, unknown>[] = (orders || []).map((d: OrderData) => ({
    order_for_year: d.order_for_year,
    vintage: d.vintage,
    quantity: d.quantity,
    deficit: d.deficit,
    created_at: d.created_at ? moment(d.created_at).format('YYYY-MM-DD HH:mm:ss') : '',
    status: d.status,
  }));

  return (
    <div className="mt-12 w-full">
      <div className="flex items-center justify-between">
        <Title title={t('ordersAnnual')} />
        <ExportButton data={exportData} columns={exportColumns} tableName="orders-annual" />
      </div>
      <div className="font-inter mt-4 w-full overflow-x-auto border border-neutral-600 text-sm">
        <table className="min-w-full table-auto text-left">
          <thead className="h-10 whitespace-nowrap bg-neutral-500 text-neutral-100">
            <tr>
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">{t('forYear')}</th>
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">{t('vintage')}</th>
              <th className="px-4">{t('quantity')}</th>
              <th className="px-4">{t('deficit')}</th>
              <th className="px-4">{t('createdAt')}</th>
              <th className="px-4">{t('status')}</th>
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
        const formattedWithDateFns = moment(created_at).format('YYYY-MM-DD HH:MM:SS');
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
