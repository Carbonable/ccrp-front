'use client';

import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const ProjectNavigationTabs = ({ slug }: { slug: string }) => {
  const pathname = usePathname();
  const isTrackingActivated = process.env.NEXT_PUBLIC_TRACKING_ACTIVATED;

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
        title={
          <Link href={`/projects/${slug}`} prefetch>
            Overview
          </Link>
        }
      />
      <Tab
        key={`/projects/${slug}/carbon-management`}
        title={
          <Link href={`/projects/${slug}/carbon-management`} prefetch>
            Carbon Management
          </Link>
        }
      />
      <Tab
        key={`/projects/${slug}/tracking`}
        title={
          <Link href={`/projects/${slug}/tracking`} prefetch>
            Tracking
          </Link>
        }
      />
      <Tab
        key={`/projects/${slug}/impact`}
        title={
          <Link href={`/projects/${slug}/impact`} prefetch>
            Impact
          </Link>
        }
      />
    </Tabs>
  );
};

export default ProjectNavigationTabs;
