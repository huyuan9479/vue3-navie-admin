import type { FormProps, FormActionType, UseFormReturnType } from "../types/form";
import { ref, onUnmounted, unref, nextTick, watch } from "vue";
import { getDynamicProps } from "../utils/helper";

import { isProdMode } from "@/utils/common";

type Props = Partial<DynamicProps<FormProps>>;

export function useForm(props?: Props): UseFormReturnType {
  const formRef = ref<Nullable<FormActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  async function getForm() {
    const form = unref(formRef);
    if (!form) {
      console.error(
        "The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!"
      );
    }
    await nextTick();
    return form as FormActionType;
  }

  function register(instance: FormActionType) {
    // 开发环境宽松以支持热更新，生产环境严格以避免内存泄漏和重复注册。
    if (isProdMode()) {
      onUnmounted(() => {
        formRef.value = null;
        loadedRef.value = null;
      });
    }
    if (unref(loadedRef) && isProdMode() && instance === unref(formRef)) return;

    formRef.value = instance;
    loadedRef.value = true;

    watch(
      () => props,
      () => {
        if (props) {
          instance.setProps(getDynamicProps(props));
        }
      },
      {
        immediate: true,
        deep: true
      }
    );
  }

  const methods: FormActionType = {
    setProps: async (formProps: Partial<FormProps>) => {
      const form = await getForm();
      await form.setProps(formProps);
    },

    resetFields: async () => {
      getForm().then(async form => {
        await form.resetFields();
      });
    },

    clearValidate: async (name?: string | string[]) => {
      const form = await getForm();
      await form.clearValidate(name);
    },

    getFieldsValue: <T>() => {
      return unref(formRef)?.getFieldsValue() as T;
    },

    setFieldsValue: async <T>(values: T) => {
      const form = await getForm();
      await form.setFieldsValue(values as Recordable<any>);
    },

    submit: async (): Promise<any> => {
      const form = await getForm();
      return form.submit();
    },

    validate: async (nameList?: any[]): Promise<Recordable> => {
      const form = await getForm();
      return form.validate(nameList);
    },

    setLoading: (value: boolean) => {
      loadedRef.value = value;
    },

    setSchema: async values => {
      const form = await getForm();
      form.setSchema(values);
    }
  };

  return [register, methods];
}
