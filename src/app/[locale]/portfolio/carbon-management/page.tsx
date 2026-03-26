'use client';

import { useTranslations } from 'next-intl';
import Title from '@/components/common/Title';
import ProjectFundingAllocation from '@/components/portfolio/project-allocation/ProjectFundingAllocation';
import ProjectsMetrics from '@/components/portfolio/project-allocation/ProjectsMetrics';

export default function CarbonManagementPage() {
  const t = useTranslations('allocation');
  const tc = useTranslations('charts');

  return (
    <div className="py-6">
      <div className="relative">
        <Title title={t('title')} />
        <ProjectFundingAllocation />
      </div>
      <div className="relative">
        <Title title={tc('projectsMetrics')} />
        <ProjectsMetrics />
      </div>
    </div>
  );
}
