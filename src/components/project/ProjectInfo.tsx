'use client';

import { useTranslations } from 'next-intl';
import { ProjectGlobalData } from '@/graphql/__generated__/graphql';
import { KPI } from '../KPI';

export default function ProjectInfo({
  name,
  data,
}: {
  name: string | any;
  data: ProjectGlobalData | any;
}) {
  const t = useTranslations('projectInfo');

  if (data === undefined) {
    return (
      <div className="relative w-full rounded-lg bg-project-header-border p-[1px]">
        <div className="relative w-full overflow-hidden rounded-lg bg-project-header p-6">
          <div className="text-xl font-bold uppercase">{name}</div>
          <div className="mt-8 grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3">
            <KPI title={t('amount')} kpi={t('tbd')} />
            <KPI title={t('source')} kpi={t('tbd')} />
            <KPI title={t('rating')} kpi={t('tbd')} />
            <KPI title={t('allocatedUnits')} kpi={t('tbd')} />
            <KPI title={t('availableExPost')} kpi={t('tbd')} />
            <KPI title={t('availableExAnte')} kpi={t('tbd')} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg bg-project-header-border p-[1px]">
      <div className="relative w-full overflow-hidden rounded-lg bg-project-header p-6">
        <div className="text-xl font-bold uppercase">{name}</div>
        <div className="mt-8 grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3">
          <KPI title={t('amount')} kpi={data.amount} />
          <KPI title={t('source')} kpi={data.source} />
          <KPI title={t('rating')} kpi={data.rating} />
          <KPI title={t('allocatedUnits')} kpi={data.allocated_units} />
          <KPI title={t('availableExPost')} kpi={data.available_ex_post} />
          <KPI title={t('availableExAnte')} kpi={data.available_ex_ante} />
        </div>
      </div>
    </div>
  );
}
