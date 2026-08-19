<script lang="ts" setup>
import { getCurrentInstance, ref, unref, computed, useAttrs } from 'vue';
import { deepMerge } from '@/utils/common';
import type { BasicModalProps, ModalMethods } from './types';

const attrs = useAttrs();
const props = withDefaults(defineProps<BasicModalProps>(), {
  subBtnText: '确定',
  cancelBtnText: '取消',
  title: '',
  showIcon: false,
  width: 500,
  maskClosable: true,
  preset: 'card',
  draggable: true
});
const emit = defineEmits<{
  (e: 'onClose' | 'onOk' | 'register', values?: Recordable): void;
}>();

const propsRef = ref<Partial<BasicModalProps> | null>(null);

const isModal = ref(false);
const subLoading = ref(false);

const getProps = computed((): BasicModalProps => {
  return { ...props, ...(unref(propsRef) as any) };
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
  setProps,
  openModal,
  closeModal,
  setSubLoading
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
    v-bind="getBindValue"
    v-model:show="isModal"
    @close="onCloseModal"
  >
    <template #header>
      <div id="basic-modal-bar" class="w-full">
        {{ getBindValue.title }}
      </div>
    </template>
    <template #default>
      <slot name="default"></slot>
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

<style lang="less"></style>
