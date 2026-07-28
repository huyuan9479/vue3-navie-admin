<script setup lang="ts">
import { computed, reactive } from "vue";
import { useAuthStore } from "@/store/modules/auth";
import { useThemeStore } from "@/store/modules/theme";
import { useRouterPush } from "@/hooks/common/router";
import { useCaptcha } from "@/hooks/business/captcha";
import { useFormRules, useNaiveForm } from "@/hooks/common/form";
import { $t } from "@/locales";

defineOptions({
  name: "PwdLogin",
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
  password: "123456",
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    userName: formRules.userName,
    password: formRules.pwd,
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login(model.userName, model.password);
}

// type AccountKey = "super" | "admin" | "user";

// interface Account {
//   key: AccountKey;
//   label: string;
//   userName: string;
//   password: string;
// }

// const accounts = computed<Account[]>(() => [
//   {
//     key: "super",
//     label: $t("page.login.pwdLogin.superAdmin"),
//     userName: "Super",
//     password: "123456",
//   },
//   {
//     key: "admin",
//     label: $t("page.login.pwdLogin.admin"),
//     userName: "Admin",
//     password: "123456",
//   },
//   {
//     key: "user",
//     label: $t("page.login.pwdLogin.user"),
//     userName: "User",
//     password: "123456",
//   },
// ]);

// async function handleAccountLogin(account: Account) {
//   await authStore.login(account.userName, account.password);
// }
// 短信登录
const { label, isCounting, loading, getCaptcha } = useCaptcha();

interface CodeLoginFormModel {
  phone: string;
  code: string;
}

const codeLoginModel: CodeLoginFormModel = reactive({
  phone: "",
  code: "",
});

const codeLoginRules = computed<Record<keyof CodeLoginFormModel, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    phone: formRules.phone,
    code: formRules.code,
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
    <NTabs class="card-tabs" default-value="pwd-login" size="large" animated>
      <NTabPane name="pwd-login" :tab="$t('page.login.pwdLogin.title')">
        <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
          <NForm
            ref="pwdLoginFormRef"
            :model="model"
            :rules="rules"
            size="large"
            :show-label="false"
            @keyup.enter="handleSubmit"
          >
            <NFormItem path="userName">
              <NInput
                v-model:value="model.userName"
                :placeholder="$t('page.login.common.userNamePlaceholder')"
              >
                <template #prefix>
                  <SvgIcon icon="ant-design:user-outlined" class="text-18px color-#999" />
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
                  <SvgIcon icon="ant-design:lock-outlined" class="text-18px color-#999" />
                </template>
              </NInput>
            </NFormItem>
            <NSpace vertical :size="16">
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
                @click="handleSubmit"
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
            @keyup.enter="handleSubmit"
          >
            <NFormItem path="phone">
              <NInput
                v-model:value="codeLoginModel.phone"
                :placeholder="$t('page.login.common.phonePlaceholder')"
              >
                <template #prefix>
                  <SvgIcon icon="ant-design:mobile-outlined" class="text-18px color-#999" />
                </template>
              </NInput>
            </NFormItem>
            <NFormItem path="code">
              <div class="w-full flex-y-center gap-16px">
                <NInput
                  v-model:value="codeLoginModel.code"
                  :placeholder="$t('page.login.common.codePlaceholder')"
                >
                  <template #prefix>
                    <SvgIcon icon="ant-design:mail-outlined" class="text-18px color-#999" />
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
            <NSpace vertical :size="16">
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
    <!--
 <div class="flex-y-center justify-between gap-12px px-8px">
      <div class="flex-y-center flex-1 user-login-other">
        <span class="mr-6px">{{ $t("page.login.pwdLogin.otherLoginMode") }}</span>
        <SvgIcon icon="ant-design:alipay-circle-outlined" class="item-icon" />
        <SvgIcon icon="ant-design:github-outlined" class="item-icon" />
        <SvgIcon icon="ant-design:wechat-filled" class="item-icon" />
      </div>
      <div class="cursor-pointer" @click="toggleLoginModule('register')">
        {{ $t(loginModuleRecord.register) }}
      </div>
    </div>
-->
    <div class="mt-16px">
      <NDivider class="text-14px text-#666 !m-0">
        {{ $t("page.login.pwdLogin.otherLoginMode") }}
      </NDivider>
      <div class="flex-center gap-12px text-#999 mt-8px">
        <SvgIcon icon="ant-design:wechat-filled" class="text-22px" />
        <SvgIcon icon="ant-design:alipay-circle-outlined" class="text-22px" />
        <SvgIcon icon="ant-design:github-outlined" class="text-22px" />
      </div>
    </div>
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
