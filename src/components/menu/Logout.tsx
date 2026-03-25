'use client';

import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import NotificationBell from '@/components/notifications/NotificationBell';

export default function Logout() {
  return (
    <div className="flex w-full flex-col gap-3">
      {/* Organization Switcher — full width */}
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
              'bg-neutral-900 border border-neutral-700 shadow-2xl',
            organizationPreview: 'text-neutral-200',
            organizationSwitcherPopoverActionButton: 'text-neutral-300 hover:bg-neutral-800',
            organizationSwitcherPopoverActionButton__createOrganization: 'hidden',
            organizationSwitcherPopoverFooter: 'hidden',
          },
        }}
        afterCreateOrganizationUrl="/dashboard"
        afterSelectOrganizationUrl="/dashboard"
      />

      {/* Avatar + Notification bell — same row */}
      <div className="flex items-center justify-between px-1">
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            baseTheme: dark,
            elements: {
              avatarBox: 'w-8 h-8',
              userButtonPopoverCard:
                'bg-neutral-900 border border-neutral-700 shadow-2xl',
              userButtonPopoverActionButton: 'text-neutral-300 hover:bg-neutral-800',
              userButtonPopoverFooter: 'hidden',
            },
          }}
        />
        <NotificationBell />
      </div>
    </div>
  );
}
