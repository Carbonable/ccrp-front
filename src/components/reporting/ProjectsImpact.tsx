'use client';

import { GET_IMPACT_METRICS } from '@/graphql/queries/impact';
import { CARBONABLE_COMPANY_ID, GLOBAL_IMPACT_LINK } from '@/utils/constant';
import { useQuery } from '@apollo/client';
import ImpactComponent from '../common/impact/ImpactComponent';

export default function ProjectsImpact() {
  const { loading, error, data, refetch } = useQuery(GET_IMPACT_METRICS, {
    variables: {
      view: {
        company_id: CARBONABLE_COMPANY_ID,
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
