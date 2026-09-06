<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import HeaderBanner from './components/HeaderBanner.vue';
import ProjectNews from './components/ProjectNews.vue';
import CreativityBanner from './components/Calendar.vue';
import QuickFunctions from './components/QuickFunctions.vue';
import MessageNotice from './components/MessageNotice.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 10));
</script>

<template>
  <NSpace vertical :size="10">
    <HeaderBanner />
    <NGrid :x-gap="gap" :y-gap="10" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <MessageNotice />
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard
          :title="$t('page.home.quickFunctions')"
          :bordered="false"
          size="small"
          segmented
          class="shadow-sm h-278px"
        >
          <QuickFunctions />
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="10" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <ProjectNews />
      </NGi>
      <NGi span="24 s:24 m:10">
        <CreativityBanner />
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
