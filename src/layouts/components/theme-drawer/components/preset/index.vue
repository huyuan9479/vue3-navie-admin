<script setup lang="ts">
import ThemePreset from './components/ThemePreset.vue';

defineOptions({
  name: 'PresetSettings'
});
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <ThemePreset />
  </div>
</template>

<style scoped></style>
