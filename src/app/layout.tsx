import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { NextIntlClientProvider } from 'next-intl';
import ClientLayout from './client-layout';

// Default messages for non-locale routes (fallback to English)
import messages from '../../messages/en.json';

export const metadata = {
  title: 'Carbonable CCPM',
  description: 'Carbon Credit Retirement Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <NextIntlClientProvider locale="en" messages={messages}>
        <ClientLayout>{children}</ClientLayout>
      </NextIntlClientProvider>
    </ClerkProvider>
  );
}
