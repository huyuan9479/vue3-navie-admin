<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { $t } from "@/locales";

defineOptions({
  name: "ThemeButton",
});

const appStore = useAppStore();
</script>

<template>
  <ButtonIcon
    icon="ant-design:setting-outlined"
    :tooltip-content="$t('icon.themeConfig')"
    @click="appStore.openThemeDrawer"
  />
</template>

<style scoped></style>
