<script setup lang="ts">
import {
  reactive,
  ref,
  computed,
  unref,
  onMounted,
  watch,
  useAttrs
} from 'vue';
import { createPlaceholderMessage, getComponent } from './utils/helper';
import { useFormEvents } from './hooks/form-events';
import { useFormValues } from './hooks/form-values';
import type { Ref } from 'vue';
import type { GridProps } from 'naive-ui/lib/grid';
import type { ButtonProps } from 'naive-ui/lib/button';
import type { FormSchema, FormProps, FormActionType } from './types/form';
import type { ComponentType } from './types/form';
import { isArray } from '@/utils/is';
import { deepMerge } from '@/utils/common';

defineOptions({ name: 'BasicForm' });

const props = withDefaults(defineProps<FormProps>(), {
  // 标签宽度  固定宽度
  labelWidth: 80,
  // 表单配置规则
  schemas: () => [],
  // 布局方式
  layout: 'inline',
  // 是否展示为行内表单
  inline: false,
  // 表单大小
  size: 'medium',
  // 标签位置
  labelPlacement: 'left',
  // 必填项位置
  requireMarkPlacement: 'left',
  // 组件是否width 100%
  isFull: true,
  // 是否显示操作按钮（查询/重置）
  showActionButtonGroup: true,
  // 是否显示重置按钮
  showResetButton: true,
  // 是否显示查询按钮
  showSubmitButton: true,
  // 是否展开收起按钮
  showAdvancedButton: true,
  // 查询按钮文本
  submitButtonText: '查询',
  // 重置按钮文本
  resetButtonText: '重置',
  // 重置按钮配置
  resetButtonOptions: (): Partial<ButtonProps> => ({
    size: 'medium',
    secondary: true
  }),
  // 查询按钮配置
  submitButtonOptions: (): Partial<ButtonProps> => ({
    size: 'medium',
    type: 'primary'
  }),
  // 折叠行数
  collapsedRows: 1,
  // 是否折叠
  collapsed: true,
  //grid 配置
  gridProps: () => ({ cols: '1 s:2 m:2 l:3 xl:4 2xl:4' }),
  // 是否显示反馈信息
  showFeedback: false
});

const emit = defineEmits<{
  (e: 'register', action: Partial<FormActionType>): void;
  // 这里要定义事件，否则会警告
  (e: 'submit', values: Recordable): void;
  (e: 'reset'): void;
}>();

const attrs = useAttrs();
const defaultFormModel = ref<Recordable>({});
const formModel = reactive<Recordable>({});
const propsRef = ref<Partial<FormProps>>({});
const schemaRef = ref<Nullable<FormSchema[]>>(null);
const formElRef = ref<Nullable<FormActionType>>(null);
const gridCollapsed = ref(true);
const loadingSub = ref(false);
const isUpdateDefaultRef = ref(false);

const getSubmitBtnOptions = computed((): Partial<ButtonProps> => {
  return Object.assign(
    {
      size: props.size as unknown as ButtonProps['size']
    },
    props.submitButtonOptions
  );
});

const getResetBtnOptions = computed((): Partial<ButtonProps> => {
  return Object.assign(
    {
      size: props.size as unknown as ButtonProps['size']
    },
    props.resetButtonOptions
  );
});

function getComponentProps(schema: FormSchema) {
  const compProps = schema.componentProps ?? {};
  const component = schema.component;
  return {
    clearable: true,
    placeholder: createPlaceholderMessage(unref(component) as ComponentType),
    ...compProps
  };
}

const getProps = computed((): FormProps => {
  const formProps = { ...props, ...unref(propsRef) } as FormProps;
  const rulesObj: any = {
    rules: {}
  };
  const schemas: any = formProps.schemas || [];
  schemas.forEach((item: FormSchema) => {
    if (item.rules && isArray(item.rules)) {
      rulesObj.rules[item.field] = item.rules;
    }
  });
  return { ...formProps, ...unref(rulesObj) };
});

const isInline = computed(() => {
  const { layout } = unref(getProps);
  return layout === 'inline';
});

const getGrid = computed((): GridProps => {
  const { gridProps } = unref(getProps);
  return {
    ...gridProps,
    collapsed: isInline.value ? gridCollapsed.value : false,
    responsive: 'screen',
    collapsedRows: props.collapsedRows
  };
});

const getBindValue = computed(
  () => ({ ...attrs, ...props, ...unref(getProps) }) as Recordable
);

const getSchema = computed((): FormSchema[] => {
  const schemas: FormSchema[] =
    unref(schemaRef) || (unref(getProps).schemas as any);
  for (const schema of schemas) {
    const { defaultValue } = schema;
    // handle date type
    // dateItemType.includes(component as string)
    if (defaultValue) {
      schema.defaultValue = defaultValue;
    }
  }
  return schemas as FormSchema[];
});

const { handleFormValues, initDefault } = useFormValues({
  defaultFormModel,
  getSchema,
  formModel
});

