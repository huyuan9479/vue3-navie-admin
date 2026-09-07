<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useMessage } from 'naive-ui';

defineOptions({
  name: 'SystemNotice'
});

const message = useMessage();

// 消息项数据结构
interface NoticeItem {
  id: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
  type: 'notice' | 'message'; // notice - 消息/通知, message - 私信
  icon?: string; // 仅 notice 使用
  iconColor?: string; // 仅 notice 使用
  sender?: string; // 仅 message 使用
  avatar?: string; // 仅 message 使用
}

// 模拟数据源
const listData = ref<NoticeItem[]>([
  // 通知类 (Notice)
  {
    id: '1',
    title: '系统版本升级公告 🚀',
    content:
      '为了提供更优质的服务，系统预计将于本周日凌晨 2:00 - 4:00 进行例行架构升级，届时部分服务可能会有短暂波动，感谢您的理解与支持。',
    time: '2026-09-05 14:30',
    read: false,
    type: 'notice',
    icon: 'mdi:cloud-upload-outline',
    iconColor: '#2080f0'
  },
  {
    id: '2',
    title: '安全登录异地提醒 ⚠️',
    content:
      '检测到您的账号于今日 11:15 在 [上海市] 进行了登录。如果这是您本人操作，请忽略此消息；若非本人，请立刻前往个人中心修改密码。',
    time: '2026-09-05 11:20',
    read: false,
    type: 'notice',
    icon: 'mdi:shield-alert-outline',
    iconColor: '#f0a020'
  },
  {
    id: '3',
    title: '实名认证审核通过 ✅',
    content:
      '恭喜！您的企业实名认证申请已于刚刚审核通过。现在您已解锁平台全部高级功能，可以前往工作台创建您的第一个微服务项目了。',
    time: '2026-09-04 18:00',
    read: false,
    type: 'notice',
    icon: 'mdi:check-circle-outline',
    iconColor: '#18a058'
  },
  {
    id: '4',
    title: '平台七周年充值福利活动 🎁',
    content:
      '值此平台 7 周年之际，限时推出“充值返现”尊享福利！最高可享 20% 返现，并额外赠送 1000 次 API 调用额度，抓紧时间参与吧。',
    time: '2026-09-03 09:00',
    read: true,
    type: 'notice',
    icon: 'mdi:gift-outline',
    iconColor: '#d03050'
  },
  {
    id: '5',
    title: '数据库存储空间不足警告 💾',
    content:
      '您当前主数据库的存储空间使用率已达到 87%。为了避免影响线上正常业务写入，建议您及时扩容磁盘容量。',
    time: '2026-09-02 16:45',
    read: true,
    type: 'notice',
    icon: 'mdi:database-alert-outline',
    iconColor: '#f0a020'
  },

  // 私信类 (Message)
  {
    id: '6',
    title: '前端架构师 - 李工',
    content:
      '嗨，昨天我把 `@fullcalendar/vue3` 万年历组件以及 ECharts 双重系列重构提交了，现在可以在 workbench 模块进行本地联调，有空帮我 review 一下代码呗。',
    time: '2026-09-05 10:15',
    read: false,
    type: 'message',
    sender: '李工',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix'
  },
  {
    id: '7',
    title: '产品经理 - 麦克',
    content:
      '对于“修改密码的5级强度进度条”以及“消息通知中心分页”的新增需求，我已经在蓝湖上更新了最新一版交互设计稿。咱们周一早会过一下进度。',
    time: '2026-09-04 15:40',
    read: true,
    type: 'message',
    sender: '麦克',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Max'
  },
  {
    id: '8',
    title: '安全审计专家 - 肖老师',
    content:
      '您好，我们对本系统的 `v-perm` 细粒度按钮权限以及 `router.guard` 守卫进行了一波代码审计，没有发现越权和漏洞风险，整体架构设计的非常棒，给个大大的赞！',
    time: '2026-09-03 14:10',
    read: true,
    type: 'message',
    sender: '肖老师',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack'
  }
]);

