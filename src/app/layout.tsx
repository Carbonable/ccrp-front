import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import ClientLayout from './client-layout';

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
      }}
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <ClientLayout>{children}</ClientLayout>
    </ClerkProvider>
  );
}
