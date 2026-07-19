<script setup lang="ts">
import { computed, reactive } from "vue";
import { loginModuleRecord } from "@/constants/app";
import { useAuthStore } from "@/store/modules/auth";
import { useRouterPush } from "@/hooks/common/router";
import { useFormRules, useNaiveForm } from "@/hooks/common/form";
import { $t } from "@/locales";

defineOptions({
  name: "PwdLogin",
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

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

type AccountKey = "super" | "admin" | "user";

interface Account {
  key: AccountKey;
  label: string;
  userName: string;
  password: string;
}

const accounts = computed<Account[]>(() => [
  {
    key: "super",
    label: $t("page.login.pwdLogin.superAdmin"),
    userName: "Super",
    password: "123456",
  },
  {
    key: "admin",
    label: $t("page.login.pwdLogin.admin"),
    userName: "Admin",
    password: "123456",
  },
  {
    key: "user",
    label: $t("page.login.pwdLogin.user"),
    userName: "User",
    password: "123456",
  },
]);

async function handleAccountLogin(account: Account) {
  await authStore.login(account.userName, account.password);
}
</script>

<template>
  <NForm
    ref="formRef"
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
      <NDivider class="text-14px text-#666 !m-0">
        {{ $t("page.login.pwdLogin.otherAccountLogin") }}
      </NDivider>
      <div class="flex-center gap-12px">
        <NButton
          v-for="item in accounts"
          :key="item.key"
          type="primary"
          tertiary
          @click="handleAccountLogin(item)"
        >
          {{ item.label }}
        </NButton>
      </div>
    </NSpace>
  </NForm>
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
