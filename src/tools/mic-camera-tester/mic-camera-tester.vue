<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { ref, onBeforeUnmount, watch } from 'vue';
import { Video, Microphone, Refresh, VideoOff, MicrophoneOff } from '@vicons/tabler';

const message = useMessage();
const videoRef = ref<HTMLVideoElement | null>(null);
const streamRef = ref<MediaStream | null>(null);
const audioContextRef = ref<AudioContext | null>(null);
const analyserRef = ref<AnalyserNode | null>(null);
const microphoneRef = ref<MediaStreamAudioSourceNode | null>(null);
const volume = ref(0);
const animationFrameRef = ref<number>(0);

const videoDevices = ref<MediaDeviceInfo[]>([]);
const audioDevices = ref<MediaDeviceInfo[]>([]);
const selectedVideoDevice = ref<string>('');
const selectedAudioDevice = ref<string>('');
const isCameraActive = ref(false);
const isMicActive = ref(false);

const getDevices = async () => {
  try {
    // Request permission first to get labels
    await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(s => s.getTracks().forEach(t => t.stop()));
    
    const devices = await navigator.mediaDevices.enumerateDevices();
    videoDevices.value = devices.filter(d => d.kind === 'videoinput');
    audioDevices.value = devices.filter(d => d.kind === 'audioinput');
    
    if (videoDevices.value.length > 0) selectedVideoDevice.value = videoDevices.value[0].deviceId;
    if (audioDevices.value.length > 0) selectedAudioDevice.value = audioDevices.value[0].deviceId;
  } catch (e: any) {
    message.error('Permission denied or error fetching devices: ' + e.message);
  }
};

const startCamera = async () => {
  if (!selectedVideoDevice.value) return;
  stopCamera();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: selectedVideoDevice.value ? { exact: selectedVideoDevice.value } : undefined }
    });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      isCameraActive.value = true;
    }
  } catch (e: any) {
    message.error('Error starting camera: ' + e.message);
  }
};

const stopCamera = () => {
  if (videoRef.value && videoRef.value.srcObject) {
    const stream = videoRef.value.srcObject as MediaStream;
    stream.getTracks().forEach(t => t.stop());
    videoRef.value.srcObject = null;
    isCameraActive.value = false;
  }
};

const startMic = async () => {
  if (!selectedAudioDevice.value) return;
  stopMic();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: selectedAudioDevice.value ? { exact: selectedAudioDevice.value } : undefined }
    });
    
    streamRef.value = stream;
    audioContextRef.value = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.value = audioContextRef.value.createAnalyser();
    microphoneRef.value = audioContextRef.value.createMediaStreamSource(stream);
    microphoneRef.value.connect(analyserRef.value);
    analyserRef.value.fftSize = 256;
    
    isMicActive.value = true;
    drawVolume();
  } catch (e: any) {
    message.error('Error starting microphone: ' + e.message);
  }
};

const stopMic = () => {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach(t => t.stop());
    streamRef.value = null;
  }
  if (audioContextRef.value) {
    audioContextRef.value.close();
    audioContextRef.value = null;
  }
  cancelAnimationFrame(animationFrameRef.value);
  isMicActive.value = false;
  volume.value = 0;
};

const drawVolume = () => {
  if (!analyserRef.value) return;
  const bufferLength = analyserRef.value.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyserRef.value.getByteFrequencyData(dataArray);
  
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += dataArray[i];
  }
  volume.value = sum / bufferLength; // 0-255 roughly
  
  if (isMicActive.value) {
    animationFrameRef.value = requestAnimationFrame(drawVolume);
  }
};

watch(selectedVideoDevice, () => {
  if (isCameraActive.value) startCamera();
});

watch(selectedAudioDevice, () => {
  if (isMicActive.value) startMic();
});

onBeforeUnmount(() => {
  stopCamera();
  stopMic();
});

// Init
getDevices();
</script>

<template>
  <c-card>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Camera Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold flex items-center gap-2"><n-icon><Video /></n-icon> Camera</h3>
          <c-button circle size="tiny" @click="getDevices" title="Refresh Devices"><template #icon><n-icon><Refresh /></n-icon></template></c-button>
        </div>
        
        <c-select v-model:value="selectedVideoDevice" 
          :options="videoDevices.map(d => ({ label: d.label || 'Camera ' + d.deviceId.slice(0,5), value: d.deviceId }))" 
          placeholder="Select Camera"
        />

        <div class="aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
           <video ref="videoRef" autoplay playsinline class="w-full h-full object-contain transform scale-x-[-1]"></video> <!-- Mirror effect -->
           <div v-if="!isCameraActive" class="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
             <n-icon size="48"><VideoOff /></n-icon>
             <span>Camera Off</span>
           </div>
        </div>

        <div class="flex gap-2">
           <c-button v-if="!isCameraActive" primary class="flex-1" @click="startCamera">Start Camera</c-button>
           <c-button v-else type="error" class="flex-1" @click="stopCamera">Stop Camera</c-button>
        </div>
      </div>

      <!-- Mic Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold flex items-center gap-2"><n-icon><Microphone /></n-icon> Microphone</h3>
        </div>

        <c-select v-model:value="selectedAudioDevice" 
          :options="audioDevices.map(d => ({ label: d.label || 'Mic ' + d.deviceId.slice(0,5), value: d.deviceId }))" 
          placeholder="Select Microphone"
        />

        <div class="h-48 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-6 space-y-4">
           <n-icon size="48" :class="isMicActive ? 'text-primary' : 'text-gray-400'">
             <Microphone v-if="isMicActive" />
             <MicrophoneOff v-else />
           </n-icon>
           
           <!-- Volume Bar -->
           <div class="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
             <div class="h-full bg-green-500 transition-all duration-75 ease" :style="{ width: (volume / 255 * 100) * 2 + '%' }"></div>
           </div>
           <div class="text-xs text-gray-500">{{ Math.round((volume / 255 * 100)) }}% Level</div>
        </div>

        <div class="flex gap-2">
           <c-button v-if="!isMicActive" primary class="flex-1" @click="startMic">Start Microphone</c-button>
           <c-button v-else type="error" class="flex-1" @click="stopMic">Stop Microphone</c-button>
        </div>
      </div>
    </div>
  </c-card>
</template>
