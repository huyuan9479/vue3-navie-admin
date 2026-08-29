<script lang="ts" setup>
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'PinToggler' });

interface Props {
  pin?: boolean;
}

const props = defineProps<Props>();

const icon = computed(() =>
  props.pin ? 'material-symbols:keep' : 'material-symbols:keep-off'
);
</script>

<template>
  <ButtonIcon
    :tooltip-content="pin ? $t('icon.unpin') : $t('icon.pin')"
    tooltip-placement="bottom-start"
    :z-index="100"
  >
    <SvgIcon :icon="icon" />
  </ButtonIcon>
</template>

<style scoped></style>
