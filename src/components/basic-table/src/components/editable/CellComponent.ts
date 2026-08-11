import type { FunctionalComponent, defineComponent } from 'vue';
import type { ComponentType } from '../../types/componentType';
import { componentMap } from '../../componentMap';

import { h } from 'vue';

import { NPopover } from 'naive-ui';

export interface ComponentProps {
  component: ComponentType;
  rule: boolean;
  popoverVisible: boolean;
  ruleMessage: string;
}

export const CellComponent: FunctionalComponent<ComponentProps> = (
  { component = 'NInput', rule = true, ruleMessage, popoverVisible }: ComponentProps,
  { attrs }
) => {
  const comp = componentMap.get(component) as typeof defineComponent;

  const DefaultComp = h(comp as any, attrs);
  if (!rule) {
    return DefaultComp;
  }
  return h(
    NPopover,
    { 'display-directive': 'show', show: !!popoverVisible, manual: 'manual' },
    {
      trigger: () => DefaultComp,
      default: () =>
        h(
          'span',
          {
            style: {
              color: 'red',
              width: '90px',
              display: 'inline-block'
            }
          },
          {
            default: () => ruleMessage
          }
        )
    }
  );
};
