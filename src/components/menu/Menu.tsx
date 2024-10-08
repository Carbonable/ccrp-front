'use client';
import Image from 'next/image';
import NavLinkInside from './NavLinkInside';
import NavLinkOutside from './NavLinkOutside';
import { adminLink, links } from './links';
import Logout from './Logout';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function Menu({
  openMenu,
  setOpenMenu,
}: {
  openMenu: boolean;
  setOpenMenu: (open: boolean) => void;
}) {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (
      user &&
      user?.organizationMemberships.some((membership) => membership.role === 'org:admin')
    ) {
      setIsAdmin(true);
    }
  }, [user]);

  return (
    <div
      className={`${openMenu ? 'fixed z-50 block w-[300px] bg-neutral-900' : 'hidden w-0 bg-neutral-900'} left-0 h-[calc(100vh_-_68px)] pr-4 pt-4 lg:fixed lg:block lg:h-[100vh] lg:w-[222px] lg:bg-neutral-900`}
    >
      <Image
        src="/assets/logo/logo.svg"
        alt="Carbonable logo"
        width={144}
        height={36}
        className="hidden pl-4 lg:block"
      />
      <div className="hidden pl-[70px] font-extrabold uppercase text-greenish-600 lg:block">
        CCPM
      </div>
      <div className="mt-6 w-full lg:mt-12">
        {links.map(
          (link) =>
            isLinkEnabled(link.label) && (
              <div key={`${link.label}_mobile`} className="my-2">
                {link.outsideLink && <NavLinkOutside link={link} />}
                {!link.outsideLink && <NavLinkInside link={link} setOpenMenu={setOpenMenu} />}
              </div>
            ),
        )}
        {isAdmin && (
          <div key="admin_mobile" className="my-2">
            <NavLinkInside link={adminLink} setOpenMenu={setOpenMenu} />
          </div>
        )}
      </div>
      <div className="absolute bottom-1 left-1 flex w-full items-center justify-start p-2">
        <Logout />
      </div>
    </div>
  );
}

export function isLinkEnabled(label: string) {
  const enabledItems = process.env.NEXT_PUBLIC_ENABLED_MENU_ITEMS?.split(',') || [];
  return enabledItems.includes(label);
}
