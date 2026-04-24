<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { RouterLink, useRoute } from 'vue-router';
import MenuIconItem from './MenuIconItem.vue';
import type { Tool, ToolCategory } from '@/tools/tools.types';
import { useStyleStore } from '@/stores/style.store';

const props = withDefaults(defineProps<{ toolsByCategory?: ToolCategory[] }>(), { toolsByCategory: () => [] });
const { toolsByCategory } = toRefs(props);
const route = useRoute();

const makeLabel = (tool: Tool) => () => h(RouterLink, { to: tool.path }, { default: () => tool.name });
const makeIcon = (tool: Tool) => () => h(MenuIconItem, { tool });

const collapsedCategories = useStorage<Record<string, boolean>>(
  'menu-tool-option:collapsed-categories',
  {},
  undefined,
  {
    deep: true,
    serializer: {
      read: v => (v ? JSON.parse(v) : null),
      write: v => JSON.stringify(v),
    },
  },
);

function toggleCategoryCollapse({ name }: { name: string }) {
  collapsedCategories.value[name] = !collapsedCategories.value[name];
}

const menuOptions = computed(() =>
  toolsByCategory.value.map(({ name, components }) => ({
    name,
    isCollapsed: collapsedCategories.value[name] ?? true,
    tools: components.map(tool => ({
      label: makeLabel(tool),
      icon: makeIcon(tool),
      key: tool.path,
    })),
  })),
);

const themeVars = useThemeVars();
const styleStore = useStyleStore();
</script>

<template>
  <div class="appearance-settings">
    <div class="section-title">佈局設定</div>
    <div class="setting-item">
      <span class="label">Bing 桌布</span>
      <n-switch v-model:value="styleStore.isBingWallpaperEnabled" size="small" />
    </div>
    <div class="setting-item flex-col">
      <div class="label-row">
        <span class="label">卡片透明度</span>
        <span class="value">{{ Math.round(styleStore.cardOpacity * 100) }}%</span>
      </div>
      <n-slider v-model:value="styleStore.cardOpacity" :min="0.1" :max="1" :step="0.01" :tooltip="false" />
    </div>
  </div>

  <div v-for="{ name, tools, isCollapsed } of menuOptions" :key="name">
    <div ml-6px mt-12px flex cursor-pointer items-center op-60 @click="toggleCategoryCollapse({ name })">
      <span :class="{ 'rotate-0': isCollapsed, 'rotate-90': !isCollapsed }" text-16px lh-1 op-50 transition-transform>
        <icon-mdi-chevron-right />
      </span>

      <span ml-8px text-13px>
        {{ name }}
      </span>
    </div>

    <n-collapse-transition :show="!isCollapsed">
      <div class="menu-wrapper">
        <div class="toggle-bar" @click="toggleCategoryCollapse({ name })" />

        <n-menu
          class="menu"
          :value="route.path"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="tools"
          :indent="8"
          :default-expand-all="true"
        />
      </div>
    </n-collapse-transition>
  </div>
</template>

<style scoped lang="less">
.appearance-settings {
  padding: 0 16px;
  margin-bottom: 20px;
  margin-top: 10px;

  .section-title {
    font-size: 12px;
    font-weight: 600;
    opacity: 0.5;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 12px;

    &.flex-col {
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      font-size: 13px;
    }

    .value {
      font-size: 12px;
      opacity: 0.6;
    }
  }
}

.menu-wrapper {
  display: flex;
  flex-direction: row;
  .menu {
    flex: 1;
    margin-bottom: 5px;

    ::v-deep(.n-menu-item-content::before) {
      left: 0;
      right: 13px;
    }
  }

  .toggle-bar {
    width: 24px;
    opacity: 0.1;
    transition: opacity ease 0.2s;
    position: relative;
    cursor: pointer;

    &::before {
      width: 2px;
      height: 100%;
      content: ' ';
      background-color: v-bind('themeVars.textColor3');
      border-radius: 2px;
      position: absolute;
      top: 0;
      left: 14px;
    }

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
