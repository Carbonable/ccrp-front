'use client';

import React from 'react';
import { Tabs, Tab } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const DashboardNavigationTabs = () => {
  const pathname = usePathname();

  return (
    <Tabs 
        selectedKey={pathname}
        classNames={{ 
            tabList: 'bg-opacityLight-5 text-neutral-100',
        }}
    >
      <Tab 
        key="/dashboard" 
        title={<Link href="/dashboard" prefetch>Net Zero Overview</Link>} 
      />
      <Tab 
        key="/dashboard/business-units-allocation" 
        title={<Link href="/dashboard/business-units-allocation" prefetch>Business Units Allocation</Link>} 
      />
      <Tab 
        key="/dashboard/reporting" 
        title={<Link href="/dashboard/reporting" prefetch>Reporting</Link>} 
      />
    </Tabs>
  );
};

export default DashboardNavigationTabs;