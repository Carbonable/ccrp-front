'use client';

import { Project } from '@/graphql/__generated__/graphql';
import { GET_PROJECT_WITHOUT_VINTAGES } from '@/graphql/queries/projects';
import { useQuery } from '@apollo/client';
import { createContext, use, useContext, useEffect, useState } from 'react';

interface ProjectContextType {
  project: Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode; slug: string }> = ({
  children,
  slug,
}) => {
  const [project, setProject] = useState<Project | undefined>(undefined);

  const { data } = useQuery(GET_PROJECT_WITHOUT_VINTAGES, {
    variables: {
      field: 'slug',
      value: slug,
    },
  });

  useEffect(() => {
    setProject(data?.projectBy);
  }, [data]);

  return <ProjectContext.Provider value={{ project }}>{children}</ProjectContext.Provider>;
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within an ProjectProvider');
  }
  return context;
};
