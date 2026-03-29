'use client';

import { ChatBubbleLeftRightIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
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

function AgentShortcutButton() {
  const { activeTab, isOpen, openPanel } = useAgent();

  if (isOpen) return null;

  return (
    <button
      type="button"
      aria-label="Open CCPM agent"
      onClick={() => openPanel(activeTab)}
      className="fixed bottom-5 right-5 z-[69] inline-flex cursor-pointer items-center gap-3 rounded-full border border-primary/30 bg-neutral-950/95 px-4 py-3 text-left text-neutral-100 shadow-2xl shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-neutral-900 active:scale-[0.98]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-neutral-950">
        <ChatBubbleLeftRightIcon className="h-5 w-5" />
      </div>
      <div className="hidden sm:block">
        <div className="flex items-center gap-1 text-sm font-semibold leading-none text-white">
          <span>Need help?</span>
          <SparklesIcon className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-1 text-xs leading-none text-neutral-400">Ask, report, or send feedback</div>
      </div>
    </button>
  );
}

export default function AgentPanel() {
  const { activeTab, closePanel, isOpen, setActiveTab } = useAgent();

  return (
    <>
      <AgentShortcutButton />

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
