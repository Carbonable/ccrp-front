'use client';
import MenuWrapper from '@/components/menu/MenuWrapper';
import BaseLayout from './base-layout';
import { usePathname } from 'next/navigation';
import { ApolloWrapper } from './ApolloWrapper';
import FullWidthLayout from './full-width-layout';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return (
      <BaseLayout>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <div className="z-0 mx-auto max-w-screen-2xl p-4 md:p-12">{children}</div>
        </ClerkProvider>
      </BaseLayout>
    );
  }

  if (pathname.includes('/projects')) {
    return (
      <FullWidthLayout>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <MenuWrapper />
          <ApolloWrapper>
            <div className="ml-0 mt-[66px] min-h-screen max-w-full lg:mx-auto lg:mt-0 lg:pl-[222px]">
              {children}
            </div>
          </ApolloWrapper>
        </ClerkProvider>
      </FullWidthLayout>
    );
  }

  return (
    <BaseLayout>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <MenuWrapper />
        <ApolloWrapper>
          <div className="2xl:max-w-8xl ml-0 mt-[66px] min-h-screen max-w-full p-4 md:p-8 lg:mx-auto lg:mt-0 lg:max-w-6xl lg:p-4 lg:pl-[240px] xl:max-w-7xl">
            {children}
          </div>
        </ApolloWrapper>
      </ClerkProvider>
    </BaseLayout>
  );
}
