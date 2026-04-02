'use client';

import { useTranslations } from 'next-intl';
import { ErrorReloadTable, NoDataTable } from '@/components/common/ErrorReload';
import PaginationComponent from '@/components/common/Pagination';
import Title from '@/components/common/Title';
import TableLoading from '@/components/table/TableLoading';
import ExportButton from '@/components/common/ExportButton';
import { CumulativeData, PageInfo } from '@/graphql/__generated__/graphql';
import { CUMULATIVE } from '@/graphql/queries/net-zero';
import { RESULT_PER_PAGE } from '@/utils/constant';
import { roundIfFloat } from '@/utils/numbers';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';

export default function ProjectDecarbonationTableCumulative({
  businessUnitId,
}: {
  businessUnitId: string;
}) {
  const t = useTranslations('tables');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { loading, error, data, refetch } = useQuery<any>(CUMULATIVE, {
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

  const cumulative: CumulativeData[] = data?.cumulative.data;
  const pagination: PageInfo = data?.cumulative.page_info;

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
    { header: 'Time Period', key: 'time_period' },
    { header: 'Cumulative Emissions (t)', key: 'emissions' },
    { header: 'Cumulative Retired (t)', key: 'ex_post_retired' },
    { header: 'Cumulative Forward (t)', key: 'ex_post_issued' },
    { header: 'Cumulative Spot (t)', key: 'ex_post_purchased' },
    { header: 'Cumulative Emission Debt (t)', key: 'debt' },
  ];
  const exportData: Record<string, unknown>[] = (cumulative || []).map((d) => ({
    time_period: d.time_period,
    emissions: d.emissions,
    ex_post_retired: d.ex_post_retired,
    ex_post_issued: d.ex_post_issued,
    ex_post_purchased: d.ex_post_purchased,
    debt: d.debt != null ? roundIfFloat(d.debt) : 'n/a',
  }));

  return (
    <div className="mt-12 w-full">
      <div className="flex items-center justify-between">
        <Title title={t('cumulative')} />
        <ExportButton data={exportData} columns={exportColumns} tableName="cumulative" />
      </div>
      <div className="font-inter mt-4 w-full overflow-x-auto border border-neutral-600 text-sm">
        <table className="min-w-full table-auto text-left">
          <thead className="h-10 whitespace-nowrap bg-neutral-500 text-neutral-100">
            <tr>
              <th className="sticky left-0 z-10 bg-neutral-500 px-4">Time Period</th>
              <th className="px-4">Cumulative Emissions (t)</th>
              <th className="px-4">Cumulative Retired (t)</th>
              <th className="px-4">Cumulative Forward (t)</th>
              <th className="px-4">Cumulative Spot (t)</th>
              <th className="px-4">Cumulative Emission Debt (t)</th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoading resultsPerPage={RESULT_PER_PAGE} numberOfColumns={11} />}
            {!loading && !error && <ProjectedDecarbonationLoaded cumulative={cumulative} />}
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

function ProjectedDecarbonationLoaded({ cumulative }: { cumulative: CumulativeData[] }) {
  if (cumulative.length === 0) {
    return <NoDataTable />;
  }

  return (
    <>
      {cumulative.map((data: any, idx: number) => {
        const {
          time_period,
          emissions,
          ex_post_issued,
          ex_post_purchased,
          ex_post_retired,
          debt,
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
            <td className="px-4">{emissions}</td>
            <td className="px-4">{ex_post_retired}</td>
            <td className="px-4">{ex_post_issued}</td>
            <td className="px-4">{ex_post_purchased}</td>
            <td className="px-4">{debt ? roundIfFloat(debt) : 'n/a'}</td>
          </tr>
        );
      })}
    </>
  );
}
