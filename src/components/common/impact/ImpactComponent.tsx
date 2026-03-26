'use client';

import { useTranslations } from 'next-intl';
import { CARBONABLE_COMPANY_ID } from '@/utils/constant';
import ErrorReload from '../ErrorReload';
import { ImpactTitle } from '../Title';
import type { ApolloError } from '@apollo/client';
import { ImpactMetrics, Sdg } from '@/graphql/__generated__/graphql';
import { LinkSecondary } from '../Button';

export default function ImpactComponent({
  loading,
  error,
  data,
  refetch,
  link,
}: {
  loading: boolean;
  error: ApolloError | undefined;
  data: any;
  refetch: any;
  link?: string;
}) {
  const t = useTranslations('impact');
  const tc = useTranslations('common');
  const ta = useTranslations('allocation');
  const cssBlock = 'border border-neutral-500 rounded-xl px-6 py-4 bg-neutral-700';

  const metrics: ImpactMetrics = data?.getImpactMetrics;

  if (loading) {
    return <div className="mt-12 w-full">{tc('loading')}</div>;
  }

  if (error && error.message.includes('42P01')) {
    return <div className="mt-12 w-full">{ta('noAllocations')}</div>;
  }

  if (error) {
    return (
      <div className="mt-12 w-full">
        <ErrorReload refetchData={refetch} />
      </div>
    );
  }

  return (
    <div className="mt-12 grid w-full grid-flow-col grid-cols-4 grid-rows-3 gap-4 md:grid-rows-3">
      <div className={`col-span-4 md:col-span-1 md:row-span-3 ${cssBlock}`}>
        <ImpactTitle title={t('impactedSdgs')} value={`# ${metrics.sdgs.length}`} />
        <div className="mt-8 grid grid-cols-5 gap-6 md:grid-cols-3">
          {metrics.sdgs.map((sdg: Sdg, idx: number) => {
            return (
              <a
                href={`https://sdgs.un.org/goals/goal${sdg.number}`}
                key={`sdg_image_${sdg.number}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  key={`sdg_${idx}`}
                  className="rounded-lg"
                  alt={`sdg_${sdg.number}`}
                  src={`https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-${sdg.number < 10 ? '0' + sdg.number : sdg.number}.jpg`}
                />
              </a>
            );
          })}
        </div>
      </div>
      <div className="col-span-4 grid gap-4 md:col-span-3 md:grid-cols-3">
        <div className={`col-span-1 ${cssBlock}`}>
          <ImpactTitle title={t('removedTons')} value={metrics.removed_tons} />
        </div>
        <div className={`col-span-1 ${cssBlock}`}>
          <ImpactTitle title={t('restauredHectares')} value={metrics.protected_forest} />
        </div>
        <div className={`col-span-1 ${cssBlock}`}>
          <ImpactTitle title={t('protectedSpecies')} value={metrics.protected_species} />
        </div>
      </div>
      <div
        className={`col-span-4 md:col-span-3 md:row-span-2 ${cssBlock} bg-impact-report relative overflow-hidden`}
      >
        <img
          className="absolute bottom-[-55%] right-[-2%] h-full w-[90%] -rotate-6 rounded-2xl object-contain object-top md:bottom-[-50%] md:w-[54%] md:object-cover lg:bottom-[-33%] lg:w-[60%]"
          src="/assets/images/impact/impact.png"
          alt="impact-report"
        />
        <div className="xl:p-8">
          <div className="text-2xl font-bold text-neutral-50">
            See your <br />
            full impact report
          </div>
          <div className="mt-8 lg:mt-12">
            <LinkSecondary href={link ? link : ''}>{t('goToImpactReport')}</LinkSecondary>
          </div>
        </div>
      </div>
    </div>
  );
}
