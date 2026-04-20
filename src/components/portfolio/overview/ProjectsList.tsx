'use client';

import { Project } from '@/graphql/__generated__/graphql';
import { GET_PROJECTS } from '@/graphql/queries/projects';
import { useQuery } from '@apollo/client/react';
import { useTranslations } from 'next-intl';
import { useCompanyId } from '@/hooks/useCompanyId';

export default function ProjectsList() {
  const companyId = useCompanyId();
  const { loading, error, data } = useQuery<any>(GET_PROJECTS, {
    variables: { view: { company_id: companyId } },
  });
  const t = useTranslations('portfolio');
  const tc = useTranslations('common');

  if (error) {
    console.error(error);
  }

  const projects: Project[] = data?.projects;

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-between">
        <div className="w-full text-lg font-extrabold uppercase text-neutral-100 md:w-fit">
          {tc('loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-wrap items-center justify-between">
        <div className="w-full text-lg font-extrabold uppercase text-neutral-100 md:w-fit">
          {tc('error', { error: error.message })}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between">
        <div className="w-full text-lg font-extrabold uppercase text-neutral-100 md:w-fit">
          <NumberOfProjects number={projects.length} />
        </div>
      </div>
      <div className="mt-8">
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project: Project, idx: number) => (
            <a
              key={`project_${project.id}_${idx}`}
              href={`/projects/${project.slug}`}
              className="overflow-hidden text-ellipsis"
            >
              <img src={project.metadata?.sft_image_url} alt={`${project.name} project`} />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

function NumberOfProjects({ number }: { number: number }) {
  const t = useTranslations('portfolio');

  if (number === 0) {
    return (
      <div className="w-full text-lg font-extrabold uppercase text-neutral-100 md:w-fit">
        {t('noProjects')}
      </div>
    );
  }

  return (
    <div className="w-full text-lg font-extrabold uppercase text-neutral-100 md:w-fit">
      {t('assets', { count: number })}
    </div>
  );
}
