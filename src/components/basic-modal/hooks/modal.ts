import { ref, unref, getCurrentInstance, watch } from 'vue';
import { isProdMode } from '@/utils/common';
import { ModalMethods, UseModalReturnType, BasicModalProps } from '../types';
import { tryOnUnmounted } from '@vueuse/core';

export function useModal(props: BasicModalProps): UseModalReturnType {
  const modalRef = ref<Nullable<ModalMethods>>(null);
  const currentInstance = getCurrentInstance();

  const getInstance = () => {
    const instance = unref(modalRef.value);
    if (!instance) {
      console.error('useModal instance is undefined!');
    }
    return instance;
  };

  const register = (modalInstance: ModalMethods) => {
    if (isProdMode()) {
      tryOnUnmounted(() => {
        modalRef.value = null;
      });
    }
    modalRef.value = modalInstance;
    currentInstance?.emit('register', modalInstance);

    watch(
      () => props,
      () => {
        if (props) modalInstance.setProps(getDynamicProps(props));
      },
      {
        immediate: true,
        deep: true
      }
    );
  };

  const methods: ModalMethods = {
    setProps: (values: BasicModalProps): void => {
      getInstance()?.setProps(values);
    },
    openModal: () => {
      getInstance()?.openModal();
    },
    closeModal: () => {
      getInstance()?.closeModal();
    },
    setSubLoading: status => {
      getInstance()?.setSubLoading(status);
    }
  };

  return [register, methods];
}

// dynamic use hook props
function getDynamicProps<T extends {}, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map(key => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}
