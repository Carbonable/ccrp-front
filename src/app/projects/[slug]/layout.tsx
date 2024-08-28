"use client";

import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@apollo/client";
import { GET_PROJECT_WITHOUT_VINTAGES } from "@/graphql/queries/projects";
import { Project } from "@/graphql/__generated__/graphql";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectNavigationTabs from "@/components/project/Navigation";
import { ProjectProvider } from "@/context/ProjectContext";

export default function Layout({
  params,
  children,
}: Readonly<{
  params: { slug: string };
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const { loading, error, data } = useQuery(GET_PROJECT_WITHOUT_VINTAGES, {
    variables: {
      field: "slug",
      value: params.slug,
    },
  });
  let userName = "loading_dashboard";
  if (user) {
    userName = user.fullName ?? user.firstName!;
  }
  const project: Project = data?.projectBy;

  return (
    <div>
      <ProtectedRoute key={userName}>
        <ProjectProvider slug={params.slug}>
          <ProjectHeader />
          <div className="p-8 lg:mx-auto max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl min-h-screen">
            <ProjectNavigationTabs slug={params.slug} />
            {children}
          </div>
        </ProjectProvider>
      </ProtectedRoute>
    </div>
  );
}
