<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getRandomBingWallpaper } from '@/services/wallpaper.service';
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();
const wallpaperUrl = ref<string | null>(null);
const isLoaded = ref(false);

onMounted(async () => {
  if (styleStore.isBingWallpaperEnabled) {
    const url = await getRandomBingWallpaper();
    if (url) {
      wallpaperUrl.value = url;
    }
  }
});

watch(() => styleStore.isBingWallpaperEnabled, async (enabled) => {
  if (enabled && !wallpaperUrl.value) {
    const url = await getRandomBingWallpaper();
    if (url) {
      wallpaperUrl.value = url;
    }
  }
});

const onImageLoad = () => {
  isLoaded.value = true;
};
</script>

<template>
  <div v-if="wallpaperUrl" class="bing-background-container" :class="{ 'is-loaded': isLoaded }">
    <img 
      :src="wallpaperUrl" 
      class="bing-image" 
      alt="Bing Wallpaper"
      @load="onImageLoad"
    />
    <div class="bing-overlay" />
  </div>
</template>

<style scoped lang="less">
.bing-background-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -999;
  overflow: hidden;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  pointer-events: none;
  background-color: #000; // Fallback background

  &.is-loaded {
    opacity: 1;
  }
}

.bing-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.1);
  transition: transform 10s ease-out;
}

.is-loaded .bing-image {
  transform: scale(1);
}

.bing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  // Adaptive overlay based on theme
  // In light mode, we want it a bit brighter but still providing contrast
  // In dark mode, we want it darker
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

// Dark theme specific adjustment if needed via global classes
:deep(.dark) .bing-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}
</style>
