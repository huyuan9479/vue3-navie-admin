import type {
  InternalRowData,
  TableColumn
} from 'naive-ui/lib/data-table/src/interface';
import { ComponentType } from './index';
import type { VNode, VNodeChild } from 'vue';

export type BasicColumn<T = InternalRowData> = TableColumn<T> & {
  //编辑表格
  title?: string | (() => VNodeChild);
  key: string | number;
  type?: 'selection' | 'index';
  edit?: boolean;
  editRow?: boolean;
  editable?: boolean;
  editComponent?: ComponentType;
  editComponentProps?: Recordable;
  editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
  editValueMap?: (value: any) => string;
  render?: (rowData: T, rowIndex: number) => VNodeChild;
  onEditRow?: () => void;
  // 权限编码控制是否显示
  auth?: string[];
  // 业务控制是否显示
  ifShow?: boolean | ((column: BasicColumn) => boolean);
  // 控制是否支持拖拽，默认支持
  draggable?: boolean;
};

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
  singleLine?: boolean;
  bordered?: boolean;
  dataSource?: Function;
  columns: BasicColumn[];
  pagination?: object | boolean;
  actionColumn?: BasicColumn;
  canResize?: boolean;
  resizeHeightOffset?: number;
  loading?: boolean;
  striped?: boolean;
  maxHeight?: number | undefined;
  rowKey?: string | ((record: Recordable) => string);
  renderExpandIcon?: (record: Recordable) => VNode;
  rowProps?: (record: Recordable) => Recordable;
  beforeRequest?: (...arg: any[]) => Promise<any>;
  request?: (...arg: any[]) => Promise<any> | void;
  afterRequest?: (...arg: any[]) => Promise<any>;
}
