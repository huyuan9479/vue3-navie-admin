<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'ProjectNews'
});

interface NewsItem {
  id: number;
  content: string;
  time: string;
}

const newses = computed<NewsItem[]>(() => [
  {
    id: 1,
    content: $t('page.home.projectNews.desc1'),
    time: '2021-05-28 22:22:22'
  },
  {
    id: 2,
    content: $t('page.home.projectNews.desc2'),
    time: '2021-10-27 10:24:54'
  },
  {
    id: 3,
    content: $t('page.home.projectNews.desc3'),
    time: '2021-10-31 22:43:12'
  },
  {
    id: 4,
    content: $t('page.home.projectNews.desc4'),
    time: '2021-11-03 20:33:31'
  },
  {
    id: 5,
    content: $t('page.home.projectNews.desc5'),
    time: '2021-11-07 22:45:32'
  }
]);
</script>

<template>
  <NCard
    :title="$t('page.home.projectNews.title')"
    :bordered="false"
    size="small"
    segmented
    class="shadow-sm"
  >
    <template #header-extra>
      <a class="text-primary" href="javascript:;">
        {{ $t('page.home.projectNews.moreNews') }}
      </a>
    </template>
    <NList>
      <NListItem v-for="item in newses" :key="item.id" class="!py-8px">
        <div class="flex flex-col gap-6px pl-4px">
          <p
            class="text-14px font-medium leading-relaxed text-neutral-800 dark:text-neutral-200"
          >
            {{ item.content }}
          </p>
          <span class="text-12px text-neutral-400 dark:text-neutral-500">
            {{ item.time }}
          </span>
        </div>
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
