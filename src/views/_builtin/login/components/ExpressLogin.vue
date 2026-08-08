<script setup lang="ts">
import { ref } from "vue";
import QrcodeVue from "qrcode.vue";

defineOptions({
  name: "ExpressLogin",
});

const qrContent = ref("https://gitcode.com/gh_mirrors/qr/qrcode.vue");
const backgroundColor = ref("#ffffff");
const foregroundColor = ref("#000000");
</script>

<template>
  <div class="flex flex-col items-center">
    <h3 class="text-26px font-bold mb-24px">{{ $t("page.login.expressLogin.title") }}</h3>
    <div class="p-24px border border-solid border-#e5e5e5 rounded-8px shadow-md">
      <QrcodeVue
        :value="qrContent"
        :size="230"
        level="H"
        render-as="canvas"
        :background="backgroundColor"
        :foreground="foregroundColor"
      />
    </div>
  </div>
</template>

<style scoped></style>
