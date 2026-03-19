'use client';

import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

/** Projects with dMRV data — match against Sanity slugs */
const DMRV_MATCHES = ['banegas-farm', 'las-delicias', 'manjarisoa'];

function hasDmrvData(slug: string): boolean {
  return DMRV_MATCHES.some((m) => slug.includes(m));
}

const ProjectNavigationTabs = ({ slug }: { slug: string }) => {
  const pathname = usePathname();
  const isTrackingActivated = process.env.NEXT_PUBLIC_TRACKING_ACTIVATED;
  const showDmrv = hasDmrvData(slug);

  return (
    <Tabs
      disabledKeys={isTrackingActivated === 'false' ? [`/projects/${slug}/tracking`] : []}
      selectedKey={pathname}
      classNames={{
        tabList: 'bg-opacityLight-5 text-neutral-100',
      }}
    >
      <Tab
        key={`/projects/${slug}`}
        title={<Link href={`/projects/${slug}`} prefetch>Overview</Link>}
      />
      <Tab
        key={`/projects/${slug}/carbon-management`}
        title={<Link href={`/projects/${slug}/carbon-management`} prefetch>Carbon Management</Link>}
      />
      <Tab
        key={`/projects/${slug}/tracking`}
        title={<Link href={`/projects/${slug}/tracking`} prefetch>Tracking</Link>}
      />
      <Tab
        key={`/projects/${slug}/impact`}
        title={<Link href={`/projects/${slug}/impact`} prefetch>Impact</Link>}
      />
      {showDmrv && (
        <Tab
          key={`/projects/${slug}/dmrv`}
          title={<Link href={`/projects/${slug}/dmrv`} prefetch>dMRV</Link>}
        />
      )}
    </Tabs>
  );
};

export default ProjectNavigationTabs;
