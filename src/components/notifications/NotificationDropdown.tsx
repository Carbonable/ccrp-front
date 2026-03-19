'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { BellIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationType } from '@/data/notifications';

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; className: string }
> = {
  project: { label: 'Projet', className: 'bg-blue-900/60 text-blue-300 border border-blue-700' },
  stock: { label: 'Stock', className: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700' },
  critical: { label: 'Critique', className: 'bg-red-900/60 text-red-300 border border-red-700' },
  update: { label: 'Mise à jour', className: 'bg-green-900/60 text-green-300 border border-green-700' },
  deadline: { label: 'Échéance', className: 'bg-orange-900/60 text-orange-300 border border-orange-700' },
  review: { label: 'Revue', className: 'bg-purple-900/60 text-purple-300 border border-purple-700' },
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);

  if (diffH < 1) return 'À l\'instant';
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD === 1) return 'Hier';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ open, onClose }: Props) {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-[200] w-[380px] max-w-[calc(100vw-2rem)] rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl flex flex-col"
      style={{ maxHeight: '520px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <BellIcon className="h-5 w-5 text-greenish-500" />
          <span className="font-semibold text-neutral-100">Notifications</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-greenish-600 px-2 py-0.5 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-greenish-400 transition-colors"
            >
              <CheckIcon className="h-3.5 w-3.5" />
              Tout marquer lu
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
            <BellIcon className="h-10 w-10 mb-2 opacity-40" />
            <p className="text-sm">Aucune notification</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const typeConf = TYPE_CONFIG[notif.type];
            return (
              <Link
                key={notif.id}
                href={notif.href}
                onClick={() => {
                  markAsRead(notif.id);
                  onClose();
                }}
                className={`flex gap-3 px-4 py-3 border-b border-neutral-800 hover:bg-neutral-800/60 transition-colors group cursor-pointer ${
                  !notif.read ? 'bg-neutral-800/30' : ''
                }`}
              >
                {/* Unread dot */}
                <div className="mt-1.5 flex-shrink-0">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      !notif.read ? 'bg-greenish-500' : 'bg-transparent'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm leading-snug ${
                        !notif.read ? 'font-semibold text-neutral-100' : 'font-normal text-neutral-300'
                      }`}
                    >
                      {notif.title}
                    </p>
                    <span className="flex-shrink-0 text-xs text-neutral-500 mt-0.5">
                      {formatDate(notif.date)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {notif.description}
                  </p>
                  <div className="mt-1.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${typeConf.className}`}
                    >
                      {typeConf.label}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-700 px-4 py-2 text-center">
        <Link
          href="/settings/notifications"
          onClick={onClose}
          className="text-xs text-neutral-500 hover:text-greenish-400 transition-colors"
        >
          Gérer les préférences de notification →
        </Link>
      </div>
    </div>
  );
}
