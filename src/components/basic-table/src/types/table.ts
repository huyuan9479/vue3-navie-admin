import type { InternalRowData, TableBaseColumn } from 'naive-ui/lib/data-table/src/interface';
import { ComponentType } from './componentType';

export interface BasicColumn<T = InternalRowData> extends TableBaseColumn<T> {
  //编辑表格
  edit?: boolean;
  editRow?: boolean;
  editable?: boolean;
  editComponent?: ComponentType;
  editComponentProps?: Recordable;
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
  editValueMap?: (value: any) => string;
  onEditRow?: () => void;
  // 权限编码控制是否显示
  auth?: string[];
  // 业务控制是否显示
  ifShow?: boolean | ((column: BasicColumn) => boolean);
  // 控制是否支持拖拽，默认支持
  draggable?: boolean;
}

export interface TableActionType {
  reload: (opt?: Recordable) => Promise<void>;
  emit?: any;
  getColumns: (opt?: Recordable) => BasicColumn[];
  setColumns: (columns: BasicColumn[] | string[]) => void;
}

export interface BasicTableProps {
  title?: string;
  titleTooltip?: string;
  size?: string;
  dataSource: Function;
  columns: BasicColumn[];
  pagination: object | boolean;
  actionColumn?: BasicColumn;
  canResize: boolean;
  resizeHeightOffset: number;
  loading: boolean;
  striped: boolean;
  maxHeight?: number | undefined;
  rowKey?: string | ((record: Recordable) => string);
  beforeRequest?: (...arg: any[]) => Promise<any>;
  request: (...arg: any[]) => Promise<any>;
  afterRequest?: (...arg: any[]) => Promise<any>;
  'update:checked-row-keys'?: (
    keys: (string | number)[],
    rows: any[],
    meta: { row: any | undefined; action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' }
  ) => void;
}
