'use client';

import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const DMRV_MATCHES = ['banegas-farm', 'las-delicias', 'manjarisoa'];

function hasDmrvData(slug: string): boolean {
  return DMRV_MATCHES.some((m) => slug.includes(m));
}

const ProjectNavigationTabs = ({ slug }: { slug: string }) => {
  const pathname = usePathname();
  const showDmrv = hasDmrvData(slug);
  const t = useTranslations('project');

  return (
    <Tabs
      selectedKey={pathname}
      classNames={{
        tabList: 'bg-opacityLight-5 text-neutral-100',
      }}
    >
      <Tab
        key={`/projects/${slug}`}
        title={<Link href={`/projects/${slug}`} prefetch>{t('overview')}</Link>}
      />
      <Tab
        key={`/projects/${slug}/carbon-management`}
        title={<Link href={`/projects/${slug}/carbon-management`} prefetch>{t('carbonManagement')}</Link>}
      />
      <Tab
        key={`/projects/${slug}/impact`}
        title={<Link href={`/projects/${slug}/impact`} prefetch>{t('impact')}</Link>}
      />
      {showDmrv && (
        <Tab
          key={`/projects/${slug}/dmrv`}
          title={<Link href={`/projects/${slug}/dmrv`} prefetch>{t('dmrv')}</Link>}
        />
      )}
    </Tabs>
  );
};

export default ProjectNavigationTabs;
