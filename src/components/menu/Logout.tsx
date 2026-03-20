'use client';

import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function Logout() {
  return (
    <div className="flex items-center gap-3">
      <OrganizationSwitcher
        hidePersonal={true}
        appearance={{
          baseTheme: dark,
          elements: {
            rootBox: 'w-full',
            organizationSwitcherTrigger:
              'px-2 py-1 rounded-md text-sm text-neutral-300 hover:bg-neutral-800 border border-neutral-700',
            organizationSwitcherPopoverCard: 'bg-neutral-900 border border-neutral-700',
            organizationPreview: 'text-neutral-200',
          },
        }}
        afterCreateOrganizationUrl="/dashboard"
        afterSelectOrganizationUrl="/dashboard"
      />
      <UserButton
        afterSignOutUrl="/sign-in"
        appearance={{
          baseTheme: dark,
          elements: {
            avatarBox: 'w-8 h-8',
            userButtonPopoverCard: 'bg-neutral-900 border border-neutral-700',
          },
        }}
        showName={true}
      >
        <UserButton.UserProfilePage label="Members" url="members" labelIcon={<></>}>
          <div />
        </UserButton.UserProfilePage>
      </UserButton>
    </div>
  );
}
