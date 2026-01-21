<script setup lang="ts">
import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { onBeforeUnmount, onMounted } from 'vue';
import { useClipboard } from '@vueuse/core';

const fileInput = ref<HTMLInputElement | null>(null);
const previewRef = ref<HTMLDivElement | null>(null);
const cameraEnabled = ref(false);
const scanning = ref(false);
const results = ref<{ text: string; format: string; ts: number }[]>([]);
const error = ref<string>('');
const cameraId = ref<string | null>(null);
const availableCameras = ref<{ id: string; label: string }[]>([]);

let scanner: Html5Qrcode | null = null;

const addResult = (text: string, format: string) => {
  results.value.unshift({ text, format, ts: Date.now() });
};

const stopCamera = async () => {
  if (scanner) {
    if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
      await scanner.stop();
    }
    try {
      await scanner.clear();
    } catch (err) {
      // ignore clear errors
    }
    scanner = null;
  }
  scanning.value = false;
  cameraEnabled.value = false;
};

const startCamera = async () => {
  if (!previewRef.value) return;
  error.value = '';
  scanning.value = true;
  scanner = new Html5Qrcode(previewRef.value.id);
  try {
    const cams = await Html5Qrcode.getCameras();
    availableCameras.value = cams.map(c => ({ id: c.id, label: c.label || c.id }));
    const id = cameraId.value ?? cams[0]?.id;
    if (!id) throw new Error('No camera found');
    cameraId.value = id;
    
    // Support all common formats including 1D barcodes
    const config = {
      fps: 10,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.AZTEC,
        Html5QrcodeSupportedFormats.CODABAR,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.CODE_93,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.DATA_MATRIX,
        Html5QrcodeSupportedFormats.MAXICODE,
        Html5QrcodeSupportedFormats.ITF,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.PDF_417,
        Html5QrcodeSupportedFormats.RSS_14,
        Html5QrcodeSupportedFormats.RSS_EXPANDED,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
      ] 
    };

    await scanner.start({ deviceId: { exact: id } }, config, (decodedText, decodedResult) => {
      addResult(decodedText, decodedResult?.result?.format?.formatName || 'Unknown');
    }, (errorMessage) => {
      // parse error, ignore it.
    });
    cameraEnabled.value = true;
  } catch (e: any) {
    error.value = e?.message ?? String(e);
    scanning.value = false;
    cameraEnabled.value = false;
  }
};

const decodeFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    error.value = 'Not an image file';
    return;
  }
  error.value = '';
  await stopCamera();
  try {
    const id = previewRef.value?.id ?? 'barcode-preview';
    const html5 = new Html5Qrcode(id);
    const res = await html5.scanFile(file, true);
    // Note: scanFile returns only string in current version types, but might return object in newer. 
    // We'll treat it as string for now.
    addResult(res, 'File Scan');
  } catch (err: any) {
    error.value = err?.message ?? 'Failed to decode image';
  }
};

const onFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  await decodeFile(file);
  target.value = '';
};

const handlePaste = async (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (!items) return;
  const fileItem = Array.from(items).find(
    item => item.kind === 'file' && item.type.startsWith('image/'),
  );
  const file = fileItem?.getAsFile();
  if (file) {
    await decodeFile(file);
  }
};

const clearAll = async () => {
  results.value = [];
  error.value = '';
  await stopCamera();
  cameraEnabled.value = false;
};

onMounted(() => {
  window.addEventListener('paste', handlePaste);
});

onBeforeUnmount(() => {
  stopCamera();
  window.removeEventListener('paste', handlePaste);
});

const { copy } = useClipboard();
</script>

<template>
  <c-card>
    <n-grid x-gap="12" y-gap="12" cols="1 700:3">
      <n-gi span="2">
        <div flex gap-3 items-center mb-3>
          <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" hidden />
          <c-button @click="() => fileInput?.click()">Upload Image</c-button>
          <c-button secondary @click="startCamera" :disabled="scanning">Start Camera Scan</c-button>
          <c-button tertiary @click="clearAll">Clear</c-button>
        </div>
        <div class="hint">Supports pasting images from Clipboard.</div>

        <div v-if="availableCameras.length > 0" flex gap-2 items-center mb-2>
          <span>Camera:</span>
          <c-select v-model:value="cameraId" :options="availableCameras.map(c => ({ label: c.label, value: c.id }))" w-240px />
        </div>

        <div v-if="error" text-red-500 text-sm mb-2>{{ error }}</div>

        <n-card title="Scan Results" size="small">
          <div v-if="results.length === 0" text-neutral-500>No results yet</div>
          <div v-else class="results">
            <div v-for="item in results" :key="item.ts" class="result-item">
              <div class="result-text">{{ item.text }}</div>
              <div class="result-meta">
                <span>{{ item.format }}</span>
                <span>{{ new Date(item.ts).toLocaleString() }}</span>
                <c-button size="tiny" tertiary @click="copy(item.text)">Copy</c-button>
              </div>
            </div>
          </div>
        </n-card>
      </n-gi>

      <n-gi>
        <div ref="previewRef" id="barcode-preview" class="preview-box" />
      </n-gi>
    </n-grid>
  </c-card>
</template>

<style scoped lang="less">
.preview-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f5f5f5;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
}
.results {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 360px;
  overflow: auto;
}
.hint {
  color: #666;
  font-size: 12px;
  margin-top: -4px;
  margin-bottom: 12px;
}
.result-item {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px;
}
.result-text {
  word-break: break-all;
  font-family: monospace;
  font-size: 1.1em;
  font-weight: bold;
}
.result-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #888;
  font-size: 0.85em;
  margin-top: 4px;
  gap: 8px;
}
</style>
