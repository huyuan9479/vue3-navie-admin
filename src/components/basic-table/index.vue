<script lang="ts" setup>
import { ref, unref, toRaw, computed, onMounted, nextTick } from "vue";
import { createTableContext } from "./hooks/table-context";
import ColumnSetting from "./components/ColumnSetting.vue";
import { useLoading } from "./hooks/loading";
import { useColumns } from "./hooks/columns";
import { useDataSource } from "./hooks/data-source";
import { usePagination } from "./hooks/pagination";
import type { BasicTableProps } from "./types/table";
import { getViewportOffset } from "@/utils/dom";
import { useWindowSizeFn } from "@/hooks/common/window-size";
import { isBoolean } from "@/utils/is";

const props = withDefaults(defineProps<BasicTableProps>(), {
  dataSource: () => [],
  columns: () => [],
  pagination: true,
  size: "small",
  canResize: true,
  resizeHeightOffset: 0,
  loading: false,
  striped: true,
  singleLine: false,
  bordered: true,
});

const emit = defineEmits<{
  (
    e: "update:checked-row-keys",
    keys: (string | number)[],
    rows: any[],
    meta: {
      row: any | undefined;
      action: "check" | "uncheck" | "checkAll" | "uncheckAll";
    },
  ): void;
  (e: "fetch-success", result: { items: any[]; pageCount: number }): void;
  (e: "fetch-error", error: unknown): void;
  (e: "edit-end"): void;
  (e: "edit-cancel"): void;
  (e: "edit-row-end"): void;
  (e: "edit-change"): void;
}>();

const densityOptions = [
  {
    type: "menu",
    label: "紧凑",
    key: "small",
  },
  {
    type: "menu",
    label: "默认",
    key: "medium",
  },
  {
    type: "menu",
    label: "宽松",
    key: "large",
  },
];
const stripedOptions = [
  {
    type: "menu",
    label: "开启",
    key: "Y",
  },
  {
    type: "menu",
    label: "关闭",
    key: "N",
  },
];

const deviceHeight = ref(150);
const tableElRef = ref<ComponentRef>(null);
const wrapRef = ref<Nullable<HTMLDivElement>>(null);
let paginationEl: HTMLElement | null;
const isStriped = ref(props.striped || false);
const tableStriped = ref(props.striped ? "Y" : "N");
const tableData = ref<Recordable[]>([]);
const innerPropsRef = ref<Partial<BasicTableProps>>();

const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
});

const tableSize = ref(unref(getProps as any).size || "medium");

const { getLoading, setLoading } = useLoading(getProps);

const { getPaginationInfo, setPagination } = usePagination(getProps);

const { getDataSourceRef, getDataSource, getRowKey, reload } = useDataSource(
  getProps,
  {
    getPaginationInfo,
    setPagination,
    tableData,
    setLoading,
  },
  emit,
);

const {
  getPageColumns,
  getScrollX,
  setColumns,
  getColumns,
  getCacheColumns,
  setCacheColumnsField,
} = useColumns(getProps);

//页码切换
function updatePage(page: number) {
  setPagination({ current: page });
  reload();
}

//分页数量切换
function updatePageSize(size: number) {
  setPagination({ current: 1, pageSize: size });
  reload();
}

//密度切换
function densitySelect(e: "small" | "medium" | "large") {
  tableSize.value = e;
}
// 斑马纹切换
function stripedSelect(e: "Y" | "N") {
  isStriped.value = e === "Y";
  tableStriped.value = e;
}
//获取表格大小
const getTableSize = computed(() => tableSize.value);

//组装表格信息
const getBindValues = computed(() => {
  const dataList = unref(getDataSourceRef);
  const maxHeight = dataList.length ? `${unref(deviceHeight)}px` : "auto";
  return {
    ...unref(getProps),
    loading: unref(getLoading),
    columns: toRaw(unref(getPageColumns)),
    rowKey: unref(getRowKey),
    data: dataList,
    size: unref(getTableSize),
    remote: true,
    "max-height": maxHeight,
    title: "", // 重置为空 避免绑定到 table 上面
    scrollX: unref(getScrollX),
  };
});

//获取分页信息
const pagination = computed(() => toRaw(unref(getPaginationInfo)));

function setProps(values: Partial<BasicTableProps>) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...values };
}

const tableAction = {
  reload,
  setColumns,
  setLoading,
  setProps,
  getColumns,
  getDataSource,
  getPageColumns,
  getCacheColumns,
  setCacheColumnsField,
  emit,
};

const getCanResize = computed(() => {
  const { canResize } = unref(getProps);
  return canResize;
});

