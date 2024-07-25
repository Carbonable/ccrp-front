'use client';

import React from 'react';
import { Tabs, Tab } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PortfolioNavigationTabs = () => {
  const pathname = usePathname();

  return (
    <Tabs 
        selectedKey={pathname}
        classNames={{ 
            tabList: 'bg-opacityLight-5 text-neutral-100',
        }}
    >
      <Tab 
        key="/portfolio" 
        title={<Link href="/portfolio" prefetch>Overview</Link>}
      />
      <Tab 
        key="/portfolio/carbon-management" 
        title={<Link href="/portfolio/carbon-management" prefetch>Carbon Management</Link>}
      />
    </Tabs>
  );
};

export default PortfolioNavigationTabs;