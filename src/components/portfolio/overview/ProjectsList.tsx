'use client';

import { Project } from "@/graphql/__generated__/graphql";
import { GET_PROJECTS } from "@/graphql/queries/projects";
import { useQuery } from "@apollo/client";


export default function ProjectsList() {

    const { loading, error, data } = useQuery(GET_PROJECTS);

    if (error) {
        console.error(error);
    }

    const projects: Project[] = data?.projects;

    if (loading) {
        return (
            <div className="flex justify-between items-center flex-wrap">
                <div className="font-extrabold text-neutral-100 text-lg uppercase w-full md:w-fit">
                    Loading...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-between items-center flex-wrap">
                <div className="font-extrabold text-neutral-100 text-lg uppercase w-full md:w-fit">
                    Error: {error.message}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-between items-center flex-wrap">
                <div className="font-extrabold text-neutral-100 text-lg uppercase w-full md:w-fit">
                    <NumberOfProjects number={projects.length} />
                </div>
            </div>
            <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                    {projects.map((project: Project, idx: number) => (
                        <a 
                            key={`project_${project.id}_${idx}`}
                            href={`/projects/${project.slug}`}
                            className="overflow-hidden text-ellipsis"
                        >
                            <img src={project.metadata?.sft_image_url} alt={`${project.name} project`} />
                        </a>
                    ))}
                </div>
            </div>
        </>
    )
}

function NumberOfProjects({ number }: { number: number }) {
    if (number === 0) {
        return (
            <div className="font-extrabold text-neutral-100 text-lg uppercase w-full md:w-fit">
                No projects in the portfolio
            </div>
        )
    }

    return (
        <div className="font-extrabold text-neutral-100 text-lg uppercase w-full md:w-fit">
            {number} assets
        </div>
    )
}