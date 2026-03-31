'use client';

import { use } from 'react';
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectNavigationTabs from '@/components/project/Navigation';
import { ProjectProvider } from '@/context/ProjectContext';

export default function Layout({
  params,
  children,
}: Readonly<{
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}>) {
  const { slug } = use(params);

  return (
    <div>
      <ProjectProvider slug={slug}>
        <ProjectHeader />
        <div className="2xl:max-w-8xl min-h-screen max-w-full p-8 lg:mx-auto lg:max-w-6xl xl:max-w-7xl">
          <ProjectNavigationTabs slug={slug} />
          {children}
        </div>
      </ProjectProvider>
    </div>
  );
}
