import type { AgentScreenshotPayload } from '@/lib/agent/types';

const COLOR_STYLE_PROPERTIES = [
  'color',
  'background-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'caret-color',
  'fill',
  'stroke',
  'column-rule-color',
] as const;

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

function resolveCssColor(value: string) {
  if (!value || !value.includes('color(')) return value;

  const probe = document.createElement('span');
  probe.style.position = 'fixed';
  probe.style.pointerEvents = 'none';
  probe.style.opacity = '0';
  probe.style.color = value;
  document.body.appendChild(probe);
  const resolved = window.getComputedStyle(probe).color;
  probe.remove();

  return resolved && !resolved.includes('color(') ? resolved : value;
}

function sanitizeUnsupportedColorFunctions(sourceRoot: HTMLElement, cloneRoot: HTMLElement) {
  const sourceElements = [sourceRoot, ...Array.from(sourceRoot.querySelectorAll<HTMLElement>('*'))];
  const cloneElements = [cloneRoot, ...Array.from(cloneRoot.querySelectorAll<HTMLElement>('*'))];

  sourceElements.forEach((sourceElement, index) => {
    const cloneElement = cloneElements[index];
    if (!cloneElement) return;

    const computed = window.getComputedStyle(sourceElement);

    for (const property of COLOR_STYLE_PROPERTIES) {
      const value = computed.getPropertyValue(property);
      if (!value || !value.includes('color(')) continue;

      const resolved = resolveCssColor(value);
      if (resolved && !resolved.includes('color(')) {
        cloneElement.style.setProperty(property, resolved);
      }
    }

    const boxShadow = computed.getPropertyValue('box-shadow');
    if (boxShadow.includes('color(')) {
      cloneElement.style.setProperty('box-shadow', 'none');
    }

    const textShadow = computed.getPropertyValue('text-shadow');
    if (textShadow.includes('color(')) {
      cloneElement.style.setProperty('text-shadow', 'none');
    }

    const backgroundImage = computed.getPropertyValue('background-image');
    if (backgroundImage.includes('color(')) {
      cloneElement.style.setProperty('background-image', 'none');
      const backgroundColor = computed.getPropertyValue('background-color');
      const resolvedBackground = resolveCssColor(backgroundColor);
      if (resolvedBackground && !resolvedBackground.includes('color(')) {
        cloneElement.style.setProperty('background-color', resolvedBackground);
      }
    }
  });
}

async function captureElement(target: HTMLElement) {
  const html2canvas = (await import('html2canvas')).default;

  return html2canvas(target, {
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
    onclone: (clonedDocument) => {
      clonedDocument.querySelectorAll('[data-agent-panel]').forEach((element) => element.remove());

      const clonedTarget = target === document.body
        ? clonedDocument.body
        : (clonedDocument.querySelector('main') as HTMLElement | null) || clonedDocument.body;

      sanitizeUnsupportedColorFunctions(target, clonedTarget);
    },
  });
}

export async function captureViewportScreenshot(): Promise<AgentScreenshotPayload> {
  const target = (document.querySelector('main') as HTMLElement | null) || document.body;

  let canvas: HTMLCanvasElement;

  try {
    canvas = await captureElement(target);
  } catch (error) {
    if (target !== document.body) {
      canvas = await captureElement(document.body);
    } else {
      throw error;
    }
  }

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
