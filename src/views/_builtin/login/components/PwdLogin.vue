<script setup lang="ts">
import { computed, reactive } from "vue";
import { useAuthStore } from "@/store/modules/auth";
import { useThemeStore } from "@/store/modules/theme";
import { useRouterPush } from "@/hooks/common/router";
import { useCaptcha } from "@/hooks/business/captcha";
import { useFormRules, useNaiveForm } from "@/hooks/common/form";
import { $t } from "@/locales";

defineOptions({
  name: "PwdLogin"
});

const authStore = useAuthStore();
const themeStore = useThemeStore();
const { toggleLoginModule } = useRouterPush();
const { formRef: pwdLoginFormRef, formRef: codeLoginFormRef, validate } = useNaiveForm();

interface FormModel {
  userName: string;
  password: string;
}

const model: FormModel = reactive({
  userName: "admin",
  password: "123456"
});

const expressLoginWays = [
  {
    icon: "ant-design:wechat-filled",
    value: "wechat"
  },
  {
    icon: "ant-design:alipay-circle-outlined",
    value: "alipay"
  },
  {
    icon: "ant-design:github-outlined",
    value: "github"
  }
];
const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd
  };
});

async function handlePwdLoginSubmit() {
  await validate();
  await authStore.login(model.userName, model.password);
}

// 短信登录
const { label, isCounting, loading, getCaptcha } = useCaptcha();

interface CodeLoginFormModel {
  phone: string;
  code: string;
}

const codeLoginModel: CodeLoginFormModel = reactive({
  phone: "",
  code: ""
});

const codeLoginRules = computed<Record<keyof CodeLoginFormModel, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    phone: formRules.phone,
    code: formRules.code
  };
});

async function handleCodeLoginSubmit() {
  await validate();
  // request
  window.$message?.success($t("page.login.common.validateSuccess"));
}
</script>

<template>
  <div>
    <h3 class="text-26px font-bold mb-24px">{{ $t("page.login.pwdLogin.title") }}</h3>
    <NTabs class="card-tabs" default-value="pwd-login" size="large" animated type="segment">
      <NTabPane name="pwd-login" :tab="$t('page.login.pwdLogin.passwordLogin')">
        <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
          <NForm
            ref="pwdLoginFormRef"
            :model="model"
            :rules="rules"
            size="large"
            :show-label="false"
            @keyup.enter="handlePwdLoginSubmit"
          >
            <NFormItem path="userName">
              <NInput v-model:value="model.userName" :placeholder="$t('page.login.common.userNamePlaceholder')">
                <template #prefix>
                  <SvgIcon icon="material-symbols:person-outline" class="text-18px color-#999" />
                </template>
              </NInput>
            </NFormItem>
            <NFormItem path="password">
              <NInput
                v-model:value="model.password"
                type="password"
                show-password-on="click"
                :placeholder="$t('page.login.common.passwordPlaceholder')"
              >
                <template #prefix>
                  <SvgIcon icon="material-symbols:lock-outline" class="text-18px color-#999" />
                </template>
              </NInput>
            </NFormItem>
            <NSpace vertical :size="24">
              <div class="flex-y-center justify-between">
                <NCheckbox>{{ $t("page.login.pwdLogin.rememberMe") }}</NCheckbox>
                <div class="cursor-pointer" @click="toggleLoginModule('reset-pwd')">
                  {{ $t("page.login.pwdLogin.forgetPassword") }}
                </div>
              </div>
              <NButton
                type="primary"
                size="large"
                round
                block
                :loading="authStore.loginLoading"
                @click="handlePwdLoginSubmit"
              >
                {{ $t("common.confirm") }}
              </NButton>
            </NSpace>
          </NForm>
        </Transition>
      </NTabPane>
      <NTabPane name="code-login" :tab="$t('page.login.codeLogin.title')">
        <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
          <NForm
            ref="codeLoginFormRef"
            :model="codeLoginModel"
            :rules="codeLoginRules"
            size="large"
            :show-label="false"
            @keyup.enter="handleCodeLoginSubmit"
          >
            <NFormItem path="phone">
              <NInput v-model:value="codeLoginModel.phone" :placeholder="$t('page.login.common.phonePlaceholder')">
                <template #prefix>
                  <SvgIcon icon="material-symbols:mobile-outline" class="text-18px color-#999" />
                </template>
              </NInput>
            </NFormItem>
            <NFormItem path="code">
              <div class="w-full flex-y-center gap-16px">
                <NInput v-model:value="codeLoginModel.code" :placeholder="$t('page.login.common.codePlaceholder')">
                  <template #prefix>
                    <SvgIcon icon="material-symbols:mail-outline" class="text-18px color-#999" />
                  </template>
                </NInput>
                <NButton
                  size="large"
                  :disabled="isCounting"
                  :loading="loading"
                  @click="getCaptcha(codeLoginModel.phone)"
                >
                  {{ label }}
                </NButton>
              </div>
            </NFormItem>
            <NSpace vertical :size="24">
              <div class="flex-y-center justify-between">
                <NCheckbox>{{ $t("page.login.pwdLogin.rememberMe") }}</NCheckbox>
              </div>
              <NButton
                type="primary"
                size="large"
                round
                block
                :loading="authStore.loginLoading"
                @click="handleCodeLoginSubmit"
              >
                {{ $t("common.confirm") }}
              </NButton>
            </NSpace>
          </NForm>
        </Transition>
      </NTabPane>
    </NTabs>
    <NSpace vertical :size="24">
      <div class="cursor-pointer text-center mt-24px" @click="toggleLoginModule('register')">
        <span>{{ $t("page.login.pwdLogin.noRegister") }}</span>
        <span class="text-primary">{{ $t("page.login.pwdLogin.register") }}</span>
      </div>
      <div class="w-full flex justify-center">
        <NDivider class="w-2/3 text-14px text-#666 !m-0">
          {{ $t("page.login.pwdLogin.otherLoginMode") }}
        </NDivider>
      </div>
      <div class="flex justify-between mx-auto w w-2/3 gap-12px">
        <NButton
          v-for="item in expressLoginWays"
          :key="item.value"
          circle
          size="small"
          @click="toggleLoginModule('express-login')"
        >
          <template #icon>
            <SvgIcon :icon="item.icon" class="text-22px cursor-pointer text-#666" />
          </template>
        </NButton>
      </div>
    </NSpace>
  </div>
</template>

<style lang="scss" scoped>
.user-login-other {
  :deep(.item-icon) {
    font-size: 24px;
    color: #999;
    cursor: pointer;
    margin: 6px;
  }
}
</style>
