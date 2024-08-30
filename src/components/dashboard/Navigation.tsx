'use client';

import { useEffect, useState } from 'react';
import { Tabs, Tab } from "@nextui-org/react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const DashboardNavigationTabs = () => {
  const [selectedKey, setSelectedKey] =useState<string>('/dashboard');
  const pathname = usePathname();

  useEffect(() => {
    setSelectedKey(pathname);

    if (pathname.includes('/business-units-allocation')) {
      setSelectedKey('/dashboard/business-units-allocation');
    }
  }, [pathname]);

  return (
    <Tabs 
        selectedKey={selectedKey}
        classNames={{ 
            tabList: 'bg-opacityLight-5 text-neutral-100',
        }}
    >
      <Tab 
        key="/dashboard" 
        title={<Link href="/" prefetch>Net Zero Overview</Link>} 
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