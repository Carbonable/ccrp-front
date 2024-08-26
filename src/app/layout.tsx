'use client';
import MenuWrapper from "@/components/menu/MenuWrapper";
import BaseLayout from "./base-layout";
import dynamic from 'next/dynamic';
import { usePathname } from "next/navigation";
import { ApolloWrapper } from "./ApolloWrapper";
import FullWidthLayout from "./full-width-layout";

const AuthProviderClient = dynamic(() => import('@/components/authentication/AuthProviderClient'), {
  ssr: false,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  if (pathname === "/login") {
    return (
      <BaseLayout>
        <AuthProviderClient>
          <div className="p-4 md:p-12 z-0 max-w-screen-2xl mx-auto">
            {children}
          </div>
        </AuthProviderClient>
      </BaseLayout>
    );
  }

  if (pathname.includes("/projects")) {
    return (
      <FullWidthLayout>
        <AuthProviderClient>
          <MenuWrapper />
          <ApolloWrapper>
            <div className="ml-0 mt-[66px] lg:mt-0 lg:pl-[222px] lg:mx-auto max-w-full min-h-screen">
              {children}
            </div>
        </ApolloWrapper>
        </AuthProviderClient>
      </FullWidthLayout>
    );
  }

  return (
    <BaseLayout>
      <AuthProviderClient>
        <MenuWrapper />
        <ApolloWrapper>
          <div className="p-4 ml-0 mt-[66px] md:p-8 lg:p-4 lg:mt-0 lg:pl-[240px] lg:mx-auto max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl min-h-screen">
            {children}
          </div>
        </ApolloWrapper>
      </AuthProviderClient>
    </BaseLayout>
  );
}