<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';

defineOptions({
  name: 'HeaderBanner'
});

const appStore = useAppStore();
const authStore = useAuthStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

interface StatisticData {
  id: number;
  label: string;
  value: string;
}

const statisticData = computed<StatisticData[]>(() => [
  {
    id: 0,
    label: $t('page.home.projectCount'),
    value: '25'
  },
  {
    id: 1,
    label: $t('page.home.todo'),
    value: '4/16'
  },
  {
    id: 2,
    label: $t('page.home.message'),
    value: '12'
  }
]);
</script>

<template>
  <NCard :bordered="false" size="small" class="shadow-sm">
    <NGrid :x-gap="gap" :y-gap="12" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:18">
        <div class="flex-y-center">
          <div class="size-72px shrink-0 overflow-hidden rd-1/2">
            <img src="@/assets/imgs/user.png" class="size-full" />
          </div>
          <div class="pl-12px">
            <h3 class="text-18px font-semibold py-3px">
              {{
                $t('page.home.greeting', {
                  userName: authStore.userInfo.userName
                })
              }}
            </h3>
            <p class="text-#999 leading-30px line-height-normal py-3px">
              {{ $t('page.home.weatherDesc') }}
            </p>
          </div>
        </div>
      </NGi>
      <NGi span="24 s:24 m:6">
        <NSpace :size="24" justify="end" align="center" class="h-full">
          <NStatistic
            v-for="item in statisticData"
            :key="item.id"
            class="whitespace-nowrap"
          >
            <template #label>
              <div class="text-center py-3px">{{ item.label }}</div>
            </template>
            <template #default>
              <div class="text-center text-22px line-height-5 py-3px">
                {{ item.value }}
              </div>
            </template>
          </NStatistic>
        </NSpace>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
