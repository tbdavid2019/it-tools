<script setup lang="ts">
import type { Component } from 'vue';

import { useStyleStore } from '@/stores/style.store';

const props = defineProps<{ icon: Component; title: string }>();
const { icon, title } = toRefs(props);
const styleStore = useStyleStore();

const gradientBackground = computed(() => {
  const opacity = styleStore.cardOpacity;
  return `linear-gradient(48deg, rgba(37, 99, 108, ${opacity}) 0%, rgba(59, 149, 111, ${opacity}) 60%, rgba(20, 160, 88, ${opacity}) 100%)`;
});
</script>

<template>
  <c-card class="colored-card">
    <n-icon class="icon" size="40" :component="icon" />
    <n-h3 class="title">
      <n-ellipsis>{{ title }}</n-ellipsis>
    </n-h3>

    <div class="description">
      <n-ellipsis :line-clamp="2" :tooltip="false">
        <slot />
      </n-ellipsis>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.colored-card {
  background: v-bind('gradientBackground');
  color: #fff;
  border: none;

  .icon {
    opacity: 0.7;
  }

  .title {
    color: #fff;

    margin: 5px 0;
  }

  .description {
    opacity: 0.8;

    margin: 5px 0;

    ::v-deep(a) {
      color: inherit;
      text-decoration: underline;
      font-weight: bold;
      transition: color ease 0.2s;

      &:hover {
        color: rgb(20, 20, 20);
      }
    }
  }
}
</style>
