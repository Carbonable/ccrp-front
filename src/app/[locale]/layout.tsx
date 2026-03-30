import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ClientLayout from './client-layout';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <ClerkProvider
      signInUrl={`/${locale}/sign-in`}
      signUpUrl={`/${locale}/sign-up`}
      signInForceRedirectUrl={`/${locale}/dashboard`}
      signUpForceRedirectUrl={`/${locale}/dashboard`}
      signInFallbackRedirectUrl={`/${locale}/dashboard`}
      signUpFallbackRedirectUrl={`/${locale}/dashboard`}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#22c55e',
          colorBackground: '#171717',
          colorText: '#f5f5f5',
          colorInputBackground: '#262626',
          colorInputText: '#f5f5f5',
        },
        elements: {
          footer: 'hidden',
          footerAction: 'hidden',
        },
      }}
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ClientLayout>{children}</ClientLayout>
      </NextIntlClientProvider>
    </ClerkProvider>
  );
}
