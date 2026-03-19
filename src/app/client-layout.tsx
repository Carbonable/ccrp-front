'use client';

import MenuWrapper from '@/components/menu/MenuWrapper';
import BaseLayout from './base-layout';
import { usePathname } from 'next/navigation';
import { ApolloWrapper } from './ApolloWrapper';
import FullWidthLayout from './full-width-layout';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { RefetchProvider } from '@/context/General';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return (
      <BaseLayout>
        <div className="z-0 mx-auto max-w-screen-2xl p-4 md:p-12">{children}</div>
      </BaseLayout>
    );
  }

  if (pathname.includes('/projects')) {
    return (
      <FullWidthLayout>
        <SignedIn>
          <MenuWrapper />
          <ApolloWrapper>
            <div className="ml-0 mt-[66px] min-h-screen max-w-full lg:mx-auto lg:mt-0 lg:pl-[222px]">
              {children}
            </div>
          </ApolloWrapper>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </FullWidthLayout>
    );
  }

  return (
    <BaseLayout>
      <SignedIn>
        <MenuWrapper />
        <ApolloWrapper>
          <RefetchProvider>
            <div className="2xl:max-w-8xl ml-0 mt-[66px] min-h-screen max-w-full p-4 md:p-8 lg:mx-auto lg:mt-0 lg:max-w-6xl lg:p-4 lg:pl-[240px] xl:max-w-7xl">
              {children}
            </div>
          </RefetchProvider>
        </ApolloWrapper>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </BaseLayout>
  );
}
