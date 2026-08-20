<script setup lang="ts">
import { BasicModal, useModal } from "@/components/basic-modal";
import { ref } from "vue";

const [modalRegister, { openModal, closeModal }] = useModal({
  title: "添加用户",
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
  <BasicModal
    ref="modalRef"
    @register="modalRegister"
    @on-ok="handleOk"
    @on-close="handleClose"
  />
</template>

<style scoped></style>
