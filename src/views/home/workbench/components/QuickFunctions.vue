<script lang="ts" setup>
import { ref } from 'vue';

const functionList = ref([
  { title: '项目管理', icon: 'data-log' },
  { title: '角色管理', icon: 'role' },
  { title: '菜单管理', icon: 'menu' },
  { title: '组织管理', icon: 'organization' },
  { title: '评估分析', icon: 'evaluation' },
  { title: '权限管理', icon: 'up-guide' }
]);
</script>

<template>
  <NGrid cols="3 s:3 m:3 l:4 xl:5 2xl:5" responsive="screen" x-gap="12px" y-gap="12px">
    <NGridItem v-for="item in functionList" :key="item.title">
      <div class="function-item">
        <SvgIcon :local-icon="item.icon" class="text-32px" />
        <div class="mt-2">{{ item.title }}</div>
      </div>
    </NGridItem>
  </NGrid>
</template>

<style scoped lang="scss">
.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--n-border-color);
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.function-item:hover {
  border-color: rgb(var(--primary-color));
}
</style>
