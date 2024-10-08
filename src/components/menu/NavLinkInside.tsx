'use client';
import { MenuLink } from '@/types/Link';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavLinkInside({
  link,
  setOpenMenu,
}: {
  link: MenuLink;
  setOpenMenu: (open: boolean) => void;
}) {
  const [isShown, setIsShown] = useState(true);
  const pathName = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(pathName.includes(link.href));

    if (pathName.includes('/projects') && link.href === '/portfolio') {
      setIsActive(true);
    }
  }, [pathName, link.href]);

  if (link.isOpen === false) {
    return (
      <div key={link.label} className="font-inter text-base uppercase">
        <div className="flex w-full items-center justify-start">
          <div className="h-[44px] w-[3px] bg-transparent"></div>
          <div
            className="flex cursor-default items-center justify-start py-2 pl-6 text-neutral-400"
            onMouseEnter={() => setIsShown(false)}
            onMouseLeave={() => setIsShown(true)}
          >
            <Image
              src={`/assets/images/menu/${link.icon}-inactive.svg`}
              alt={`${link.icon}_inactive`}
              width={24}
              height={24}
              className="h-6 w-6"
            />
            {isShown && <div className="py-3 pl-2">{link.label}</div>}
            {!isShown && <div className="py-3 pl-2">COMING SOON</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      prefetch
      key={link.label}
      className="font-inter text-base uppercase"
      href={link.href}
      onClick={() => setOpenMenu(false)}
    >
      <div
        className={`flex w-full items-center justify-start ${isActive ? '' : 'hover:brightness-125'}`}
      >
        <div className={`h-[48px] w-[3px] ${isActive ? 'bg-primary' : 'bg-transparent'}`}></div>
        <div
          className={`flex w-full items-center justify-start pl-6 ${isActive ? 'bg-menu-selected text-primary' : 'text-neutral-200'}`}
        >
          <Image
            src={`/assets/images/menu/${link.icon}${isActive ? '-active' : ''}.svg`}
            alt={`${link.icon}${isActive ? '_active' : ''}`}
            width={6}
            height={6}
            className="h-6 w-6"
          />
          <div className="py-3 pl-2">{link.label}</div>
        </div>
      </div>
    </Link>
  );
}
