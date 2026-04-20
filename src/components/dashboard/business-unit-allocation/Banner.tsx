'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@apollo/client/react';
import { GlobalData } from '@/graphql/__generated__/graphql';
import { GET_GLOBAL_DATA } from '@/graphql/queries/net-zero';
import { useCompanyId } from '@/hooks/useCompanyId';
import GlobalDataComponent from '@/components/common/global-data/GlobalData';

export default function Banner() {
  const companyId = useCompanyId();
  const view = {
    company_id: companyId,
  };
  const { loading, error, data, refetch } = useQuery<any>(GET_GLOBAL_DATA, {
    variables: {
      view,
    },
  });

  if (error) {
    console.error(error);
  }

  const refetchData = () => {
    refetch({
      view,
    });
  };

  return <GlobalDataComponent loading={loading} error={error} data={data} refetch={refetchData} />;
}
