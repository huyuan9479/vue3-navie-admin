import type { ComponentType } from '../types/index';
import { $t } from '@/locales';

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component === 'NInput') return $t('form.placeholder');
  if (
    [
      'NPicker',
      'NSelect',
      'NCheckbox',
      'NRadio',
      'NSwitch',
      'NDatePicker',
      'NTimePicker'
    ].includes(component)
  )
    return $t('form.selectPlaceholder');
  return '';
}
