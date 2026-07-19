<template>
  <div class="app-logo">
    <SvgIcon local-icon="logo" class="logo-icon size-32px!" />
  </div>
</template>

<style lang="scss" scoped>
.app-logo {
  :deep(.logo-icon) {
    color: rgb(var(--primary-color));
  }
}
</style>
