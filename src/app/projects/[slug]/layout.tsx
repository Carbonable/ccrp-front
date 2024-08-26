'use client';

import ProtectedRoute from '@/components/authentication/ProtectedRoute'
import { useAuth } from "@/context/AuthContext";
import { useQuery } from '@apollo/client';
import { GET_PROJECT_WITHOUT_VINTAGES } from '@/graphql/queries/projects';
import { Project } from '@/graphql/__generated__/graphql';
import ProjectHeader from '@/components/project/ProjectHeader';

export default function Layout({
  params,
  children,
}: Readonly<{
  params: { slug: string };
  children: React.ReactNode;
}>) {
  const { user } = useAuth();
  const { loading, error, data } = useQuery(GET_PROJECT_WITHOUT_VINTAGES, {
    variables: {
        field: "slug",
        value: params.slug
    }
  });

  const project: Project = data?.projectBy;

  if (loading) {
    return (
      <>
        Loading...
      </>
    )
}

if (error) {
  return (
    <>
      Error: {error.message}
    </>
  )
}


  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <div>
      <ProtectedRoute key={user ? user.username : 'loading_dashboard'}>
        <ProjectHeader project={project} />
        <div className="mt-8 p-8 lg:mx-auto max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl min-h-screen">
          {children}
        </div>
      </ProtectedRoute>
      
    </div>
  )
}