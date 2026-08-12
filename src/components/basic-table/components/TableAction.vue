<script setup lang="ts">
// import type { PropType } from 'vue';
import { computed, toRaw } from 'vue';
import type { ActionItem } from '../types/tableAction';
import { usePermission } from '@/hooks/common/permission';
import { isBoolean, isFunction } from '@/utils/is';
import type { ButtonType } from 'naive-ui/lib';
import type { DropdownMixedOption } from 'naive-ui/lib/dropdown/src/interface';
// import { DownOutlined } from '@vicons/antd';
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
  style: 'button',
  select: () => {}
});
// defineProps<{}>();

// export default defineComponent({
//   name: 'TableAction',
//   // components: { DownOutlined },
//   props: {
//     actions: {
//       type: Array as PropType<ActionItem[]>,
//       default: null,
//       required: true
//     },
//     dropDownActions: {
//       type: Array as PropType<ActionItem[]>,
//       default: null
//     },
//     style: {
//       type: String as PropType<string>,
//       default: 'button'
//     },
//     select: {
//       type: Function as PropType<Function>,
//       default: () => {}
//     }
//   },
//   setup(props) {
const { hasPermission } = usePermission();

const actionType = props.style === 'button' ? 'default' : props.style === 'text' ? 'primary' : 'default';
const actionText = props.style === 'button' ? undefined : props.style === 'text' ? true : undefined;

const getMoreProps = computed(() => {
  return {
    text: actionText,
    type: actionType as ButtonType,
    size: 'small' as const
  };
});

const getDropdownList = computed((): DropdownMixedOption[] => {
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
    }) as DropdownMixedOption[];
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

//     return {
//       getActions,
//       getDropdownList,
//       getMoreProps
//     };
//   }
// });
</script>

<template>
  <div class="tableAction">
    <div class="flex items-center justify-center">
      <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
        <NButton v-bind="action" class="mx-1">
          {{ action.label }}
          <template v-if="action.hasOwnProperty('icon')" #icon>
            <NIcon :component="action.icon" />
          </template>
        </NButton>
      </template>
      <NDropdown
        v-if="dropDownActions && getDropdownList.length"
        trigger="hover"
        :options="getDropdownList"
        @select="select"
      >
        <slot name="more"></slot>
        <NButton v-if="!$slots.more" v-bind="getMoreProps" class="mx-1" icon-placement="right">
          <div class="flex items-center">
            <span>更多</span>
            <NIcon size="14" class="ml-1">
              <DownOutlined />
            </NIcon>
          </div>
          <!--          <template #icon>-->
          <!--            -->
          <!--          </template>-->
        </NButton>
      </NDropdown>
    </div>
  </div>
</template>
