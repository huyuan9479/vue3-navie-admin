<script setup lang="ts">
import { BasicModal, useModal } from '@/components/basic-modal';
import { ref } from 'vue';

const [modalRegister, { openModal, closeModal, setModalLoading }] = useModal({
  title: '添加用户',
  tipMessage: '这是一个提示，可以用来说明'
});
const modalRef = ref<typeof BasicModal>();

function handleOk() {
  closeModal();
}

function handleOpenModal() {
  setModalLoading(true);
  openModal();
  setTimeout(() => {
    setModalLoading(false);
  }, 3000);
}

defineExpose({
  handleOpenModal
});
</script>

<template>
  <BasicModal ref="modalRef" @register="modalRegister" @on-ok="handleOk">
    <template #default>
      <div v-for="item in 100" :key="item">{{ item }}</div>
    </template>
  </BasicModal>
</template>

<style scoped></style>
