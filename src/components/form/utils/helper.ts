import { ComponentType } from "../types/form";
import { unref } from "vue";
import {
  NInput,
  NInputGroup,
  NInputNumber,
  NSelect,
  NTreeSelect,
  NRadioGroup,
  NCheckbox,
  NCheckboxGroup,
  NAutoComplete,
  NCascader,
  NDatePicker,
  NTimePicker
} from "naive-ui";

const componentMap: Record<string, any> = {
  NInput,
  NInputGroup,
  NInputNumber,
  NSelect,
  NTreeSelect,
  NRadioGroup,
  NCheckbox,
  NCheckboxGroup,
  NAutoComplete,
  NCascader,
  NDatePicker,
  NTimePicker
};

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component === "NInput") return "请输入";
  if (["NPicker", "NSelect", "NCheckbox", "NRadio", "NSwitch", "NDatePicker", "NTimePicker"].includes(component))
    return "请选择";
  return "";
}

const dateTypes = ["DatePicker", "MonthPicker", "WeekPicker", "TimePicker"];

function genType() {
  return [...dateTypes, "RangePicker"];
}

/**
 * 时间字段
 */
export const dateItemType = genType();

export function defaultType(component: string) {
  if (component === "NInput") return "";
  if (component === "NInputNumber") return null;
  return ["NPicker", "NSelect", "NCheckbox", "NRadio", "NSwitch", "NDatePicker", "NTimePicker"].includes(component)
    ? ""
    : undefined;
}

// dynamic use hook props
export function getDynamicProps<T extends {}, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map(key => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getComponent(component: ComponentType) {
  return componentMap[component] || NInput;
}
