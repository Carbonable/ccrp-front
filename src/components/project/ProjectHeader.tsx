'use client';

import { useContext, useState } from "react";
import { BackButton, GreenButton } from "../common/Button";
import { Project } from "@/graphql/__generated__/graphql";
import ProjectInfo from "./ProjectInfo";
import { useProject } from "@/context/ProjectContext";

export default function ProjectHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { project } = useProject();

  const handleAction = () => {
    setIsOpen(true);
  }

  if (project === undefined) {
    return (
      <>
        Loading...
      </>
    )
  }

  return (
    <div className="bg-project-info">
      <div className="p-4 mt-[66px] lg:mt-0 md:p-8 lg:mx-auto max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
        <BackButton href="/portfolio">Back</BackButton>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-4 xl:gap-8 mt-8">
          <div className="order-1 lg:order-2">
            <img src={project.metadata?.collection_image_url} alt={`${project.name} project`} />
          </div>
          <div className="order-2 lg:order-1 lg:col-span-2">
            <ProjectInfo name={project.name} data={project.global_data} />
            <div className="mt-4">
              <GreenButton className="w-full" onClick={handleAction}>Allocate</GreenButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}