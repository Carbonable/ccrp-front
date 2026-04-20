'use client';

import ProjectsMetricsComponenent from '@/components/project/ProjectsMetricsComponenent';
import { GET_PROJECTS_METRICS } from '@/graphql/queries/projects';
import { useQuery } from '@apollo/client/react';
import { useCompanyId } from '@/hooks/useCompanyId';

export default function ProjectsMetrics() {
  const companyId = useCompanyId();
  const { loading, error, data, refetch } = useQuery<any>(GET_PROJECTS_METRICS, {
    variables: {
      view: {
        company_id: companyId,
      },
    },
  });

  return (
    <ProjectsMetricsComponenent loading={loading} error={error} data={data} refetch={refetch} />
  );
}
