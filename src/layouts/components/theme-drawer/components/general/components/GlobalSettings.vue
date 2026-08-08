<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/SettingItem.vue';

defineOptions({
  name: 'GlobalSettings'
});

const themeStore = useThemeStore();
</script>

<template>
  <NCard
    :title="$t('theme.general.title')"
    :segmented="{
      content: true
    }"
    size="small"
  >
    <NSpace vertical :size="[12, 12]">
      <SettingItem :label="$t('theme.general.multilingual.visible')">
        <NSwitch v-model:value="themeStore.header.multilingual.visible" />
      </SettingItem>

      <SettingItem :label="$t('theme.general.globalSearch.visible')">
        <NSwitch v-model:value="themeStore.header.globalSearch.visible" />
      </SettingItem>
    </NSpace>
  </NCard>
</template>

<style scoped>
.setting-list-move,
.setting-list-enter-active,
.setting-list-leave-active {
  --uno: transition-all-300;
}

.setting-list-enter-from,
.setting-list-leave-to {
  --uno: opacity-0 -translate-x-30px;
}

.setting-list-leave-active {
  --uno: absolute;
}
</style>
