import type { DialogOptions } from 'naive-ui/lib/dialog';
/**
 * @description: 弹窗对外暴露的方法
 */
export interface ModalMethods {
  setProps: (props: BasicModalProps) => void;
  openModal: () => void;
  closeModal: () => void;
  setSubLoading: (status: boolean) => void;
}

export interface BasicModalProps extends Omit<
  DialogOptions,
  'onPositiveClick' | 'onNegativeClick'
> {
  subBtnText?: string;
  cancelBtnText?: string;
  showIcon?: boolean;
  width?: number;
  title?: string;
  maskClosable?: boolean;
  preset?: 'dialog' | 'card' | undefined;
  draggable?: boolean;
}

export type RegisterFn = (ModalInstance: ModalMethods) => void;

export type UseModalReturnType = [RegisterFn, ModalMethods];
