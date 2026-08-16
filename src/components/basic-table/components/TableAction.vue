<script setup lang="ts">
import { computed, toRaw } from 'vue';
import type { ActionItem } from '../types/tableAction';
import { usePermission } from '@/hooks/common/permission';
import { isBoolean, isFunction } from '@/utils/is';
import type { ButtonType } from 'naive-ui/lib';
import SvgIcon from '@/components/custom/SvgIcon.vue';

defineOptions({
  name: 'TableAction'
});

interface TableActionProps {
  actions?: ActionItem[];
  dropDownActions?: ActionItem[];
  style?: string;
  select?: (option: { label?: string; key?: string | number; [key: string]: any }) => void;
}

const props = withDefaults(defineProps<TableActionProps>(), {
  actions: undefined,
  dropDownActions: undefined,
  style: 'text',
  select: () => {}
});

const { hasPermission } = usePermission();
const actionType = props.style === 'button' ? 'default' : props.style === 'text' ? 'default' : '';
const actionText = props.style === 'button' ? undefined : props.style === 'text' ? true : undefined;

const getMoreProps = computed(() => {
  return {
    text: actionText,
    type: actionType as ButtonType,
    size: 'small' as const
  };
});

const getDropdownList = computed((): ActionItem[] => {
  return (toRaw(props.dropDownActions) || [])
    .filter(action => {
      return hasPermission(action.auth as string[]) && isIfShow(action);
    })
    .map(action => {
      const { popConfirm } = action;
      return {
        size: 'small' as const,
        text: actionText,
        type: actionType as ButtonType,
        ...action,
        ...popConfirm,
        onConfirm: popConfirm?.confirm,
        onCancel: popConfirm?.cancel
      };
    }) as ActionItem[];
});

function isIfShow(action: ActionItem): boolean {
  const ifShow = action.ifShow;

  let isShow = true;

  if (isBoolean(ifShow)) {
    isShow = ifShow;
  }
  if (isFunction(ifShow)) {
    isShow = ifShow(action);
  }
  return isShow;
}

const getActions = computed(() => {
  return (toRaw(props.actions) || [])
    .filter(action => {
      return hasPermission(action.auth as string[]) && isIfShow(action);
    })
    .map(action => {
      const { popConfirm } = action;
      //需要展示什么风格，自己修改一下参数
      return {
        size: 'small' as const,
        text: actionText,
        type: actionType as ButtonType,
        ...action,
        ...popConfirm,
        onConfirm: popConfirm?.confirm,
        onCancel: popConfirm?.cancel,
        enable: !!popConfirm
      };
    });
});
</script>

<template>
  <div class="table-action">
    <div class="flex items-center justify-center">
      <NSpace align="center">
        <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
          <NButton v-bind="action" class="action-btn-item flex items-center">
            <template v-if="action.hasOwnProperty('icon')" #icon>
              <SvgIcon :icon="action.icon as string" />
            </template>
            {{ action.label }}
          </NButton>
        </template>

        <NPopover trigger="hover" placement="bottom">
          <template #trigger>
            <div v-if="dropDownActions && getDropdownList.length" class="action-btn-more">
              <slot name="more"></slot>
              <NButton v-if="!$slots.more" v-bind="getMoreProps" icon-placement="right">
                <div class="flex items-center">
                  <span>更多</span>
                  <icon-mdi-chevron-down class="text-20px" />
                </div>
              </NButton>
            </div>
          </template>
          <template #default>
            <NSpace size="small" vertical>
              <NButton
                v-for="(item, index) in getDropdownList"
                :key="`${index}-${item.key}`"
                v-bind="item"
                :text="actionText"
                @click="select(item)"
              >
                <template v-if="item.hasOwnProperty('icon')" #icon>
                  <SvgIcon :icon="item.icon as string" />
                </template>
                {{ item.label }}
              </NButton>
            </NSpace>
          </template>
        </NPopover>
      </NSpace>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-action {
  :deep(.action-btn-item),
  :deep(.action-btn-more) {
    .n-button__icon {
      margin-right: 0;
      margin-left: 0;
      font-size: 17px;
    }
  }
}
</style>
