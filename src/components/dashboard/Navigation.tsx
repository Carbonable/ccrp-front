'use client';

import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import NavigationTabs from '@/components/common/NavigationTabs';

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
    <NavigationTabs
      activeKey={selectedKey}
      items={[
        {
          key: '/dashboard',
          label: (
            <Link href="/dashboard" prefetch className="block px-3 py-2">
              {t('netZeroOverview')}
            </Link>
          ),
        },
        {
          key: '/dashboard/business-units-allocation',
          label: (
            <Link href="/dashboard/business-units-allocation" prefetch className="block px-3 py-2">
              {t('businessUnitsAllocation')}
            </Link>
          ),
        },
        {
          key: '/dashboard/reporting',
          label: (
            <Link href="/dashboard/reporting" prefetch className="block px-3 py-2">
              {t('reporting')}
            </Link>
          ),
        },
      ]}
    />
  );
};

export default DashboardNavigationTabs;
