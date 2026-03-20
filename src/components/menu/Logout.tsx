'use client';

import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export default function Logout() {
  return (
    <div className="flex w-full flex-col gap-3 px-2">
      {/* Organization Switcher — full width above user */}
      <OrganizationSwitcher
        hidePersonal={true}
        appearance={{
          baseTheme: dark,
          elements: {
            rootBox: 'w-full',
            organizationSwitcherTrigger: [
              'w-full justify-between px-3 py-2 rounded-lg text-xs',
              'text-neutral-300 hover:bg-neutral-800/80',
              'border border-neutral-700/60 bg-neutral-800/40',
              'transition-colors duration-150',
            ].join(' '),
            organizationSwitcherPopoverCard:
              'bg-neutral-900 border border-neutral-700 shadow-2xl backdrop-blur-sm',
            organizationPreview: 'text-neutral-200',
            organizationSwitcherPopoverActionButton: 'text-neutral-300 hover:bg-neutral-800',
          },
        }}
        afterCreateOrganizationUrl="/dashboard"
        afterSelectOrganizationUrl="/dashboard"
      />

      {/* User button — compact row */}
      <UserButton
        afterSignOutUrl="/sign-in"
        appearance={{
          baseTheme: dark,
          elements: {
            rootBox: 'w-full',
            userButtonBox: 'w-full',
            userButtonTrigger: [
              'w-full justify-start px-3 py-2 rounded-lg',
              'hover:bg-neutral-800/80 transition-colors duration-150',
            ].join(' '),
            avatarBox: 'w-7 h-7',
            userButtonOuterIdentifier: 'text-xs text-neutral-300 truncate',
            userButtonPopoverCard:
              'bg-neutral-900 border border-neutral-700 shadow-2xl backdrop-blur-sm',
            userButtonPopoverActionButton: 'text-neutral-300 hover:bg-neutral-800',
            userButtonPopoverFooter: 'hidden',
          },
        }}
        showName={true}
      />
    </div>
  );
}
