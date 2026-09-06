<script lang="ts" setup>
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import CardData from './components/CardData.vue';
import PieChart from './components/PieChart.vue';
import LineChart from './components/LineChart.vue';
import TransAmount from './components/TransAmount.vue';
import TransVolume from './components/TransVolume.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 10));
</script>

<template>
  <NSpace vertical :size="10">
    <CardData />
    <NGrid :x-gap="gap" :y-gap="10" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <LineChart />
      </NGi>
      <NGi span="24 s:24 m:10">
        <PieChart />
      </NGi>
    </NGrid>
    <NCard :bordered="false" segmented size="small" class="shadow-sm">
      <NTabs type="line">
        <NTabPane name="transAmount" :tab="$t('page.home.turnover')">
          <TransAmount />
        </NTabPane>
        <NTabPane name="transVolume" :tab="$t('page.home.dealCount')">
          <TransVolume />
        </NTabPane>
      </NTabs>
    </NCard>
  </NSpace>
</template>
