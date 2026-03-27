import { SignIn } from '@clerk/nextjs';

export default function SignInPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <SignIn
        forceRedirectUrl={`/${locale}/dashboard`}
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-neutral-900 border border-neutral-700',
          },
        }}
      />
    </div>
  );
}
