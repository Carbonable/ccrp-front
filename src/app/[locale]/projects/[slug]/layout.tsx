'use client';

import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectNavigationTabs from '@/components/project/Navigation';
import { ProjectProvider } from '@/context/ProjectContext';

export default function Layout({
  params,
  children,
}: Readonly<{
  params: { slug: string };
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ProjectProvider slug={params.slug}>
        <ProjectHeader />
        <div className="2xl:max-w-8xl min-h-screen max-w-full p-8 lg:mx-auto lg:max-w-6xl xl:max-w-7xl">
          <ProjectNavigationTabs slug={params.slug} />
          {children}
        </div>
      </ProjectProvider>
    </div>
  );
}
