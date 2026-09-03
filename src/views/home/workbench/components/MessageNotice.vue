<script lang="ts" setup>
import { ref } from 'vue';

const activeTab = ref('notice');

interface MessageNotice {
  title: string;
  content: string;
  time: string;
}
const messageNoticeList = ref<MessageNotice[]>([
  {
    title: '关于中秋节和国庆节放假的通知',
    content:
      '为了感谢大家的努力工作，特决定中秋节和国庆节一起放假13天，具体时间为：2026年9月25日至10月7日。',
    time: '2026-09-03 10:00:00'
  },
  {
    title: '面试通过',
    content:
      '你推荐的 曲妮妮 已通过第三轮面试。',
    time: '2026-09-02 14:00:00'
  },
  {
    title: '审批通知',
    content:
      '你有3个月报需要审批，请及时查看。',
    time: '2026-09-01 11:00:00'
  },
  {
    title: '审批通知',
    content:
      '你有3个月报需要审批，请及时查看。',
    time: '2026-09-01 11:00:00'
  }
]);
const todoNoticeList = ref([]);
</script>

<template>
  <NCard :bordered="false" size="small" class="h-320px" content-class="message-notice-content">
    <div class="flex-1 flex-col overflow-hidden">
      <NTabs v-model:active="activeTab" type="line" size="large" animated>
        <NTabPane name="notice" tab="通知"></NTabPane>
        <NTabPane name="message" tab="消息"></NTabPane>
        <NTabPane name="todo" tab="待办"></NTabPane>
      </NTabs>
      <!-- <div class="flex-1 overflow-auto"> -->
      <NScrollbar>
        <NList>
          <NListItem v-for="item in messageNoticeList" :key="item.title">
            <NThing :description="item.content">
              <template #header>
                <div class="w-full flex-y-center justify-between">
                  <div class="flex-center flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    <SvgIcon local-icon="notice" class="size-22px! mr-6px" />
                    <span>{{ item.title }}</span>
                  </div>
                </div>
              </template>
              <template #header-extra>
                <div class="text-14px color-#999">{{ item.time }}</div>
              </template>
            </NThing>
          </NListItem>
        </NList>
      </NScrollbar>
    </div>
    <!-- </div> -->
  </NCard>
</template>

<style lang="scss">
.message-notice-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 0px !important;

  .n-tabs {
    .n-tabs-tab {
      padding: 12px 0 13px !important;
    }
  }
}
</style>
