import type { AgentScreenshotPayload } from '@/lib/agent/types';

function downscaleCanvas(source: HTMLCanvasElement, maxWidth = 1280): HTMLCanvasElement {
  if (source.width <= maxWidth) return source;

  const ratio = maxWidth / source.width;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(source.width * ratio);
  canvas.height = Math.round(source.height * ratio);

  const ctx = canvas.getContext('2d');
  if (!ctx) return source;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export async function captureViewportScreenshot(): Promise<AgentScreenshotPayload> {
  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(document.body, {
    backgroundColor: '#0a0a0a',
    useCORS: true,
    logging: false,
    scale: Math.min(window.devicePixelRatio || 1, 1.5),
    x: window.scrollX,
    y: window.scrollY,
    width: window.innerWidth,
    height: window.innerHeight,
    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,
    ignoreElements: (element) => {
      if (!(element instanceof HTMLElement)) return false;
      return Boolean(element.closest('[data-agent-panel]'));
    },
  });

  const optimized = downscaleCanvas(canvas, 1280);
  const dataUrl = optimized.toDataURL('image/jpeg', 0.78);

  return {
    dataUrl,
    width: optimized.width,
    height: optimized.height,
    mimeType: 'image/jpeg',
    capturedAt: new Date().toISOString(),
  };
}
