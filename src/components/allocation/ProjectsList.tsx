'use client';

import { Project } from '@/graphql/__generated__/graphql';
import { GET_PROJECTS } from '@/graphql/queries/projects';
import { useQuery } from '@apollo/client/react';
import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * availableRatio: 1 = fully free, 0 = nothing left.
 * The bar represents availability — full bar = lots available, empty = nothing.
 */
function getStockInfo(project: Project): {
  availableRatio: number;
  available: number;
  total: number;
  barColor: string;
} {
  const gd = project.global_data;
  const total = gd?.amount ?? 0;
  const allocated = gd?.allocated_units ?? 0;

  if (total === 0) {
    return { availableRatio: 0, available: 0, total: 0, barColor: 'bg-neutral-600' };
  }

  const available = Math.max(total - allocated, 0);
  const availableRatio = available / total;

  if (availableRatio > 0.5) return { availableRatio, available, total, barColor: 'bg-emerald-400' };
  if (availableRatio > 0) return { availableRatio, available, total, barColor: 'bg-amber-400' };
  return { availableRatio: 0, available: 0, total, barColor: 'bg-red-400' };
}

function textColor(availableRatio: number): string {
  if (availableRatio > 0.5) return 'text-emerald-400';
  if (availableRatio > 0) return 'text-amber-400';
  return 'text-red-400';
}

function StockBar({ availableRatio, barColor }: { availableRatio: number; barColor: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-neutral-700">
      <div
        className={`h-full rounded-full transition-all ${barColor}`}
        style={{ width: `${Math.max(availableRatio * 100, availableRatio > 0 ? 4 : 0)}%` }}
      />
    </div>
  );
}

function ProjectItem({
  project,
  isSelected,
  onClick,
}: {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}) {
  const info = getStockInfo(project);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-neutral-700/50 ${
        isSelected ? 'bg-neutral-700/70' : ''
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-neutral-100">{project.name}</span>
          <span className={`shrink-0 text-[10px] font-medium ${textColor(info.availableRatio)}`}>
            {info.total === 0 ? '—' : `${info.available.toLocaleString()} avail.`}
          </span>
        </div>
        <div className="mt-1.5">
          <StockBar availableRatio={info.availableRatio} barColor={info.barColor} />
        </div>
      </div>
    </button>
  );
}

export default function ProjectsList({
  selectedProject,
  setSelectedProject,
}: {
  selectedProject: Project | undefined;
  setSelectedProject: (project: Project) => void;
}) {
  const { loading, error, data } = useQuery<any>(GET_PROJECTS);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (error) {
    console.error(error);
  }

  const projects: Project[] = data?.projects ?? [];

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject, setSelectedProject]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (project: Project) => {
    setSelectedProject(project);
    setOpen(false);
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

  const si = getStockInfo(selectedProject);

  return (
    <div ref={ref} className="relative w-full">
      <div className="mb-2 text-left font-light uppercase text-neutral-200">Select Project</div>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-left transition hover:border-neutral-500 focus:border-primary focus:outline-none"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-medium text-neutral-100">{selectedProject.name}</span>
            <span className={`shrink-0 text-[10px] font-medium ${textColor(si.availableRatio)}`}>
              {si.total > 0 ? `Global: ${si.available.toLocaleString()} / ${si.total.toLocaleString()} avail.` : ''}
            </span>
          </div>
          <div className="mt-2">
            <StockBar availableRatio={si.availableRatio} barColor={si.barColor} />
          </div>
        </div>
        <ChevronDownIcon
          className={`ml-3 h-4 w-4 shrink-0 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl">
          {projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              isSelected={project.id === selectedProject.id}
              onClick={() => handleSelect(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
