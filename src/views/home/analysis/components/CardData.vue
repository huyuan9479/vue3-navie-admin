<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'CardData'
});

interface CardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  icon: string;
  period: string;
  periodType: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default';
  percent1: number;
  percent2: number;
}

const cardData = computed<CardData[]>(() => [
  {
    key: 'visitCount',
    title: $t('page.home.visitCount'),
    value: 6000,
    unit: '',
    icon: 'visit',
    period: '日',
    periodType: 'primary',
    percent1: 16.2,
    percent2: -7.2
  },
  {
    key: 'turnover',
    title: $t('page.home.turnover'),
    value: 36126,
    unit: '￥',
    icon: 'trans-amount',
    period: '日',
    periodType: 'error',
    percent1: 12,
    percent2: 6
  },
  {
    key: 'downloadCount',
    title: $t('page.home.downloadCount'),
    value: 97098,
    unit: '',
    icon: 'download-volume',
    period: '月',
    periodType: 'success',
    percent1: -10.1,
    percent2: -18
  },
  {
    key: 'dealCount',
    title: $t('page.home.dealCount'),
    value: 868,
    unit: '',
    icon: 'trans-volume',
    period: '日',
    periodType: 'warning',
    percent1: 5.6,
    percent2: -1.2
  }
]);
</script>

<template>
  <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="10" :y-gap="10">
    <NGi v-for="item in cardData" :key="item.key">
      <NCard
        :bordered="false"
        :title="item.title"
        segmented
        size="small"
        class="shadow-sm"
      >
        <template #header-extra>
          <NTag :type="item.periodType" size="small">{{ item.period }}</NTag>
        </template>
        <div class="flex-y-center justify-between">
          <SvgIcon :local-icon="item.icon" class="text-32px" />
          <CountTo
            :prefix="item.unit"
            :start-value="1"
            :end-value="item.value"
            class="text-26px dark:text-dark"
          />
        </div>
        <template #footer>
          <div class="flex-y-center justify-between">
            <div class="flex-y-center">
              日同比
              <span
                class="flex-y-center"
                :class="{
                  'text-success': item.percent1 > 0,
                  'text-error': item.percent1 < 0
                }"
              >
                {{ item.percent1 }}%
                <span>
                  <SvgIcon
                    :icon="
                      item.percent1 > 0
                        ? 'mdi:arrow-up-thin'
                        : 'mdi:arrow-down-thin'
                    "
                    class="text-16px"
                  />
                </span>
              </span>
            </div>
            <div class="flex-y-center">
              月同比
              <span
                class="flex-y-center"
                :class="{
                  'text-success': item.percent2 > 0,
                  'text-error': item.percent2 < 0
                }"
              >
                {{ item.percent2 }}%
                <span>
                  <SvgIcon
                    :icon="
                      item.percent2 > 0
                        ? 'mdi:arrow-up-thin'
                        : 'mdi:arrow-down-thin'
                    "
                    class="text-16px"
                  />
                </span>
              </span>
            </div>
          </div>
        </template>
      </NCard>
    </NGi>
  </NGrid>
</template>

<style scoped></style>
