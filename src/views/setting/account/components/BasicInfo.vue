<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useFormRules } from '@/hooks/common/form';

const { formRules } = useFormRules();

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  email: formRules.email,
  mobile: formRules.phone
};
const formRef: any = ref(null);

const formValue = reactive({
  username: '',
  nickname: '',
  gender: '0',
  mobile: '',
  email: '',
  address: ''
});

function formSubmit() {
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      window.$message?.success('验证成功');
    } else {
      window.$message?.error('验证失败，请填写完整信息');
    }
  });
}
</script>

<template>
  <NForm
    ref="formRef"
    :label-width="80"
    label-placement="left"
    require-mark-placement="left"
    :model="formValue"
    :rules="rules"
  >
    <NFormItem label="用户名" path="username">
      <NInput v-model:value="formValue.username" placeholder="请输入用户名" />
    </NFormItem>

    <NFormItem label="昵称" path="nickname">
      <NInput v-model:value="formValue.nickname" placeholder="请输入昵称" />
    </NFormItem>

    <NFormItem label="性别" path="gender">
      <NRadioGroup v-model:value="formValue.gender" name="gender">
        <NRadioButton value="0">男</NRadioButton>
        <NRadioButton value="1">女</NRadioButton>
        <NRadioButton value="2">未知</NRadioButton>
      </NRadioGroup>
    </NFormItem>

    <NFormItem label="邮箱" path="email">
      <NInput v-model:value="formValue.email" placeholder="请输入邮箱" />
    </NFormItem>

    <NFormItem label="联系电话" path="mobile">
      <NInput v-model:value="formValue.mobile" placeholder="请输入联系电话" />
    </NFormItem>

    <NFormItem label="联系地址" path="address">
      <NInput
        v-model:value="formValue.address"
        type="textarea"
        placeholder="请输入联系地址"
      />
    </NFormItem>

    <div>
      <NSpace justify="center">
        <NButton type="primary" @click="formSubmit">更新基本信息</NButton>
      </NSpace>
    </div>
  </NForm>
</template>
