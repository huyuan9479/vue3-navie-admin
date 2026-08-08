<script lang="ts" setup>
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'MenuToggler' });

interface Props {
  /** Show collapsed icon */
  collapsed?: boolean;
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  arrowIcon: false,
  zIndex: 98
});

const icon = computed(() => {
  const icons: Record<number, string> = {
    0: 'ant-design:menu-fold-outlined',
    1: 'ant-design:menu-unfold-outlined'
  };
  const collapsed = Number(props.collapsed || false);
  return icons[collapsed];
});
</script>

<template>
  <ButtonIcon
    :key="String(collapsed)"
    :tooltip-content="collapsed ? $t('icon.expand') : $t('icon.collapse')"
    tooltip-placement="bottom-start"
    :z-index="zIndex"
  >
    <SvgIcon :icon="icon" class="text-20px" />
  </ButtonIcon>
</template>

<style scoped></style>
