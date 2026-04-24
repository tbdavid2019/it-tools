<script lang="ts" setup>
import _ from 'lodash';
import { demoRoutes } from './demo.routes';
import { useStyleStore } from '@/stores/style.store';

const route = useRoute();
const styleStore = useStyleStore();

const layoutBackgroundColor = computed(() => {
  if (!styleStore.isBingWallpaperEnabled) return 'transparent';
  const opacity = styleStore.cardOpacity;
  const baseColor = styleStore.isDarkTheme ? '35, 35, 35' : '255, 255, 255';
  return `rgba(${baseColor}, ${opacity})`;
});

const componentName = computed(() => _.startCase(String(route.name).replace(/^c-/, '')));
</script>

<template>
  <div mt-2 w-full p-8 :class="{ 'glass-effect': styleStore.isBingWallpaperEnabled }">
    <h1>c-lib components</h1>

    <div flex>
      <div w-200px b-r b-gray b-op-10 b-r-solid pr-4>
        <c-button
          v-for="{ name } of demoRoutes"
          :key="name"
          variant="text"
          :to="{ name }"
          w-full
          important:justify-start
          important:text-left
          :type="route.name === name ? 'primary' : 'default'"
        >
          {{ name }}
        </c-button>
      </div>

      <div flex-1 pl-4>
        <h1>{{ componentName }}</h1>

        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.glass-effect {
  background-color: v-bind('layoutBackgroundColor');
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
