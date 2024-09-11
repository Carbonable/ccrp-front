'use client';

import DashboardNavigationTabs from '@/components/dashboard/Navigation';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-8">
      <DashboardNavigationTabs />
      <div>{children}</div>
    </div>
  );
}
