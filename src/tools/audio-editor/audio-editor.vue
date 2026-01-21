<script setup lang="ts">
import { useAudioStore } from '@/stores/audio.store';
import { storeToRefs } from 'pinia';
import { useMessage } from 'naive-ui';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { 
  PlayerPlay, PlayerPause, Upload, Volume, Volume3, Download, 
  PlayerSkipBack, PlayerSkipForward, Sun, Moon, Radio, Trash 
} from '@vicons/tabler';

const store = useAudioStore();
const { 
  audioFile, audioBuffer, isPlaying, volume, duration, 
  currentTime, effects, selection 
} = storeToRefs(store);

const message = useMessage();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const audioContextRef = ref<AudioContext | null>(null);
const sourceNodeRef = ref<AudioBufferSourceNode | null>(null);
const gainNodeRef = ref<GainNode | null>(null);
const startTimeRef = ref<number>(0);
const pauseTimeRef = ref<number>(0);
const animationFrameRef = ref<number>(0);

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('audio/')) {
    message.error('Please select a valid audio file');
    return;
  }

  try {
    store.reset();
    store.setAudioFile(file);
    
    const arrayBuffer = await file.arrayBuffer();
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const decodedBuffer = await context.decodeAudioData(arrayBuffer);
    
    audioContextRef.value = context;
    store.setAudioBuffer(decodedBuffer);
    store.setDuration(decodedBuffer.duration);
    store.setSelection({ start: 0, end: decodedBuffer.duration });
    
    message.success('Audio loaded successfully');
    drawWaveform();
  } catch (error) {
    console.error(error);
    message.error('Error loading audio file');
  }
};

