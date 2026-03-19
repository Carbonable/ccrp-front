'use client';

import { UserButton } from '@clerk/nextjs';

export default function Logout() {
  return (
    <div className="flex items-center gap-3">
      <UserButton
        afterSignOutUrl="/sign-in"
        appearance={{
          elements: {
            avatarBox: 'w-8 h-8',
            userButtonPopoverCard: 'bg-neutral-900 border border-neutral-700',
          },
        }}
        showName={true}
      />
    </div>
  );
}
