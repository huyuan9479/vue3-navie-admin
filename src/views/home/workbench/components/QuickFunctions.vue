<script lang="ts" setup>
import { ref } from 'vue';

const functionList = ref([
  { title: '项目管理', icon: 'data-log' },
  { title: '角色管理', icon: 'role' },
  { title: '菜单管理', icon: 'menu' },
  { title: '组织管理', icon: 'organization' },
  { title: '评估分析', icon: 'evaluation' },
  { title: '场景向导', icon: 'up-guide' }
]);
</script>

<template>
  <NGrid cols="3" x-gap="12px" y-gap="12px">
    <NGridItem v-for="item in functionList" :key="item.title">
      <div class="function-item">
        <SvgIcon :local-icon="item.icon" class="text-36px" />
        <div class="mt-2">{{ item.title }}</div>
      </div>
    </NGridItem>
  </NGrid>
</template>

<style scoped lang="scss">
.function-item {
  @apply flex-col-center border border-solid border-gray-200 rounded-md p-3;
}
</style>
