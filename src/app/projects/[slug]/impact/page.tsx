'use client';

import ImpactComponent from '@/components/common/impact/ImpactComponent';
import { useProject } from '@/context/ProjectContext';
import { GET_IMPACT_METRICS } from '@/graphql/queries/impact';
import { useQuery } from '@apollo/client';

export default function ImpactPage() {
  const { project } = useProject();

  const { loading, error, data, refetch } = useQuery(GET_IMPACT_METRICS, {
    variables: {
      view: {
        project_id: project?.id,
      },
    },
  });

  return (
    <ImpactComponent
      loading={loading}
      error={error}
      data={data}
      refetch={refetch}
      link={project?.metadata.impact_report_url}
    />
  );
}
