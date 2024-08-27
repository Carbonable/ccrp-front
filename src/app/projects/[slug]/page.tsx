'use client';

import Title from "@/components/common/Title";
import ImageGallery from "@/components/project/overview/ImagesGallery";
import SectionWrapper from "@/components/project/overview/SectionWrapper";
import { client } from "@/utils/sanity/client";
import { SanityContent } from "@/utils/sanity/types";
import { useEffect, useState } from "react";

export default function ProjectPage({ params }: Readonly<{ params: { slug: string } }>) {
  const [content, setContent] = useState<SanityContent | undefined>(undefined);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const result = await client.fetch(
          `*[_type == "project" && slug.current == $slug]`,
          { slug: params.slug }
        );

        setContent(result[0]);

      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

  fetchProjectData();
  }, [params.slug]);

  if (!content) {
    return (
      <div className="mt-6"> 
        Overview is not available
      </div>
    )
  }
  
  return (
    <>
      { content && content.projectOverview && content.projectOverview.sections.length > 0 && content.projectOverview.sections.map((section, index) => (
          <SectionWrapper key={`section_${index}`} section={section}></SectionWrapper>
      ))}
      { content.imagesGallery?.length > 0 && 
        <>
          <Title title="Images gallery" />
          <div className="mt-4">
            <ImageGallery images={content.imagesGallery} videos={content.videosGallery} />
          </div>
        </>
      }
    </>
  )
}