'use client';

import { Project } from '@/graphql/__generated__/graphql';
import { GET_PROJECTS } from '@/graphql/queries/projects';
import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';

/**
 * Returns a stock availability indicator based on the ratio of allocated vs total units.
 *
 * ⭕ = untouched (0% allocated)
 * ◔ = more than half available (< 50% allocated)
 * ◓ = less than half available (≥ 50% allocated)
 * ⬤ = fully allocated (100% or no availability)
 */
function getStockIndicator(project: Project): { icon: string; label: string; color: string } {
  const globalData = project.global_data;
  if (!globalData || !globalData.amount || globalData.amount === 0) {
    return { icon: '⬤', label: 'No data', color: 'text-neutral-500' };
  }

  const total = globalData.amount;
  const allocated = globalData.allocated_units ?? 0;
  const ratio = allocated / total;

  if (allocated === 0) {
    return { icon: '⭕', label: 'Untouched', color: 'text-green-400' };
  }
  if (ratio < 0.5) {
    return { icon: '◔', label: 'More than half available', color: 'text-green-300' };
  }
  if (ratio < 1) {
    return { icon: '◓', label: 'Less than half available', color: 'text-amber-400' };
  }
  return { icon: '⬤', label: 'Fully allocated', color: 'text-red-400' };
}

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

  const selectedIndicator = getStockIndicator(selectedProject);

  return (
    <>
      <div className="mb-2 text-left font-light uppercase text-neutral-200">Select Project</div>
      <select
        className="w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-neutral-200 outline-none transition focus:border-primary"
        value={selectedProject.id || ''}
        onChange={handleSelectionChange}
      >
        {projects.map((project) => {
          const indicator = getStockIndicator(project);
          return (
            <option
              key={project.id || project.name}
              value={project.id || ''}
              className="bg-neutral-900 text-neutral-100"
            >
              {indicator.icon} {project.name}
            </option>
          );
        })}
      </select>
      {/* Stock availability legend for selected project */}
      <div className="mt-2 flex items-center gap-2 text-left text-xs text-neutral-400">
        <span className={selectedIndicator.color}>{selectedIndicator.icon}</span>
        <span>{selectedIndicator.label}</span>
        {selectedProject.global_data?.allocated_units != null && selectedProject.global_data?.amount != null && (
          <span className="text-neutral-500">
            ({selectedProject.global_data.allocated_units}/{selectedProject.global_data.amount} allocated)
          </span>
        )}
      </div>
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-left text-[10px] text-neutral-500">
        <span><span className="text-green-400">⭕</span> Untouched</span>
        <span><span className="text-green-300">◔</span> &gt;50% available</span>
        <span><span className="text-amber-400">◓</span> &lt;50% available</span>
        <span><span className="text-red-400">⬤</span> Fully allocated</span>
      </div>
    </>
  );
}
