import BaseLayout from "../base-layout";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout>
      <div className="p-4 md:p-12 z-0 max-w-screen-2xl mx-auto min-h-screen">
        {children}
      </div>
    </BaseLayout>
  );
}