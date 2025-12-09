<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFullscreen, useLocalStorage, useNow } from '@vueuse/core';
import FlipCard from './FlipCard.vue';

const { t, locale } = useI18n();

const mode = useLocalStorage<'digital' | 'analog' | 'flip'>('onlineClock/mode', 'digital');
const showSeconds = useLocalStorage<boolean>('onlineClock/showSeconds', true);
const showDate = useLocalStorage<boolean>('onlineClock/showDate', true);
const timezone = useLocalStorage<string>('onlineClock/timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
const useNetworkTime = useLocalStorage<boolean>('onlineClock/useNetworkTime', true);
const clockRef = ref<HTMLElement | null>(null);
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(clockRef);

const now = useNow({ interval: 1000 });
const timeOffset = ref(0);
const isSyncing = ref(false);
const syncError = ref(false);

const syncTime = async () => {
  if (!useNetworkTime.value) {
    timeOffset.value = 0;
    return;
  }

  isSyncing.value = true;
  syncError.value = false;
  try {
    const start = Date.now();
    const response = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
    const end = Date.now();
    
    const dateHeader = response.headers.get('date');
    if (!dateHeader) throw new Error('No Date header');

    const serverTime = new Date(dateHeader).getTime();
    const latency = (end - start) / 2;
    const estimatedServerTime = serverTime + latency;
    
    // Offset = Server Time - Local Time
    timeOffset.value = estimatedServerTime - end;
  } catch (e) {
    console.error('Time sync failed', e);
    syncError.value = true;
  } finally {
    isSyncing.value = false;
  }
};

watch(useNetworkTime, () => {
  if (useNetworkTime.value) {
    syncTime();
  } else {
    timeOffset.value = 0;
  }
});

onMounted(() => {
  if (useNetworkTime.value) {
    syncTime();
  }
});

const adjustedNow = computed(() => {
  if (timeOffset.value === 0) return now.value;
  return new Date(now.value.getTime() + timeOffset.value);
});

const zonedNow = computed(() => {
  try {
    const iso = adjustedNow.value.toLocaleString('en-US', { timeZone: timezone.value });
    return new Date(iso);
  } catch (e) {
    console.warn('Timezone not supported, fallback to local', e);
    return adjustedNow.value;
  }
});

const parts = computed(() => {
  const date = zonedNow.value;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const pad = (v: number) => v.toString().padStart(2, '0');
  return {
    hours,
    minutes,
    seconds,
    hh: pad(hours),
    mm: pad(minutes),
    ss: pad(seconds),
    date,
  };
});

const dateText = computed(() =>
  new Intl.DateTimeFormat(locale.value, { dateStyle: 'full', timeZone: timezone.value }).format(zonedNow.value),
);

const timeText = computed(() =>
  new Intl.DateTimeFormat(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds.value ? '2-digit' : undefined,
    timeZone: timezone.value,
  }).format(zonedNow.value),
);

const timezones = computed(() => {
  // Keep list short enough but still useful; sorted so UX is predictable.
  const tzList =
    (Intl as any).supportedValuesOf?.('timeZone') ??
    [
      'UTC',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Europe/Moscow',
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'America/Sao_Paulo',
      'Asia/Dubai',
      'Asia/Kolkata',
      'Asia/Bangkok',
      'Asia/Jakarta',
      'Asia/Shanghai',
      'Asia/Tokyo',
      'Asia/Seoul',
      'Asia/Taipei',
      'Asia/Hong_Kong',
      'Asia/Singapore',
      'Australia/Sydney',
    ];
  return tzList.map(tz => ({ label: tz, value: tz }));
});

const hourRotation = computed(() => (parts.value.hours % 12) * 30 + parts.value.minutes * 0.5 + parts.value.seconds / 120);
const minuteRotation = computed(() => parts.value.minutes * 6 + parts.value.seconds * 0.1);
const secondRotation = computed(() => parts.value.seconds * 6);

const flipDigits = computed(() => {
  const digits = `${parts.value.hh}${parts.value.mm}${showSeconds.value ? parts.value.ss : ''}`;
  return digits.split('');
});
</script>

