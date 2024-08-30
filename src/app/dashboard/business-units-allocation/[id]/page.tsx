import { BackButton } from "@/components/common/Button";
import Title from "@/components/common/Title";
import BusinessUnitInfo from "@/components/dashboard/business-unit-allocation/BusinessUnitInfo";
import GlobalData from "@/components/dashboard/business-unit-allocation/GlobalData";
import ProjectFundingAllocation from "../../../../components/dashboard/business-unit-allocation/ProjectFundingAllocation";
import DecarbonationOverview from "@/components/dashboard/business-unit-allocation/Decarbonation";
import ProjectsMetrics from "@/components/dashboard/business-unit-allocation/ProjectsMetrics";
import ProjectsImpact from "@/components/dashboard/business-unit-allocation/Impact";

export default function BusinessUnitsDetails({ params }: Readonly<{ params: { id: string } }>) {

  return (
    <>
      <div className="mt-4 ml-1">
        <BackButton href="/dashboard/business-units-allocation">Back to list</BackButton>
        <div className="mt-12">
          <BusinessUnitInfo id={params.id} />
        </div>
        <div className="mt-16">
          <GlobalData businessUnitId={params.id} />
        </div>
        <div className="mt-16">
          <Title title="Projects Allocation" />
          <ProjectFundingAllocation businessUnitId={params.id} />
        </div>
        <div className="mt-16">
          <DecarbonationOverview businessUnitId={params.id} />
        </div>
        <div className="mt-16">
          <Title title="Project metrics" />
          <ProjectsMetrics businessUnitId={params.id} />
        </div>
        <div className="mt-16 mb-12">
          <Title title="Impact metrics" />
          <ProjectsImpact businessUnitId={params.id} />
        </div>
      </div>
    </>
  )
}