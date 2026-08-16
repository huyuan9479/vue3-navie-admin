<script setup lang="ts">
import { ref, reactive, watch, toRaw, unref } from 'vue';
import { useTableContext } from '../hooks/table-context';
import { cloneDeep } from 'lodash-es';
import Draggable from 'vuedraggable';
import { useThemeStore } from '@/store/modules/theme';
import type { BasicColumn } from '../types/table';

interface Options {
  title: string;
  key: string;
  fixed?: boolean | 'left' | 'right';
}

const { darkMode } = useThemeStore();
const table: any = useTableContext();
const columnsList = ref<Options[]>([]);
const cacheColumnsList = ref<Options[]>([]);

const state = reactive<{
  selection: boolean;
  checkAll: boolean;
  checkList: string[];
  defaultCheckList: string[];
}>({
  selection: false,
  checkAll: true,
  checkList: [],
  defaultCheckList: []
});

const initialized = ref(false);
// 避免每次列变化都重置 checkList
watch(
  () => table.getColumns(),
  columns => {
    if (columns.length && !initialized.value) {
      init();
      initialized.value = true;
    }
  },
  { immediate: true }
);

//初始化
function init() {
  const columns: any[] = getColumns();
  const checkList: any = columns.map(item => item.key);
  state.checkList = checkList;
  state.defaultCheckList = checkList;
  columnsList.value = cloneDeep(columns);
  cacheColumnsList.value = cloneDeep(columns);
}

function onChange(checkList: any[]) {
  setColumns(checkList);
}

//设置
function setColumns(columns: BasicColumn[] | string[]) {
  table.setColumns(columns);
}

//获取
function getColumns() {
  const newRet: any[] = [];
  table.getColumns().forEach((item: BasicColumn) => {
    newRet.push({ ...item });
  });
  return newRet;
}

//重置
function resetColumns() {
  state.checkList = [...state.defaultCheckList];
  state.checkAll = true;
  const cacheColumnsKeys: any[] = cacheColumnsList.value;
  const newColumns = cacheColumnsKeys.map(item => {
    return {
      ...item,
      fixed: item.fixed || undefined
    };
  });
  setColumns(newColumns);
  columnsList.value = newColumns;
}

//全选
function onCheckAll(e: boolean) {
  const checkList = table.getCacheColumns(true);
  if (e) {
    setColumns(checkList as BasicColumn[]);
    state.checkList = checkList;
  } else {
    setColumns([]);
    state.checkList = [];
  }
}

function onMove(e: any) {
  if (e.draggedContext.element.draggable === false) return false;
  return true;
}

//拖拽排序
function draggableEnd() {
  const newColumns = toRaw(unref(columnsList));
  columnsList.value = newColumns;
  setColumns(newColumns as BasicColumn[]);
}

//固定
function fixedColumn(item: BasicColumn, fixed: boolean | 'left' | 'right' | undefined) {
  if (!state.checkList.includes(item.key as string)) return;
  const columns = getColumns();
  const isFixed = item.fixed === fixed ? undefined : fixed;
  const index = columns.findIndex(res => res.key === item.key);
  if (index !== -1) {
    columns[index].fixed = isFixed;
  }
  table.setCacheColumnsField(item.key, { fixed: isFixed });
  const columnsListIndex = columnsList.value.findIndex(res => res.key === item.key);
  if (columnsListIndex !== -1) {
    columnsList.value[columnsListIndex].fixed = isFixed;
  }
  setColumns(columns);
}
</script>

