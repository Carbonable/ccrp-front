'use client';

import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/utils';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
};

export default function SimpleModal({
  isOpen,
  onClose,
  title,
  footer,
  children,
  size = 'lg',
}: SimpleModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={classNames(
          'relative z-[121] flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 text-neutral-100 shadow-2xl',
          sizeClasses[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 px-6 py-4">
          <div className="min-w-0 text-lg font-semibold text-neutral-100">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-800 p-2 text-neutral-400 transition hover:border-neutral-600 hover:text-white"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer ? <div className="border-t border-neutral-800 px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
