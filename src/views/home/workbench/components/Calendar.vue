<script setup lang="ts">
import { ref, computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { CalendarOptions } from '@fullcalendar/core';
import zhCnLocale from '@fullcalendar/core/locales/zh-cn';
import { $t } from '@/locales';

defineOptions({
  name: 'Calendar'
});

// 2026 年中国传统节日及法定假节日映射表（保持极轻量，无需引入庞大的农历库）
const holidayMap: Record<string, string> = {
  '2026-01-01': '元旦',
  '2026-02-16': '除夕',
  '2026-02-17': '春节',
  '2026-02-18': '初二',
  '2026-02-19': '初三',
  '2026-03-08': '妇女节',
  '2026-04-05': '清明节',
  '2026-05-01': '劳动节',
  '2026-05-04': '青年节',
  '2026-06-01': '儿童节',
  '2026-06-19': '端午节',
  '2026-09-10': '教师节',
  '2026-09-25': '中秋节',
  '2026-10-01': '国庆节',
  '2026-12-25': '圣诞节'
};

// 模拟的一些有趣的系统日程
const events = ref([
  {
    id: '1',
    title: '🎨 创意灵感脑暴会',
    start: '2026-09-05',
    color: '#18a058'
  },
  {
    id: '2',
    title: '💻 动态路由重构评审',
    start: '2026-09-08',
    color: '#2080f0'
  },
  {
    id: '3',
    title: '🚀 系统中秋活动上线',
    start: '2026-09-25',
    color: '#ff4d4f'
  }
]);

// FullCalendar 配置项，指定严格的 CalendarOptions 类型
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locales: [zhCnLocale], // 1. 载入中文语言包
  locale: 'zh-cn', // 2. 指定当前语言为中文
  editable: true,
  selectable: true,
  showNonCurrentDates: true, // 3. 不展示非当前月份的日期（使其变为空白）
  fixedWeekCount: false, // 4. 关闭强制 6 周，自适应当月周数，使布局更精简
  height: 'parent', // 5. 让日历自动撑满父级容器高度（完美响应式）
  headerToolbar: {
    left: 'title',
    center: '',
    right: 'prev,next today'
  },
  events: events.value,
  // 3. 单元格自定义渲染：在日期下方完美展示节日小字
  dayCellContent: (arg: any) => {
    // 格式化当前单元格日期为 YYYY-MM-DD
    const year = arg.date.getFullYear();
    const month = String(arg.date.getMonth() + 1).padStart(2, '0');
    const day = String(arg.date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const holidayName = holidayMap[dateStr];

    // 剥离出纯数字（如 "15日" 剥离出 "15"）
    const dayNum = arg.dayNumberText.replace('日', '');

    return {
      html: `
        <div class="fc-day-cell-container flex flex-col items-center justify-center leading-none py-2px">
          <span class="fc-day-number-val font-medium text-13px">${dayNum}</span>
          ${holidayName ? `<span class="fc-day-holiday-val text-primary text-10px font-normal scale-90 mt-2px">${holidayName}</span>` : ''}
        </div>
      `
    };
  },
  // 交互回调
  dateClick: (info: any) => {
    window.$message?.info(`您点击了日期: ${info.dateStr}`);
  },
  eventClick: (info: any) => {
    window.$message?.success(`日程: ${info.event.title}`);
  }
}));
</script>

<template>
  <NCard
    :title="$t('page.home.calendar')"
    :bordered="false"
    segmented
    size="small"
    class="h-full shadow-sm"
    content-class="h-full flex flex-col"
  >
    <div class="calendar-wrapper flex-grow overflow-hidden mt-4px">
      <FullCalendar class="h-350px" :options="calendarOptions" />
    </div>
  </NCard>
</template>

<style scoped lang="scss">
:deep(.fc) {
  --fc-border-color: var(--n-border-color, #efeff5);
  --fc-daygrid-event-dot-width: 6px;

  font-family: inherit;
  font-size: 13px;

  /* 汉化和美化头部标题与按钮 */
  .fc-toolbar {
    margin-bottom: 12px !important;

    .fc-toolbar-title {
      font-size: 15px !important;
      font-weight: 600;
      color: var(--n-title-text-color, #333639);
    }
  }

  .fc-button {
    padding: 4px 8px !important;
    font-size: 12px !important;
  }

  /* 自定义按钮样式，契合 Naive UI 绿色调 */
  .fc-button-primary {
    background-color: rgb(var(--primary-color)) !important;
    border-color: rgb(var(--primary-color)) !important;
    color: #fff !important;
    font-weight: 500;
    transition: all 0.3s;

    &:hover {
      background-color: rgb(var(--primary-color)) !important;
      border-color: rgb(var(--primary-color)) !important;
    }

    &:active,
    &:focus {
      background-color: rgb(var(--primary-color) / 0.8) !important;
      border-color: rgb(var(--primary-color) / 0.8) !important;
      box-shadow: none !important;
    }

    &:disabled {
      background-color: #d7f4e4 !important;
      border-color: #d7f4e4 !important;
      color: #a3a3a3 !important;
    }
  }

  /* 今天高亮背景 */
  .fc-day-today {
    background-color: rgb(var(--primary-color) / 0.08) !important;
  }

  /* 调整格子单元高度以适应面板高度 */
  .fc-daygrid-day-frame {
    min-height: 50px !important;
  }

  /* 让日期数字在单元格内水平居中对齐 */
  .fc-daygrid-day-top {
    flex-direction: row !important; /* 覆盖默认的 row-reverse 靠右方向 */
    justify-content: center !important; /* 设置水平居中 */
    padding-top: 4px !important; /* 调整距离格子顶部的间距 */
  }

  .fc-daygrid-day-number {
    width: 100% !important;
    padding: 0 !important;
    text-align: center !important;
    text-decoration: none !important;
    color: inherit !important;
  }

  /* 精致美化中国传统节日小字 */
  .fc-day-holiday-val {
    color: rgb(var(--primary-color)) !important; /* 动态采用系统的绿色主题色 */
    font-size: 10px !important;
    font-weight: 500 !important;
    letter-spacing: -0.5px;
  }

  .fc-theme-standard th,
  .fc-theme-standard td {
    border-color: var(--n-border-color, #efeff5) !important;
  }
}
</style>
