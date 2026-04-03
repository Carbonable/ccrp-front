'use client';

import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@/i18n/navigation';
import { BellIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useNotifications, iconToType, NotificationType } from '@/context/NotificationContext';
import { useLocale, useTranslations } from 'next-intl';

const TYPE_CONFIG: Record<NotificationType, string> = {
  project: 'bg-blue-900/60 text-blue-300 border border-blue-700',
  stock: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700',
  critical: 'bg-red-900/60 text-red-300 border border-red-700',
  update: 'bg-green-900/60 text-green-300 border border-green-700',
  deadline: 'bg-orange-900/60 text-orange-300 border border-orange-700',
  review: 'bg-purple-900/60 text-purple-300 border border-purple-700',
};

interface Props {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export default function NotificationDropdown({ open, onClose, anchorRef }: Props) {
  const { notifications, unreadCount, markAllAsRead, markAsRead, loading } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const t = useTranslations('notifications');

  function formatDate(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffD = Math.floor(diffH / 24);

    if (diffH < 1) return t('justNow');
    if (diffH < 24) return t('hoursAgo', { count: diffH });
    if (diffD === 1) return t('yesterday');
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !anchorRef.current) return;

    const updatePosition = () => {
      const rect = anchorRef.current!.getBoundingClientRect();
      const dropdownMaxHeight = 520;

      setPosition({
        top: Math.max(8, rect.top - dropdownMaxHeight - 8),
        left: Math.max(8, rect.left),
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, anchorRef]);

  if (!open || !mounted) return null;

  const dropdown = (
    <div
      ref={ref}
      className="fixed z-[99999] flex w-[380px] max-w-[calc(100vw-2rem)] flex-col rounded-xl border border-neutral-700 bg-neutral-900 shadow-2xl"
      style={{ top: position.top, left: position.left, maxHeight: '520px' }}
    >
      <div className="flex items-center justify-between border-b border-neutral-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <BellIcon className="h-5 w-5 text-greenish-500" />
          <span className="font-semibold text-neutral-100">{t('title')}</span>
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
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-greenish-400"
            >
              <CheckIcon className="h-3.5 w-3.5" />
              {t('markAllRead')}
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-neutral-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-600 border-t-greenish-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
            <BellIcon className="mb-2 h-10 w-10 opacity-40" />
            <p className="text-sm">{t('noNotifications')}</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const type = iconToType(notif.icon);
            const typeClassName = TYPE_CONFIG[type];
            // Extract title from body (first line or data.title)
            const title = (notif.data as Record<string, string>)?.title || notif.body.split('\n')[0];
            const description =
              (notif.data as Record<string, string>)?.description || notif.body.split('\n').slice(1).join('\n') || notif.body;
            return (
              <Link
                key={notif.id}
                href={notif.url || '/dashboard'}
                onClick={() => {
                  markAsRead(notif.id);
                  onClose();
                }}
                className={`group flex cursor-pointer gap-3 border-b border-neutral-800 px-4 py-3 transition-colors hover:bg-neutral-800/60 ${
                  !notif.is_read ? 'bg-neutral-800/30' : ''
                }`}
              >
                <div className="mt-1.5 flex-shrink-0">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      !notif.is_read ? 'bg-greenish-500' : 'bg-transparent'
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm leading-snug ${
                        !notif.is_read ? 'font-semibold text-neutral-100' : 'font-normal text-neutral-300'
                      }`}
                    >
                      {title}
                    </p>
                    <span className="mt-0.5 flex-shrink-0 text-xs text-neutral-500">
                      {formatDate(notif.created_at)}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-neutral-400">{description}</p>
                  <div className="mt-1.5">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${typeClassName}`}>
                      {t(`types.${type}`)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="border-t border-neutral-700 px-4 py-2 text-center">
        <Link
          href="/settings/notifications"
          onClick={onClose}
          className="text-xs text-neutral-500 transition-colors hover:text-greenish-400"
        >
          {t('managePreferences')} →
        </Link>
      </div>
    </div>
  );

  return createPortal(dropdown, document.body) as unknown as React.ReactElement;
}
