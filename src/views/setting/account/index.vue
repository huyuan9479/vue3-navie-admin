<script lang="ts" setup>
import { reactive, computed } from 'vue';
import BasicInfo from './components/BasicInfo.vue';
import SafetySetting from './components/SafetySetting.vue';
import ModifyPassword from './components/ModifyPassword.vue';

const typeTabList = [
  {
    name: '基本设置',
    desc: '个人账户信息设置',
    key: 1
  },
  {
    name: '安全设置',
    desc: '密码，邮箱等设置',
    key: 2
  },
  {
    name: '修改密码',
    desc: '修改登录密码',
    key: 3
  }
];

const state = reactive({
  type: 1
});

const componentMap = {
  1: BasicInfo,
  2: SafetySetting,
  3: ModifyPassword
};

const currentComponent = computed(
  () => componentMap[state.type as keyof typeof componentMap]
);

function switchType(e: any) {
  state.type = e.key;
}
</script>

<template>
  <div>
    <NGrid :x-gap="10" class="h-full">
      <NGridItem span="6">
        <NCard :bordered="false" size="small" class="h-full">
          <div class="flex-col justify-center items-center mb-4">
            <NAvatar
              round
              :size="100"
              src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
            />
            <div class="flex justify-center mt-3">
              <NUpload
                action="#"
                accept=".jpg,.png,.jpeg"
                :max="1"
                :show-file-list="false"
              >
                <NButton size="small">修改头像</NButton>
              </NUpload>
            </div>
          </div>
          <NThing
            v-for="item in typeTabList"
            :key="item.key"
            class="thing-cell"
            :class="{ 'thing-cell-on': state.type === item.key }"
            @click="switchType(item)"
          >
            <template #header>{{ item.name }}</template>

            <template #description>
              <span
                class="text-12px"
                :class="{ 'text-gray-400': state.type !== item.key }"
              >
                {{ item.desc }}
              </span>
            </template>
          </NThing>
        </NCard>
      </NGridItem>
      <NGridItem span="18">
        <NCard :bordered="false" size="small" class="h-full">
          <component :is="currentComponent" />
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style lang="scss" scoped>
.thing-cell {
  margin: 0 -10px 6px;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #f3f3f3;
    cursor: pointer;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.thing-cell-on {
  background: #f0faff;
  color: rgb(var(--primary-color));

  ::v-deep(.n-thing-main .n-thing-header .n-thing-header__title) {
    color: rgb(var(--primary-color));
  }

  &:hover {
    background: #f0faff;
  }
}
</style>
