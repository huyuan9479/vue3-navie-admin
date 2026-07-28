<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";
import { getPaletteColorByNumber, mixColor } from "@sa/color";
import { loginModuleRecord } from "@/constants/app";
import { useAppStore } from "@/store/modules/app";
import { useThemeStore } from "@/store/modules/theme";
import { $t } from "@/locales";
import PwdLogin from "./components/PwdLogin.vue";
import Register from "./components/Register.vue";
import ResetPwd from "./components/ResetPwd.vue";
import BindWechat from "./components/BindWechat.vue";

interface Props {
  /** The login module */
  module?: UnionKey.LoginModule;
}

const props = defineProps<Props>();

const appStore = useAppStore();
const themeStore = useThemeStore();

interface LoginModule {
  label: App.I18n.I18nKey;
  component: Component;
}

const moduleMap: Record<UnionKey.LoginModule, LoginModule> = {
  "pwd-login": { label: loginModuleRecord["pwd-login"], component: PwdLogin },
  register: { label: loginModuleRecord.register, component: Register },
  "reset-pwd": { label: loginModuleRecord["reset-pwd"], component: ResetPwd },
  "bind-wechat": { label: loginModuleRecord["bind-wechat"], component: BindWechat },
};

const activeModule = computed(() => moduleMap[props.module || "pwd-login"]);

const bgThemeColor = computed(() =>
  themeStore.darkMode ? getPaletteColorByNumber(themeStore.themeColor, 600) : themeStore.themeColor,
);

const bgColor = computed(() => {
  const COLOR_WHITE = "#ffffff";

  const ratio = themeStore.darkMode ? 0.5 : 0.2;

  return mixColor(COLOR_WHITE, themeStore.themeColor, ratio);
});
</script>

<template>
  <div class="relative size-full flex-center overflow-hidden" :style="{ backgroundColor: bgColor }">
    <WaveBg :theme-color="bgThemeColor" />
    <div class="flex-y-center position-absolute top-6px right-6px z-9">
      <ThemeSchemaSwitch
        :theme-schema="themeStore.themeScheme"
        :show-tooltip="false"
        @switch="themeStore.toggleThemeScheme"
      />
      <LangSwitch
        v-if="themeStore.header.multilingual.visible"
        :lang="appStore.locale"
        :lang-options="appStore.localeOptions"
        :show-tooltip="false"
        @change-lang="appStore.changeLocale"
      />
    </div>
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px">
      <div class="w-400px lt-sm:w-300px">
        <header class="flex-y-center justify-between">
          <SystemLogo class="size-60px lt-sm:size-44px" />
          <h3 class="text-28px text-primary font-500 lt-sm:text-22px">{{ $t("system.title") }}</h3>
        </header>
        <main class="pt-24px">
          <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
            <component :is="activeModule.component" />
          </Transition>
        </main>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
