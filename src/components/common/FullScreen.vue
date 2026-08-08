<script setup lang="ts">
import { $t } from "@/locales";

defineOptions({
  name: "FullScreen",
});

interface Props {
  full?: boolean;
}

defineProps<Props>();
</script>

<template>
  <ButtonIcon
    :key="String(full)"
    :tooltip-content="full ? $t('icon.fullscreenExit') : $t('icon.fullscreen')"
  >
    <icon-ant-design-fullscreen-exit v-if="full" />
    <icon-ant-design-fullscreen v-else />
  </ButtonIcon>
</template>

<style scoped></style>
