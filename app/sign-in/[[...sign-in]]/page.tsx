import {
  SignedOut,
  SignIn,
} from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="text-center mt-12">
      <h1 className="uppercase text-3xl font-bold">
        Carbon assets portfolio manager
      </h1>
      <h2 className="font-light">
        Powered by <span className="text-greenish-500">Carbonable</span>
      </h2>
      <div className="mt-12 mx-auto w-fit">
        <SignedOut>
          <SignIn />
        </SignedOut>
      </div>
    </div>
  );
}
