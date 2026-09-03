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
    time: '2026-09-01 10:00:00'
  },
  {
    title: '关于中秋节和国庆节放假的通知',
    content:
      '为了感谢大家的努力工作，特决定中秋节和国庆节一起放假13天，具体时间为：2026年9月25日至10月7日。',
    time: '2026-09-01 10:00:00'
  }
]);
const todoNoticeList = ref([]);
</script>

<template>
  <div class="message-notice">
    <NTabs v-model:active="activeTab" type="line" size="small" animated>
      <NTabPane name="notice" tab="通知">
        <NList>
          <NListItem v-for="item in messageNoticeList" :key="item.title">
            <NThing :description="item.content">
              <template #header>
                <div class="w-full flex-y-center justify-between">
                  <div
                    class="flex-center flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
                  >
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
      </NTabPane>
      <NTabPane name="message" tab="消息"></NTabPane>
      <NTabPane name="todo" tab="待办"></NTabPane>
    </NTabs>
  </div>
</template>

<style scoped lang="scss"></style>
