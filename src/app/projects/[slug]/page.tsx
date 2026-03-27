import { redirect } from 'next/navigation';

export default function ProjectPage({
  params,
}: Readonly<{ params: { slug: string } }>) {
  redirect(`/en/projects/${params.slug}`);
}
