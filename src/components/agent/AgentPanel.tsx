'use client';

import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import AgentChatTab from '@/components/agent/AgentChatTab';
import AgentReportTab from '@/components/agent/AgentReportTab';
import { useAgent } from '@/components/agent/AgentProvider';

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
        active
          ? 'border-primary/30 bg-primary/10 text-white shadow-[inset_0_0_0_1px_rgba(10,242,173,0.08)]'
          : 'border-transparent text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function AgentShortcutButton() {
  const t = useTranslations('agent.panel');
  const pathname = usePathname();
  const { activeTab, isOpen, openPanel } = useAgent();

  if (isOpen || pathname.endsWith('/assistant')) return null;

  return (
    <button
      type="button"
      aria-label={t('open')}
      onClick={() => openPanel(activeTab)}
      className="group fixed bottom-5 right-5 z-[69] inline-flex h-12 w-12 cursor-pointer items-center overflow-hidden rounded-full border border-primary/30 bg-neutral-950/95 text-neutral-100 shadow-2xl shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 active:scale-[0.98] sm:w-auto"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-neutral-950">
        <ChatBubbleLeftRightIcon className="h-5 w-5" />
      </div>
      <div className="pointer-events-none hidden whitespace-nowrap pl-2 pr-4 text-left text-sm font-semibold text-white sm:block">
        {t('shortcutLabel')}
      </div>
    </button>
  );
}

export default function AgentPanel() {
  const t = useTranslations('agent.panel');
  const { activeTab, closePanel, isOpen, setActiveTab } = useAgent();

  return (
    <>
      <AgentShortcutButton />

      {isOpen && (
        <button
          type="button"
          aria-label={t('close')}
          onClick={closePanel}
          className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-[1px]"
        />
      )}

      <aside
        data-agent-panel
        className={`fixed right-0 top-0 z-[80] h-screen w-full max-w-[620px] transform border-l border-neutral-800 bg-neutral-900 shadow-2xl transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-4">
            <div>
              <div className="text-base font-semibold text-neutral-100">{t('title')}</div>
              <div className="text-xs text-neutral-400">{t('subtitle')}</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-1">
                <TabButton active={activeTab === 'ask'} label={t('ask')} onClick={() => setActiveTab('ask')} />
                <TabButton active={activeTab === 'report'} label={t('report')} onClick={() => setActiveTab('report')} />
              </div>
              <button
                type="button"
                aria-label={t('close')}
                onClick={closePanel}
                className="rounded-full border border-neutral-800 p-2 text-neutral-300 transition hover:border-neutral-600 hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1">{activeTab === 'ask' ? <AgentChatTab /> : <AgentReportTab />}</div>
        </div>
      </aside>
    </>
  );
}
