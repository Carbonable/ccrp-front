'use client';

import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import PaginationComponent from '../../common/Pagination';
import { FINANCIAL_ANALYSIS } from '@/graphql/queries/net-zero';
import { CARBONABLE_COMPANY_ID, RESULT_PER_PAGE } from '@/utils/constant';
import { FinancialAnalysisData, PageInfo } from '@/graphql/__generated__/graphql';
import TableLoading from '@/components/table/TableLoading';
import { ErrorReloadTable, NoDataTable } from '../../common/ErrorReload';
import Title from '../../common/Title';
import ExportButton from '@/components/common/ExportButton';

export default function FinancialAnalysisTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const t = useTranslations('tables');

  const { loading, error, data, refetch } = useQuery<any>(FINANCIAL_ANALYSIS, {
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

  const financialAnalysis: FinancialAnalysisData[] = data?.financialAnalysis.data;
  const pagination: PageInfo = data?.financialAnalysis.page_info;

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
    { header: t('timePeriod'), key: 'year' },
    { header: t('avgSpotPrice'), key: 'avg_purchased_price' },
    { header: t('avgForwardPrice'), key: 'avg_issued_price' },
    { header: t('avgPrice'), key: 'avg_price' },
    { header: t('totalSpotAmount'), key: 'total_purchased_amount' },
    { header: t('totalForwardAmount'), key: 'total_issued_amount' },
    { header: t('totalAmount'), key: 'total_amount' },
    { header: t('allTimeAvgPurchasedPrice'), key: 'all_time_avg_purchased_price' },
    { header: t('allTimeAvgIssuedPrice'), key: 'all_time_avg_issued_price' },
    { header: t('allTimeAvgPrice'), key: 'all_time_avg_price' },
    { header: t('cumulativeTotalAmount'), key: 'cumulative_total_amount' },
  ];
  const exportData: Record<string, unknown>[] = (financialAnalysis || []).map((d: FinancialAnalysisData) => ({
    year: d.year,
    avg_purchased_price: d.avg_purchased_price,
    avg_issued_price: d.avg_issued_price,
    avg_price: d.avg_price,
    total_purchased_amount: d.total_purchased_amount,
    total_issued_amount: d.total_issued_amount,
    total_amount: d.total_amount,
    all_time_avg_purchased_price: d.all_time_avg_purchased_price,
    all_time_avg_issued_price: d.all_time_avg_issued_price,
    all_time_avg_price: d.all_time_avg_price,
    cumulative_total_amount: d.cumulative_total_amount,
  }));

  return (
    <div className="mt-12 w-full">
      <div className="flex items-center justify-between">
        <Title title={t('financialAnalysis')} />
        <ExportButton data={exportData} columns={exportColumns} tableName="financial-analysis" />
      </div>
      <div className="font-inter mt-4 w-full overflow-x-auto border border-neutral-600 text-sm">
        <table className="min-w-full table-auto text-left">
          <thead className="h-10 whitespace-nowrap bg-neutral-500 text-neutral-100">
            <tr>
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">{t('timePeriod')}</th>
              <th className="px-4">{t('avgSpotPrice')}</th>
              <th className="px-4">{t('avgForwardPrice')}</th>
              <th className="px-4">{t('avgPrice')}</th>
              <th className="px-4">{t('totalSpotAmount')}</th>
              <th className="px-4">{t('totalForwardAmount')}</th>
              <th className="px-4">{t('totalAmount')}</th>
              <th className="px-4">{t('allTimeAvgPurchasedPrice')}</th>
              <th className="px-4">{t('allTimeAvgIssuedPrice')}</th>
              <th className="px-4">{t('allTimeAvgPrice')}</th>
              <th className="px-4">{t('cumulativeTotalAmount')}</th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoading resultsPerPage={RESULT_PER_PAGE} numberOfColumns={11} />}
            {!loading && !error && <TableLoaded financialAnalysis={financialAnalysis} />}
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

function TableLoaded({ financialAnalysis }: { financialAnalysis: FinancialAnalysisData[] }) {
  if (financialAnalysis.length === 0) {
    return <NoDataTable />;
  }

  return (
    <>
      {financialAnalysis.map((data: FinancialAnalysisData, idx: number) => {
        const {
          year,
          all_time_avg_issued_price,
          all_time_avg_purchased_price,
          all_time_avg_price,
          avg_issued_price,
          avg_purchased_price,
          avg_price,
          cumulative_total_amount,
          total_amount,
          total_issued_amount,
          total_purchased_amount,
        } = data;

        if (!year) {
          return null;
        }

        return (
          <tr
            key={`projection_${idx}`}
            className={`h-12 border-b border-neutral-600 bg-neutral-800 last:border-b-0 hover:brightness-110 ${year < new Date().getFullYear() ? 'text-neutral-50' : 'text-neutral-200'}`}
          >
            <td className="sticky left-0 z-10 bg-neutral-800 px-4">{year}</td>
            <td className="px-4">{avg_purchased_price}</td>
            <td className="px-4">{avg_issued_price}</td>
            <td className="px-4">{avg_price}</td>
            <td className="px-4">{total_purchased_amount}</td>
            <td className="px-4">{total_issued_amount}</td>
            <td className="px-4">{total_amount}</td>
            <td className="px-4">{all_time_avg_purchased_price}</td>
            <td className="px-4">{all_time_avg_issued_price}</td>
            <td className="px-4">{all_time_avg_price}</td>
            <td className="px-4">{cumulative_total_amount}</td>
          </tr>
        );
      })}
    </>
  );
}
