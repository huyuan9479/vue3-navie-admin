<script setup lang="ts">
import { BasicModal, useModal } from "@/components/basic-modal";
import { ref } from "vue";

const [modalRegister, { openModal, closeModal }] = useModal({
  title: "添加用户",
  tipMessage: "这是一个提示，可以用来说明",
});
const modalRef = ref<typeof BasicModal>();

function handleOk() {
  closeModal();
}

function handleClose() {
  closeModal();
}

defineExpose({
  openModal,
});
</script>

<template>
  <BasicModal ref="modalRef" @register="modalRegister" @on-ok="handleOk" @on-close="handleClose" />
</template>

<style scoped></style>
