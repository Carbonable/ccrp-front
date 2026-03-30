'use client';

import { useEffect, useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const DashboardNavigationTabs = () => {
  const [selectedKey, setSelectedKey] = useState<string>('/dashboard');
  const pathname = usePathname();
  const t = useTranslations('dashboard');

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
        tabList: 'bg-opacity-light-5 text-neutral-100',
      }}
    >
      <Tab
        key="/dashboard"
        title={
          <Link href="/dashboard" prefetch>
            {t('netZeroOverview')}
          </Link>
        }
      />
      <Tab
        key="/dashboard/business-units-allocation"
        title={
          <Link href="/dashboard/business-units-allocation" prefetch>
            {t('businessUnitsAllocation')}
          </Link>
        }
      />
      <Tab
        key="/dashboard/reporting"
        title={
          <Link href="/dashboard/reporting" prefetch>
            {t('reporting')}
          </Link>
        }
      />
    </Tabs>
  );
};

export default DashboardNavigationTabs;
