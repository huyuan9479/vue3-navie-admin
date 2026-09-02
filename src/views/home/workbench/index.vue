<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import HeaderBanner from './components/HeaderBanner.vue';
import CardData from './components/CardData.vue';
import LineChart from './components/LineChart.vue';
import PieChart from './components/PieChart.vue';
import ProjectNews from './components/ProjectNews.vue';
import CreativityBanner from './components/CreativityBanner.vue';
import QuickFunctions from './components/QuickFunctions.vue';
import MessageNotice from './components/MessageNotice.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 10));
</script>

<template>
  <NSpace vertical :size="10">
    <HeaderBanner />
    <CardData />
    <NGrid :x-gap="gap" :y-gap="10" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" class="card-wrapper">
          <MessageNotice />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard
          title="快捷功能"
          :bordered="false"
          size="small"
          :segmented="{
            content: true
          }"
          class="shadow-sm"
        >
          <QuickFunctions />
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="10" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" class="card-wrapper">
          <LineChart />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" class="card-wrapper">
          <PieChart />
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
