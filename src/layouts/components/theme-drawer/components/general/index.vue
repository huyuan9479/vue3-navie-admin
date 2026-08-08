<script setup lang="ts">
import GlobalSettings from './components/GlobalSettings.vue';
import WatermarkSettings from './components/WatermarkSettings.vue';

defineOptions({
  name: 'GeneralSettings'
});
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <GlobalSettings />
    <WatermarkSettings />
  </div>
</template>

<style scoped></style>
