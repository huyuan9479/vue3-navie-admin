import { provide, inject } from 'vue';
import type { FormActionType } from '../types/form';

const key = Symbol('formElRef');

export function createFormContext(instance: FormActionType) {
  provide(key, instance);
}

export function useFormContext() {
  return inject(key);
}
