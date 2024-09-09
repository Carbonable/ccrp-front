"use client";
import { useEffect, useState } from "react";
import ImageGallery from "@/components/project/overview/ImagesGallery";
import SectionWrapper from "@/components/project/overview/SectionWrapper";
import Title from "@/components/common/Title";
import { SanityContent } from "@/utils/sanity/types";

export default function ProjectPageClient({
  content,
}: {
  content: SanityContent;
}) {
  const [clientContent, setClientContent] = useState<SanityContent | null>(
    null
  );

  useEffect(() => {
    // Hydration-safe dynamic content can be set here
    setClientContent(content);
  }, [content]);

  if (!clientContent) {
    return <div>Loading project...</div>;
  }

  return (
    <>
      {clientContent.projectOverview?.sections?.length > 0 &&
        clientContent.projectOverview.sections.map((section, index) => (
          <SectionWrapper key={`section_${index}`} section={section} />
        ))}

      {clientContent.imagesGallery?.length > 0 && (
        <>
          <Title title="Images gallery" />
          <div className="mt-4">
            <ImageGallery
              images={clientContent.imagesGallery}
              videos={clientContent.videosGallery}
            />
          </div>
        </>
      )}
    </>
  );
}
