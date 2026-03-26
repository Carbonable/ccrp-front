'use client';

import { useState } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { MenuLink } from '@/types/Link';
import { useTranslations } from 'next-intl';

export default function NavLinkOutside({ link }: { link: MenuLink }) {
  const t = useTranslations('menu');
  const tc = useTranslations('common');
  const [isShown, setIsShown] = useState(true);
  const label = t(link.labelKey);

  if (link.isOpen === false) {
    return (
      <div key={link.labelKey} className="font-inter text-base uppercase">
        <div className="flex w-full items-center justify-start">
          <div className="h-[44px] w-[3px] bg-transparent"></div>
          <div
            className="flex cursor-default items-center justify-start py-2 pl-6 text-neutral-400"
            onMouseEnter={() => setIsShown(false)}
            onMouseLeave={() => setIsShown(true)}
          >
            <Image
              src={`/assets/images/menu/${link.icon}.svg`}
              alt={`${link.icon}_inactive`}
              width={24}
              height={24}
              className="h-6 w-6"
            />
            {isShown && <div className="py-3 pl-2">{label}</div>}
            {!isShown && <div className="py-3 pl-2">{tc('comingSoon')}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <a
      key={link.labelKey}
      className="font-inter text-base uppercase"
      href={link.href}
      target="_blank"
      rel="noreferrer"
    >
      <div className="flex w-full items-center justify-start hover:brightness-125">
        <div className="h-[44px] w-[3px] bg-transparent"></div>
        <div className="flex items-center justify-start py-2 pl-6 text-neutral-200">
          <Image
            src={`/assets/images/menu/${link.icon}.svg`}
            alt={`${link.icon}_active`}
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <div className="py-3 pl-2">{label}</div>
          <ArrowTopRightOnSquareIcon className="ml-2 w-4" />
        </div>
      </div>
    </a>
  );
}
