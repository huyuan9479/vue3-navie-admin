<script setup lang="ts">
import { computed, reactive } from "vue";
import { loginModuleRecord } from "@/constants/app";
import { useRouterPush } from "@/hooks/common/router";
import { useAuthStore } from "@/store/modules/auth";
import { useFormRules, useNaiveForm } from "@/hooks/common/form";
import { useCaptcha } from "@/hooks/business/captcha";
import { $t } from "@/locales";

defineOptions({
  name: "CodeLogin",
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();
const { label, isCounting, loading, getCaptcha } = useCaptcha();

interface FormModel {
  phone: string;
  code: string;
}

const model: FormModel = reactive({
  phone: "",
  code: "",
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return {
    phone: formRules.phone,
    code: formRules.code,
  };
});

async function handleSubmit() {
  await validate();
  // request
  window.$message?.success($t("page.login.common.validateSuccess"));
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
    <NFormItem path="phone">
      <NInput v-model:value="model.phone" :placeholder="$t('page.login.common.phonePlaceholder')">
        <template #prefix>
          <SvgIcon icon="ant-design:mobile-outlined" class="text-18px color-#999" />
        </template>
      </NInput>
    </NFormItem>
    <NFormItem path="code">
      <div class="w-full flex-y-center gap-16px">
        <NInput v-model:value="model.code" :placeholder="$t('page.login.common.codePlaceholder')">
          <template #prefix>
            <SvgIcon icon="ant-design:mail-outlined" class="text-18px color-#999" />
          </template>
        </NInput>
        <NButton
          size="large"
          :disabled="isCounting"
          :loading="loading"
          @click="getCaptcha(model.phone)"
        >
          {{ label }}
        </NButton>
      </div>
    </NFormItem>
    <NSpace vertical :size="16">
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t("page.login.pwdLogin.rememberMe") }}</NCheckbox>
        <div class="cursor-pointer" @click="toggleLoginModule('register')">
          {{ $t(loginModuleRecord.register) }}
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
