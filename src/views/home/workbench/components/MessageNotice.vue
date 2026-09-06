<script lang="ts" setup>
import { ref, computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'MessageNotice'
});

const activeTab = ref('notice');

interface MessageNotice {
  id: number;
  title: string;
  content: string;
  time: string;
}

const noticeList = ref<MessageNotice[]>([
  {
    id: 1,
    title: '关于中秋节和国庆节放假的通知',
    content:
      '为了感谢大家的努力工作，特决定中秋节和国庆节一起放假13天，具体时间为：2026年9月25日至10月7日。',
    time: '2026-09-03 10:00:00'
  },
  {
    id: 2,
    title: '面试通过通知',
    content:
      '您内推的候选人【曲妮妮】已顺利通过第三轮前端开发专家面试，已发送 Offer。',
    time: '2026-09-02 14:00:00'
  },
  {
    id: 3,
    title: '月度报销审批通知',
    content:
      '您有 3 个月度差旅与活动经费报销单需要审批，请及时到工作流中查看。',
    time: '2026-09-01 11:00:00'
  },
  {
    id: 4,
    title: '系统维护公告',
    content:
      '由于机房升级，系统预计将于本周六凌晨 02:00 至 05:00 进行例行维护，届时可能影响访问。',
    time: '2026-08-31 09:30:00'
  }
]);

const messageList = ref<MessageNotice[]>([
  {
    id: 1,
    title: '项目讨论群 - 架构设计分享',
    content:
      '曲妮妮：今天下午 15:00 会在腾讯会议进行前端微服务路由按需加载的经验分享。',
    time: '10:15'
  },
  {
    id: 2,
    title: '人力资源部 - 个人社保确认',
    content:
      '张HR：请大家于本周五前登录个税系统，确认九月份的社保基数申报信息，谢谢配合。',
    time: '09:20'
  },
  {
    id: 3,
    title: '运维报警监控服务',
    content:
      '[WARN] 容器集群 K8s-Node-03 节点 CPU 持续过载 92%，触发扩容伸缩预警机制。',
    time: '昨日'
  }
]);

const messageNoticeList = computed(() => {
  const listMap: Record<string, MessageNotice[]> = {
    notice: noticeList.value,
    message: messageList.value
  };
  return listMap[activeTab.value] || [];
});

const iconName = computed(() => {
  const iconMap: Record<string, string> = {
    notice: 'notice',
    message: 'message'
  };
  return iconMap[activeTab.value] || 'notice';
});
</script>

<template>
  <NCard
    :bordered="false"
    size="small"
    class="h-278px flex flex-col shadow-sm"
    content-class="message-notice"
  >
    <div class="flex-1 flex flex-col overflow-hidden">
      <NTabs
        type="line"
        size="large"
        animated
        @update:value="activeTab = $event"
      >
        <NTabPane name="notice" :tab="$t('page.home.notice')"></NTabPane>
        <NTabPane name="message" :tab="$t('page.home.message')"></NTabPane>
      </NTabs>
      <NScrollbar>
        <div
          v-for="item in messageNoticeList"
          :key="item.id"
          class="message-notice-item"
        >
          <div class="flex-y-center justify-between">
            <div class="flex-y-center flex-1 truncate pr-8px">
              <SvgIcon :local-icon="iconName" class="size-22px! mr-8px" />
              <div class="truncate flex-1 font-medium">
                {{ item.title }}
              </div>
            </div>
            <div class="text-gray-500 text-12px">
              {{ item.time }}
            </div>
          </div>
          <div class="message-content mt-6px text-gray-500">
            {{ item.content }}
          </div>
        </div>
        <div
          v-if="messageNoticeList.length === 0"
          class="h-full flex-center py-40px"
        >
          <NEmpty :description="$t('common.noData')" />
        </div>
      </NScrollbar>
    </div>
  </NCard>
</template>

<style scoped lang="scss">
:deep(.message-notice) {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 0px !important;

  .n-tabs {
    .n-tabs-tab {
      padding: 12px 0 13px !important;
    }
    .n-tab-pane {
      padding: 0 !important;
    }
  }

  .message-notice-item {
    padding: 8px 0;
    border-bottom: 1px solid var(--n-border-color);
    .message-content {
      width: 100%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
