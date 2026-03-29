'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
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
      className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
        active ? 'bg-primary text-neutral-950' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

export default function AgentPanel() {
  const { activeTab, closePanel, isOpen, setActiveTab } = useAgent();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close CCPM agent panel"
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
              <div className="text-base font-semibold text-neutral-100">CCPM Agent</div>
              <div className="text-xs text-neutral-400">Page-aware assistant + structured issue reporting.</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-1">
                <TabButton active={activeTab === 'ask'} label="Ask" onClick={() => setActiveTab('ask')} />
                <TabButton active={activeTab === 'report'} label="Report" onClick={() => setActiveTab('report')} />
              </div>
              <button
                type="button"
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
