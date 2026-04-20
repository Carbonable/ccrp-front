'use client';

import { useQuery } from '@apollo/client/react';
import BannerKPI from '@/components/common/BannerKPI';
import { GlobalData } from '@/graphql/__generated__/graphql';
import { GET_GLOBAL_DATA } from '@/graphql/queries/net-zero';
import { useTranslations } from 'next-intl';
import { useCompanyId } from '@/hooks/useCompanyId';

export default function Banner() {
  const companyId = useCompanyId();
  const { loading, error, data } = useQuery<any>(GET_GLOBAL_DATA, {
    variables: {
      view: {
        company_id: companyId,
      },
    },
  });
  const t = useTranslations('portfolio');

  if (error) {
    console.error(error);
  }

  const globalData: GlobalData = data?.getGlobalData;

  return (
    <div className="relative flex w-full flex-wrap items-start justify-start rounded-3xl border border-neutral-700 bg-planification bg-cover bg-bottom px-4 py-6 md:p-10 lg:p-12">
      <div className="grid grid-cols-3 gap-3 md:auto-cols-max md:grid-flow-col md:grid-cols-none md:gap-6 xl:gap-16">
        <BannerKPI
          title={t('investedAmount')}
          value={globalData?.invested_amount}
          loading={loading}
          error={error}
        />
        <BannerKPI
          title={t('numberOfProjects')}
          value={globalData?.number_of_projects}
          loading={loading}
          error={error}
        />
      </div>
      <img
        src="/assets/images/common/logo-transparent.svg"
        alt="Carbonable logo transparent"
        className="absolute bottom-0 right-12 w-[100px] lg:w-[110px] xl:right-20"
      />
    </div>
  );
}
