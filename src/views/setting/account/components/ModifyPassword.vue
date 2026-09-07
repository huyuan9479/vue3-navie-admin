<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useMessage } from 'naive-ui';
import type { FormInst } from 'naive-ui';

defineOptions({
  name: 'ModifyPassword'
});

const message = useMessage();
const formRef = ref<FormInst | null>(null);

// 表单数据
const formModel = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 计算密码强度得分 (0 - 5分)
const getPasswordStrength = (pwd: string): number => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6) score++; // 1. 长度最少 6 位
  if (/\d/.test(pwd)) score++; // 2. 包含数字
  if (/[a-z]/.test(pwd)) score++; // 3. 包含小写字母
  if (/[A-Z]/.test(pwd)) score++; // 4. 包含大写字母
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++; // 5. 包含特殊字符
  return score;
};

// 新密码强度
const newPasswordStrength = computed(() =>
  getPasswordStrength(formModel.value.newPassword)
);

// 确认密码强度（只有与新密码一致时才亮起，否则保持灰色）
const confirmPasswordStrength = computed(() => {
  if (!formModel.value.confirmPassword) return 0;
  if (formModel.value.confirmPassword !== formModel.value.newPassword) return 0;
  return newPasswordStrength.value;
});

// 动态计算强度格子的 Tailwind 颜色类名
const getStrengthClass = (score: number, index: number) => {
  if (index > score) {
    return 'bg-neutral-100 dark:bg-neutral-800'; // 未点亮时，展示中性灰
  }
  // 根据总分渲染对应的强度色彩
  if (score === 1) return 'bg-error'; // 1格：极弱 (红)
  if (score <= 3) return 'bg-warning'; // 2-3格：中等 (黄/橙)
  return 'bg-success'; // 4-5格：安全 (绿)
};

// 表单验证规则
const rules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: ['blur', 'input'] },
    { min: 6, message: '新密码长度不能小于 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: ['blur', 'input'] },
    {
      validator: (_rule: any, value: string) => {
        return value === formModel.value.newPassword;
      },
      message: '两次输入的密码不一致',
      trigger: ['blur', 'input']
    }
  ]
};

// 提交修改
function handleSubmit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(errors => {
    if (errors) {
      message.error('请确保所有字段填写正确');
      return;
    }

    // 强度守卫
    if (newPasswordStrength.value < 3) {
      message.warning(
        '您的新密码强度过低，请混合包含大小写字母、数字或特殊字符'
      );
      return;
    }

    message.success('密码修改成功！');
    // 模拟重置表单
    formModel.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  });
}
</script>

<template>
  <NGrid class="h-full">
    <NGridItem span="14">
      <NForm
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="90"
        require-mark-placement="left"
      >
        <!-- 旧密码 -->
        <NFormItem label="旧密码" path="oldPassword">
          <NInput
            v-model:value="formModel.oldPassword"
            type="password"
            show-password-on="click"
            placeholder="请输入旧密码"
            clearable
          />
        </NFormItem>

        <!-- 新密码 -->
        <NFormItem label="新密码" path="newPassword">
          <div class="w-full">
            <NInput
              v-model:value="formModel.newPassword"
              type="password"
              show-password-on="click"
              placeholder="请输入新密码"
              clearable
            />
            <!-- 5格强度指示条 -->
            <div class="flex gap-6px mt-8px px-2px">
              <div
                v-for="index in 5"
                :key="index"
                class="h-4px flex-1 rounded-2px transition-all duration-300"
                :class="getStrengthClass(newPasswordStrength, index)"
              ></div>
            </div>
          </div>
        </NFormItem>

        <!-- 确认密码 -->
        <NFormItem label="确认密码" path="confirmPassword">
          <div class="w-full">
            <NInput
              v-model:value="formModel.confirmPassword"
              type="password"
              show-password-on="click"
              placeholder="请再次输入新密码"
              clearable
            />
            <!-- 5格对齐强度指示条（一致时点亮） -->
            <div class="flex gap-6px mt-8px px-2px">
              <div
                v-for="index in 5"
                :key="index"
                class="h-4px flex-1 rounded-2px transition-all duration-300"
                :class="getStrengthClass(confirmPasswordStrength, index)"
              ></div>
            </div>
          </div>
        </NFormItem>

        <!-- 按钮组 -->
        <div class="flex justify-center pt-12px">
          <NButton type="primary" class="px-32px" @click="handleSubmit">
            更新密码
          </NButton>
        </div>
      </NForm>
    </NGridItem>
  </NGrid>
</template>

<style scoped>
/* 保持过度动画平滑，增强密码格变色体验 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