// 当前激活的 Tab：notice(通知) 或 message(消息)
const activeTab = ref<'notice' | 'message'>('notice');

// 分页相关状态
const currentPage = ref(1);
const pageSize = 5;

// 切换 Tab 时重置页码到第 1 页
function handleTabChange() {
  currentPage.value = 1;
}

// 过滤出当前分类的全部数据
const currentCategoryList = computed(() => {
  return listData.value.filter(item => item.type === activeTab.value);
});

// 计算当前分类下未读的数量（用来做顶部的角标和快捷已读控制）
const unreadNoticeCount = computed(
  () =>
    listData.value.filter(item => item.type === 'notice' && !item.read).length
);
const unreadMessageCount = computed(
  () =>
    listData.value.filter(item => item.type === 'message' && !item.read).length
);

// 计算所有未读数量
const totalUnreadCount = computed(() => {
  return unreadNoticeCount.value + unreadMessageCount.value;
});

const hasUnreadInActiveTab = computed(() => {
  return currentCategoryList.value.some(item => !item.read);
});

// 根据当前页码截取展示的列表切片
const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return currentCategoryList.value.slice(start, start + pageSize);
});

// 操作 1：标记单条已读
function markAsRead(id: string) {
  const item = listData.value.find(i => i.id === id);
  if (item && !item.read) {
    item.read = true;
    message.success('已标记为已读');
  }
}

// 操作 2：删除单条
function deleteItem(id: string) {
  listData.value = listData.value.filter(i => i.id !== id);
  message.success('删除成功');
  // 如果删除当前页最后一条，导致当前页为空，则自动回退到上一页
  if (pagedList.value.length === 0 && currentPage.value > 1) {
    currentPage.value--;
  }
}

// 操作 3：当前分类一键全部已读
function markAllAsRead() {
  let count = 0;
  listData.value.forEach(item => {
    if (item.type === activeTab.value && !item.read) {
      item.read = true;
      count++;
    }
  });
  if (count > 0) {
    message.success(`已将 ${count} 条通知标记为已读`);
  }
}

// 操作 4：一键清空当前分类
function clearCurrentCategory() {
  listData.value = listData.value.filter(item => item.type !== activeTab.value);
  currentPage.value = 1;
  message.info('当前分类列表已清空');
}
</script>

