import { ref, Ref, ComputedRef, unref, computed, watch, toRaw, h } from 'vue';
import type { BasicColumn, BasicTableProps } from '../types/table';
import { isEqual, cloneDeep } from 'lodash-es';
import { isArray, isString, isBoolean, isFunction } from '@/utils/is';
import { usePermission } from '@/hooks/common/permission';
import { ActionItem } from '../types/tableAction';
import { renderEditCell } from '../utils/edit-cell';
import { NTooltip, NIcon } from 'naive-ui';
// import { FormOutlined } from '@vicons/antd';

export function useColumns(propsRef: ComputedRef<BasicTableProps>) {
  const columnsRef = ref(unref(propsRef).columns) as unknown as Ref<BasicColumn[]>;
  let cacheColumns = unref(propsRef).columns;

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef));

    handleActionColumn(propsRef, columns);
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
        return hasPermission(column.auth as string[]) && isIfShow(column as ActionItem);
      })
      .map(column => {
        //默认 ellipsis 为true
        column.ellipsis = typeof column.ellipsis === 'undefined' ? { tooltip: true } : false;
        const { edit } = column;
        if (edit) {
          column.render = renderEditCell(column);
          if (edit) {
            const title: any = column.title;
            column.title = () => {
              return renderTooltip(
                h('div', { class: 'flex items-center' }, [
                  h('span', { style: { 'margin-right': '5px' } }, title),
                  h(
                    NIcon,
                    {
                      size: 14
                    },
                    {
                      // default: () => h(FormOutlined)
                    }
                  )
                ]),
                '该列可编辑'
              );
            };
          }
        }
        return column;
      });
  });

  watch(
    () => unref(propsRef).columns,
    columns => {
      columnsRef.value = columns;
      cacheColumns = columns;
    }
  );

  function handleActionColumn(values: ComputedRef<BasicTableProps>, columns: BasicColumn[]) {
    const { actionColumn } = unref(values);
    if (!actionColumn) return;
    if (!columns.find(col => col.key === 'action')) {
      columns.push({
        ...(actionColumn as any)
      });
    }
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
      return { ...item, title: item.title, key: item.key, fixed: item.fixed || undefined };
    });
  }

  //获取原始
  function getCacheColumns(isKey?: boolean): any[] {
    return isKey ? cacheColumns?.map(item => item.key) : cacheColumns;
  }

  //更新原始数据单个字段
  function setCacheColumnsField(key: string | undefined, value: Partial<BasicColumn>) {
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
    getPageColumns
  };
}
