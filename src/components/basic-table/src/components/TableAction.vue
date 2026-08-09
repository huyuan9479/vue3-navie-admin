<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, computed, toRaw } from 'vue';
import type { ActionItem } from '../types/tableAction';
import { usePermission } from '@/hooks/common/permission';
import { isBoolean, isFunction } from '@/utils/is';
// import { DownOutlined } from '@vicons/antd';

export default defineComponent({
  name: 'TableAction',
  // components: { DownOutlined },
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
      required: true
    },
    dropDownActions: {
      type: Array as PropType<ActionItem[]>,
      default: null
    },
    style: {
      type: String as PropType<string>,
      default: 'button'
    },
    select: {
      type: Function as PropType<Function>,
      default: () => {}
    }
  },
  setup(props) {
    const { hasPermission } = usePermission();

    const actionType = props.style === 'button' ? 'default' : props.style === 'text' ? 'primary' : 'default';
    const actionText = props.style === 'button' ? undefined : props.style === 'text' ? true : undefined;

    const getMoreProps = computed(() => {
      return {
        text: actionText,
        type: actionType,
        size: 'small'
      };
    });

    const getDropdownList = computed(() => {
      return (toRaw(props.dropDownActions) || [])
        .filter(action => {
          return hasPermission(action.auth as string[]) && isIfShow(action);
        })
        .map(action => {
          const { popConfirm } = action;
          return {
            size: 'small',
            text: actionText,
            type: actionType,
            ...action,
            ...popConfirm,
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel
          };
        });
    });

    function isIfShow(action: ActionItem): boolean {
      const ifShow = action.ifShow;

      let isIfShow = true;

      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(action);
      }
      return isIfShow;
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
            size: 'small',
            text: actionText,
            type: actionType,
            ...action,
            ...popConfirm,
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel,
            enable: !!popConfirm
          };
        });
    });

    return {
      getActions,
      getDropdownList,
      getMoreProps
    };
  }
});
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
