import { ref, Ref, ComputedRef, unref, computed, watch, toRaw, h } from 'vue';
import type { BasicColumn, BasicTableProps } from '../types/table';
import { isEqual, cloneDeep } from 'lodash-es';
import { isArray, isString, isBoolean, isFunction } from '@/utils/is';
import { usePermission } from '@/hooks/common/permission';
import { ActionItem } from '../types/tableAction';
import { renderEditCell } from '../utils/edit-cell';
import { NTooltip, NIcon } from 'naive-ui';
import { isNumber } from '@/utils/is';
import SvgIcon from '@/components/custom/SvgIcon.vue';

export function useColumns(propsRef: ComputedRef<BasicTableProps>) {
  // 初始化时和 watch 中合并 actionColumn
  const columnsRef = ref(mergeActionColumn()) as unknown as Ref<BasicColumn[]>;
  let cacheColumns = mergeActionColumn();
  const DEFAULT_WIDTH = 100;

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef));
    if (!columns) return [];
    return columns;
  });

  const { hasPermission } = usePermission();

  function isIfShow(action: ActionItem): boolean {
    const ifShow = action.ifShow;

    let isShould = true;

    if (isBoolean(ifShow)) {
      isShould = ifShow;
    }
    if (isFunction(ifShow)) {
      isShould = ifShow(action);
    }
    return isShould;
  }

  const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
      trigger: () => trigger,
      default: () => content
    });
  };

  const getPageColumns = computed(() => {
    const pageColumns = unref(getColumnsRef);
    const columns = cloneDeep(pageColumns);
    return columns
      .filter(column => {
        return (
          hasPermission(column.auth as string[]) &&
          isIfShow(column as ActionItem)
        );
      })
      .map(column => {
        // 默认宽度
        column.width = column.width || DEFAULT_WIDTH;
        column.minWidth = column.minWidth || column.width;
        // 默认居中对齐
        column.align = column.align || 'center';
        //默认 ellipsis 为 false
        column.ellipsis = column.ellipsis ? { tooltip: true } : false;
        const { edit } = column;
        if (edit) {
          column.render = renderEditCell(column);
          const title: any = column.title;
          column.title = () => {
            return renderTooltip(
              h('div', { class: 'flex items-center justify-center' }, [
                h('span', { style: { 'margin-right': '2px' } }, title),
                h(
                  NIcon,
                  {
                    size: 16,
                    class: 'table-header-edit-icon'
                  },
                  {
                    default: () =>
                      h(SvgIcon, { icon: 'mdi-square-edit-outline' })
                  }
                )
              ]),
              '该列可编辑'
            );
          };
        }
        return column;
      });
  });
  // 表格内容的横向宽度，如果列被水平固定了，则需要设定它
  const getScrollX = computed(() => {
    return getPageColumns.value.reduce((total, column) => {
      const { width, minWidth } = column;
      const w = isNumber(width)
        ? width
        : isNumber(minWidth)
          ? minWidth
          : DEFAULT_WIDTH;
      return total + w;
    }, 0);
  });

  watch(
    () => unref(propsRef).columns,
    () => {
      const merged = mergeActionColumn();
      columnsRef.value = merged;
      cacheColumns = merged;
    }
  );

  function mergeActionColumn(): BasicColumn[] {
    const { columns, actionColumn } = unref(propsRef);
    const result = [...columns];
    if (!actionColumn) return result;
    if (!result.find(col => col.key === 'action')) {
      result.push({ ...(actionColumn as any) });
    }
    return result;
  }

  //设置
  function setColumns(columnList: BasicColumn[] | string[]) {
    const columns: any[] = cloneDeep(columnList);
    if (!isArray(columns)) return;

    if (!columns.length) {
      columnsRef.value = [];
      return;
    }
    const cacheKeys = cacheColumns?.map(item => item.key) || [];
    //针对拖拽排序
    if (!isString(columns[0])) {
      columnsRef.value = columns;
    } else {
      const keyList = columnList as string[];
      const newColumns: any[] = [];
      cacheColumns?.forEach(item => {
        if (keyList.includes(String(item.key))) {
          newColumns.push({ ...item });
        }
      });
      if (!isEqual(cacheKeys, columns)) {
        newColumns.sort((prev, next) => {
          return cacheKeys.indexOf(prev.key) - cacheKeys.indexOf(next.key);
        });
      }
      columnsRef.value = newColumns;
    }
  }

  //获取
  function getColumns(): BasicColumn[] {
    const columns = toRaw(unref(getColumnsRef));
    return columns.map(item => {
      return {
        ...item,
        title: item.title,
        key: item.key,
        fixed: item.fixed || undefined
      };
    });
  }

  //获取原始
  function getCacheColumns(isKey?: boolean): any[] {
    return isKey ? cacheColumns?.map(item => item.key) : cacheColumns;
  }

  //更新原始数据单个字段
  function setCacheColumnsField(
    key: string | undefined,
    value: Partial<BasicColumn>
  ) {
    if (!key || !value) {
      return;
    }
    cacheColumns.forEach(item => {
      if (item.key === key) {
        Object.assign(item, value);
        return;
      }
    });
  }

  return {
    getColumnsRef,
    getCacheColumns,
    setCacheColumnsField,
    setColumns,
    getColumns,
    getPageColumns,
    getScrollX
  };
}
