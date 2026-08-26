<script lang="ts" setup>
import { getCurrentInstance, ref, unref, computed, useAttrs, h } from 'vue';
import { deepMerge } from '@/utils/common';
import type { BasicModalProps, ModalMethods } from './types';
import ModalHeader from './components/ModalHeader.vue';
import ModalWrapper from './components/ModalWrapper.vue';
import { useFullScreen } from './hooks/modal-fullscreen';

const attrs = useAttrs();
const props = withDefaults(defineProps<BasicModalProps>(), {
  subBtnText: '确定',
  cancelBtnText: '取消',
  title: '',
  showIcon: false,
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
const canFullscreen = ref(props.canFullscreen);

const getProps = computed((): BasicModalProps => {
  return { ...props, ...(unref(propsRef) as any) };
});

// 全屏
const { handleFullScreen, getWrapClassName, fullScreenRef } = useFullScreen({
  wrapClassName: computed(() => getProps.value.wrapClassName)
});

const submitBtnText = computed(() => {
  const { subBtnText } = propsRef.value as any;
  return subBtnText || props.subBtnText;
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
  const { title, tipMessage, ...bindValue } = unref(getBindValue) as any;
  return {
    ...bindValue,
    title: () => h(ModalHeader, { title, tipMessage })
  };
});

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

function openModal() {
  isModal.value = true;
}

function closeModal() {
  isModal.value = false;
  subLoading.value = false;
  emit('onClose');
}

function onCloseModal() {
  isModal.value = false;
  emit('onClose');
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
    id="basic-modal"
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
    </template>
    <template v-if="!$slots.action" #action>
      <NSpace>
        <NButton @click="closeModal">取消</NButton>
        <NButton type="primary" :loading="subLoading" @click="handleSubmit">
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
  padding: 10px 24px 8px !important;
  border-bottom: 1px solid rgba(102, 102, 102, 0.12);
}
.basic-modal-content {
  padding: 12px 0 !important;
}

.basic-modal-wrap {
  margin-top: 2vh;
  margin-bottom: 2vh;
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
