'use client';
import Image from 'next/image';
import NavLinkInside from './NavLinkInside';
import NavLinkOutside from './NavLinkOutside';
import { adminLink, links } from './links';
import Logout from './Logout';
import { useAuth } from '../auth/AuthProvider';
import { useTranslations } from 'next-intl';
import AgentMenuButton from '@/components/agent/AgentMenuButton';

export default function Menu({
  openMenu,
  setOpenMenu,
}: {
  openMenu: boolean;
  setOpenMenu: (open: boolean) => void;
}) {
  const { isAdmin } = useAuth();
  const t = useTranslations('menu');

  return (
    <div
      className={`${openMenu ? 'fixed z-50 block w-[300px] bg-neutral-900' : 'hidden w-0 bg-neutral-900'} left-0 h-[calc(100vh_-_68px)] pt-4 lg:fixed lg:block lg:h-[100vh] lg:w-[222px] lg:bg-neutral-900`}
    >
      <Image
        src="/assets/logo/logo.svg"
        alt="Carbonable logo"
        width={144}
        height={36}
        className="hidden pl-4 lg:block"
      />
      <div className="hidden pl-[70px] font-extrabold uppercase text-greenish-600 lg:block">
        {t('ccpm')}
      </div>
      <div className="mt-6 w-full lg:mt-12">
        {links.map(
          (link) =>
            isLinkEnabled(link.labelKey) && (
              <div key={`${link.labelKey}_mobile`} className="my-2">
                {link.outsideLink && <NavLinkOutside link={link} />}
                {!link.outsideLink && <NavLinkInside link={link} setOpenMenu={setOpenMenu} />}
              </div>
            ),
        )}
        <div className="my-2">
          <AgentMenuButton setOpenMenu={setOpenMenu} />
        </div>
        {isAdmin() && (
          <div key="admin_mobile" className="my-2">
            <NavLinkInside link={adminLink} setOpenMenu={setOpenMenu} />
          </div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full border-t border-neutral-700/40 p-3">
        <Logout />
      </div>
    </div>
  );
}

export function isLinkEnabled(labelKey: string) {
  const enabledItems = process.env.NEXT_PUBLIC_ENABLED_MENU_ITEMS?.split(',') || [];
  // Support both labelKey (new) and old label format
  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    portfolio: 'Portfolio',
    impact: 'Impact',
    planifier: 'Planifier',
    baseline: 'Baseline',
    admin: 'Admin',
  };
  return enabledItems.includes(labelMap[labelKey] || labelKey);
}
