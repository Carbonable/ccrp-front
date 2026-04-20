'use client';

import { GET_IMPACT_METRICS } from '@/graphql/queries/impact';
import { GLOBAL_IMPACT_LINK } from '@/utils/constant';
import { useQuery } from '@apollo/client/react';
import { useCompanyId } from '@/hooks/useCompanyId';
import ImpactComponent from '../common/impact/ImpactComponent';

export default function ProjectsImpact() {
  const companyId = useCompanyId();
  const { loading, error, data, refetch } = useQuery<any>(GET_IMPACT_METRICS, {
    variables: {
      view: {
        company_id: companyId,
      },
    },
  });

  return (
    <ImpactComponent
      loading={loading}
      error={error}
      data={data}
      refetch={refetch}
      link={GLOBAL_IMPACT_LINK}
    />
  );
}
