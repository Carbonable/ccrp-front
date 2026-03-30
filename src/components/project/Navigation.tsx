'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import NavigationTabs from '@/components/common/NavigationTabs';

const DMRV_MATCHES = ['banegas-farm', 'las-delicias', 'manjarisoa'];

function hasDmrvData(slug: string): boolean {
  return DMRV_MATCHES.some((m) => slug.includes(m));
}

const ProjectNavigationTabs = ({ slug }: { slug: string }) => {
  const pathname = usePathname();
  const showDmrv = hasDmrvData(slug);
  const t = useTranslations('project');

  return (
    <NavigationTabs
      activeKey={pathname}
      items={[
        {
          key: `/projects/${slug}`,
          label: (
            <Link href={`/projects/${slug}`} prefetch className="block px-3 py-2">
              {t('overview')}
            </Link>
          ),
        },
        {
          key: `/projects/${slug}/carbon-management`,
          label: (
            <Link href={`/projects/${slug}/carbon-management`} prefetch className="block px-3 py-2">
              {t('carbonManagement')}
            </Link>
          ),
        },
        {
          key: `/projects/${slug}/impact`,
          label: (
            <Link href={`/projects/${slug}/impact`} prefetch className="block px-3 py-2">
              {t('impact')}
            </Link>
          ),
        },
        ...(showDmrv
          ? [{
              key: `/projects/${slug}/dmrv`,
              label: (
                <Link href={`/projects/${slug}/dmrv`} prefetch className="block px-3 py-2">
                  {t('dmrv')}
                </Link>
              ),
            }]
          : []),
      ]}
    />
  );
};

export default ProjectNavigationTabs;
