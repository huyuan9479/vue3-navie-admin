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

type ModalWidth = number | `${number}px` | `${number}%` | `${number}vw`;

export interface BasicModalProps {
  subBtnText?: string;
  cancelBtnText?: string;
  showIcon?: boolean;
  width?: ModalWidth;
  title?: string;
  maskClosable?: boolean;
  preset?: 'dialog' | 'card' | undefined;
  draggable?: boolean;
  tipMessage?: string;
  fullscreen?: boolean;
  canFullscreen?: boolean;
  onPositiveClick?: (values?: Recordable) => void;
  onNegativeClick?: (values?: Recordable) => void;
}

export type RegisterFn = (ModalInstance: ModalMethods) => void;

export type UseModalReturnType = [RegisterFn, ModalMethods];
