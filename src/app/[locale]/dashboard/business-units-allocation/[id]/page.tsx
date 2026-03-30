'use client';

import { useTranslations } from 'next-intl';
import { BackButton } from '@/components/common/Button';
import Title from '@/components/common/Title';
import BusinessUnitInfo from '@/components/dashboard/business-unit-allocation/BusinessUnitInfo';
import GlobalData from '@/components/dashboard/business-unit-allocation/GlobalData';
import ProjectFundingAllocation from '@/components/dashboard/business-unit-allocation/ProjectFundingAllocation';
import DecarbonationOverview from '@/components/dashboard/business-unit-allocation/Decarbonation';
import ProjectsMetrics from '@/components/dashboard/business-unit-allocation/ProjectsMetrics';
import ProjectsImpact from '@/components/dashboard/business-unit-allocation/Impact';

export default function BusinessUnitsDetails({ params }: Readonly<{ params: { id: string } }>) {
  const { id } = params;
  const t = useTranslations('allocation');
  const tp = useTranslations('projectMetrics');
  const ti = useTranslations('impact');
  const tc = useTranslations('common');

  return (
    <>
      <div className="ml-1 mt-4">
        <BackButton href="/dashboard/business-units-allocation">{tc('backToList')}</BackButton>
        <div className="mt-12">
          <BusinessUnitInfo id={id} />
        </div>
        <div className="mt-16">
          <GlobalData businessUnitId={id} />
        </div>
        <div className="mt-16">
          <Title title={t('projectsAllocation')} />
          <ProjectFundingAllocation businessUnitId={id} />
        </div>
        <div className="mt-16">
          <DecarbonationOverview businessUnitId={id} />
        </div>
        <div className="mt-16">
          <Title title={tp('title')} />
          <ProjectsMetrics businessUnitId={id} />
        </div>
        <div className="mb-12 mt-16">
          <Title title={ti('title')} />
          <ProjectsImpact businessUnitId={id} />
        </div>
      </div>
    </>
  );
}
