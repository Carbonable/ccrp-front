import MenuWrapper from "@/components/menu/MenuWrapper";
import BaseLayout from "../app/base-layout";

export default function IframeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout>
      <MenuWrapper />
      <div className="ml-0 mt-0 lg:pl-[240px] lg:mx-auto max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
        {children}
      </div>
    </BaseLayout>
  );
}