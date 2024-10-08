import { SignedOut, SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="mt-12 text-center">
      <h1 className="text-3xl font-bold uppercase">Carbon assets portfolio manager</h1>
      <h2 className="font-light">
        Powered by <span className="text-greenish-500">Carbonable</span>
      </h2>
      <div className="mx-auto mt-12 w-fit">
        <SignedOut>
          <SignIn />
        </SignedOut>
      </div>
    </div>
  );
}
