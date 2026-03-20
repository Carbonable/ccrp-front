'use client';

import { useState, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const bellRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={bellRef}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-greenish-600 hover:text-greenish-400 transition-colors"
        aria-label="Notifications"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-greenish-600 text-[10px] font-bold text-white ring-2 ring-neutral-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      <NotificationDropdown open={open} onClose={() => setOpen(false)} anchorRef={bellRef} />
    </>
  );
}
