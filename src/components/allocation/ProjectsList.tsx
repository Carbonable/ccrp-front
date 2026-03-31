'use client';

import { Project } from '@/graphql/__generated__/graphql';
import { GET_PROJECTS } from '@/graphql/queries/projects';
import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';

export default function ProjectsList({
  selectedProject,
  setSelectedProject,
}: {
  selectedProject: Project | undefined;
  setSelectedProject: (project: Project) => void;
}) {
  const { loading, error, data } = useQuery<any>(GET_PROJECTS);

  if (error) {
    console.error(error);
  }

  const projects: Project[] = data?.projects ?? [];

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject, setSelectedProject]);

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextId = event.target.value;
    const nextProject = projects.find((project) => project.id === nextId);
    if (nextProject) {
      setSelectedProject(nextProject);
    }
  };

  if (loading || !selectedProject) {
    return (
      <div className="flex flex-wrap items-center justify-between">
        <div className="w-full text-lg font-extrabold uppercase text-neutral-100 md:w-fit">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2 text-left font-light uppercase text-neutral-200">Select Project</div>
      <select
        className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-neutral-200 outline-none transition focus:border-primary"
        value={selectedProject.id || ''}
        onChange={handleSelectionChange}
      >
        {projects.map((project) => (
          <option key={project.id || project.name} value={project.id || ''} className="bg-neutral-900 text-neutral-100">
            {project.name}
          </option>
        ))}
      </select>
    </>
  );
}
