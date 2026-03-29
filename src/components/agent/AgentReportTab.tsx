'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { ArrowPathIcon, BugAntIcon, ChatBubbleOvalLeftEllipsisIcon, LightBulbIcon, PhotoIcon, ViewfinderCircleIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { captureViewportScreenshot } from '@/lib/agent/capture';
import type { AgentReportKind, AgentScreenshotPayload, AgentSubmitResponse } from '@/lib/agent/types';
import { useAgent } from '@/components/agent/AgentProvider';

type SelectionRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const REPORT_KIND_ICONS: Record<AgentReportKind, React.ComponentType<{ className?: string }>> = {
  bug: BugAntIcon,
  feature: LightBulbIcon,
  contact: ChatBubbleOvalLeftEllipsisIcon,
};

function normalizeRect(startX: number, startY: number, endX: number, endY: number): SelectionRect {
  return {
    x: Math.min(startX, endX),
    y: Math.min(startY, endY),
    width: Math.abs(endX - startX),
    height: Math.abs(endY - startY),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

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

function KindSelector({
  selected,
  onChange,
  getLabel,
  getSubtitle,
}: {
  selected: AgentReportKind;
  onChange: (kind: AgentReportKind) => void;
  getLabel: (kind: AgentReportKind) => string;
  getSubtitle: (kind: AgentReportKind) => string;
}) {
  const kinds: AgentReportKind[] = ['bug', 'feature', 'contact'];

  return (
    <div className="grid grid-cols-3 gap-2">
      {kinds.map((kind) => {
        const active = selected === kind;
        const Icon = REPORT_KIND_ICONS[kind];

        return (
          <button
            key={kind}
            type="button"
            onClick={() => onChange(kind)}
            className={`flex cursor-pointer flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 ${
              active
                ? 'border-primary/60 bg-primary/10 text-neutral-100'
                : 'border-neutral-800 bg-neutral-950/70 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
            }`}
            aria-pressed={active}
          >
            <Icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-neutral-500'}`} />
            <div>
              <div className="text-xs font-semibold leading-tight">{getLabel(kind)}</div>
              <div className="mt-0.5 text-[11px] leading-tight opacity-70">{getSubtitle(kind)}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function AgentReportTab() {
  const t = useTranslations('agent.report');
  const { activeTab, buildRuntimeContext, isOpen, selectedEntities } = useAgent();
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [kind, setKind] = useState<AgentReportKind>('bug');
  const [messagesByKind, setMessagesByKind] = useState<Record<AgentReportKind, string>>({
    bug: '',
    feature: '',
    contact: '',
  });
  const [screenshot, setScreenshot] = useState<AgentScreenshotPayload | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<AgentSubmitResponse | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectingArea, setSelectingArea] = useState(false);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const templates = useMemo<Record<AgentReportKind, string>>(
    () => ({
      bug: t('templates.bug'),
      feature: t('templates.feature'),
      contact: t('templates.contact'),
    }),
    [t],
  );

  useEffect(() => {
    setMessagesByKind((current) => ({
      bug: current.bug || templates.bug,
      feature: current.feature || templates.feature,
      contact: current.contact || templates.contact,
    }));
  }, [templates]);

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

  const currentMessage = messagesByKind[kind] || '';
  const hasMessage = currentMessage.trim().length > 0;

  const setCurrentMessage = (value: string) => {
    setMessagesByKind((current) => ({ ...current, [kind]: value }));
  };

  const handleKindChange = (next: AgentReportKind) => {
    setKind(next);
    setSubmitResult(null);
    setSubmitError(null);
  };

  const captureNow = useCallback(async () => {
    setCapturing(true);
    setCaptureError(null);
    setSelectionRect(null);
    setSelectingArea(false);
    setDragStart(null);

    try {
      const shot = await captureViewportScreenshot();
      setScreenshot(shot);
    } catch {
      setCaptureError(t('capture.error'));
    } finally {
      setCapturing(false);
    }
  }, [t]);

  useEffect(() => {
    if (isOpen && activeTab === 'report' && !screenshot) {
      void captureNow();
    }
  }, [activeTab, captureNow, isOpen, screenshot]);

  const cropCurrentScreenshot = async (rect: SelectionRect) => {
    if (!screenshot || !previewRef.current) return;

    const bounds = previewRef.current.getBoundingClientRect();
    const scaleX = screenshot.width / bounds.width;
    const scaleY = screenshot.height / bounds.height;
    const cropX = Math.max(Math.round(rect.x * scaleX), 0);
    const cropY = Math.max(Math.round(rect.y * scaleY), 0);
    const cropWidth = Math.max(Math.round(rect.width * scaleX), 24);
    const cropHeight = Math.max(Math.round(rect.height * scaleY), 24);

    const image = new window.Image();
    image.src = screenshot.dataUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Image load failed'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas unavailable');
    }

    context.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    setScreenshot({
      dataUrl: canvas.toDataURL('image/jpeg', 0.86),
      width: cropWidth,
      height: cropHeight,
      mimeType: 'image/jpeg',
      capturedAt: new Date().toISOString(),
    });
  };

  const beginAreaSelection = async () => {
    if (!screenshot) {
      await captureNow();
    }

    setCaptureError(null);
    setSubmitResult(null);
    setSelectionRect(null);
    setSelectingArea(true);
  };

  const getPoint = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = previewRef.current?.getBoundingClientRect();
    if (!bounds) return null;

    return {
      x: clamp(event.clientX - bounds.left, 0, bounds.width),
      y: clamp(event.clientY - bounds.top, 0, bounds.height),
    };
  };

  const handlePreviewPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!selectingArea) return;

    const point = getPoint(event);
    if (!point) return;

    setDragStart(point);
    setSelectionRect({ x: point.x, y: point.y, width: 0, height: 0 });
  };

  const handlePreviewPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!selectingArea || !dragStart) return;

    const point = getPoint(event);
    if (!point) return;

    setSelectionRect(normalizeRect(dragStart.x, dragStart.y, point.x, point.y));
  };

  const finishSelection = async () => {
    if (!selectingArea || !selectionRect) {
      setSelectingArea(false);
      setDragStart(null);
      return;
    }

    if (selectionRect.width < 12 || selectionRect.height < 12) {
      setSelectionRect(null);
      setSelectingArea(false);
      setDragStart(null);
      return;
    }

    try {
      await cropCurrentScreenshot(selectionRect);
    } catch {
      setCaptureError(t('capture.error'));
    } finally {
      setSelectingArea(false);
      setDragStart(null);
      setSelectionRect(null);
    }
  };

  const submitTicket = async () => {
    if (!hasMessage || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);

    try {
      const runtimeContext = buildRuntimeContext();
      const draftResponse = await fetch('/api/agent/report/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          runtimeContext,
          screenshot,
          reportKind: kind,
        }),
      });

      if (!draftResponse.ok) {
        throw new Error('draft-failed');
      }

      const draftData = (await draftResponse.json()) as { draft: unknown };

      const response = await fetch('/api/agent/report/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: draftData.draft,
          runtimeContext,
          screenshot,
          message: currentMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('submit-failed');
      }

      const data = (await response.json()) as AgentSubmitResponse;
      setSubmitResult(data);
    } catch {
      setSubmitError(t('submit.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMessageKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      void submitTicket();
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-neutral-800 px-4 py-3">
        <div className="text-sm font-semibold text-neutral-100">{t('title')}</div>
        <div className="mt-1 text-xs text-neutral-400">{t('subtitle')}</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          <KindSelector
            selected={kind}
            onChange={handleKindChange}
            getLabel={(reportKind) => t(`kinds.${reportKind}.label`)}
            getSubtitle={(reportKind) => t(`kinds.${reportKind}.subtitle`)}
          />

          {kind === 'bug' && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-neutral-100">{t('capture.title')}</div>
                  <div className="text-xs text-neutral-400">{t('capture.subtitle')}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void captureNow()}
                    disabled={capturing || submitting}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-200 transition hover:border-neutral-500 hover:text-white disabled:opacity-50"
                  >
                    {capturing ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <PhotoIcon className="h-4 w-4" />}
                    {capturing ? t('capture.capturing') : t('capture.current')}
                  </button>
                  <button
                    type="button"
                    onClick={() => void beginAreaSelection()}
                    disabled={capturing || submitting || !screenshot}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-200 transition hover:border-neutral-500 hover:text-white disabled:opacity-50"
                  >
                    <ViewfinderCircleIcon className="h-4 w-4" />
                    {t('capture.select')}
                  </button>
                </div>
              </div>

              {selectingArea && (
                <div className="mb-3 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary">
                  {t('capture.selectionHint')}
                </div>
              )}

              {screenshot ? (
                <div
                  ref={previewRef}
                  onPointerDown={handlePreviewPointerDown}
                  onPointerMove={handlePreviewPointerMove}
                  onPointerUp={() => void finishSelection()}
                  className={`relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 ${
                    selectingArea ? 'cursor-crosshair select-none' : ''
                  }`}
                >
                  <Image
                    src={screenshot.dataUrl}
                    alt={t('capture.alt')}
                    width={screenshot.width}
                    height={screenshot.height}
                    unoptimized
                    className="h-auto w-full"
                  />
                  {selectionRect && (
                    <div
                      className="pointer-events-none absolute border-2 border-primary bg-primary/10"
                      style={{
                        left: selectionRect.x,
                        top: selectionRect.y,
                        width: selectionRect.width,
                        height: selectionRect.height,
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-neutral-800 px-4 py-10 text-center text-sm text-neutral-500">
                  {t('capture.empty')}
                </div>
              )}

              {captureError && <div role="alert" className="mt-2 text-xs text-red-400">{captureError}</div>}
            </div>
          )}

          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
            <label className="text-sm font-semibold text-neutral-100" htmlFor="agent-report-message">
              {t(`kinds.${kind}.label`)}
            </label>
            <p className="mt-1 text-xs text-neutral-400">{t(`kinds.${kind}.subtitle`)}</p>
            <textarea
              id="agent-report-message"
              value={currentMessage}
              onChange={(event) => setCurrentMessage(event.target.value)}
              onKeyDown={handleMessageKeyDown}
              className="mt-3 min-h-[180px] w-full rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-100 outline-none transition focus:border-primary"
            />
            <div className="mt-2 text-xs text-neutral-500">{t('sendShortcut')}</div>
          </div>

          {kind === 'bug' && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <ContextList title={t('context.recentActions')} items={recentActions} />
              <ContextList title={t('context.apiErrors')} items={apiErrors} />
              <ContextList title={t('context.consoleErrors')} items={consoleErrors} />
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{t('context.detected')}</div>
                <div className="mt-2 space-y-1 text-xs text-neutral-300">
                  <div>• {t('context.path')}: {runtimeSnapshot.page.pathname}</div>
                  <div>• {t('context.viewport')}: {runtimeSnapshot.viewport.width}×{runtimeSnapshot.viewport.height}</div>
                  {Object.entries(selectedEntities).map(([key, value]) =>
                    value ? <div key={key}>• {key}: {value}</div> : null,
                  )}
                </div>
              </div>
            </div>
          )}

          {submitError && <div role="alert" className="text-sm text-red-400">{submitError}</div>}
          {submitResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              {t('success')}{submitResult.displayId ? `: ${submitResult.displayId}` : ''}
              {submitResult.url ? (
                <a href={submitResult.url} target="_blank" rel="noreferrer" className="ml-2 underline">
                  {t('openIssue')}
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
          disabled={!hasMessage || submitting || selectingArea}
          className="w-full cursor-pointer rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? t('sending') : t('send')}
        </button>
      </div>
    </div>
  );
}
