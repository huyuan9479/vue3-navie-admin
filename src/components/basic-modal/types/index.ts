/**
 * @description: 弹窗对外暴露的方法
 */
export interface ModalMethods {
  setProps: (props: BasicModalProps) => void;
  openModal: () => void;
  closeModal: () => void;
  setSubLoading: (status: boolean) => void;
  onRefresh: () => void;
  onCallback: (values?: Recordable) => void;
}
export interface BasicModalProps {
  subBtnText?: string;
  cancelBtnText?: string;
  showIcon?: boolean;
  width?: number;
  title?: string;
  maskClosable?: boolean;
  preset?: "dialog" | "card" | undefined;
  draggable?: boolean;
  onPositiveClick?: (values?: Recordable) => void;
  onNegativeClick?: (values?: Recordable) => void;
}

export type RegisterFn = (ModalInstance: ModalMethods) => void;

export type UseModalReturnType = [RegisterFn, ModalMethods];