<template>
  <div ref="clockRef" class="clock-page" :class="{ fullscreen: isFullscreen }">
    <div class="header">
      <div class="title">{{ t('tools.online-clock.title') }}</div>
      <div class="controls">
        <n-select
          v-model:value="timezone"
          size="small"
          :options="timezones"
          filterable
          :placeholder="t('tools.online-clock.timezone')"
          class="tz"
        />
        <div class="control">
          <n-switch v-model:value="showSeconds" size="small" />
          <span>{{ t('tools.online-clock.showSeconds') }}</span>
        </div>
        <div class="control">
          <n-switch v-model:value="showDate" size="small" />
          <span>{{ t('tools.online-clock.showDate') }}</span>
        </div>
        <div class="control">
          <n-switch v-model:value="useNetworkTime" size="small" :loading="isSyncing" />
          <span>{{ t('tools.online-clock.useNetworkTime') }}</span>
          <c-button v-if="useNetworkTime" size="tiny" circle quaternary @click="syncTime">
            <span class="icon-refresh" :class="{ spinning: isSyncing }">↻</span>
          </c-button>
        </div>
        <c-button size="small" quaternary @click="toggleFullscreen">
          {{ isFullscreen ? t('tools.online-clock.exitFullscreen') : t('tools.online-clock.fullscreen') }}
        </c-button>
      </div>
    </div>

    <div v-if="useNetworkTime && timeOffset !== 0" class="offset-info">
      {{ t('tools.online-clock.offset', { value: (timeOffset / 1000).toFixed(2) }) }}
    </div>
    <div v-if="syncError" class="offset-info error">
      {{ t('tools.online-clock.syncError') }}
    </div>

    <div v-if="showDate" class="date">{{ dateText }}</div>

    <div v-if="mode === 'digital'" class="digital">
      <div class="digital-time">{{ timeText }}</div>
    </div>

    <div v-else-if="mode === 'analog'" class="analog">
      <div class="dial">
        <div class="ticks">
          <div v-for="n in 60" :key="n" class="tick-wrapper" :style="{ transform: `rotate(${n * 6}deg)` }">
            <div class="tick" :class="{ bold: n % 5 === 0 }" />
          </div>
        </div>
        <div class="numbers">
          <div v-for="n in 12" :key="n" class="number-wrapper" :style="{ transform: `rotate(${n * 30}deg)` }">
            <span class="number" :style="{ transform: `rotate(${-n * 30}deg)` }">{{ n }}</span>
          </div>
        </div>
        <div class="hand hour" :style="{ '--rot': `${hourRotation}deg` }" />
        <div class="hand minute" :style="{ '--rot': `${minuteRotation}deg` }" />
        <div class="hand second" :style="{ '--rot': `${secondRotation}deg` }" />
        <div class="center-dot" />
      </div>
    </div>

    <div v-else class="flip">
      <div class="flip-group">
        <FlipCard :value="parts.hh[0]" />
        <FlipCard :value="parts.hh[1]" />
      </div>
      <div class="flip-group">
        <FlipCard :value="parts.mm[0]" />
        <FlipCard :value="parts.mm[1]" />
      </div>
      <template v-if="showSeconds">
        <div class="flip-group">
          <FlipCard :value="parts.ss[0]" />
          <FlipCard :value="parts.ss[1]" />
        </div>
      </template>
    </div>

    <div class="tabs">
      <c-button quaternary :type="mode === 'digital' ? 'primary' : 'default'" @click="mode = 'digital'">
        {{ t('tools.online-clock.modes.digital') }}
      </c-button>
      <c-button quaternary :type="mode === 'analog' ? 'primary' : 'default'" @click="mode = 'analog'">
        {{ t('tools.online-clock.modes.analog') }}
      </c-button>
      <c-button quaternary :type="mode === 'flip' ? 'primary' : 'default'" @click="mode = 'flip'">
        {{ t('tools.online-clock.modes.flip') }}
      </c-button>
    </div>
  </div>
</template>

<style scoped>
.clock-page {
  background: #0e0f14;
  color: #d3d6dc;
  padding: 28px 16px 32px;
  border-radius: 16px;
}

