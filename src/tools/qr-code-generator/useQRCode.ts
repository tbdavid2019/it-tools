import { type MaybeRef, get } from '@vueuse/core';
import QRCode, { type QRCodeErrorCorrectionLevel, type QRCodeToDataURLOptions } from 'qrcode';
import { isRef, ref, watch } from 'vue';

export function useQRCode({
  text,
  color: { background, foreground },
  errorCorrectionLevel,
  style,
  options,
}: {
  text: MaybeRef<string>
  color: { foreground: MaybeRef<string>; background: MaybeRef<string> }
  errorCorrectionLevel?: MaybeRef<QRCodeErrorCorrectionLevel>
  style?: MaybeRef<'square' | 'dots'>
  options?: QRCodeToDataURLOptions
}) {
  const qrcode = ref('');

  watch(
    [text, background, foreground, errorCorrectionLevel, style].filter(isRef),
    async () => {
      if (get(text)) {
        qrcode.value = await renderCustomQRCode({
          text: get(text).trim(),
          foreground: get(foreground),
          background: get(background),
          errorCorrectionLevel: get(errorCorrectionLevel) ?? 'medium',
          style: get(style) ?? 'square',
          width: options?.width ?? 1024,
          margin: options?.margin ?? 4,
        });
      }
    },
    { immediate: true },
  );

  return { qrcode };
}

async function renderCustomQRCode({
  text,
  foreground,
  background,
  errorCorrectionLevel,
  style,
  width,
  margin,
}: {
  text: string
  foreground: string
  background: string
  errorCorrectionLevel: QRCodeErrorCorrectionLevel
  style: 'square' | 'dots'
  width: number
  margin: number
}) {
  const levelMap: Record<QRCodeErrorCorrectionLevel, 'L' | 'M' | 'Q' | 'H'> = {
    low: 'L',
    medium: 'M',
    quartile: 'Q',
    high: 'H',
  };

  const qr = QRCode.create(text, { errorCorrectionLevel: levelMap[errorCorrectionLevel] });
  const size = qr.modules.size;
  const cells = qr.modules.data;

  const canvas = document.createElement('canvas');
  const cellSize = Math.max(Math.floor((width - margin * 2) / size), 1);
  const qrSize = cellSize * size + margin * 2;
  canvas.width = qrSize;
  canvas.height = qrSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, qrSize, qrSize);
  ctx.fillStyle = foreground;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (cells[row * size + col]) {
        const x = col * cellSize + margin;
        const y = row * cellSize + margin;

        if (style === 'dots') {
          const radius = cellSize / 2;
          ctx.beginPath();
          ctx.arc(x + radius, y + radius, radius * 0.9, 0, Math.PI * 2, false);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }
  }

  return canvas.toDataURL('image/png');
}
