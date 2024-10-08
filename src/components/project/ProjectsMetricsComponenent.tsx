import ProjectsColors from './ProjectsColors';
import ProjectsTypes from './ProjectsTypes';
import ProjectsStandards from './ProjectsStandards';
import ProjectsCountries from './ProjectsCountries';
import type { ApolloError } from '@apollo/client';
import { ProjectMetrics } from '@/graphql/__generated__/graphql';
import ErrorReload from '../common/ErrorReload';

interface ProjectMetricsProps {
  loading: boolean;
  error: ApolloError | undefined;
  data: any;
  refetch: any;
}

export default function ProjectsMetricsComponenent({
  loading,
  error,
  data,
  refetch,
}: ProjectMetricsProps) {
  if (error) {
    console.error(error);
  }

  const refetchData = () => {
    refetch();
  };

  const metrics: ProjectMetrics = data?.getProjectMetrics;

  if (loading) {
    return <div className="mt-12 w-full">Loading ...</div>;
  }

  if (error && error.message.includes('42P01')) {
    return <div className="mt-12 w-full">No allocations yet</div>;
  }

  if (error) {
    return (
      <div className="mt-12 w-full">
        <ErrorReload refetchData={refetchData} />
      </div>
    );
  }
  if (!metrics || metrics.localization.length === 0) {
    return <div className="w-full">No data</div>;
  }

  return (
    <div className="mt-12 w-full">
      <div className="font-inter relative mt-4 grid grid-cols-2 gap-x-10 gap-y-16">
        <div className="col-span-2 md:col-span-1">
          <ProjectsColors colors={metrics.colors} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <ProjectsTypes types={metrics.types} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <ProjectsStandards standards={metrics.standards} />
        </div>
        <div className="col-span-2 md:col-span-1">
          <ProjectsCountries countries={metrics.localization} />
        </div>
      </div>
    </div>
  );
}
