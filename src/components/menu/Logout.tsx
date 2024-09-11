'use client';

import { useUser } from '@clerk/nextjs';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function Logout() {
  const { user } = useUser();

  if (!user) return null;

  const userName = user.fullName ?? user.firstName!;

  return (
    <div className="text-sm">
      <SignedIn>
        <div className="flex items-center justify-start">
          <UserButton />
          <div className="ml-2 overflow-hidden text-ellipsis">{userName}</div>
        </div>
      </SignedIn>
    </div>
  );
}
