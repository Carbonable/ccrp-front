// src/app/projects/[slug]/page.tsx (Server Component)
import { notFound } from 'next/navigation';
import ProjectPageClient from './ProjectPageClient'; // Client-side component
import { client } from '@/utils/sanity/client'; // Sanity client

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  // Fetch data from Sanity (server-side)
  const result = await client.fetch(`*[_type == "project" && slug.current == $slug]`, {
    slug: params.slug,
  });

  // Handle case where no project is found
  if (!result || result.length === 0 || !result[0].title) {
    console.log(result[0]);
    notFound(); // This will trigger a 404 response
  }

  const content = result[0]; // Extract the project content

  // Pass the content to the client-side component
  return <ProjectPageClient content={content} />;
}
