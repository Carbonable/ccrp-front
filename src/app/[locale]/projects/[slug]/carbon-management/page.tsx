'use client';

import ProjectAllocationTable from '@/components/project/carbon-management/ProjectAllocationTable';
import ProjectDecarbonation from '@/components/project/carbon-management/ProjectDecarbonation';
import ProjectDecarbonationTable from '@/components/project/carbon-management/ProjectDecarbonationTable';
import { useProject } from '@/context/ProjectContext';
import { Project } from '@/graphql/__generated__/graphql';
import { GET_PROJECT_WITHOUT_VINTAGES } from '@/graphql/queries/projects';
import { useQuery } from '@apollo/client';

export default function CarbonManagementPage() {
  const { project } = useProject();

  if (!project) {
    return null;
  }

  return (
    <div className="mt-8">
      <ProjectDecarbonation isFullScreen={true} projectId={project.id} />
      <ProjectDecarbonationTable projectId={project.id} />
      <ProjectAllocationTable projectId={project.id} />
    </div>
  );
}
