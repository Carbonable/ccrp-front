'use client';

import { UserButton } from '@clerk/nextjs';

export default function Logout() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <UserButton
        afterSignOutUrl="/sign-in"
        appearance={{
          elements: {
            avatarBox: 'w-8 h-8',
          },
        }}
      />
    </div>
  );
}
