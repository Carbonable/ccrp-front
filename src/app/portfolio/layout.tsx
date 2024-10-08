'use client';

import PortfolioNavigationTabs from '@/components/portfolio/Navigation';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-8">
      <PortfolioNavigationTabs />
      <div>{children}</div>
    </div>
  );
}
