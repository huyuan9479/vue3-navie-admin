<script setup lang="ts">
import { computed } from "vue";
import type { PopoverPlacement } from "naive-ui";
import { $t } from "@/locales";

defineOptions({ name: "ThemeSchemaSwitch" });

interface Props {
  /** Theme schema */
  themeSchema: UnionKey.ThemeScheme;
  /** Show tooltip */
  showTooltip?: boolean;
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: "bottom",
});

interface Emits {
  (e: "switch", event: MouseEvent): void;
}

const emit = defineEmits<Emits>();

function handleSwitch(event: MouseEvent) {
  emit("switch", event);
}

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: "material-symbols:sunny-outline-rounded",
  dark: "material-symbols:dark-mode-outline-rounded",
};

const icon = computed(() => icons[props.themeSchema]);

const tooltipContent = computed(() => {
  if (!props.showTooltip) return "";

  return $t("icon.themeSchema");
});
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleSwitch"
  />
</template>

<style scoped></style>