const {
  handleSubmit,
  validate,
  resetFields,
  getFieldsValue,
  clearValidate,
  setFieldsValue
} = useFormEvents({
  emit: emit as {
    (e: 'submit' | 'reset', values: Recordable | boolean): void;
  },
  getProps,
  formModel,
  getSchema,
  formElRef: formElRef as Ref<FormActionType>,
  defaultFormModel,
  loadingSub,
  handleFormValues
});

function unfoldToggle() {
  gridCollapsed.value = !gridCollapsed.value;
}

async function setProps(formProps: Partial<FormProps>): Promise<void> {
  propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
}

const formActionType: Partial<FormActionType> = {
  getFieldsValue,
  setFieldsValue,
  resetFields,
  validate,
  clearValidate,
  setProps,
  submit: handleSubmit
};

watch(
  () => getSchema.value,
  schema => {
    if (unref(isUpdateDefaultRef)) {
      return;
    }
    if (schema?.length) {
      initDefault();
      isUpdateDefaultRef.value = true;
    }
  }
);

onMounted(() => {
  initDefault();
  emit('register', formActionType);
});
</script>

<template>
  <NForm v-bind="getBindValue" ref="formElRef" :model="formModel">
    <NGrid v-bind="getGrid" :y-gap="showFeedback ? 0 : 20">
      <NGi
        v-for="schema in getSchema"
        v-bind="schema.giProps"
        :key="schema.field"
      >
        <NFormItem :label="schema.label" :path="schema.field">
          <!--标签名右侧温馨提示-->
          <template v-if="schema.labelMessage" #label>
            <div class="flex items-center">
              {{ schema.label }}
              <NTooltip trigger="hover" :style="schema.labelMessageStyle">
                <template #trigger>
                  <icon-material-symbols-help-outline
                    class="text-16px ml-2px cursor-pointer"
                  />
                </template>
                {{ schema.labelMessage }}
              </NTooltip>
            </div>
          </template>

          <!--判断插槽-->
          <template v-if="schema.slot">
            <slot
              :name="schema.slot"
              :model="formModel"
              :field="schema.field"
              :value="formModel[schema.field]"
            ></slot>
          </template>

          <!--NCheckbox-->
          <template v-else-if="schema.component === 'NCheckbox'">
            <NCheckboxGroup v-model:value="formModel[schema.field]">
              <NSpace>
                <NCheckbox
                  v-for="item in schema.componentProps.options"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </NSpace>
            </NCheckboxGroup>
          </template>

          <!--NRadioGroup-->
          <template v-else-if="schema.component === 'NRadioGroup'">
            <NRadioGroup v-model:value="formModel[schema.field]">
              <NSpace>
                <NRadio
                  v-for="item in schema.componentProps.options"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </NRadio>
              </NSpace>
            </NRadioGroup>
          </template>
          <!--动态渲染表单组件-->
          <component
            v-bind="getComponentProps(schema)"
            :is="getComponent(schema.component || 'NInput')"
            v-else
            v-model:value="formModel[schema.field]"
            :class="{ isFull: schema.isFull != false && getProps.isFull }"
          />
          <!--组件后面的内容-->
          <template v-if="schema.suffix">
            <slot
              :name="schema.suffix"
              :model="formModel"
              :field="schema.field"
              :value="formModel[schema.field]"
            ></slot>
          </template>
        </NFormItem>
      </NGi>
      <!--提交 重置 展开 收起 按钮-->
      <NGi
        v-if="getProps.showActionButtonGroup"
        :span="isInline ? '' : 24"
        :suffix="isInline ? true : false"
        #="{ overflow }"
      >
        <NSpace
          align="center"
          :justify="isInline ? 'end' : 'start'"
          :style="{ 'margin-left': `${isInline ? 12 : getProps.labelWidth}px` }"
        >
          <NButton
            v-if="getProps.showSubmitButton"
            v-bind="getSubmitBtnOptions"
            :loading="loadingSub"
            attr-type="submit"
            @click="handleSubmit"
          >
            <icon-material-symbols-search class="text-16px mr-2px" />
            {{ getProps.submitButtonText }}
          </NButton>
          <NButton
            v-if="getProps.showResetButton"
            v-bind="getResetBtnOptions"
            @click="resetFields"
          >
            <icon-material-symbols-refresh class="text-16px mr-2px" />
            {{ getProps.resetButtonText }}
          </NButton>
          <NButton
            v-if="isInline && getProps.showAdvancedButton"
            type="default"
            @click="unfoldToggle"
          >
            {{ overflow ? '展开' : '收起' }}
            <icon-mdi-chevron-down v-if="overflow" class="unfold-icon" />
            <icon-mdi-chevron-up v-else class="unfold-icon" />
          </NButton>
        </NSpace>
      </NGi>
    </NGrid>
  </NForm>
</template>

<style lang="scss" scoped>
.isFull {
  width: 100%;
  justify-content: flex-start;
}

.unfold-icon {
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 16px;
}
</style>
