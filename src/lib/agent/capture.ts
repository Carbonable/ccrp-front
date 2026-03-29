import { toJpeg } from 'html-to-image';
import type { AgentScreenshotPayload } from '@/lib/agent/types';

function getCaptureTarget(): HTMLElement {
  return (
    (document.querySelector('[data-report-capture]') as HTMLElement | null) ||
    (document.querySelector('main') as HTMLElement | null) ||
    document.body
  );
}

function getCaptureDimensions(target: HTMLElement) {
  const rect = target.getBoundingClientRect();

  return {
    width: Math.max(Math.round(rect.width || target.clientWidth || window.innerWidth), 1),
    height: Math.max(Math.round(rect.height || target.clientHeight || window.innerHeight), 1),
  };
}

async function captureElement(target: HTMLElement) {
  const { width, height } = getCaptureDimensions(target);

  const dataUrl = await toJpeg(target, {
    quality: 0.82,
    cacheBust: true,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    backgroundColor: '#0a0a0a',
    width,
    height,
    canvasWidth: width,
    canvasHeight: height,
    skipFonts: true,
    filter: (node) => {
      if (!(node instanceof HTMLElement)) return true;
      return !node.closest('[data-agent-panel]');
    },
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
  });

  return { dataUrl, width, height };
}

export async function captureViewportScreenshot(): Promise<AgentScreenshotPayload> {
  const target = getCaptureTarget();

  try {
    const { dataUrl, width, height } = await captureElement(target);

    return {
      dataUrl,
      width,
      height,
      mimeType: 'image/jpeg',
      capturedAt: new Date().toISOString(),
    };
  } catch {
    const { dataUrl, width, height } = await captureElement(document.body);

    return {
      dataUrl,
      width,
      height,
      mimeType: 'image/jpeg',
      capturedAt: new Date().toISOString(),
    };
  }
}
