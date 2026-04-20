'use client';

import GlobalDataComponent from '@/components/common/global-data/GlobalData';
import { GET_GLOBAL_DATA } from '@/graphql/queries/net-zero';
import { useQuery } from '@apollo/client/react';
import { useCompanyId } from '@/hooks/useCompanyId';

export default function GlobalData() {
  const companyId = useCompanyId();
  const { loading, error, data, refetch } = useQuery<any>(GET_GLOBAL_DATA, {
    variables: {
      view: {
        company_id: companyId,
      },
    },
  });

  if (error) {
    console.error(error);
  }

  const refetchData = () => {
    refetch();
  };

  return <GlobalDataComponent loading={loading} error={error} data={data} refetch={refetchData} />;
}
