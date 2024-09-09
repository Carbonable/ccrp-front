import Title from "@/components/common/Title";
import ProjectFundingAllocation from "@/components/portfolio/project-allocation/ProjectFundingAllocation";
import ProjectsMetrics from "@/components/portfolio/project-allocation/ProjectsMetrics";

export default function CarbonManagementPage() {
  return (
    <div className="py-6">
      <div className="relative">
        <Title title="Carbon Assets’ Allocation " />
        <ProjectFundingAllocation />
      </div>
      <div className="relative">
        <Title title="Projects metrics" />
        <ProjectsMetrics />
      </div>
    </div>
  )
}