<template>
  <div>
    <NCard :bordered="false" class="rounded-8px shadow-sm flex-grow">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-12px pb-12px border-b border-neutral-100 dark:border-neutral-800"
      >
        <!-- 标题 -->
        <div>
          <h2
            class="text-18px font-600 m-0 text-neutral-800 dark:text-neutral-100"
          >
            消息通知中心
          </h2>
          <p class="text-12px text-neutral-400 dark:text-neutral-500 mt-4px">
            您可以在这里查看并管理所有的系统公告、安全预警和同事间的私信消息。
          </p>
        </div>

        <!-- 一键快捷工具栏 -->
        <div class="flex gap-8px">
          <NButton
            size="small"
            secondary
            type="primary"
            :disabled="!hasUnreadInActiveTab"
            @click="markAllAsRead"
          >
            <template #icon>
              <SvgIcon icon="ant-design:mail-outlined" font-size="16" />
            </template>
            全部已读
          </NButton>
          <NButton
            size="small"
            secondary
            type="error"
            :disabled="currentCategoryList.length === 0"
            @click="clearCurrentCategory"
          >
            <template #icon>
              <SvgIcon icon="ant-design:clear-outlined" font-size="16" />
            </template>
            一键清空
          </NButton>
        </div>
      </div>

      <!-- Tabs 栏 -->
      <NTabs
        v-model:value="activeTab"
        type="line"
        animated
        class="mt-16px"
        @update:value="handleTabChange"
      >
        <!-- 通知 Tab -->
        <NTabPane name="notice" tab="系统通知"></NTabPane>
        <!-- 消息 Tab -->
        <NTabPane name="message" tab="私信消息"></NTabPane>
      </NTabs>
      <div class="mb-3">共 {{ totalUnreadCount }} 条消息未读</div>
      <!-- 消息主列表 -->
      <div v-if="pagedList.length > 0" class="flex flex-col gap-12px">
        <div
          v-for="item in pagedList"
          :key="item.id"
          class="notice-item flex gap-16px p-16px rounded-8px border border-neutral-100 dark:border-neutral-800 transition-all duration-300 hover:shadow-sm"
          :class="[
            !item.read
              ? 'bg-primary-5/4 dark:bg-primary-5/1 border-primary/20'
              : 'bg-white dark:bg-neutral-900'
          ]"
        >
          <!-- 左侧红/绿点未读指示器 + 图标/头像 -->
          <div class="flex items-center relative">
            <!-- 未读绿点 -->
            <div
              v-if="!item.read"
              class="w-8px h-8px bg-primary rounded-full absolute -top-2px -left-2px animate-ping"
            ></div>
            <div
              v-if="!item.read"
              class="w-8px h-8px bg-primary rounded-full absolute -top-2px -left-2px"
            ></div>

            <!-- 图标/头像槽 -->
            <div
              v-if="item.type === 'notice'"
              class="w-44px h-44px rounded-full flex items-center justify-center bg-neutral-50 dark:bg-neutral-800"
            >
              <SvgIcon
                :icon="item.icon || 'mdi:bell-outline'"
                :style="{ color: item.iconColor }"
                class="text-22px"
              />
            </div>
            <img
              v-else
              :src="item.avatar"
              :alt="item.sender"
              class="w-44px h-44px rounded-full object-cover border border-neutral-200 dark:border-neutral-700 bg-neutral-100"
            />
          </div>

          <!-- 中间内容区域 -->
          <div class="flex-grow min-w-0">
            <div class="flex justify-between items-center">
              <h4
                class="text-15px font-600 m-0 truncate text-neutral-800 dark:text-neutral-100"
                :class="{ 'font-bold': !item.read }"
              >
                {{ item.title }}
              </h4>
              <span
                class="text-12px text-neutral-400 dark:text-neutral-500 whitespace-nowrap ml-12px"
              >
                {{ item.time }}
              </span>
            </div>
            <p
              class="text-13px text-neutral-500 dark:text-neutral-400 mt-6px mb-0 leading-relaxed break-all"
            >
              {{ item.content }}
            </p>
          </div>

          <!-- 右侧操作选项 -->
          <div class="flex flex-col justify-between items-end gap-10px">
            <div class="flex gap-8px">
              <NButton
                v-if="!item.read"
                size="tiny"
                quaternary
                type="primary"
                @click="markAsRead(item.id)"
              >
                已读
              </NButton>
              <NButton
                size="tiny"
                quaternary
                type="error"
                @click="deleteItem(item.id)"
              >
                删除
              </NButton>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态占位 -->
      <div v-else class="py-60px flex justify-center items-center">
        <NEmpty description="恭喜！当前没有任何未处理的新消息 ~" size="huge" />
      </div>

      <!-- 底部自适应分页区 -->
      <div
        v-if="currentCategoryList.length > pageSize"
        class="flex justify-end mt-24px"
      >
        <NPagination
          v-model:page="currentPage"
          :page-size="pageSize"
          :item-count="currentCategoryList.length"
          show-size-picker
          :page-sizes="[5, 10]"
          size="medium"
        />
      </div>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
/* 未读条目会有轻微的左侧绿色微渐变 */
.notice-item {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }
}

/* 契合系统主色微调 Badge 呼吸效果 */
:deep(.n-badge) {
  .n-badge-number {
    font-weight: 600;
  }
}
</style>
