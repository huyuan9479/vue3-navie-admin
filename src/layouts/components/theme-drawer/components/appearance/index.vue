<script setup lang="ts">
import ThemeSchema from "./components/ThemeSchema.vue";
import ThemeColor from "./components/ThemeColor.vue";
import ThemeRadius from "./components/ThemeRadius.vue";

defineOptions({
  name: "AppearanceSettings"
});
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <ThemeSchema />
    <ThemeColor />
    <ThemeRadius />
  </div>
</template>

<style scoped></style>
