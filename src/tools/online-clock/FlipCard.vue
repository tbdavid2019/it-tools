<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  value: string;
}>();

const current = ref(props.value);
const next = ref(props.value);
const isFlipping = ref(false);

watch(
  () => props.value,
  (newVal, oldVal) => {
    if (newVal === oldVal) return;
    current.value = oldVal || newVal;
    next.value = newVal;
    isFlipping.value = true;

    setTimeout(() => {
      isFlipping.value = false;
      current.value = newVal;
    }, 600); // Match CSS animation duration
  },
);
</script>

<template>
  <div class="flip-card">
    <!-- Background Top: Shows the Next value (revealed when Top Leaf flips down) -->
    <div class="digit top-bg">{{ next }}</div>

    <!-- Background Bottom: Shows the Current value (covered when Bottom Leaf flips down) -->
    <div class="digit bottom-bg">{{ current }}</div>

    <!-- Top Leaf: Shows Current value. Flips down (0 -> -90) -->
    <div class="digit leaf-top" :class="{ flipping: isFlipping }">
      {{ current }}
    </div>

    <!-- Bottom Leaf: Shows Next value. Flips down (90 -> 0) -->
    <div class="digit leaf-bottom" :class="{ flipping: isFlipping }">
      {{ next }}
    </div>
    
    <!-- Divider line -->
    <div class="divider"></div>
  </div>
</template>

<style scoped>
.flip-card {
  position: relative;
  width: clamp(52px, 11vw, 92px);
  height: clamp(78px, 14vw, 128px);
  background: #1a1d24;
  border-radius: 8px;
  font-size: clamp(36px, 7vw, 64px);
  font-weight: 700;
  color: #e5e7eb;
  perspective: 400px;
  box-shadow: 0 8px 14px rgba(0, 0, 0, 0.35);
}

.digit {
  position: absolute;
  left: 0;
  width: 100%;
  height: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  background: #1a1d24;
  backface-visibility: hidden;
  line-height: clamp(78px, 14vw, 128px); /* Line height = full card height to center text vertically across halves */
}

.top-bg {
  top: 0;
  align-items: flex-start;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.bottom-bg {
  bottom: 0;
  align-items: flex-end;
  border-radius: 0 0 8px 8px;
  z-index: 1;
}

.leaf-top {
  top: 0;
  align-items: flex-start;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transform-origin: bottom;
  z-index: 2;
}

.leaf-top.flipping {
  animation: flipTop 0.6s ease-in-out;
}

.leaf-bottom {
  bottom: 0;
  align-items: flex-end;
  border-radius: 0 0 8px 8px;
  transform-origin: top;
  transform: rotateX(90deg); /* Initially hidden (flat up) */
  z-index: 2;
}

.leaf-bottom.flipping {
  animation: flipBottom 0.6s ease-in-out;
}

.divider {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.4);
  z-index: 5;
}

@keyframes flipTop {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(-90deg);
  }
}

@keyframes flipBottom {
  0% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}
</style>
