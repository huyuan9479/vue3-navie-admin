<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { loginModuleRecord } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import PwdLogin from './components/PwdLogin.vue';
import Register from './components/Register.vue';
import ResetPwd from './components/ResetPwd.vue';
import ExpressLogin from './components/ExpressLogin.vue';

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
  'pwd-login': { label: loginModuleRecord['pwd-login'], component: PwdLogin },
  register: { label: loginModuleRecord.register, component: Register },
  'reset-pwd': { label: loginModuleRecord['reset-pwd'], component: ResetPwd },
  'express-login': { label: loginModuleRecord['express-login'], component: ExpressLogin }
};

const activeModule = computed(() => moduleMap[props.module || 'pwd-login']);
</script>

<template>
  <div class="login-container relative size-full flex min-h-full overflow-hidden">
    <!-- logo -->
    <div class="absolute left-0 top-0 h-15 pl-12px z-9 flex-y-center justify-between">
      <SystemLogo class="size-36px mr-6px lt-sm:size-32px" />
      <h3 class="text-20px text-primary font-500 lt-sm:text-20px">
        {{ $t('system.title') }}
      </h3>
    </div>
    <!-- 左侧登录 -->
    <div class="login-container-left login-bg relative hidden inset-0 flex-1 lg:block">
      <div class="h-full flex flex-col items-center justify-center -enter-x">
        <img src="@/assets/imgs/login-img.png" alt="login-img" class="w-80% object-cover" />
      </div>
    </div>
    <!-- 右侧登录 -->
    <div class="login-container-right relative flex-col-center lg:flex-initial min-h-full w-2/5 flex-1">
      <div class="relative flex justify-center w-full">
        <div class="w-full px-50px px-24px lt-sm:w-350px lt-lg:w-500px lt-sm:px-24px lt-sm:px-12px 2xl:w-600px">
          <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
            <component :is="activeModule.component" />
          </Transition>
        </div>
      </div>
      <div class="flex-y-center position-absolute right-0 top-0 h-15 pr-12px z-9">
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  .login-bg {
    background:
      radial-gradient(600px at 80% 20%, #90caf933, #0000 70%), radial-gradient(700px at 50% 80%, #611df133, #0000 60%),
      oklch(98% 0 0);
  }

  .login-container-right {
    background: #fff;
  }
}

.dark {
  .login-container {
    .login-bg {
      background: linear-gradient(154deg, #07070915 30%, hsl(var(--primary) / 20%) 48%, #07070915 64%);
    }
    .login-container-right {
      background: rgb(var(--layout-bg-color));
    }
  }
}
</style>
