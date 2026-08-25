<script setup lang="ts">
import type { ModalHeaderProps } from "../types/header";

withDefaults(defineProps<ModalHeaderProps>(), {
  title: "",
  tipMessage: "",
});
</script>

<template>
  <div class="flex items-center">
    <div class="font-500">{{ title }}</div>
    <NTooltip v-if="tipMessage" placement="bottom" trigger="hover">
      <template #trigger>
        <icon-material-symbols-help-outline class="text-20px ml-2px cursor-pointer title-tips-icon" />
      </template>
      <span>{{ tipMessage }}</span>
    </NTooltip>
  </div>
</template>

<style scoped lang="scss">
.title-tips-icon {
  color: #666666;
}

.dark .title-tips-icon {
  color: #ffffff;
}
</style>
