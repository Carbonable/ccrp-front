'use client';

import { AnnualData, PageInfo } from '@/graphql/__generated__/graphql';
import { ErrorReloadTable, NoDataTable } from '../../common/ErrorReload';
import Title from '../Title';
import PaginationComponent from '../Pagination';
import TableLoading from '@/components/table/TableLoading';
import { RESULT_PER_PAGE } from '@/utils/constant';
import { useEffect, useState } from 'react';
import { roundIfFloat } from '@/utils/numbers';
import ExportButton from '@/components/common/ExportButton';
import { useTranslations } from 'next-intl';

export default function ProjectDecarbonationTableComponent({
  loading,
  error,
  data,
  refetchData,
  currentPage,
  setCurrentPage,
  buView
}: {
  loading: boolean;
  error: any;
  data: any;
  refetchData: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  buView: boolean;
}) {
  const [totalPages, setTotalPages] = useState<number>(1);
  const t = useTranslations('tables');

  if (error) {
    console.error(error);
  }

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

  const exportColumns = [
    { header: t('timePeriod'), key: 'time_period' },
    { header: t('emission'), key: 'emissions' },
    { header: t('exPostForward'), key: 'ex_post_issued' },
    { header: t('exPostSpot'), key: 'ex_post_purchased' },
    { header: t('totalExPost'), key: 'total_ex_post' },
    { header: t('exPostRetired'), key: 'ex_post_retired' },
    { header: t('totalExAnte'), key: 'total_ex_ante' },
    { header: t('neutralityTarget'), key: 'target' },
    { header: t('actualRate'), key: 'actual_rate' },
    { header: t('delta'), key: 'delta' },
    { header: t('debt'), key: 'debt' },
    ...(!buView ? [{ header: t('exPostStock'), key: 'ex_post_stock' }, { header: t('exAnteStock'), key: 'ex_ante_stock' }] : []),
  ];
  const exportData: Record<string, unknown>[] = (annual || []).map((d) => ({
    time_period: d.time_period,
    emissions: d.emissions,
    ex_post_issued: d.ex_post_issued,
    ex_post_purchased: d.ex_post_purchased,
    total_ex_post: d.total_ex_post,
    ex_post_retired: d.ex_post_retired,
    total_ex_ante: d.total_ex_ante,
    target: d.target,
    actual_rate: d.actual_rate,
    delta: d.delta,
    debt: d.debt,
    ex_post_stock: d.ex_post_stock,
    ex_ante_stock: d.ex_ante_stock,
  }));

  return (
    <div className="mt-12 w-full">
      <div className="flex items-center justify-between">
        <Title title={t('stockAnnual')} />
        <ExportButton data={exportData} columns={exportColumns} tableName="stock-annual" />
      </div>
      <div className="font-inter mt-4 w-full overflow-x-auto border border-neutral-600 text-sm">
        <table className="min-w-full table-auto text-left">
          <thead className="h-10 whitespace-nowrap bg-neutral-500 text-neutral-100">
            <tr>
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">{t('timePeriod')}</th>
              <th className="px-4">{t('emission')}</th>
              <th className="px-4">{t('exPostForward')}</th>
              <th className="px-4">{t('exPostSpot')}</th>
              <th className="px-4">{t('totalExPost')}</th>
              <th className="px-4">{t('exPostRetired')}</th>
              <th className="px-4">{t('totalExAnte')}</th>
              <th className="px-4">{t('neutralityTarget')}</th>
              <th className="px-4">{t('actualRate')}</th>
              <th className="px-4">{t('delta')}</th>
              <th className="px-4">{t('debt')}</th>
              {!buView && <th className="px-4">{t('exPostStock')}</th>}
              {!buView && <th className="px-4">{t('exAnteStock')}</th>}
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoading resultsPerPage={RESULT_PER_PAGE} numberOfColumns={11} />}
            {error && <ErrorReloadTable refetchData={refetchData} />}
            {!loading && !error && <ProjectedDecarbonationLoaded annual={annual} buView={buView} />}
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

function ProjectedDecarbonationLoaded({ annual, buView }: { annual: AnnualData[], buView: boolean }) {
  if (annual.length === 0) {
    return <NoDataTable />;
  }

  return (
    <>
      {annual.map((data: AnnualData, idx: number) => {
        const {
          time_period,
          emissions,
          ex_post_issued,
          ex_post_purchased,
          ex_post_retired,
          target,
          actual_rate,
          delta,
          debt,
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
            className={`h-12 border-b border-neutral-600 bg-neutral-800 last:border-b-0 hover:brightness-110 ${
              parseInt(time_period) < new Date().getFullYear()
                ? 'text-neutral-50'
                : 'text-neutral-200'
            }`}
          >
            <td className="sticky left-0 z-10 bg-neutral-800 px-4">{time_period}</td>
            <td className="px-4">{roundIfFloat(emissions)}</td>
            <td className="px-4">{roundIfFloat(ex_post_issued)}</td>
            <td className="px-4">{roundIfFloat(ex_post_purchased)}</td>
            <td className="px-4">{roundIfFloat(total_ex_post)}</td>
            <td className="px-4">{roundIfFloat(ex_post_retired)}</td>
            <td className="px-4">{roundIfFloat(total_ex_ante)}</td>
            <td className="px-4">{roundIfFloat(target)}</td>
            <td className="px-4">{roundIfFloat(actual_rate)}</td>
            <td className="px-4">{roundIfFloat(delta)}</td>
            <td className="px-4">{roundIfFloat(debt)}</td>
            {!buView && <td className="px-4">{roundIfFloat(ex_post_stock)}</td>}
            {!buView && <td className="px-4">{roundIfFloat(ex_ante_stock)}</td>}
          </tr>
        );
      })}
    </>
  );
}
