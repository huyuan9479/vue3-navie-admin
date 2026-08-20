import {
  ref,
  ComputedRef,
  unref,
  computed,
  onMounted,
  watchEffect,
  watch,
} from "vue";
import type { BasicTableProps } from "../types/table";
import type { PaginationProps } from "../types/index";
import { isBoolean, isFunction } from "@/utils/is";
import { APISETTING } from "../utils/const";

export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  { getPaginationInfo, setPagination, setLoading, tableData }: any,
  emit: {
    (e: "fetch-success", result: { items: any[]; pageCount: number }): void;
    (e: "fetch-error", error: unknown): void;
    // (e: 'edit-end'): void;
    // (e: 'edit-cancel'): void;
    // (e: 'edit-row-end'): void;
    // (e: 'edit-change'): void;
  },
) {
  const dataSourceRef = ref<Recordable[]>([]);

  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
  });

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource }: any = unref(propsRef);
      if (dataSource && dataSource.length > 0) {
        dataSourceRef.value = dataSource;
      }
    },
    {
      immediate: true,
    },
  );

  const getRowKey = computed(() => {
    const { rowKey }: any = unref(propsRef);
    return rowKey
      ? rowKey
      : () => {
          return "key";
        };
  });

  const getDataSourceRef = computed(() => {
    const dataSource = unref(dataSourceRef);
    if (!dataSource || dataSource.length === 0) {
      return unref(dataSourceRef);
    }
    return unref(dataSourceRef);
  });

  async function fetch(opt?: Recordable) {
    try {
      setLoading(true);
      const { request, pagination, beforeRequest, afterRequest }: any =
        unref(propsRef);
      if (!request) return;
      //组装分页信息
      const currentField = APISETTING.currentField;
      const totalField = APISETTING.totalField;
      const recordsField = APISETTING.recordsField;
      const pageCountField = APISETTING.pagesField;
      const currentFetchField = APISETTING.currentFetchField;
      const pageSizeFetchField = APISETTING.pageSizeFetchField;
      let pageParams = {};
      const { current = 1, pageSize = 10 } = unref(
        getPaginationInfo,
      ) as PaginationProps;

      if (
        (isBoolean(pagination) && !pagination) ||
        isBoolean(getPaginationInfo)
      ) {
        pageParams = {};
      } else {
        (pageParams as Record<string, any>)[currentFetchField] =
          (opt && opt[currentField]) || current;
        (pageParams as Record<string, any>)[pageSizeFetchField] = pageSize;
      }

      let params = {
        ...pageParams,
        ...opt,
      };
      if (beforeRequest && isFunction(beforeRequest)) {
        // The params parameter can be modified by outsiders
        params = (await beforeRequest(params)) || params;
      }
      const res = await request(params);
      if (!res) return;
      const pageCount = res[pageCountField];
      const currentPage = res[currentField];
      const total = res[totalField];
      // 如果数据异常，需获取正确的页码再次执行
      if (pageCount) {
        const currentTotalPage = Math.ceil(total / pageSize);
        if (currentPage > currentTotalPage) {
          setPagination({
            page: currentTotalPage,
            total: total,
          });
          return await fetch(opt);
        }
      }
      let resultInfo = res[recordsField] ? res[recordsField] : [];
      if (afterRequest && isFunction(afterRequest)) {
        // can modify the data returned by the interface for processing
        resultInfo = (await afterRequest(resultInfo)) || resultInfo;
      }
      dataSourceRef.value = resultInfo;
      setPagination({
        page: currentPage,
        pageCount: pageCount,
        itemCount: total,
      });
      if (opt && opt[currentField]) {
        setPagination({
          current: opt[currentField] || 1,
        });
      }
      emit("fetch-success", {
        items: unref(resultInfo),
        pageCount: pageCount,
      });
    } catch (error) {
      emit("fetch-error", error);
      dataSourceRef.value = [];
      setPagination({
        pages: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  onMounted(() => {
    setTimeout(() => {
      fetch();
    }, 16);
  });

  function setTableData(values: Recordable[]) {
    dataSourceRef.value = values;
  }

  function getDataSource(): any[] {
    return getDataSourceRef.value;
  }

  async function reload(opt?: Recordable) {
    await fetch(opt);
  }

  return {
    fetch,
    getRowKey,
    getDataSourceRef,
    getDataSource,
    setTableData,
    reload,
  };
}