<template>
  <NTooltip trigger="hover" class="column-setting">
    <template #trigger>
      <div class="cursor-pointer">
        <NPopover trigger="click" :width="240" placement="bottom-end" :content-style="{ padding: '0' }">
          <template #trigger>
            <NButton secondary circle size="small">
              <template #icon>
                <icon-mdi:view-grid-outline class="text-#666" />
              </template>
            </NButton>
          </template>
          <template #header>
            <div>
              <NSpace justify="space-between">
                <NCheckbox v-model:checked="state.checkAll" class="ml-4px" @update:checked="onCheckAll">
                  列展示
                </NCheckbox>
                <NButton text type="info" size="small" class="mt-1" @click="resetColumns">重置</NButton>
              </NSpace>
            </div>
          </template>
          <template #default>
            <div class="column-setting-content">
              <NCheckboxGroup v-model:value="state.checkList" @update:value="onChange">
                <Draggable
                  v-model="columnsList"
                  :animation="300"
                  item-key="key"
                  filter=".no-draggable"
                  :move="onMove"
                  @end="draggableEnd"
                >
                  <template #item="{ element }">
                    <div
                      class="column-setting-content-checkbox"
                      :class="{
                        'column-setting-content-checkbox-dark': darkMode === true,
                        'no-draggable': !state.checkList.includes(element.key)
                      }"
                    >
                      <NCheckbox :value="element.key" :label="element.title" />
                      <div class="fixed-item">
                        <NSpace size="small">
                          <span
                            class="drag-icon"
                            :class="{ 'drag-icon-disabled': !state.checkList.includes(element.key) }"
                          >
                            <icon-ant-design-drag-outlined class="text-18px" />
                          </span>
                          <NTooltip trigger="hover" placement="bottom" :content-style="{ padding: '0' }">
                            <template #trigger>
                              <NIcon
                                size="18"
                                :color="element.fixed === 'left' ? '#2080f0' : undefined"
                                class="cursor-pointer"
                                :class="{ 'fixed-icon-disabled': !state.checkList.includes(element.key) }"
                                @click="fixedColumn(element, 'left')"
                              >
                                <icon-ant-design-vertical-right-outlined class="text-18px" />
                              </NIcon>
                            </template>
                            <span>固定到左侧</span>
                          </NTooltip>
                          <NTooltip trigger="hover" placement="bottom" :content-style="{ padding: '0' }">
                            <template #trigger>
                              <NIcon
                                size="18"
                                :color="element.fixed === 'right' ? '#2080f0' : undefined"
                                class="cursor-pointer"
                                :class="{ 'fixed-icon-disabled': !state.checkList.includes(element.key) }"
                                @click="fixedColumn(element, 'right')"
                              >
                                <icon-ant-design-vertical-left-outlined class="text-18px" />
                              </NIcon>
                            </template>
                            <span>固定到右侧</span>
                          </NTooltip>
                        </NSpace>
                      </div>
                    </div>
                  </template>
                </Draggable>
              </NCheckboxGroup>
            </div>
          </template>
        </NPopover>
      </div>
    </template>
    <span>列设置</span>
  </NTooltip>
</template>

<style lang="scss" scoped>
.column-setting-content {
  padding: 12px;
  max-height: 300px;
  overflow: auto;
  &-checkbox {
    display: flex;
    align-items: center;
    padding: 6px 4px;

    &:hover {
      background: #e6f7ff;
      border-radius: 4px;
    }

    .drag-icon {
      display: inline-flex;
      margin-right: 8px;
      cursor: move;
      &-hidden {
        visibility: hidden;
        cursor: default;
      }
      &-disabled {
        color: #999;
        cursor: not-allowed;
      }
    }

    .fixed-icon-disabled {
      color: #999;
      cursor: not-allowed;
    }

    .fixed-item {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-left: auto;
    }

    .ant-checkbox-wrapper {
      flex: 1;

      &:hover {
        color: #1890ff !important;
      }
    }
  }

  &-checkbox-dark {
    &:hover {
      background: hsla(0, 0%, 100%, 0.08);
    }
  }
}

.dark {
  .column-setting-content {
    &-checkbox {
      &:hover {
        background: hsla(0, 0%, 100%, 0.08);
        border-radius: 4px;
      }
    }
  }
}
</style>
