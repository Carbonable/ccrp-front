export default function Layout({
  children,
}: Readonly<{
  params: { slug: string };
  children: React.ReactNode;
}>) {
  return children;
}
