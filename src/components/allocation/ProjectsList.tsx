'use client';
import { Project } from '@/graphql/__generated__/graphql';
import { GET_PROJECTS } from '@/graphql/queries/projects';
import { useQuery } from '@apollo/client';
import { Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';

export default function ProjectsList({
  selectedProject,
  setSelectedProject,
}: {
  selectedProject: Project | undefined;
  setSelectedProject: (project: Project) => void;
}) {
  const { loading, error, data } = useQuery(GET_PROJECTS);
  const [value, setValue] = useState(new Set([]));

  const handleSelectionChange = (e: any) => {
    if (!e.target.value || projects === undefined || projects.length === 0) {
      return;
    }

    setValue(e.target.value);
    const selectProject = projects.find((project) => project.id === e.target.value);
    if (selectProject) {
      setSelectedProject(selectProject);
    }
  };

  if (error) {
    console.error(error);
  }

  const projects: Project[] = data?.projects;
  useEffect(() => {
    if (projects && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects]);

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
      <Select
        variant="flat"
        className="select-component w-full"
        classNames={{ popoverContent: 'bg-neutral-800', value: '!text-neutral-200' }}
        selectedKeys={selectedProject.id!}
        onChange={handleSelectionChange}
      >
        {projects.map((project) => (
          <SelectItem key={project.id}>{project.name}</SelectItem>
        ))}
      </Select>
    </>
  );
}
