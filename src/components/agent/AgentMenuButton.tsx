'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function AgentMenuButton({ setOpenMenu }: { setOpenMenu: (open: boolean) => void }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('menu');
  const isActive = pathname.endsWith('/assistant');

  return (
    <button
      type="button"
      className="font-inter w-full text-left text-base uppercase"
      onClick={() => {
        router.push(`/${locale}/assistant`);
        setOpenMenu(false);
      }}
    >
      <div className={`flex w-full items-center justify-start ${isActive ? '' : 'hover:brightness-125'}`}>
        <div className={`h-[48px] w-[3px] ${isActive ? 'bg-primary' : 'bg-transparent'}`}></div>
        <div
          className={`flex w-full items-center justify-start pl-6 ${isActive ? 'bg-menu-selected text-white' : 'text-neutral-200'}`}
        >
          <Image
            src={`/assets/images/menu/agent${isActive ? '-active' : ''}.svg`}
            alt="agent"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <div className="py-3 pl-2">{t('agent')}</div>
        </div>
      </div>
    </button>
  );
}
