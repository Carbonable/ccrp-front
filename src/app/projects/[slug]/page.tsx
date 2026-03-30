import { redirect } from 'next/navigation';

export default async function ProjectPage({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const { slug } = await params;
  redirect(`/en/projects/${slug}`);
}
