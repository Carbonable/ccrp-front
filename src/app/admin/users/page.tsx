'use client';

import { OrganizationProfile, OrganizationSwitcher, useOrganization } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

function OrgContent() {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <div className="text-neutral-400 mt-6">Loading...</div>;
  }

  if (!organization) {
    return (
      <div className="mt-6">
        <p className="text-neutral-400 mb-4">
          No organization selected. Create or join one to manage users.
        </p>
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: 'w-full',
              organizationSwitcherTrigger:
                'bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 hover:bg-neutral-700 w-full justify-start',
              footer: 'hidden',
            },
          }}
          afterCreateOrganizationUrl="/admin/users"
          afterSelectOrganizationUrl="/admin/users"
        />
      </div>
    );
  }

  return (
    <OrganizationProfile
      appearance={{
        baseTheme: dark,
        elements: {
          rootBox: 'w-full',
          card: 'bg-neutral-900 border border-neutral-700 shadow-none w-full max-w-none',
          footer: 'hidden',
          footerAction: 'hidden',
        },
      }}
    />
  );
}

export default function UsersPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <OrgContent />
    </div>
  );
}
