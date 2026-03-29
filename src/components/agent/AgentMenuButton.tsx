'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useAgent } from '@/components/agent/AgentProvider';

export default function AgentMenuButton({ setOpenMenu }: { setOpenMenu: (open: boolean) => void }) {
  const t = useTranslations('menu');
  const { activeTab, isOpen, openPanel } = useAgent();
  const isActive = isOpen;

  return (
    <button
      type="button"
      className="font-inter w-full text-left text-base uppercase"
      onClick={() => {
        openPanel(activeTab);
        setOpenMenu(false);
      }}
    >
      <div className={`flex w-full items-center justify-start ${isActive ? '' : 'hover:brightness-125'}`}>
        <div className={`h-[48px] w-[3px] ${isActive ? 'bg-primary' : 'bg-transparent'}`}></div>
        <div
          className={`flex w-full items-center justify-start pl-6 ${isActive ? 'bg-menu-selected text-primary' : 'text-neutral-200'}`}
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
