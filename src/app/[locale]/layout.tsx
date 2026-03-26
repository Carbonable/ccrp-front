import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ClientLayout from './client-layout';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  unstable_setRequestLocale(locale);
  const messages = useMessages();

  return (
    <html lang={locale} className="bg-neutral-950">
      <body>
        <ClerkProvider
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
          signInForceRedirectUrl={`/${locale}/dashboard`}
          signUpForceRedirectUrl={`/${locale}/dashboard`}
          signInFallbackRedirectUrl={`/${locale}/dashboard`}
          signUpFallbackRedirectUrl={`/${locale}/dashboard`}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ClientLayout>{children}</ClientLayout>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
