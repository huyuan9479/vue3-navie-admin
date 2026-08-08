<script setup lang="ts">
import { useThemeStore } from "@/store/modules/theme";
import LayoutMode from "./components/LayoutMode.vue";
import TabSettings from "./components/TabSettings.vue";
import HeaderSettings from "./components/HeaderSettings.vue";
import SiderSettings from "./components/SiderSettings.vue";
import FooterSettings from "./components/FooterSettings.vue";
import ContentSettings from "./components/ContentSettings.vue";

defineOptions({
  name: "LayoutSettings",
});

const themeStore = useThemeStore();
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <LayoutMode />
    <TabSettings />
    <HeaderSettings />
    <!-- The top menu mode does not have a sidebar -->
    <SiderSettings v-if="themeStore.layout.mode !== 'horizontal'" />
    <FooterSettings />
    <ContentSettings />
  </div>
</template>

<style scoped></style>
