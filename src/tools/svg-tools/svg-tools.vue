<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { ref, computed } from 'vue';
import { Vector, Download, Copy, Eye, Code } from '@vicons/tabler';

const message = useMessage();
const svgContent = ref<string>('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />\n</svg>');
const activeTab = ref<'preview' | 'code'>('preview');

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (file.type !== 'image/svg+xml') {
    message.error('Please upload a valid SVG file');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      svgContent.value = e.target.result as string;
    }
  };
  reader.readAsText(file);
};

const copyCode = () => {
  navigator.clipboard.writeText(svgContent.value);
  message.success('SVG code copied to clipboard');
};

const downloadSvg = () => {
  const blob = new Blob([svgContent.value], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'image.svg';
  link.click();
};

const dataUrl = computed(() => {
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent.value)));
});

</script>

<template>
  <c-card>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
      <div class="flex flex-col h-full">
         <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold">SVG Editor</h3>
            <div class="flex gap-2">
               <input type="file" accept=".svg" class="hidden" ref="fileInput" @change="handleFileUpload" />
               <c-button size="tiny" secondary @click="( $refs.fileInput as any ).click()">Upload</c-button>
               <c-button size="tiny" secondary @click="copyCode">Copy</c-button>
               <c-button size="tiny" primary @click="downloadSvg">Download</c-button>
            </div>
         </div>
         <c-input-text 
            v-model:value="svgContent" 
            multiline 
            placeholder="Paste SVG code here..." 
            class="flex-1 font-mono text-xs" 
            :rows="20"
         />
      </div>

      <div class="flex flex-col h-full">
         <div class="mb-2 font-bold">Preview</div>
         <div class="flex-1 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-4 checkerboard">
            <div v-html="svgContent" class="max-w-full max-h-full object-contain"></div>
         </div>
      </div>
    </div>
  </c-card>
</template>

<style scoped>
.checkerboard {
  background-image:
    linear-gradient(45deg, #ccc 25%, transparent 25%),
    linear-gradient(-45deg, #ccc 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ccc 75%),
    linear-gradient(-45deg, transparent 75%, #ccc 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
.dark .checkerboard {
   opacity: 0.1;
}
</style>