const drawWaveform = () => {
  if (!canvasRef.value || !audioBuffer.value) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const data = audioBuffer.value.getChannelData(0);
  const step = Math.ceil(data.length / width);
  const amp = height / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.moveTo(0, amp);

  for (let i = 0; i < width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = data[i * step + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    ctx.lineTo(i, (1 + min) * amp);
    ctx.lineTo(i, (1 + max) * amp);
  }
  
  ctx.strokeStyle = '#2080f0';
  ctx.stroke();

  // Draw selection
  if (selection.value.end > 0) {
     const startX = (selection.value.start / duration.value) * width;
     const endX = (selection.value.end / duration.value) * width;
     ctx.fillStyle = 'rgba(32, 128, 240, 0.2)';
     ctx.fillRect(startX, 0, endX - startX, height);
  }

  // Draw cursor
  const cursorX = (currentTime.value / duration.value) * width;
  ctx.beginPath();
  ctx.moveTo(cursorX, 0);
  ctx.lineTo(cursorX, height);
  ctx.strokeStyle = '#d03050';
  ctx.stroke();
};

const handleCanvasClick = (e: MouseEvent) => {
  if (!canvasRef.value || !duration.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const time = (x / rect.width) * duration.value;
  
  // Simple logic: if click is close to existing selection edges, move them?
  // For now, let's just create a new selection around the click or move current time
  // Replicating react logic: update selection based on click
  // But maybe better to just seek? 
  // Let's implement seek on click, and simple selection via drag (not implemented fully here for brevity, just click to seek for now)
  
  if (isPlaying.value) stopPlayback();
  store.setCurrentTime(time);
  pauseTimeRef.value = time;
  drawWaveform();
};

const playPlayback = () => {
  if (!audioContextRef.value || !audioBuffer.value) return;
  
  if (audioContextRef.value.state === 'suspended') {
    audioContextRef.value.resume();
  }

  const source = audioContextRef.value.createBufferSource();
  source.buffer = audioBuffer.value;
  
  const gainNode = audioContextRef.value.createGain();
  gainNode.gain.value = volume.value;
  
  source.connect(gainNode);
  gainNode.connect(audioContextRef.value.destination);
  
  sourceNodeRef.value = source;
  gainNodeRef.value = gainNode;
  
  // Start from currentTime
  const offset = currentTime.value;
  startTimeRef.value = audioContextRef.value.currentTime - offset;
  
  source.start(0, offset);
  source.onended = () => {
     if (isPlaying.value) { // only trigger if natural end
        store.setIsPlaying(false);
        // Do not reset current time to 0 necessarily, but let's do it for loop feel
     }
  };
  
  store.setIsPlaying(true);
  requestAnimationFrame(updateTime);
};

const stopPlayback = () => {
  if (sourceNodeRef.value) {
    sourceNodeRef.value.stop();
    sourceNodeRef.value = null;
  }
  store.setIsPlaying(false);
  // Save current time
  if (audioContextRef.value) {
     pauseTimeRef.value = audioContextRef.value.currentTime - startTimeRef.value;
     store.setCurrentTime(pauseTimeRef.value);
  }
};

const togglePlayPause = () => {
  if (isPlaying.value) {
    stopPlayback();
  } else {
    playPlayback();
  }
};

const updateTime = () => {
  if (!isPlaying.value || !audioContextRef.value) return;
  const now = audioContextRef.value.currentTime;
  const time = now - startTimeRef.value;
  
  if (time >= duration.value) {
    stopPlayback();
    store.setCurrentTime(0);
    pauseTimeRef.value = 0;
  } else {
    store.setCurrentTime(time);
    drawWaveform();
    requestAnimationFrame(updateTime);
  }
};

watch(volume, (newVal) => {
  if (gainNodeRef.value) {
    gainNodeRef.value.gain.value = newVal;
  }
});

const applyEffect = (type: 'fadeIn' | 'fadeOut' | 'echo') => {
   store.addEffect({ type, value: 2 }); // Mock effect add
   message.success(`Effect ${type} added (Visual Logic Only in V1)`);
};

const removeEffect = (id: string) => {
  store.removeEffect(id);
};

const downloadAudio = () => {
  // Mock download - in real implementation would render offline context
  if (!audioFile.value) return;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(audioFile.value);
  link.download = 'edited_' + audioFile.value.name;
  link.click();
  message.success('Downloading original file (Effect rendering TBD)');
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toFixed(2)}`;
};

onBeforeUnmount(() => {
  stopPlayback();
  store.reset();
  if (audioContextRef.value) audioContextRef.value.close();
});
</script>

<template>
  <c-card>
    <div class="space-y-6">
      <div v-if="!audioFile" class="p-10 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" @click="fileInput?.click()">
        <input ref="fileInput" type="file" accept="audio/*" hidden @change="handleFileUpload" />
        <n-icon size="48" class="text-gray-400 mb-2">
          <Upload />
        </n-icon>
        <p class="text-lg text-gray-500">
          Click or drop audio file here
        </p>
      </div>
      
      <div v-else>
         <div class="mb-4 flex flex-col items-center">
            <h3 class="font-bold">{{ audioFile.name }}</h3>
            <span class="text-xs text-gray-500">{{ formatTime(duration) }}</span>
         </div>

         <canvas 
           ref="canvasRef" 
           width="800" 
           height="200" 
           class="w-full h-40 bg-gray-100 dark:bg-gray-900 rounded border cursor-pointer mb-4"
           @click="handleCanvasClick"
         ></canvas>

         <div class="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center gap-2">
               <c-button circle @click="store.setSpeed(0.5)"><template #icon><n-icon><PlayerSkipBack /></n-icon></template></c-button>
               <c-button circle primary size="large" @click="togglePlayPause">
                 <template #icon>
                   <n-icon size="24"><PlayerPause v-if="isPlaying" /><PlayerPlay v-else /></n-icon>
                 </template>
               </c-button>
               <c-button circle @click="store.setSpeed(2.0)"><template #icon><n-icon><PlayerSkipForward /></n-icon></template></c-button>
            </div>
            
            <div class="flex items-center gap-2 w-48">
              <n-icon><Volume3 /></n-icon>
              <n-slider v-model:value="volume" :max="1" :step="0.05" />
            </div>

            <div class="text-mono font-bold">{{ formatTime(currentTime) }}</div>
         </div>

         <n-tabs type="segment" class="mt-6">
            <n-tab-pane name="effects" tab="Effects">
               <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <c-button @click="applyEffect('fadeIn')"><template #icon><n-icon><Sun /></n-icon></template>Fade In</c-button>
                  <c-button @click="applyEffect('fadeOut')"><template #icon><n-icon><Moon /></n-icon></template>Fade Out</c-button>
                  <c-button @click="applyEffect('echo')"><template #icon><n-icon><Radio /></n-icon></template>Echo</c-button>
               </div>
               
               <n-list v-if="effects.length > 0">
                 <n-list-item v-for="effect in effects" :key="effect.id">
                   <div class="flex justify-between items-center">
                     <span>{{ effect.type }}</span>
                     <c-button size="tiny" circle type="error" @click="removeEffect(effect.id)"><template #icon><n-icon><Trash /></n-icon></template></c-button>
                   </div>
                 </n-list-item>
               </n-list>
            </n-tab-pane>
            <n-tab-pane name="export" tab="Export">
               <div class="p-4 text-center">
                 <c-button type="primary" size="large" @click="downloadAudio">
                   <template #icon><n-icon><Download /></n-icon></template>
                   Download Edited Audio
                 </c-button>
               </div>
            </n-tab-pane>
         </n-tabs>
      </div>
    </div>
  </c-card>
</template>
