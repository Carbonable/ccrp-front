'use client';

import { OrganizationProfile } from '@clerk/nextjs';

export default function UsersPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'bg-neutral-900 border border-neutral-700 shadow-none w-full max-w-none',
            navbar: 'bg-neutral-800',
            navbarButton: 'text-neutral-300',
          },
        }}
      />
    </div>
  );
}
