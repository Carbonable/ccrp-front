import BaseLayout from "../base-layout";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout>
      {children}
    </BaseLayout>
  );
}