<script lang="ts" setup>
import { getCurrentInstance, ref, unref, computed, useAttrs, h } from 'vue';
import { deepMerge } from '@/utils/common';
import type { BasicModalProps, ModalMethods } from './types';
import ModalHeader from './components/ModalHeader.vue';
import ModalWrapper from './components/ModalWrapper.vue';
import { useFullScreen } from './hooks/modal-fullscreen';

const attrs = useAttrs();
const props = withDefaults(defineProps<BasicModalProps>(), {
  showOkBtn: true,
  showCancelBtn: true,
  showAction: true,
  showCancelTip: false,
  okBtnText: '确定',
  cancelBtnText: '取消',
  title: '',
  width: 500,
  tipMessage: '',
  maskClosable: true,
  preset: 'card',
  draggable: true,
  fullscreen: true,
  canFullscreen: true,
  minHeight: 60
});
const emit = defineEmits<{
  (e: 'onClose' | 'onOk' | 'onRefresh'): void;
  (e: 'register', methods: ModalMethods): void;
  (e: 'onRefresh'): void;
  (e: 'onCallback', values?: Recordable): void;
}>();

const propsRef = ref<Partial<BasicModalProps> | null>(null);

const modalWrapperRef = ref<typeof ModalWrapper>();
const isModal = ref(false);
const subLoading = ref(false);
const modalLoading = ref(false);
const canFullscreen = ref(props.canFullscreen);

const getProps = computed((): BasicModalProps => {
  return { ...props, ...(unref(propsRef) as any) };
});

// 全屏
const { handleFullScreen, getWrapClassName, fullScreenRef } = useFullScreen();

const submitBtnText = computed(() => {
  const { okBtnText } = propsRef.value as any;
  return okBtnText || props.okBtnText;
});

async function setProps(modalProps: Partial<BasicModalProps>): Promise<void> {
  propsRef.value = deepMerge(unref(propsRef) || ({} as any), modalProps);
}

const getBindValue = computed(() => {
  return {
    ...attrs,
    ...unref(getProps),
    ...unref(propsRef)
  };
});

const getModalBindValue = computed(() => {
  const { title, tipMessage, showAction, ...bindValue } = unref(
    getBindValue
  ) as any;
  return {
    ...bindValue,
    // 解决警告：Blocked aria-hidden on an element because its descendant retained focus.
    autoFocus: bindValue.autoFocus ?? false,
    trapFocus: bindValue.trapFocus ?? false,
    title: () => h(ModalHeader, { title, tipMessage, showAction })
  };
});
// 弹窗的宽度
const modalStyle = computed(() => {
  if (fullScreenRef.value) {
    return {
      width: '100vw',
      height: '100vh',
      margin: 0
    };
  }

  const width = getBindValue.value.width;
  return {
    width: typeof width === 'number' ? `${width}px` : width
  };
});

function setSubLoading(status: boolean) {
  subLoading.value = status;
}

function setModalLoading(status: boolean) {
  modalLoading.value = status;
}

function openModal() {
  isModal.value = true;
}

function closeModal() {
  isModal.value = false;
  subLoading.value = false;
  modalLoading.value = false;
  emit('onClose');
}

function onCloseModal() {
  // 点击右上角关闭弹窗
  // 如果显示提示，弹窗关闭前，需要确认
  // 如果不显示提示，直接关闭弹窗
  if (getBindValue.value.showCancelTip) {
    window.$dialog?.warning({
      title: '提示',
      content: '确定要关闭吗？',
      type: 'warning',
      maskClosable: false,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        isModal.value = false;
        emit('onClose');
      }
    });
    return false;
  } else {
    isModal.value = false;
    emit('onClose');
  }
}

function handleSubmit() {
  subLoading.value = true;
  emit('onOk');
}

const modalMethods: ModalMethods = {
  // 设置弹窗属性
  setProps,
  // 打开弹窗
  openModal,
  // 关闭弹窗
  closeModal,
  // 设置提交按钮加载状态
  setSubLoading,
  // 设置弹窗加载状态
  setModalLoading,
  // 比如：新增成功后，刷新列表
  onRefresh: () => {
    emit('onRefresh');
  },
  // 比如：新增成功后，回调父组件
  onCallback: (values?: Recordable) => {
    emit('onCallback', values);
  }
};

const instance = getCurrentInstance();
if (instance) {
  emit('register', modalMethods);
}

defineExpose(modalMethods);
</script>

<template>
  <NModal
    v-bind="getModalBindValue"
    v-model:show="isModal"
    :style="modalStyle"
    :class="getWrapClassName"
    header-class="basic-modal-header"
    content-class="basic-modal-content"
    @close="onCloseModal"
    @after-enter="modalWrapperRef?.setModalHeight()"
  >
    <template #header-extra>
      <div class="modal-header-extra">
        <button
          v-if="canFullscreen"
          class="extra-action-item"
          @click="handleFullScreen"
        >
          <icon-mdi-fullscreen v-if="!fullScreenRef" />
          <icon-mdi-fullscreen-exit v-else />
        </button>
      </div>
    </template>
    <template #default>
      <ModalWrapper
        ref="modalWrapperRef"
        :full-screen="fullScreenRef"
        :min-height="getProps.minHeight"
        :open="isModal"
        show-action
      >
        <slot></slot>
      </ModalWrapper>
      <div v-if="modalLoading" class="basic-modal-loading">
        <NSpin :stroke-width="16" size="large" />
      </div>
    </template>
    <template v-if="!$slots.action" #action>
      <NSpace v-if="getProps.showAction" justify="end">
        <NButton v-if="getProps.showCancelBtn" @click="closeModal">
          {{ getProps.cancelBtnText }}
        </NButton>
        <NButton
          v-if="getProps.showOkBtn"
          type="primary"
          :loading="subLoading"
          @click="handleSubmit"
        >
          {{ submitBtnText }}
        </NButton>
      </NSpace>
    </template>
    <template v-else #action>
      <slot name="action"></slot>
    </template>
  </NModal>
</template>

<style lang="scss">
.basic-modal-header {
  padding: 12px 24px !important;
  border-bottom: 1px solid rgba(102, 102, 102, 0.12);
}

.dark {
  .basic-modal-content {
    .basic-modal-loading {
      background-color: transparent;
    }
  }
}

.basic-modal-content {
  position: relative;
  padding: 12px 0 !important;

  .basic-modal-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.4);
  }
}

.basic-modal-wrap .n-card__action {
  padding: 10px 24px !important;
  border-top: 1px solid rgba(102, 102, 102, 0.12);
}

.not-modal-fullscreen {
  margin-top: 5vh;
  margin-bottom: 5vh;
}

.modal-fullscreen {
  max-width: 100vw !important;
  height: 100vh;
  margin: 0 !important;
}
</style>

<style scoped lang="scss">
.modal-header-extra {
  display: flex;
  align-items: center;

  .extra-action-item {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    width: 22px;
    height: 22px;
    font-size: 23px;
    color: rgba(102, 102, 102, 1);
    border-radius: 6px;

    &:hover {
      background-color: rgba(46, 51, 56, 0.09);
    }
  }
}

.dark {
  .modal-header-extra {
    .extra-action-item {
      background-color: transparent;
      color: rgba(255, 255, 255, 0.52);

      &:hover {
        background-color: rgba(255, 255, 255, 0.12);
      }
    }
  }
}
</style>
