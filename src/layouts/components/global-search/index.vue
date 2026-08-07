<script lang="ts" setup>
import { useBoolean } from "@sa/hooks";
import { $t } from "@/locales";
import SearchModal from "./components/SearchModal.vue";

defineOptions({ name: "GlobalSearch" });

const { bool: show, toggle } = useBoolean();
</script>

<template>
  <ButtonIcon :tooltip-content="$t('common.search')" @click="toggle">
    <icon-ant-design:search-outlined />
  </ButtonIcon>
  <SearchModal v-model:show="show" />
</template>

<style lang="scss" scoped></style>
