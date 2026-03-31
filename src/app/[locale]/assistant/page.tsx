'use client';

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
      className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
        active
          ? 'border-primary/30 bg-primary/10 text-white shadow-[inset_0_0_0_1px_rgba(10,242,173,0.08)]'
          : 'border-transparent text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

export default function AssistantPage() {
  const t = useTranslations('agent.page');
  const panelT = useTranslations('agent.panel');
  const { activeTab, setActiveTab } = useAgent();

  return (
    <div className="space-y-6 pb-8">
      <div className="rounded-3xl border border-neutral-800 bg-surface-panel p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{t('eyebrow')}</div>
            <h1 className="mt-2 text-3xl font-semibold text-white">{panelT('title')}</h1>
            <p className="mt-2 max-w-3xl text-sm text-neutral-400">{t('subtitle')}</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-surface-elevated p-1">
            <TabButton active={activeTab === 'ask'} label={panelT('ask')} onClick={() => setActiveTab('ask')} />
            <TabButton active={activeTab === 'report'} label={panelT('report')} onClick={() => setActiveTab('report')} />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-800 bg-surface-panel shadow-2xl">
        <div className="h-[calc(100vh-260px)] min-h-[680px] overflow-hidden rounded-3xl">
          {activeTab === 'ask' ? <AgentChatTab /> : <AgentReportTab />}
        </div>
      </div>
    </div>
  );
}
