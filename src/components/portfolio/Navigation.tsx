'use client';

import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const PortfolioNavigationTabs = () => {
  const pathname = usePathname();
  const t = useTranslations('project');

  return (
    <Tabs
      selectedKey={pathname}
      classNames={{
        tabList: 'bg-opacityLight-5 text-neutral-100',
      }}
    >
      <Tab
        key="/portfolio"
        title={
          <Link href="/portfolio" prefetch>
            {t('overview')}
          </Link>
        }
      />
      <Tab
        key="/portfolio/carbon-management"
        title={
          <Link href="/portfolio/carbon-management" prefetch>
            {t('carbonManagement')}
          </Link>
        }
      />
    </Tabs>
  );
};

export default PortfolioNavigationTabs;
