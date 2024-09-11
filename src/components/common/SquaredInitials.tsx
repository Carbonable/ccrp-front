'use client';

import { getProjectColor } from '@/utils/utils';
import { useState } from 'react';

export default function SquaredInitials({
  text,
  color,
}: {
  text: string | any;
  color: string | any;
}) {
  const [backgroundColor] = useState(getProjectColor(color));

  if (!text) return null;

  const cleanText = text.replace(/[^a-zA-Z ]/g, '').replace(/\s+/g, ' ');

  const getInitials = (text: string): string => {
    const words = text.split(' ');
    const initials = words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
    return initials;
  };

  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-neutral-50"
      style={{ backgroundColor: backgroundColor }}
    >
      {getInitials(cleanText)}
    </div>
  );
}
