"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Logout() {
  const { user } = useUser();

  if (!user) return null;

  const userName = user.fullName ?? user.firstName!;

  return (
    <div className="text-sm">
      <div>Welcome, {userName}</div>
      <SignedIn>
        <UserButton />
        <div className="text-red-800 hover:text-red-700 cursor-pointer mt-1">
          <SignOutButton />
        </div>
      </SignedIn>
    </div>
  );
}
