'use client';

import { useTranslations } from 'next-intl';
import { GlobalKPI } from '@/components/KPI';
import { GlobalData } from '@/graphql/__generated__/graphql';

interface GlobalKPIProps {
  loading: boolean;
  error: any;
  data: any;
  refetch: () => void;
}

export default function GlobalDataComponent({ loading, error, data, refetch }: GlobalKPIProps) {
  const t = useTranslations('dashboard');

  if (error) {
    console.error(error);
  }

  const refetchData = () => {
    refetch();
  };

  const globalData: GlobalData = data?.getGlobalData;

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
      <GlobalKPI
        title={t('targetCurrentYear')}
        kpi={globalData?.target}
        loading={loading}
        error={error}
        refetchData={refetchData}
      />
      <GlobalKPI
        title={t('actualCurrentYear')}
        kpi={globalData?.actual}
        loading={loading}
        error={error}
        refetchData={refetchData}
      />
      <GlobalKPI
        title={t('deltaCurrentYear')}
        kpi={globalData?.debt}
        loading={loading}
        error={error}
        refetchData={refetchData}
      />
      <GlobalKPI
        title={t('deltaTotal')}
        kpi={globalData?.cumulative_debt}
        loading={loading}
        error={error}
        refetchData={refetchData}
      />
    </div>
  );
}
