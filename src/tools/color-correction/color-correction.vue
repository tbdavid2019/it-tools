<script setup lang="ts">
import { useDropZone, useFileDialog } from '@vueuse/core';
import { useMessage } from 'naive-ui';
import { ref, computed, watch, onMounted } from 'vue';
import { Palette, Download, Upload, Refresh } from '@vicons/tabler';

const message = useMessage();
const mainElement = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const { open, onChange } = useFileDialog({
  accept: 'image/*',
  multiple: false,
});

const image = ref<{
  url: string;
  name: string;
  width: number;
  height: number;
  original: HTMLImageElement;
} | null>(null);

const filters = ref({
  brightness: 100, // %
  contrast: 100, // %
  saturation: 100, // %
  grayscale: 0, // %
  sepia: 0, // %
  hueRotate: 0, // deg
  blur: 0, // px
  invert: 0, // %
  opacity: 100, // %
});

const filterString = computed(() => {
  return `
    brightness(${filters.value.brightness}%) 
    contrast(${filters.value.contrast}%) 
    saturate(${filters.value.saturation}%) 
    grayscale(${filters.value.grayscale}%) 
    sepia(${filters.value.sepia}%) 
    hue-rotate(${filters.value.hueRotate}deg) 
    blur(${filters.value.blur}px) 
    invert(${filters.value.invert}%) 
    opacity(${filters.value.opacity}%)
  `;
});

const processFile = (file: File) => {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    image.value = {
      url,
      name: file.name,
      width: img.width,
      height: img.height,
      original: img,
    };
    resetFilters();
    drawImage();
  };
  img.src = url;
};

onChange((files) => {
  if (files && files.length > 0) processFile(files[0]);
});

const onDrop = (files: File[] | null) => {
  if (files && files.length > 0) processFile(files[0]);
};

const { isOverDropZone } = useDropZone(mainElement, onDrop);

const resetFilters = () => {
  filters.value = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    blur: 0,
    invert: 0,
    opacity: 100,
  };
};

const drawImage = () => {
  if (!image.value || !canvasRef.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = image.value.width;
  canvas.height = image.value.height;
  
  ctx.filter = filterString.value;
  ctx.drawImage(image.value.original, 0, 0);
};

watch(filters, drawImage, { deep: true });

const downloadImage = () => {
  if (!canvasRef.value || !image.value) return;
  const link = document.createElement('a');
  link.download = 'edited_' + image.value.name;
  link.href = canvasRef.value.toDataURL('image/png');
  link.click();
};

</script>

<template>
  <c-card>
    <div ref="mainElement">
      <div v-if="!image" class="p-10 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" :class="{ 'border-primary bg-primary/5': isOverDropZone }" @click="open()">
        <n-icon size="48" class="text-gray-400 mb-2">
          <Palette />
        </n-icon>
        <p class="text-lg text-gray-500">
          Click or drop image here
        </p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <!-- Filters -->
         <n-card title="Adjustments" size="small" class="lg:col-span-1">
            <template #header-extra>
              <c-button size="tiny" secondary @click="resetFilters">
                <template #icon><n-icon><Refresh /></n-icon></template>
                Reset
              </c-button>
            </template>
            <div class="space-y-4 pr-2 max-h-[600px] overflow-y-auto">
               <div>
                  <div class="flex justify-between text-xs mb-1"><span>Brightness</span><span>{{ filters.brightness }}%</span></div>
                  <n-slider v-model:value="filters.brightness" :min="0" :max="200" />
               </div>
               <div>
                  <div class="flex justify-between text-xs mb-1"><span>Contrast</span><span>{{ filters.contrast }}%</span></div>
                  <n-slider v-model:value="filters.contrast" :min="0" :max="200" />
               </div>
               <div>
                  <div class="flex justify-between text-xs mb-1"><span>Saturation</span><span>{{ filters.saturation }}%</span></div>
                  <n-slider v-model:value="filters.saturation" :min="0" :max="200" />
               </div>
               <div>
                  <div class="flex justify-between text-xs mb-1"><span>Grayscale</span><span>{{ filters.grayscale }}%</span></div>
                  <n-slider v-model:value="filters.grayscale" :min="0" :max="100" />
               </div>
               <div>
                  <div class="flex justify-between text-xs mb-1"><span>Sepia</span><span>{{ filters.sepia }}%</span></div>
                  <n-slider v-model:value="filters.sepia" :min="0" :max="100" />
               </div>
               <div>
                  <div class="flex justify-between text-xs mb-1"><span>Hue Rotate</span><span>{{ filters.hueRotate }}deg</span></div>
                  <n-slider v-model:value="filters.hueRotate" :min="0" :max="360" />
               </div>
               <div>
                  <div class="flex justify-between text-xs mb-1"><span>Blur</span><span>{{ filters.blur }}px</span></div>
                  <n-slider v-model:value="filters.blur" :min="0" :max="20" />
               </div>
               <div>
                  <div class="flex justify-between text-xs mb-1"><span>Invert</span><span>{{ filters.invert }}%</span></div>
                  <n-slider v-model:value="filters.invert" :min="0" :max="100" />
               </div>
                <div>
                  <div class="flex justify-between text-xs mb-1"><span>Opacity</span><span>{{ filters.opacity }}%</span></div>
                  <n-slider v-model:value="filters.opacity" :min="0" :max="100" />
               </div>
            </div>
         </n-card>
         
         <!-- Preview -->
         <div class="lg:col-span-2 space-y-4">
            <div class="border rounded-lg bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center overflow-auto max-h-[600px]">
               <canvas ref="canvasRef" class="max-w-full h-auto shadow-lg"></canvas>
            </div>
            <div class="flex justify-between">
               <c-button secondary @click="open()"><template #icon><n-icon><Upload /></n-icon></template>New Image</c-button>
               <c-button primary @click="downloadImage"><template #icon><n-icon><Download /></n-icon></template>Download Result</c-button>
            </div>
         </div>
      </div>
    </div>
  </c-card>
</template>
