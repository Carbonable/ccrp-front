'use client';

import { useQuery } from '@apollo/client';
import BannerKPI from '../../common/BannerKPI';
import { GET_GLOBAL_DATA } from '@/graphql/queries/net-zero';
import { CARBONABLE_COMPANY_ID } from '@/utils/constant';
import { GlobalData } from '@/graphql/__generated__/graphql';

export default function Banner() {
  const { loading, error, data } = useQuery(GET_GLOBAL_DATA, {
    variables: {
      view: {
        company_id: CARBONABLE_COMPANY_ID,
      },
    },
  });

  if (loading) {
    return (
      <div className="relative flex w-full flex-wrap items-start justify-start rounded-3xl border border-neutral-700 bg-planification bg-cover bg-bottom px-4 py-6 md:p-10 lg:p-12">
        <div className="grid grid-cols-3 gap-3 md:auto-cols-max md:grid-flow-col md:grid-cols-none md:gap-6 xl:gap-16">
          <BannerKPI title="My Net-zero objective" value={'0'} loading={loading} error={error} />
          <BannerKPI title="Missing contributions" value={'0'} loading={loading} error={error} />
        </div>
        <img
          src="/assets/images/common/logo-transparent.svg"
          alt="Carbonable logo transparent"
          className="absolute bottom-0 right-12 w-[100px] lg:w-[110px] xl:right-20"
        />
      </div>
    );
  }

  if (error) {
    console.error(error);
  }

  const globalData: GlobalData = data?.getGlobalData;

  return (
    <div className="relative flex w-full flex-wrap items-start justify-start rounded-3xl border border-neutral-700 bg-planification bg-cover bg-bottom px-4 py-6 md:p-10 lg:p-12">
      <div className="grid grid-cols-3 gap-3 md:auto-cols-max md:grid-flow-col md:grid-cols-none md:gap-6 xl:gap-16">
        <BannerKPI
          title="My Net-zero objective"
          value={globalData.target}
          loading={loading}
          error={error}
        />
        <BannerKPI
          title="Missing contributions"
          value={globalData.debt}
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
