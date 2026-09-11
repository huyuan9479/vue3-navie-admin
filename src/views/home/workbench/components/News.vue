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
    content:
      '🚀 恭喜研发部！核心微服务容器弹性架构在 1.2 亿级并发峰值测试中取得圆满成功，荣获年度红点技术创新大奖。',
    time: '今天 10:00'
  },
  {
    id: 2,
    content:
      '💻 为提升前端交付效率，本周三下午 15:00 将在大会议室举办《Vite 8.0 与 UnoCSS 原子化 CSS 最佳工程实践》培训。',
    time: '昨天 18:30'
  },
  {
    id: 3,
    content:
      '🎂 温情时刻：公司为 Q3 入职满 3 周年的核心员工颁发了定制的纪念黄金胸章，并配发 1000 元京东购物卡作为激励。',
    time: '前天 15:00'
  },
  {
    id: 4,
    content:
      '🛡️ 安全升级公告：多因素动态令牌认证（MFA）已全面覆盖公司财务与核心后台数据系统，请相关同学及时绑定激活。',
    time: '上周四 09:15'
  },
  {
    id: 5,
    content:
      '🎑 假期通知：中秋国庆双节连假正式确定为 2026年9月25日 - 10月7日，共 13 天，祝大家假期愉快，阖家团圆！',
    time: '两周前 12:00'
  }
]);
</script>

<template>
  <NCard
    :title="$t('page.home.projectNews.title')"
    :bordered="false"
    size="small"
    segmented
    class="shadow-sm h-full"
  >
    <template #header-extra>
      <a class="text-primary" href="javascript:;">
        {{ $t('page.home.projectNews.moreNews') }}
      </a>
    </template>
    <NScrollbar class="max-h-350px">
      <NList>
        <NListItem v-for="item in newses" :key="item.id" class="!py-12px">
          <div class="flex flex-col gap-6px pl-4px">
            <p
              class="news-content text-14px font-medium leading-relaxed text-neutral-800 dark:text-neutral-200"
            >
              {{ item.content }}
            </p>
            <span class="text-12px text-neutral-400 dark:text-neutral-500">
              {{ item.time }}
            </span>
          </div>
        </NListItem>
      </NList>
    </NScrollbar>
  </NCard>
</template>

<style scoped lang="scss">
/* 统一两行截断，确保各列表项高度视觉均衡，不产生滚动跳动 */
.news-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
