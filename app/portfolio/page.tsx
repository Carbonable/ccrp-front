import Banner from "@/components/portfolio/overview/Banner";
import ProjectsList from "@/components/portfolio/overview/ProjectsList";

export default function Portfolio() {
  return (
    <>
      <div className="relative mt-4">
        <Banner />
      </div>
      <div className="relative mt-20">
        <ProjectsList />
      </div>
    </>
  )
}