'use client';
import ProjectsMetricsComponenent from '@/components/project/ProjectsMetricsComponenent';
import { GET_PROJECTS_METRICS } from '@/graphql/queries/projects';
import { useQuery } from '@apollo/client';

export default function ProjectsMetrics({ businessUnitId }: { businessUnitId: string }) {
  const { loading, error, data, refetch } = useQuery(GET_PROJECTS_METRICS, {
    variables: {
      view: {
        business_unit_id: businessUnitId,
      },
    },
  });

  return (
    <ProjectsMetricsComponenent loading={loading} error={error} data={data} refetch={refetch} />
  );
}
