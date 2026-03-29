'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { captureViewportScreenshot } from '@/lib/agent/capture';
import type { AgentScreenshotPayload, AgentSubmitResponse, AgentTicketDraft } from '@/lib/agent/types';
import { useAgent } from '@/components/agent/AgentProvider';

function ContextList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{title}</div>
      <ul className="mt-2 space-y-1 text-xs text-neutral-300">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="line-clamp-2">• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AgentReportTab() {
  const { activeTab, buildRuntimeContext, isOpen, selectedEntities } = useAgent();
  const [userMessage, setUserMessage] = useState('');
  const [screenshot, setScreenshot] = useState<AgentScreenshotPayload | null>(null);
  const [draft, setDraft] = useState<AgentTicketDraft | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<AgentSubmitResponse | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const runtimeSnapshot = buildRuntimeContext();

  const recentActions = runtimeSnapshot.recentActions.map((action) => action.label).slice(-5).reverse();
  const apiErrors = runtimeSnapshot.recentApiErrors
    .map((error) => `${error.method} ${error.url} — ${error.status ?? 'ERR'} ${error.message}`)
    .slice(-4)
    .reverse();
  const consoleErrors = runtimeSnapshot.recentConsoleErrors
    .map((error) => error.message)
    .slice(-4)
    .reverse();

  const captureNow = async () => {
    setCapturing(true);
    setCaptureError(null);

    try {
      const shot = await captureViewportScreenshot();
      setScreenshot(shot);
    } catch (error) {
      setCaptureError(error instanceof Error ? error.message : 'Unable to capture the current view.');
    } finally {
      setCapturing(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'report') {
      void captureNow();
    }
  }, [activeTab, isOpen]);

  const generateDraft = async () => {
    setGenerating(true);
    setDraftError(null);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/agent/report/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          runtimeContext: buildRuntimeContext(),
          screenshot,
        }),
      });

      if (!response.ok) {
        throw new Error(`Draft generation failed (${response.status})`);
      }

      const data = (await response.json()) as { draft: AgentTicketDraft };
      setDraft(data.draft);
    } catch (error) {
      setDraftError(error instanceof Error ? error.message : 'Unable to generate ticket draft.');
    } finally {
      setGenerating(false);
    }
  };

  const submitTicket = async () => {
    if (!draft) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/agent/report/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft,
          runtimeContext: buildRuntimeContext(),
          screenshot,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Ticket creation failed (${response.status})`);
      }

      const data = (await response.json()) as AgentSubmitResponse;
      setSubmitResult(data);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to create the issue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-neutral-800 px-4 py-3">
        <div className="text-sm font-semibold text-neutral-100">Report issue</div>
        <div className="mt-1 text-xs text-neutral-400">
          Auto-captures the current screen, page context, recent actions and recent errors before generating a structured issue draft.
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-neutral-100">Current screen</div>
                <div className="text-xs text-neutral-400">Captured at ticket-open time. Retake if needed before submit.</div>
              </div>
              <button
                type="button"
                onClick={() => void captureNow()}
                disabled={capturing}
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-200 transition hover:border-neutral-500 hover:text-white disabled:opacity-50"
              >
                <ArrowPathIcon className={`h-4 w-4 ${capturing ? 'animate-spin' : ''}`} />
                {capturing ? 'Capturing…' : 'Retake'}
              </button>
            </div>

            {screenshot ? (
              <Image
                src={screenshot.dataUrl}
                alt="Current CCPM view"
                width={screenshot.width}
                height={screenshot.height}
                unoptimized
                className="max-h-[220px] w-full rounded-xl border border-neutral-800 object-cover"
              />
            ) : (
              <div className="rounded-xl border border-dashed border-neutral-800 px-4 py-10 text-center text-sm text-neutral-500">
                No screenshot captured yet.
              </div>
            )}

            {captureError && <div role="alert" className="mt-2 text-xs text-red-400">{captureError}</div>}
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
            <label className="text-sm font-semibold text-neutral-100" htmlFor="agent-report-message">
              What should the ticket say?
            </label>
            <textarea
              id="agent-report-message"
              value={userMessage}
              onChange={(event) => setUserMessage(event.target.value)}
              placeholder="Describe what is broken, what you expected, and what you just tried."
              className="mt-3 min-h-[120px] w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-primary"
            />
            <div className="mt-2 text-xs text-neutral-500">
              Best practice 2026: user intent + screenshot + page context + recent errors + human confirmation before submit.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <ContextList title="Recent actions" items={recentActions} />
            <ContextList title="API errors" items={apiErrors} />
            <ContextList title="Console errors" items={consoleErrors} />
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Detected context</div>
              <div className="mt-2 space-y-1 text-xs text-neutral-300">
                <div>• Path: {runtimeSnapshot.page.pathname}</div>
                <div>• URL: {runtimeSnapshot.page.fullUrl}</div>
                <div>• Viewport: {runtimeSnapshot.viewport.width}×{runtimeSnapshot.viewport.height}</div>
                {Object.entries(selectedEntities).map(([key, value]) =>
                  value ? <div key={key}>• {key}: {value}</div> : null,
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => void generateDraft()}
              disabled={generating}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? 'Generating draft…' : 'Generate ticket draft'}
            </button>
          </div>

          {draftError && <div role="alert" className="text-sm text-red-400">{draftError}</div>}

          {draft && (
            <div className="rounded-2xl border border-primary/30 bg-neutral-950/80 p-4">
              <div className="text-sm font-semibold text-neutral-100">Draft preview</div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">Title</label>
                  <input
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none transition focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">Summary</label>
                  <textarea
                    value={draft.summary}
                    onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
                    className="min-h-[80px] w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none transition focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">Severity</label>
                    <select
                      value={draft.severity}
                      onChange={(event) => setDraft({ ...draft, severity: event.target.value as AgentTicketDraft['severity'] })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none transition focus:border-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">Issue type</label>
                    <select
                      value={draft.issueType}
                      onChange={(event) => setDraft({ ...draft, issueType: event.target.value as AgentTicketDraft['issueType'] })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none transition focus:border-primary"
                    >
                      <option value="bug">Bug</option>
                      <option value="feature">Feature</option>
                      <option value="improvement">Improvement</option>
                      <option value="question">Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400">Description</label>
                  <textarea
                    value={draft.descriptionMarkdown}
                    onChange={(event) => setDraft({ ...draft, descriptionMarkdown: event.target.value })}
                    className="min-h-[260px] w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 font-mono text-xs text-neutral-100 outline-none transition focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {submitError && <div role="alert" className="text-sm text-red-400">{submitError}</div>}
          {submitResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              Issue created{submitResult.displayId ? `: ${submitResult.displayId}` : ''}
              {submitResult.url ? (
                <a href={submitResult.url} target="_blank" rel="noreferrer" className="ml-2 underline">
                  Open issue
                </a>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-800 px-4 py-4">
        <button
          type="button"
          onClick={() => void submitTicket()}
          disabled={!draft || submitting}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Creating issue…' : 'Create issue'}
        </button>
      </div>
    </div>
  );
}
