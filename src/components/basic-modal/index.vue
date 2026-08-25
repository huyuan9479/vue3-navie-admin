<script lang="ts" setup>
import { getCurrentInstance, ref, unref, computed, useAttrs, h } from "vue";
import { deepMerge } from "@/utils/common";
import type { BasicModalProps, ModalMethods } from "./types";
import ModalHeader from "./components/ModalHeader.vue";

const attrs = useAttrs();
const props = withDefaults(defineProps<BasicModalProps>(), {
  subBtnText: "确定",
  cancelBtnText: "取消",
  title: "",
  showIcon: false,
  width: 500,
  tipMessage: "",
  maskClosable: true,
  preset: "card",
  draggable: true,
  fullscreen: true,
  canFullscreen: true,
});
const emit = defineEmits<{
  (e: "onClose" | "onOk" | "onRefresh"): void;
  (e: "register", methods: ModalMethods): void;
  (e: "onRefresh"): void;
  (e: "onCallback", values?: Recordable): void;
}>();

const propsRef = ref<Partial<BasicModalProps> | null>(null);

const isModal = ref(false);
const subLoading = ref(false);
const fullscreen = ref(props.fullscreen);
const canFullscreen = ref(props.canFullscreen);

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
    ...unref(propsRef),
  };
});

const getModalBindValue = computed(() => {
  const { title, tipMessage, ...bindValue } = unref(getBindValue) as any;
  return {
    ...bindValue,
    title: () => h(ModalHeader, { title, tipMessage }),
  };
});

const modalStyle = computed(() => {
  const width = getBindValue.value.width;
  return {
    width: typeof width === "number" ? `${width}px` : width,
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
  emit("onClose");
}

function onCloseModal() {
  isModal.value = false;
  emit("onClose");
}

function handleSubmit() {
  subLoading.value = true;
  emit("onOk");
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
    emit("onRefresh");
  },
  // 比如：新增成功后，回调父组件
  onCallback: (values?: Recordable) => {
    emit("onCallback", values);
  },
};

const instance = getCurrentInstance();
if (instance) {
  emit("register", modalMethods);
}

defineExpose(modalMethods);
</script>

<template>
  <NModal id="basic-modal" v-bind="getModalBindValue" v-model:show="isModal" :style="modalStyle" @close="onCloseModal">
    <template #header-extra>
      <div class="modal-header-extra">
        <NButton v-if="canFullscreen" quaternary size="small" class="extra-action-item"
          @click="fullscreen = !fullscreen">
          <template #icon>
            <icon-mdi-fullscreen v-if="fullscreen" />
            <icon-mdi-fullscreen-exit v-else />
          </template>
        </NButton>
        <!--
 <button class="extra-action-item" @click="fullscreen = !fullscreen">
          <icon-mdi-fullscreen v-if="fullscreen" />
          <icon-mdi-fullscreen-exit v-else />
        </button>
-->
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

<style scoped lang="scss">
.modal-header-extra {
  display: flex;
  align-items: center;

  .extra-action-item {}
}
</style>
