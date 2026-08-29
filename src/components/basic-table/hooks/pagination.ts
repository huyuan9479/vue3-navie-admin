import type { PaginationProps } from '../types/index';
import type { BasicTableProps } from '../types/table';
import { computed, unref, ref, ComputedRef, watch } from 'vue';

import { isBoolean } from '@/utils/is';
import { DEFAULTPAGESIZE, PAGESIZES } from '../utils/const';

export function usePagination(refProps: ComputedRef<BasicTableProps>) {
  const configRef = ref<PaginationProps>({});
  const show = ref(true);

  watch(
    () => unref(refProps).pagination,
    pagination => {
      if (!isBoolean(pagination) && pagination) {
        configRef.value = {
          ...unref(configRef),
          ...pagination
        };
      }
    }
  );

  const getPaginationInfo = computed((): PaginationProps | boolean => {
    const { pagination } = unref(refProps);
    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false;
    }
    return {
      current: 1, //当前页
      pageSize: DEFAULTPAGESIZE, //分页大小
      pageSizes: PAGESIZES, // 每页条数
      showSizePicker: true,
      showQuickJumper: true,
      pageSlot: 7,
      prefix: (pagingInfo: PaginationProps) =>
        `共 ${pagingInfo.itemCount || 0} 条`, // 不需要可以通过 pagination 重置或者删除
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef)
    };
  });

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo);
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info
    };
  }

  function getPagination() {
    return unref(getPaginationInfo);
  }

  function getShowPagination() {
    return unref(show);
  }

  async function setShowPagination(flag: boolean) {
    show.value = flag;
  }

  return {
    getPagination,
    getPaginationInfo,
    setShowPagination,
    getShowPagination,
    setPagination
  };
}
