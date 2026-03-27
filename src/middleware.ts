import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  '/',
  '/:locale',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/:locale/sign-in(.*)',
  '/:locale/sign-up(.*)',
  '/api/sanity(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api/') || pathname.startsWith('/trpc/')) {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }

    return NextResponse.next();
  }

  const intlResponse = intlMiddleware(request);

  if (intlResponse.headers.get('location')) {
    return intlResponse;
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  return intlResponse;
});

export const config = {
  matcher: [
    '/((?!api|trpc|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
