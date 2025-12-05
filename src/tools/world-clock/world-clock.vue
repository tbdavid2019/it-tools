<script setup lang="ts">
const show24h = ref(true);
const now = ref(new Date());

const formatTime = (tz: string) => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !show24h.value,
    timeZone: tz,
  });
  return formatter.format(now.value);
};

const formatDay = (tz: string) => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: tz,
  });
  return formatter.format(now.value);
};

const groups = [
  {
    name: 'Americas',
    items: [
      { city: 'New York', country: 'USA', tz: 'America/New_York' },
      { city: 'Chicago', country: 'USA', tz: 'America/Chicago' },
      { city: 'Denver', country: 'USA', tz: 'America/Denver' },
      { city: 'Los Angeles', country: 'USA', tz: 'America/Los_Angeles' },
      { city: 'Toronto', country: 'Canada', tz: 'America/Toronto' },
      { city: 'Mexico City', country: 'Mexico', tz: 'America/Mexico_City' },
      { city: 'Bogotá', country: 'Colombia', tz: 'America/Bogota' },
      { city: 'Lima', country: 'Peru', tz: 'America/Lima' },
      { city: 'São Paulo', country: 'Brazil', tz: 'America/Sao_Paulo' },
      { city: 'Buenos Aires', country: 'Argentina', tz: 'America/Argentina/Buenos_Aires' },
    ],
  },
  {
    name: 'Europe (WET/CET/EET)',
    items: [
      { city: 'London', country: 'UK', tz: 'Europe/London' },
      { city: 'Lisbon', country: 'Portugal', tz: 'Europe/Lisbon' },
      { city: 'Madrid', country: 'Spain', tz: 'Europe/Madrid' },
      { city: 'Paris', country: 'France', tz: 'Europe/Paris' },
      { city: 'Berlin', country: 'Germany', tz: 'Europe/Berlin' },
      { city: 'Amsterdam', country: 'Netherlands', tz: 'Europe/Amsterdam' },
      { city: 'Copenhagen', country: 'Denmark', tz: 'Europe/Copenhagen' },
      { city: 'Oslo', country: 'Norway', tz: 'Europe/Oslo' },
      { city: 'Stockholm', country: 'Sweden', tz: 'Europe/Stockholm' },
      { city: 'Zurich', country: 'Switzerland', tz: 'Europe/Zurich' },
      { city: 'Rome', country: 'Italy', tz: 'Europe/Rome' },
      { city: 'Athens', country: 'Greece', tz: 'Europe/Athens' },
      { city: 'Bucharest', country: 'Romania', tz: 'Europe/Bucharest' },
      { city: 'Helsinki', country: 'Finland', tz: 'Europe/Helsinki' },
    ],
  },
  {
    name: 'Asia',
    items: [
      { city: 'Dubai', country: 'UAE', tz: 'Asia/Dubai' },
      { city: 'Karachi', country: 'Pakistan', tz: 'Asia/Karachi' },
      { city: 'Delhi', country: 'India', tz: 'Asia/Kolkata' },
      { city: 'Bangkok', country: 'Thailand', tz: 'Asia/Bangkok' },
      { city: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta' },
      { city: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore' },
      { city: 'Hong Kong', country: 'Hong Kong', tz: 'Asia/Hong_Kong' },
      { city: 'Taipei', country: 'Taiwan', tz: 'Asia/Taipei' },
      { city: 'Seoul', country: 'Korea', tz: 'Asia/Seoul' },
      { city: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo' },
      { city: 'Beijing', country: 'China', tz: 'Asia/Shanghai' },
      { city: 'Manila', country: 'Philippines', tz: 'Asia/Manila' },
      { city: 'Kuala Lumpur', country: 'Malaysia', tz: 'Asia/Kuala_Lumpur' },
      { city: 'Sydney', country: 'Australia', tz: 'Australia/Sydney' },
    ],
  },
  {
    name: 'Pacific',
    items: [
      { city: 'Honolulu', country: 'USA', tz: 'Pacific/Honolulu' },
      { city: 'Anchorage', country: 'USA', tz: 'America/Anchorage' },
      { city: 'Auckland', country: 'New Zealand', tz: 'Pacific/Auckland' },
      { city: 'Fiji', country: 'Fiji', tz: 'Pacific/Fiji' },
    ],
  },
  {
    name: 'Africa',
    items: [
      { city: 'Cairo', country: 'Egypt', tz: 'Africa/Cairo' },
      { city: 'Johannesburg', country: 'South Africa', tz: 'Africa/Johannesburg' },
      { city: 'Nairobi', country: 'Kenya', tz: 'Africa/Nairobi' },
      { city: 'Lagos', country: 'Nigeria', tz: 'Africa/Lagos' },
      { city: 'Casablanca', country: 'Morocco', tz: 'Africa/Casablanca' },
    ],
  },
  {
    name: 'Middle East',
    items: [
      { city: 'Istanbul', country: 'Turkey', tz: 'Europe/Istanbul' },
      { city: 'Tel Aviv', country: 'Israel', tz: 'Asia/Jerusalem' },
      { city: 'Doha', country: 'Qatar', tz: 'Asia/Qatar' },
      { city: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh' },
      { city: 'Muscat', country: 'Oman', tz: 'Asia/Muscat' },
    ],
  },
];

let timer: number | null = null;

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <c-card>
    <div class="header">
      <div class="title">{{ $t('tools.world-clock.title') }}</div>
      <div class="actions">
        <c-button size="small" @click="show24h = !show24h">
          {{ show24h ? '24h' : '12h' }}
        </c-button>
      </div>
    </div>
    <div class="grid">
      <n-card v-for="group in groups" :key="group.name" class="zone" size="small" :title="group.name">
        <div v-for="item in group.items" :key="item.tz" class="row">
          <div class="time">
            <div class="clock">{{ formatTime(item.tz) }}</div>
            <div class="day">{{ formatDay(item.tz) }}</div>
          </div>
          <div class="city">
            <div class="name">{{ item.city }}</div>
            <div class="country">{{ item.country }}</div>
          </div>
        </div>
      </n-card>
    </div>
  </c-card>
</template>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.title {
  font-size: 20px;
  font-weight: 600;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}
.zone {
  min-height: 200px;
}
.row {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.row:last-child {
  border-bottom: none;
}
.time {
  width: 90px;
  text-align: right;
}
.clock {
  font-size: 18px;
  font-weight: 700;
}
.day {
  color: #777;
  font-size: 12px;
}
.city .name {
  font-weight: 600;
}
.city .country {
  color: #666;
  font-size: 12px;
}
</style>
