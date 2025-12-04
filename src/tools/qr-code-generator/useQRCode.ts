import { type MaybeRef, get } from '@vueuse/core';
import QRCodeStyling from 'qr-code-styling';
import { isRef, onMounted, ref, watch } from 'vue';

type StyledQrStyle = 'square' | 'dots';
type StyledErrorCorrection = 'low' | 'medium' | 'quartile' | 'high';

export function useQRCode({
  text,
  color: { background, foreground },
  errorCorrectionLevel,
  style,
  container,
}: {
  text: MaybeRef<string>
  color: { foreground: MaybeRef<string>; background: MaybeRef<string> }
  errorCorrectionLevel?: MaybeRef<StyledErrorCorrection>
  style?: MaybeRef<StyledQrStyle>
  container: MaybeRef<HTMLElement | null>
}) {
  const instance = ref<QRCodeStyling>();

  const levelMap: Record<StyledErrorCorrection, 'L' | 'M' | 'Q' | 'H'> = {
    low: 'L',
    medium: 'M',
    quartile: 'Q',
    high: 'H',
  };

  const ensureInstance = () => {
    if (instance.value) return;

    const node = get(container);
    if (!node) return;

    instance.value = new QRCodeStyling({
      width: 256,
      height: 256,
      data: get(text),
      qrOptions: { errorCorrectionLevel: levelMap[get(errorCorrectionLevel) ?? 'medium'] },
      dotsOptions: { color: get(foreground), type: get(style) ?? 'square' },
      backgroundOptions: { color: get(background) },
      cornersSquareOptions: { type: 'extra-rounded', color: get(foreground) },
      cornersDotOptions: { type: 'dot', color: get(foreground) },
    });

    instance.value.append(node);
  };

  const update = () => {
    if (!get(text)) return;
    ensureInstance();
    if (!instance.value) return;

    instance.value.update({
      data: get(text)?.trim(),
      qrOptions: { errorCorrectionLevel: levelMap[get(errorCorrectionLevel) ?? 'medium'] },
      dotsOptions: { color: get(foreground), type: get(style) ?? 'square' },
      backgroundOptions: { color: get(background) },
      cornersSquareOptions: { type: 'extra-rounded', color: get(foreground) },
      cornersDotOptions: { type: 'dot', color: get(foreground) },
    });
  };

  onMounted(update);

  watch([text, background, foreground, errorCorrectionLevel, style].filter(isRef), update, { immediate: true });

  const download = () => instance.value?.download({ name: 'qr-code', extension: 'png' });

  return { download };
}
