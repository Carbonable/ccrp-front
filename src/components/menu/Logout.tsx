'use client';

import { UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import NotificationBell from '@/components/notifications/NotificationBell';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Avatar + Language switcher + Notification bell — same row */}
      <div className="flex items-center justify-between px-1">
        <UserButton
          signInUrl="/sign-in"
          appearance={{
            baseTheme: dark,
            elements: {
              avatarBox: 'w-8 h-8',
              userButtonPopoverCard:
                'bg-neutral-900 border border-neutral-700 shadow-2xl',
              userButtonPopoverActionButton: 'text-neutral-300 hover:bg-neutral-800',
              userButtonPopoverFooter: 'hidden',
              footer: 'hidden',
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Action label="manageAccount" />
            <UserButton.Action
              label="Manage organization"
              labelIcon={<BuildingOfficeIcon className="h-4 w-4" />}
              onClick={() => router.push('/admin/users')}
            />
            <UserButton.Action label="signOut" />
          </UserButton.MenuItems>
        </UserButton>
        <LanguageSwitcher />
        <NotificationBell />
      </div>
    </div>
  );
}