.clock-page.fullscreen {
  width: 100vw;
  min-height: 100vh;
  border-radius: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 20px 40px;
  box-sizing: border-box;
  color: #f5f6fa;
}

.header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.clock-page.fullscreen .header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100%;
  padding: 20px 40px;
  background: linear-gradient(to bottom, rgba(14, 15, 20, 0.95), rgba(14, 15, 20, 0));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.clock-page.fullscreen .header:hover {
  opacity: 1;
}

.title {
  font-size: 24px;
  font-weight: 700;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.control {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #e5e7eb;
  font-size: 13px;
}

.tz {
  width: 220px;
}

.date {
  text-align: center;
  margin-top: 12px;
  color: #9ba1ad;
}

.digital {
  margin: 32px 0 20px;
  text-align: center;
}

.digital-time {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 700;
  letter-spacing: 2px;
}

.analog {
  display: flex;
  justify-content: center;
  margin: 28px 0 12px;
}

.clock-page.fullscreen .analog {
  width: 100%;
}

.dial {
  position: relative;
  width: min(420px, 80vw);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: radial-gradient(circle, #1c1f28 0%, #0f121a 70%);
  box-shadow: 0 0 0 2px #1f232d, inset 0 0 0 1px #2a2f3a;
}

.clock-page.fullscreen .dial {
  width: min(800px, 90vmin);
}

.clock-page.fullscreen .date {
  font-size: clamp(16px, 3vw, 32px);
  margin-bottom: 2vh;
}

.clock-page.fullscreen .digital-time {
  font-size: clamp(80px, 25vw, 300px);
}

.clock-page.fullscreen .flip :deep(.flip-card) {
  width: clamp(80px, 14vw, 200px);
  height: clamp(120px, 20vw, 300px);
  font-size: clamp(60px, 10vw, 180px);
  perspective: 800px;
}

.clock-page.fullscreen .flip :deep(.digit) {
  line-height: clamp(120px, 20vw, 300px);
}

.ticks {
  position: absolute;
  inset: 0;
}

.tick-wrapper {
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 50%;
  transform-origin: bottom center;
}

.tick {
  position: absolute;
  top: 12px;
  left: -1px;
  width: 2px;
  height: 10px;
  background: #3a404d;
  opacity: 0.6;
}

.tick.bold {
  height: 16px;
  width: 3px;
  left: -1.5px;
  background: #d3d6dc;
  opacity: 1;
}

.numbers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.number-wrapper {
  position: absolute;
  top: 0;
  left: 50%;
  width: 40px;
  margin-left: -20px;
  height: 50%;
  transform-origin: bottom center;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 32px; /* Distance from edge */
}

.number {
  color: #cfd2d9;
  font-weight: 700;
  font-size: clamp(14px, 2vw, 18px);
  display: block;
}

.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  transform: rotate(var(--rot));
  border-radius: 6px;
}

.hand.hour {
  width: 10px;
  height: 24%;
  background: #d3d6dc;
  margin-left: -5px;
}

.hand.minute {
  width: 8px;
  height: 35%;
  background: #9ba1ad;
  margin-left: -4px;
}

.hand.second {
  width: 4px;
  height: 40%;
  background: #f59e0b;
  margin-left: -2px;
}

.center-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d3d6dc;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 4px #0f121a;
}

.flip {
  margin: 24px auto 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(12px, 2vw, 24px);
}

.flip-group {
  display: flex;
  gap: 8px;
}

.tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 18px;
  flex-wrap: wrap;
}

/* Force lighter text color for buttons in dark mode */
.tabs :deep(button),
.controls :deep(button) {
  color: #e0e0e0 !important;
}

.tabs :deep(button.n-button--primary-type) {
  color: #fff !important;
}

@media (max-width: 600px) {
  .controls {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .tz {
    width: 100%;
  }
}

.offset-info {
  text-align: center;
  font-size: 12px;
  color: #9ba1ad;
  margin-top: 4px;
}

.offset-info.error {
  color: #ef4444;
}

.icon-refresh {
  display: inline-block;
  font-size: 14px;
  line-height: 1;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
