'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import NavigationTabs from '@/components/common/NavigationTabs';

const PortfolioNavigationTabs = () => {
  const pathname = usePathname();
  const t = useTranslations('project');

  return (
    <NavigationTabs
      activeKey={pathname}
      items={[
        {
          key: '/portfolio',
          label: (
            <Link href="/portfolio" prefetch className="block px-3 py-2">
              {t('overview')}
            </Link>
          ),
        },
        {
          key: '/portfolio/carbon-management',
          label: (
            <Link href="/portfolio/carbon-management" prefetch className="block px-3 py-2">
              {t('carbonManagement')}
            </Link>
          ),
        },
      ]}
    />
  );
};

export default PortfolioNavigationTabs;
