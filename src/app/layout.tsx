import MenuWrapper from "@/components/menu/MenuWrapper";
import BaseLayout from "./base-layout";
import dynamic from 'next/dynamic'

const AuthProviderClient = dynamic(() => import('@/components/authentication/AuthProviderClient'), {
  ssr: false,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <BaseLayout>
      <AuthProviderClient>
        <MenuWrapper />
        <div className="p-4 ml-0 mt-[66px] md:p-8 lg:p-4 lg:mt-0 lg:pl-[240px] lg:mx-auto max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl">
          {children}
        </div>
      </AuthProviderClient>
    </BaseLayout>
  );
}