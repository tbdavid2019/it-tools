<script setup lang="ts">
import { useQRCode } from './useQRCode';

const foreground = ref('#000000ff');
const background = ref('#ffffffff');
const errorCorrectionLevel = ref<'low' | 'medium' | 'quartile' | 'high'>('medium');
const style = ref<'square' | 'dots'>('square');
const qrContainer = ref<HTMLElement | null>(null);

const errorCorrectionLevels = ['low', 'medium', 'quartile', 'high'];
const styles = [
  { label: 'Square', value: 'square' as const },
  { label: 'Dots', value: 'dots' as const },
];

const text = ref('https://tool.david888.com');
const { download } = useQRCode({
  text,
  color: {
    background,
    foreground,
  },
  errorCorrectionLevel,
  style,
  container: qrContainer,
});
</script>

<template>
  <c-card>
    <n-grid x-gap="12" y-gap="12" cols="1 600:3">
      <n-gi span="2">
        <c-input-text
          v-model:value="text"
          label-position="left"
          label-width="130px"
          label-align="right"
          label="Text:"
          multiline
          rows="1"
          autosize
          placeholder="Your link or text..."
          mb-6
        />
        <n-form label-width="130" label-placement="left">
          <n-form-item label="Foreground color:">
            <n-color-picker v-model:value="foreground" :modes="['hex']" />
          </n-form-item>
          <n-form-item label="Background color:">
            <n-color-picker v-model:value="background" :modes="['hex']" />
          </n-form-item>
          <c-select
            v-model:value="style"
            label="Style:"
            label-position="left"
            label-width="130px"
            label-align="right"
            :options="styles"
          />
          <c-select
            v-model:value="errorCorrectionLevel"
            label="Error resistance:"
            label-position="left"
            label-width="130px"
            label-align="right"
            :options="errorCorrectionLevels.map((value) => ({ label: value, value }))"
          />
        </n-form>
      </n-gi>
      <n-gi>
        <div flex flex-col items-center gap-3>
          <div ref="qrContainer" w-220px h-220px flex items-center justify-center rd-8px bg-white shadow-sm />
          <c-button @click="download">
            Download qr-code
          </c-button>
        </div>
      </n-gi>
    </n-grid>
  </c-card>
</template>
