<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import VerticalMenu from './components/VerticalMenu.vue';
import VerticalMixMenu from './components/VerticalMixMenu.vue';
import VerticalHybridHeaderFirst from './components/VerticalHybridHeaderFirst.vue';
import HorizontalMenu from './components/HorizontalMenu.vue';
import TopHybridSidebarFirst from './components/TopHybridSidebarFirst.vue';
import TopHybridHeaderFirst from './components/TopHybridHeaderFirst.vue';

defineOptions({
  name: 'GlobalMenu'
});

const appStore = useAppStore();
const themeStore = useThemeStore();

const activeMenu = computed(() => {
  const menuMap: Record<UnionKey.ThemeLayoutMode, Component> = {
    vertical: VerticalMenu,
    'vertical-mix': VerticalMixMenu,
    'vertical-hybrid-header-first': VerticalHybridHeaderFirst,
    horizontal: HorizontalMenu,
    'top-hybrid-sidebar-first': TopHybridSidebarFirst,
    'top-hybrid-header-first': TopHybridHeaderFirst
  };

  return menuMap[themeStore.layout.mode];
});

const reRenderVertical = computed(
  () => themeStore.layout.mode === 'vertical' && appStore.isMobile
);
</script>

<template>
  <component :is="activeMenu" :key="reRenderVertical" />
</template>

<style scoped></style>
