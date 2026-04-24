<script lang="ts" setup>
import { useTheme } from './c-card.theme';
import { useStyleStore } from '@/stores/style.store';

const props = defineProps<{
  title?: string
}>();

const { title } = toRefs(props);

const theme = useTheme();
const styleStore = useStyleStore();

const backgroundColor = computed(() => {
  const opacity = styleStore.cardOpacity;
  const color = theme.value.backgroundColor;
  // Replace the alpha value in rgba() string
  return color.replace(/[\d.]+\)$/, `${opacity})`);
});
</script>

<template>
  <div class="c-card">
    <div v-if="title" class="c-card-title">
      {{ title }}
    </div>
    <slot />
  </div>
</template>

<style lang="less" scoped>
.c-card {
  background-color: v-bind('backgroundColor');
  border: 1px solid v-bind('theme.borderColor');
  border-radius: 24px;
  padding: 24px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);

  &-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
  }
}
</style>