async function computeTableHeight() {
  const table = unref(tableElRef);
  if (!table) return;
  if (!unref(getCanResize)) return;
  const tableEl: any = table?.$el;
  const headEl = tableEl.querySelector(".n-data-table-thead ");
  const { bottomIncludeBody } = getViewportOffset(headEl);
  const headerH = 64;
  let paginationH = 2;
  const marginH = 24;
  if (!isBoolean(unref(pagination))) {
    paginationEl = tableEl.querySelector(
      ".n-data-table__pagination",
    ) as HTMLElement;
    if (paginationEl) {
      const offsetHeight = paginationEl.offsetHeight;
      paginationH += offsetHeight || 0;
    } else {
      paginationH += 28;
    }
  }
  let height =
    bottomIncludeBody -
    (headerH +
      paginationH +
      marginH +
      (unref(getProps).resizeHeightOffset || 0));
  const maxHeight = unref(getProps).maxHeight;
  height =
    maxHeight && typeof maxHeight === "number" && maxHeight < height
      ? maxHeight
      : height;
  deviceHeight.value = height;
}

function rowProps() {
  return {
    style: {
      backgroundColor: "#f5f5f5",
    },
  };
}

useWindowSizeFn(computeTableHeight as Fn<never, never>, 280);

onMounted(async () => {
  await nextTick();
  await computeTableHeight();
});

createTableContext({ ...tableAction, wrapRef, getBindValues });

defineExpose(tableAction);
</script>

<template>
  <div class="table-toolbar">
    <!--顶部左侧区域-->
    <div class="flex items-center table-toolbar-left">
      <NSpace size="small" align="center" :wrap="false">
        <template v-if="getProps.title">
          <div class="table-toolbar-left-title">
            {{ getProps.title }}
            <NTooltip v-if="getProps.titleTooltip" trigger="hover">
              <template #trigger>
                <icon-material-symbols-help-outline
                  class="text-18px cursor-pointer ml-2px"
                />
              </template>
              {{ getProps.titleTooltip }}
            </NTooltip>
          </div>
        </template>
        <slot name="tableTitle"></slot>
        <slot name="toolbar"></slot>
      </NSpace>
    </div>

    <div class="flex items-center leading-none table-toolbar-right">
      <!--顶部右侧区域-->
      <NSpace size="small">
        <!-- 斑马纹 -->
        <NDropdown
          v-model:value="tableStriped"
          trigger="click"
          :options="stripedOptions"
          @select="stripedSelect"
        >
          <NButton secondary circle size="small">
            <template #icon>
              <icon-mdi-format-align-center class="text-#666" />
            </template>
          </NButton>
        </NDropdown>
        <!--刷新-->
        <NTooltip trigger="hover">
          <template #trigger>
            <NButton secondary circle size="small" @click="reload">
              <template #icon>
                <icon-mdi-refresh class="text-#666" />
              </template>
            </NButton>
          </template>
          <span>刷新</span>
        </NTooltip>
        <!--密度-->
        <NDropdown
          v-model:value="tableSize"
          trigger="click"
          :options="densityOptions"
          @select="densitySelect"
        >
          <NButton secondary circle size="small">
            <template #icon>
              <icon-mdi-arrow-expand-vertical class="text-#666" />
            </template>
          </NButton>
        </NDropdown>
        <!--表格设置单独抽离成组件-->
        <ColumnSetting />
      </NSpace>
    </div>
  </div>
  <div class="custome-basic-table">
    <NDataTable
      ref="tableElRef"
      v-bind="getBindValues"
      :striped="isStriped"
      :row-props="rowProps"
      :pagination="pagination === true ? undefined : pagination"
      @update:page="updatePage"
      @update:page-size="updatePageSize"
    >
      <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
        <slot :name="item" v-bind="data"></slot>
      </template>
    </NDataTable>
  </div>
</template>

<style lang="scss" scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;

  &-left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &-title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 16px;
      font-weight: 600;
    }
  }

  &-right {
    display: flex;
    justify-content: flex-end;
    padding-left: 12px;
  }
}

.custome-basic-table {
  :deep(.n-data-table) {
    .n-data-table-thead {
      .n-data-table-th__title {
        font-weight: 500;
      }

      .table-header-edit-icon {
        color: #666;
      }
    }

    .n-data-table-base-table-body {
      .n-data-table-table {
        .n-data-table-expand-trigger {
          margin-right: 2px;
        }
      }
    }
  }
}

.dark .custome-basic-table {
  :deep(.n-data-table) {
    .n-data-table-thead {
      .table-header-edit-icon {
        color: #fff;
      }
    }
  }
}
</style>
