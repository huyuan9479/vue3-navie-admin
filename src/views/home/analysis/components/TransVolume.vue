<script lang="ts" setup>
import { useEcharts } from '@/hooks/common/echarts';

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
  grid: { left: 40, right: 20, top: '2%', bottom: 30 },
  xAxis: {
    type: 'category',
    data: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月'
    ]
  },
  yAxis: {
    type: 'value',
    max: 8000,
    splitNumber: 4
  },
  series: [
    {
      data: [] as number[],
      type: 'bar',
      barMaxWidth: 40,
      itemStyle: {
        // 设置高级绿渐变
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgb(22, 119, 255)' }, // 顶部
            { offset: 1, color: 'rgba(22, 119, 255, 0.5)' } // 底部
          ]
        },
        // 让柱子的顶部带有 4px 的优雅圆角
        borderRadius: [4, 4, 0, 0]
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
    opts.xAxis.data = [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月'
    ];
    opts.series[0].data = [
      3000, 2000, 3333, 5000, 3200, 4200, 3200, 2100, 3000, 5100, 6000, 3200,
      4800
    ];
    return opts;
  });
}

function init() {
  mockData();
}

init();
</script>

<template>
  <div ref="domRef" class="h-360px overflow-hidden"></div>
</template>
