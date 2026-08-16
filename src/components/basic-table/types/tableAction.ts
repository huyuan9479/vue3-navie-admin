import { NButton } from 'naive-ui';
import type { Component } from 'vue';

export interface ActionItem extends Partial<Omit<InstanceType<typeof NButton>, 'icon'>> {
  onClick?: Fn;
  label?: string;
  key?: string | number;
  text?: boolean;
  type?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'default';
  // 设定 color 后会覆盖 type 的样式
  color?: string;
  icon?: Component | string;
  popConfirm?: PopConfirm;
  disabled?: boolean;
  divider?: boolean;
  // 权限编码控制是否显示
  auth?: LabelValueOptions | LabelValueOptions[] | string | string[];
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean);
}

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  icon?: Component;
}
