<script lang="ts" setup>
import { useEcharts } from '@/hooks/common/echarts';
import dayjs from 'dayjs';

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        width: 1,
        color: '#019680'
      }
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [] as string[],
    splitLine: {
      show: true,
      lineStyle: {
        width: 1,
        type: 'solid',
        color: 'rgba(226,226,226,0.5)'
      }
    },
    axisTick: {
      show: false
    }
  },
  yAxis: [
    {
      type: 'value',
      max: 80000,
      splitNumber: 4,
      axisTick: {
        show: false
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(255,255,255,0.2)', 'rgba(226,226,226,0.2)']
        }
      }
    }
  ],
  grid: { left: 40, right: 20, top: '2%', bottom: 30 },
  series: [
    {
      smooth: true,
      data: [] as number[],
      type: 'line',
      areaStyle: {},
      itemStyle: {
        color: '#5da8ff'
      }
    },
    {
      smooth: true,
      data: [] as number[],
      type: 'line',
      areaStyle: {},
      itemStyle: {
        color: '#fedc69'
      }
    }
  ]
}));

async function mockData() {
  // 模拟接口数据加载
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  updateOptions(opts => {
    const days = dayjs().daysInMonth();

    // 1. 动态生成 1 ~ days 号的 X 轴坐标
    opts.xAxis.data = Array.from({ length: days }, (_, i) => `${i + 1}日`);

    // 2. 动态生成与当月天数完美匹配的、波动逼真的第一条折线数据（销售额）
    opts.series[0].data = Array.from({ length: days }, (_, i) => {
      const base = Math.sin((i / days) * Math.PI) * 45000; // 形成一个中间高两头低的完美主拱
      const randomNoise = Math.random() * 8000; // 加上每日细节波动
      return Math.round(Math.max(3000, base + randomNoise + 15000));
    });

    // 3. 动态生成与当月天数完美匹配的第二条折线数据（交易量）
    opts.series[1].data = Array.from({ length: days }, (_, i) => {
      const base = Math.cos((i / days) * Math.PI * 1.5) * 20000; // 形成差异化波段
      const randomNoise = Math.random() * 6000;
      return Math.round(Math.max(1000, base + randomNoise + 20000));
    });

    return opts;
  });
}

async function init() {
  mockData();
}

init();
</script>

<template>
  <div ref="domRef" class="h-360px overflow-hidden"></div>
</template>
