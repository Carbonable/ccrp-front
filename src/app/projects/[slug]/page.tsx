'use client';

import Title from '@/components/common/Title';
import ImageGallery from '@/components/project/overview/ImagesGallery';
import SectionWrapper from '@/components/project/overview/SectionWrapper';
import { SanityContent } from '@/utils/sanity/types';
import { useEffect, useState } from 'react';

export default function ProjectPage({ params }: Readonly<{ params: { slug: string } }>) {
  const [content, setContent] = useState<SanityContent | undefined>(undefined);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const query = `*[_type == "project" && slug.current == $slug]`;
        const queryParams = JSON.stringify({ slug: params.slug });
        const res = await fetch(`/api/sanity?query=${encodeURIComponent(query)}&params=${encodeURIComponent(queryParams)}`);
        const result = await res.json();

        setContent(Array.isArray(result) ? result[0] : undefined);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [params.slug]);

  if (!content) {
    return <div className="mt-6">Overview is not available</div>;
  }

  return (
    <>
      {content &&
        content.projectOverview &&
        content.projectOverview.sections.length > 0 &&
        content.projectOverview.sections.map((section, index) => (
          <SectionWrapper key={`section_${index}`} section={section}></SectionWrapper>
        ))}
      {content.imagesGallery?.length > 0 && (
        <>
          <Title title="Images gallery" />
          <div className="mt-4">
            <ImageGallery images={content.imagesGallery} videos={content.videosGallery} />
          </div>
        </>
      )}
    </>
  );
}
