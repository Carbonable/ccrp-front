'use client';
import MenuWrapper from '@/components/menu/MenuWrapper';
import BaseLayout from './base-layout';
import { usePathname } from 'next/navigation';
import { ApolloWrapper } from './ApolloWrapper';
import FullWidthLayout from './full-width-layout';
import { useRouter } from 'next/router';
import { AuthProvider } from '@/components/auth/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const publicRoutes = ['/sign-in', '/sign-up', '/'];

  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return (
      <BaseLayout>
        <AuthProvider>
          {publicRoutes.includes(pathname) ? (
            <div className="z-0 mx-auto max-w-screen-2xl p-4 md:p-12">{children}</div>
          ) : (
            <ProtectedRoute>
              <div className="z-0 mx-auto max-w-screen-2xl p-4 md:p-12">{children}</div>
            </ProtectedRoute>
          )}
        </AuthProvider>
      </BaseLayout>
    );
  }

  if (pathname.includes('/projects')) {
    return (
      <FullWidthLayout>
        <AuthProvider>
          {publicRoutes.includes(pathname) ? (
            <>
            <MenuWrapper />
            <ApolloWrapper>
              <div className="ml-0 mt-[66px] min-h-screen max-w-full lg:mx-auto lg:mt-0 lg:pl-[222px]">
                {children}
              </div>
            </ApolloWrapper>
            </>
          ) : (
            <ProtectedRoute>
              <>
              <MenuWrapper />
              <ApolloWrapper>
                <div className="ml-0 mt-[66px] min-h-screen max-w-full lg:mx-auto lg:mt-0 lg:pl-[222px]">
                  {children}
                </div>
              </ApolloWrapper>
              </>
            </ProtectedRoute>
          )}
        </AuthProvider>
      </FullWidthLayout>
    );
  }

  return (
    <BaseLayout>
    <AuthProvider>
          {publicRoutes.includes(pathname) ? (
            <>
            <MenuWrapper />
            <ApolloWrapper>
              <div className="2xl:max-w-8xl ml-0 mt-[66px] min-h-screen max-w-full p-4 md:p-8 lg:mx-auto lg:mt-0 lg:max-w-6xl lg:p-4 lg:pl-[240px] xl:max-w-7xl">
                {children}
              </div>
            </ApolloWrapper>
            </>
          ) : (
            <ProtectedRoute>
              <>
              <MenuWrapper />
              <ApolloWrapper>
                <div className="2xl:max-w-8xl ml-0 mt-[66px] min-h-screen max-w-full p-4 md:p-8 lg:mx-auto lg:mt-0 lg:max-w-6xl lg:p-4 lg:pl-[240px] xl:max-w-7xl">
                  {children}
                </div>
              </ApolloWrapper>
              </>
            </ProtectedRoute>
          )}
        </AuthProvider>
    </BaseLayout>
  );
}
